# EC2 Backup & Disaster Recovery

A plan to protect the data living on our EC2 instance — specifically the self-hosted **TimescaleDB** container — and answer the related question of where in the world we should host.

---

## TL;DR

1. **Region note** — `infra/terraform/terraform.tfvars` sets `aws_region = "us-west-2"` (Oregon), not Ohio. Confirm in the AWS console before planning DR regions.
2. **The real data risk** is TimescaleDB. It runs in a Docker container on the EC2 root EBS volume (`timescale_data` named volume on the 30 GB root disk). It has **zero automated backups** today. RDS (`rooted_planner`) already has 7-day automated backups — that side is fine.
3. **Recommended backup stack for TimescaleDB:**
   - Move Timescale's data onto a **dedicated EBS volume** so its lifecycle is independent of the instance.
   - **pgBackRest → S3** with WAL archiving for point-in-time recovery (PITR).
   - **AWS Backup** daily EBS snapshots as a secondary, with cross-region copy to us-east-2.
   - **Restore drill** quarterly — a backup you haven't restored is a wish, not a backup.
4. **Dubai customer:** latency from Dubai → Oregon is ~240–280 ms RTT. Usable but noticeable. Options range from "do nothing" to "add a CloudFront distribution" to "stand up a read replica in `me-central-1` (UAE)." Details in the last section.

---

## Current State

| Component | Where it lives | Backup today | Risk |
|-----------|----------------|--------------|------|
| RDS `rooted_planner` | AWS RDS PostgreSQL 15 | ✅ 7-day automated, encrypted, `deletion_protection = true` | Low — covered by `infra/terraform/rds.tf:21` |
| TimescaleDB `rooted_telemetry` | Docker on EC2 (`timescale_data` volume, on root 30 GB EBS) | ❌ None | **High — single-disk, single-instance** |
| App code | Git + S3 deploy artifacts | ✅ Git + CI | Low |
| Support uploads | S3 | ⚠️ Versioning not enabled (`infra/terraform/s3.tf`) | Medium — accidental overwrite would be unrecoverable |
| IoT telemetry pipeline | AWS-managed | ✅ Managed | Low |

**What makes TimescaleDB special:** it holds the `raw_telemetry` hypertable plus `machine_stats` continuous aggregates (see `docker/init-timescale.sql`). The continuous aggregates regenerate from raw data, but raw data has a 90-day retention policy — so anything compressed or aggregated that gets corrupted cannot be reconstructed after the fact.

---

## Best Practices (Why This Plan Looks Like It Does)

A short summary of what the Postgres/Timescale community considers baseline for production:

1. **pgBackRest is the de facto standard** for Postgres backup. It beats `pg_dump` for:
   - Incremental backups (only changed pages).
   - WAL archiving for PITR.
   - Parallel restore.
   - Works fine with TimescaleDB — hypertables are regular tables under the hood. Continuous aggregates, compression, and policies all restore cleanly.
2. **Don't rely on EBS snapshots alone.** They're crash-consistent, not application-consistent. A snapshot taken mid-write is equivalent to a power-loss event — Postgres will replay WAL on restart, but a corrupted page can still slip through. They're a great _secondary_.
3. **3-2-1 rule:** 3 copies of data, on 2 media types, with 1 off-site. For us that maps to: live disk + S3 (pgBackRest) + cross-region S3/snapshot copy.
4. **Test restores.** Untested backups fail at the worst possible moment. Restore drills belong on the calendar, not the wishlist.
5. **Encrypt at rest and in transit.** Already true for EBS and RDS; we'll enforce it for the S3 backup bucket too.

---

## Phase 1 — Isolate TimescaleDB onto its Own EBS Volume

Right now `timescale_data` is a Docker named volume living on the root EBS (`/var/lib/docker/volumes/`). If the root disk fills up (logs, apt caches, Docker images), Timescale goes down with it. If we ever need to rebuild the instance, we'd have to restore from backup rather than detach/attach.

**Goal:** move the volume onto a dedicated, sized-for-growth EBS volume that we can snapshot independently.

**Changes — `infra/terraform/ec2.tf`:**

```hcl
resource "aws_ebs_volume" "timescale_data" {
  availability_zone = aws_instance.rooted.availability_zone
  size              = 100        # start; gp3 auto-expands with max_allocated_storage pattern
  type              = "gp3"
  iops              = 3000
  throughput        = 125
  encrypted         = true

  tags = {
    Name        = "${var.project_name}-${var.environment}-timescale-data"
    Environment = var.environment
    Project     = var.project_name
    Backup      = "daily"        # picked up by AWS Backup selection in Phase 3
  }
}

resource "aws_volume_attachment" "timescale_data" {
  device_name = "/dev/xvdf"
  volume_id   = aws_ebs_volume.timescale_data.id
  instance_id = aws_instance.rooted.id
}
```

**One-time migration (manual, on the instance):**

```bash
# Stop container (API will reconnect when it comes back)
docker stop rooted-timescaledb

# Format + mount new volume
sudo mkfs.ext4 /dev/xvdf
sudo mkdir -p /mnt/timescale
sudo mount /dev/xvdf /mnt/timescale
echo '/dev/xvdf /mnt/timescale ext4 defaults,nofail 0 2' | sudo tee -a /etc/fstab

# Copy existing volume contents
sudo rsync -aHAX /var/lib/docker/volumes/timescale_data/_data/ /mnt/timescale/

# Recreate container with bind mount instead of named volume
docker rm rooted-timescaledb
docker run -d --name rooted-timescaledb --restart unless-stopped \
  -p 127.0.0.1:5434:5432 \
  -v /mnt/timescale:/var/lib/postgresql/data \
  -e POSTGRES_USER=rooted -e POSTGRES_PASSWORD=$DB_PASSWORD \
  -e POSTGRES_DB=rooted_telemetry \
  timescale/timescaledb:latest-pg16

# Verify
docker exec rooted-timescaledb psql -U rooted -d rooted_telemetry \
  -c "SELECT count(*) FROM raw_telemetry;"
```

**Also update `scripts/setup-ec2.sh`** so the `-v` flag matches (`/mnt/timescale:/var/lib/postgresql/data`) — otherwise a fresh instance rebuild silently goes back to the named volume.

---

## Phase 2 — pgBackRest with S3 (Primary Backup)

### 2.1 — S3 bucket (Terraform)

New file `infra/terraform/backup.tf`:

```hcl
resource "aws_s3_bucket" "pgbackrest" {
  bucket = "${var.project_name}-${var.environment}-pgbackrest"

  tags = {
    Name        = "${var.project_name}-${var.environment}-pgbackrest"
    Environment = var.environment
  }
}

resource "aws_s3_bucket_versioning" "pgbackrest" {
  bucket = aws_s3_bucket.pgbackrest.id
  versioning_configuration { status = "Enabled" }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "pgbackrest" {
  bucket = aws_s3_bucket.pgbackrest.id
  rule {
    apply_server_side_encryption_by_default { sse_algorithm = "AES256" }
  }
}

resource "aws_s3_bucket_public_access_block" "pgbackrest" {
  bucket                  = aws_s3_bucket.pgbackrest.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_lifecycle_configuration" "pgbackrest" {
  bucket = aws_s3_bucket.pgbackrest.id

  rule {
    id     = "expire-old-backups"
    status = "Enabled"

    # Move to Glacier Instant after 30 days; delete after 180.
    transition {
      days          = 30
      storage_class = "GLACIER_IR"
    }
    expiration { days = 180 }

    # Versioning cleanup
    noncurrent_version_expiration { noncurrent_days = 30 }
  }
}

# IAM user the EC2 instance uses to write backups.
# (Prefer an instance profile in production — shown here as a user for simplicity.)
resource "aws_iam_role_policy" "ec2_pgbackrest" {
  name = "${var.project_name}-${var.environment}-pgbackrest"
  role = aws_iam_role.ec2.id  # assumes an existing EC2 instance role; add one if missing

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect   = "Allow"
      Action   = ["s3:ListBucket", "s3:GetBucketLocation"]
      Resource = aws_s3_bucket.pgbackrest.arn
    }, {
      Effect   = "Allow"
      Action   = ["s3:PutObject", "s3:GetObject", "s3:DeleteObject"]
      Resource = "${aws_s3_bucket.pgbackrest.arn}/*"
    }]
  })
}
```

> If the EC2 role doesn't exist yet, add one in `infra/terraform/iam.tf` and attach an instance profile in `ec2.tf`. The existing code uses SSH + key pair only; adding an instance profile is a one-time prereq.

### 2.2 — Install pgBackRest alongside the Docker container

pgBackRest talks to Postgres over a socket/TCP. Two options:

- **(A) Install pgBackRest on the host** and point it at `127.0.0.1:5434`. Simpler. Chosen here.
- **(B) Bake pgBackRest into a custom Timescale image.** Cleaner isolation but more moving parts.

On the EC2 host:

```bash
sudo apt-get install -y pgbackrest
sudo mkdir -p /etc/pgbackrest /var/log/pgbackrest /var/lib/pgbackrest
sudo chown -R postgres:postgres /var/log/pgbackrest /var/lib/pgbackrest || true
```

`/etc/pgbackrest/pgbackrest.conf`:

```ini
[global]
repo1-type=s3
repo1-s3-bucket=rooted-prod-pgbackrest
repo1-s3-endpoint=s3.us-west-2.amazonaws.com
repo1-s3-region=us-west-2
repo1-s3-key-type=auto          # use the EC2 instance profile
repo1-retention-full=7          # keep 7 full backups
repo1-retention-diff=14
repo1-cipher-type=aes-256-cbc
repo1-cipher-pass=<generate with: openssl rand -base64 48>

start-fast=y
compress-type=zst
process-max=4
log-level-console=info
log-level-file=detail

[rooted-telemetry]
pg1-host=127.0.0.1
pg1-port=5434
pg1-user=rooted
pg1-database=rooted_telemetry
```

### 2.3 — Turn on WAL archiving in the Timescale container

Postgres needs `archive_mode = on` and `archive_command` pointing at pgBackRest. Because we run in Docker, we set these via `-c` flags or mount a custom `postgresql.conf`. The cleanest path is a `postgresql.auto.conf` override applied once:

```bash
docker exec -u postgres rooted-timescaledb psql -d rooted_telemetry <<'SQL'
ALTER SYSTEM SET archive_mode = 'on';
ALTER SYSTEM SET archive_command = 'pgbackrest --stanza=rooted-telemetry archive-push %p';
ALTER SYSTEM SET max_wal_senders = 3;
ALTER SYSTEM SET wal_level = 'replica';
SQL

docker restart rooted-timescaledb
```

`pgbackrest` must be callable from *inside* the container for `archive_command`, OR we use the "push from outside" pattern via a named pipe / the TCP-based `archive-push` daemon. **Simpler path:** run pgBackRest inside the container. This means switching to a Timescale image that has pgBackRest installed. Suggested Dockerfile:

```dockerfile
FROM timescale/timescaledb:latest-pg16
RUN apk add --no-cache pgbackrest || apt-get update && apt-get install -y pgbackrest
```

Build, push to a private ECR repo, update `scripts/setup-ec2.sh` to use the new image.

### 2.4 — Initialize the stanza and take the first backup

```bash
# Create the pgBackRest stanza
sudo -u postgres pgbackrest --stanza=rooted-telemetry stanza-create

# First full backup (may take a while depending on data size)
sudo -u postgres pgbackrest --stanza=rooted-telemetry --type=full backup

# Verify
sudo -u postgres pgbackrest --stanza=rooted-telemetry info
```

### 2.5 — Schedule backups via systemd timer

`/etc/systemd/system/pgbackrest-full.service`:

```ini
[Unit]
Description=pgBackRest full backup

[Service]
Type=oneshot
User=postgres
ExecStart=/usr/bin/pgbackrest --stanza=rooted-telemetry --type=full backup
```

`/etc/systemd/system/pgbackrest-diff.service` (same, but `--type=diff`).

Timers:

| Timer | Schedule | Purpose |
|-------|----------|---------|
| `pgbackrest-full.timer` | Sunday 03:00 UTC | Full weekly backup |
| `pgbackrest-diff.timer` | Daily 03:00 UTC (except Sun) | Differential |
| (continuous) | via `archive_command` | WAL archiving for PITR |

Enable with `sudo systemctl enable --now pgbackrest-full.timer pgbackrest-diff.timer`.

---

## Phase 3 — AWS Backup for EBS Snapshots (Secondary)

Belt-and-suspenders: even if pgBackRest breaks silently, we have daily crash-consistent snapshots of the whole disk.

`infra/terraform/backup.tf` (append):

```hcl
resource "aws_backup_vault" "rooted" {
  name        = "${var.project_name}-${var.environment}-vault"
  kms_key_arn = aws_kms_key.backup.arn
}

resource "aws_kms_key" "backup" {
  description             = "KMS key for AWS Backup vault"
  deletion_window_in_days = 30
  enable_key_rotation     = true
}

resource "aws_backup_plan" "rooted" {
  name = "${var.project_name}-${var.environment}-plan"

  rule {
    rule_name         = "daily"
    target_vault_name = aws_backup_vault.rooted.name
    schedule          = "cron(0 8 * * ? *)"    # 08:00 UTC = 01:00 PT
    start_window      = 60
    completion_window = 360

    lifecycle {
      delete_after = 30
    }

    # Copy to us-east-2 for cross-region DR
    copy_action {
      destination_vault_arn = aws_backup_vault.rooted_dr.arn
      lifecycle { delete_after = 30 }
    }
  }
}

resource "aws_backup_selection" "tagged" {
  name         = "backup-tagged-resources"
  iam_role_arn = aws_iam_role.aws_backup.arn
  plan_id      = aws_backup_plan.rooted.id

  selection_tag {
    type  = "STRINGEQUALS"
    key   = "Backup"
    value = "daily"
  }
}

# DR vault in a different region (requires a second provider alias)
provider "aws" {
  alias  = "dr"
  region = "us-east-2"
}

resource "aws_backup_vault" "rooted_dr" {
  provider = aws.dr
  name     = "${var.project_name}-${var.environment}-vault-dr"
}
```

Tag the Timescale EBS volume with `Backup = "daily"` (shown in Phase 1) and AWS Backup will pick it up automatically.

---

## Phase 4 — Cross-region Copy for pgBackRest

S3 replication to us-east-2 so a regional outage of us-west-2 doesn't take the backups with it:

```hcl
resource "aws_s3_bucket" "pgbackrest_dr" {
  provider = aws.dr
  bucket   = "${var.project_name}-${var.environment}-pgbackrest-dr"
}

resource "aws_s3_bucket_replication_configuration" "pgbackrest" {
  role   = aws_iam_role.s3_replication.arn
  bucket = aws_s3_bucket.pgbackrest.id

  rule {
    id     = "replicate-to-dr"
    status = "Enabled"
    filter {}

    destination {
      bucket        = aws_s3_bucket.pgbackrest_dr.arn
      storage_class = "STANDARD_IA"
    }

    delete_marker_replication { status = "Enabled" }
  }

  depends_on = [aws_s3_bucket_versioning.pgbackrest]
}
```

---

## Phase 5 — Restore Runbook & Drill

### Scenario A — "I dropped a hypertable 20 minutes ago"

Goal: point-in-time recovery to just before the bad query.

```bash
# Stop the app to prevent new writes
pm2 stop rooted-api

# Stop Timescale
docker stop rooted-timescaledb

# Restore to a target time
sudo -u postgres pgbackrest --stanza=rooted-telemetry \
  --type=time \
  --target="2026-04-20 14:32:00+00" \
  --delta \
  restore

# Start Postgres; it will recover WAL up to the target
docker start rooted-timescaledb

# Verify, then resume app
pm2 start rooted-api
```

### Scenario B — "EC2 instance is gone"

1. `terraform apply` to rebuild EC2 + EBS.
2. Run `scripts/setup-ec2.sh` to get Timescale container back up (with empty data).
3. `pgbackrest --stanza=rooted-telemetry --delta restore` to repopulate.
4. Verify row counts against recent aggregates or app-side expectations.
5. Flip Elastic IP / DNS.

**RPO target:** ≤ 5 minutes (WAL archive interval).
**RTO target:** ≤ 1 hour for Scenario B.

### Drill schedule

- **Quarterly:** full restore to a scratch EC2 instance in a different AZ. Verify `SELECT count(*) FROM raw_telemetry;` and sample `machine_stats` aggregates match source.
- **Monthly:** automated `pgbackrest check` in cron — validates WAL archiving works end-to-end.

---

## Dubai Customer — Latency Discussion

Actual RTT from the UAE to our region:

| Region | Approx RTT from Dubai | Notes |
|--------|----------------------|-------|
| us-west-2 (current) | 240–280 ms | Crosses Pacific + US mainland |
| us-east-2 (Ohio) | 200–220 ms | Shorter path over Atlantic |
| eu-central-1 (Frankfurt) | ~100 ms | Good middle ground |
| me-central-1 (UAE) | 10–30 ms | Native region |

**Options, cheapest first:**

1. **Do nothing** if the customer's workflow is tolerant of ~250 ms RTT. Web apps with infrequent writes often feel fine at that latency.
2. **CloudFront in front of `app.rootedrobotics.com`** — static assets served from a Dubai edge location. Dramatically improves page load. Does nothing for API/DB latency. Low cost, low effort.
3. **API Gateway / CloudFront HTTPS acceleration for `/api/*`** — reduces TLS handshake cost only; most of the win here is the shortened TLS round trips, not the TCP ones. Marginal.
4. **RDS read replica in eu-central-1 or me-central-1**, plus a regional API stack in front — significant architecture change (read/write splitting in the trpc layer). Only worth it if Dubai becomes multi-customer.
5. **Full second region (active-active)** — overkill for one customer.

**Recommendation:** start with #2 (CloudFront), revisit if the customer explicitly complains or we sign more Middle East customers.

---

## Security Note

`infra/terraform/terraform.tfvars` currently commits `db_password` and `lambda_secret_token` in plaintext. This is unrelated to backups but worth flagging here since we're touching infra — move these to a `.tfvars` file that is `.gitignore`'d, or to AWS Secrets Manager referenced by `data` source in Terraform. Rotating the existing password is wise given it's been in git history.

---

## Cost Estimate (rough, us-west-2 pricing)

| Item | Monthly cost |
|------|-------------|
| 100 GB gp3 EBS for Timescale | ~$8 |
| pgBackRest S3 (assume 200 GB compressed) | ~$5 |
| S3 cross-region replication to us-east-2 | ~$5 (storage) + egress one-time |
| AWS Backup EBS snapshots (30-day retention, ~100 GB × 1.1) | ~$5 |
| Cross-region snapshot copy | ~$5 |
| CloudFront (if we do Dubai option #2) | ~$5–20 |
| **Total** | **~$30–50/mo** |

---

## Rollout Order

1. **Phase 1** — separate EBS volume for Timescale data. Requires brief downtime for migration.
2. **Phase 2** — pgBackRest + S3 + WAL archiving. No downtime after setup.
3. **Phase 3** — AWS Backup for EBS snapshots. No downtime.
4. **Phase 4** — cross-region S3 replication. No downtime.
5. **Phase 5** — restore drill. Schedule for the first drill within 2 weeks of Phase 2 completion.

Phases 2–4 can be done in a single Terraform apply; Phase 1 is the only one with user-visible impact.
