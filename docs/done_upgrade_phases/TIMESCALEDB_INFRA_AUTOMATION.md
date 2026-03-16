# TimescaleDB Infrastructure Automation

**Status:** Completed
**Depends on:** `TIMESCALEDB_SPLIT_ARCHITECTURE.md` (Phase 1)
**Goal:** Automate TimescaleDB provisioning, deployment, and schema management through Terraform, deploy scripts, and CI/CD — so it's not a manual VM setup.

---

## Decision Record

### Hosting: Docker on EC2 (same as Redis)

TimescaleDB will run as a Docker container on the existing EC2 instance, matching how Redis is already deployed.

| Option | Verdict | Reason |
|--------|---------|--------|
| Docker on EC2 | **Chosen** | Cheapest, matches Redis pattern, simplest networking (localhost) |
| Second RDS instance | Rejected | AWS RDS doesn't support TimescaleDB extension (no hypertables, continuous aggregates, `last()`) |
| Timescale Cloud | Rejected | Adds monthly cost beyond current budget |
| Dedicated EC2 for TimescaleDB | Rejected | Overkill for current scale, adds networking complexity |

### EC2 Instance Upgrade: t3.small → t3.medium

Current stack on EC2: API (Node.js/PM2), Nginx, Redis (Docker). Adding TimescaleDB pushes memory past the 2GB ceiling of t3.small.

- **t3.medium**: 4GB RAM, ~$30/mo (vs ~$15/mo for t3.small)
- TimescaleDB recommended minimum: 1-2GB `shared_buffers`
- Budget increase: ~$15/mo

### Password: Reuse existing `db_password`

TimescaleDB only listens on localhost (Docker port mapping `127.0.0.1:5434:5432`). No external access, so a separate credential adds complexity without security benefit.

---

## Files to Modify

| File | Change |
|------|--------|
| `infra/terraform/ec2.tf` | Upgrade to t3.medium, add TimescaleDB Docker to user_data |
| `infra/terraform/outputs.tf` | Add TimescaleDB connection string output |
| `scripts/setup-ec2.sh` | Start TimescaleDB container, init schema, add `TIMESCALE_DATABASE_URL` to .env.production |
| `scripts/deploy-scp.sh` | Include `docker/init-timescale.sql` in deploy artifacts |
| `.github/workflows/deploy.yml` | Deploy init-timescale.sql, ensure TimescaleDB container running before PM2 reload |
| `docker/init-timescale.sql` | Make all statements idempotent (safe to re-run) |

**No changes needed:** `security.tf` (localhost only), `rds.tf`, `variables.tf`, `terraform.tfvars`, `ci.yml` (already has dummy `TIMESCALE_DATABASE_URL`)

---

## Phase 1: Terraform — EC2 Upgrade + TimescaleDB in user_data

### 1.1 — Upgrade instance type

In `infra/terraform/ec2.tf`, change:
```hcl
instance_type = "t3.medium"  # was t3.small
```

> **Note:** Changing instance type causes a stop/start (brief downtime). Plan this during a maintenance window.

### 1.2 — Add TimescaleDB Docker setup to user_data

Append to the existing `user_data` script in `ec2.tf` (after the Docker/Redis setup):

```bash
# Pull and start TimescaleDB
docker pull timescale/timescaledb:latest-pg16

docker run -d \
  --name rooted-timescaledb \
  --restart unless-stopped \
  -e POSTGRES_USER=rooted \
  -e POSTGRES_PASSWORD=${db_password} \
  -e POSTGRES_DB=rooted_telemetry \
  -p 127.0.0.1:5434:5432 \
  -v timescale_data:/var/lib/postgresql/data \
  timescale/timescaledb:latest-pg16

# Wait for TimescaleDB to be ready
until docker exec rooted-timescaledb pg_isready -U rooted -d rooted_telemetry; do
  sleep 2
done

# Initialize schema
docker cp /var/www/rooted/init-timescale.sql rooted-timescaledb:/tmp/init-timescale.sql
docker exec rooted-timescaledb psql -U rooted -d rooted_telemetry -f /tmp/init-timescale.sql
```

Key details:
- Port bound to `127.0.0.1:5434` (not `0.0.0.0`) — no external access
- Named volume `timescale_data` persists across container restarts
- `--restart unless-stopped` ensures auto-restart on EC2 reboot
- The `db_password` variable is already available in the Terraform template

### 1.3 — Add output

In `infra/terraform/outputs.tf`:
```hcl
output "timescale_connection_url" {
  description = "TimescaleDB connection URL (localhost on EC2)"
  value       = "postgresql://rooted:${var.db_password}@localhost:5434/rooted_telemetry"
  sensitive   = true
}
```

### 1.4 — Terraform apply plan

```bash
cd infra/terraform
terraform plan   # Review: expect instance type change + user_data update
terraform apply  # Will stop/start EC2 (brief downtime)
```

---

## Phase 2: Deploy Scripts

### 2.1 — Update `scripts/setup-ec2.sh`

This script runs once on initial EC2 setup. Add TimescaleDB container startup and env var.

After the Redis Docker block, add:
```bash
# --- TimescaleDB ---
echo "Starting TimescaleDB..."
docker run -d \
  --name rooted-timescaledb \
  --restart unless-stopped \
  -e POSTGRES_USER=rooted \
  -e POSTGRES_PASSWORD="$DB_PASSWORD" \
  -e POSTGRES_DB=rooted_telemetry \
  -p 127.0.0.1:5434:5432 \
  -v timescale_data:/var/lib/postgresql/data \
  timescale/timescaledb:latest-pg16

# Wait for ready
until docker exec rooted-timescaledb pg_isready -U rooted -d rooted_telemetry 2>/dev/null; do
  echo "Waiting for TimescaleDB..."
  sleep 2
done

# Initialize schema
docker cp /var/www/rooted/docker/init-timescale.sql rooted-timescaledb:/tmp/init-timescale.sql
docker exec rooted-timescaledb psql -U rooted -d rooted_telemetry -f /tmp/init-timescale.sql
```

Add to the `.env.production` heredoc:
```bash
TIMESCALE_DATABASE_URL=postgresql://rooted:${DB_PASSWORD}@localhost:5434/rooted_telemetry
```

### 2.2 — Update `scripts/deploy-scp.sh`

Add `docker/init-timescale.sql` to the files copied to `.deploy/`:
```bash
cp docker/init-timescale.sql .deploy/docker/init-timescale.sql
```

And include it in the rsync/scp to EC2:
```bash
rsync ... .deploy/docker/init-timescale.sql $EC2_HOST:/var/www/rooted/docker/
```

---

## Phase 3: CI/CD — GitHub Actions deploy.yml

### 3.1 — Add init-timescale.sql to deploy artifacts

In the rsync step, add:
```yaml
rsync -avz docker/init-timescale.sql ${{ secrets.EC2_HOST }}:/var/www/rooted/docker/
```

### 3.2 — Ensure TimescaleDB running before PM2 reload

Add a deploy step (SSH to EC2) before the PM2 reload:
```yaml
- name: Ensure TimescaleDB is running
  run: |
    ssh $EC2_USER@$EC2_HOST << 'EOF'
      if ! docker ps --filter name=rooted-timescaledb --format '{{.Names}}' | grep -q rooted-timescaledb; then
        echo "TimescaleDB not running, starting..."
        docker run -d \
          --name rooted-timescaledb \
          --restart unless-stopped \
          -e POSTGRES_USER=rooted \
          -e POSTGRES_PASSWORD="$DB_PASSWORD" \
          -e POSTGRES_DB=rooted_telemetry \
          -p 127.0.0.1:5434:5432 \
          -v timescale_data:/var/lib/postgresql/data \
          timescale/timescaledb:latest-pg16

        until docker exec rooted-timescaledb pg_isready -U rooted -d rooted_telemetry; do
          sleep 2
        done
      fi

      # Re-apply schema (idempotent)
      docker cp /var/www/rooted/docker/init-timescale.sql rooted-timescaledb:/tmp/init-timescale.sql
      docker exec rooted-timescaledb psql -U rooted -d rooted_telemetry -f /tmp/init-timescale.sql
    EOF
```

### 3.3 — CI pipeline (`ci.yml`)

Already sets `TIMESCALE_DATABASE_URL: postgresql://dummy:dummy@localhost:5432/dummy` for type-checking. No changes needed.

---

## Phase 4: Make `init-timescale.sql` Idempotent

The current script will fail if run twice (e.g., `CREATE TABLE` without `IF NOT EXISTS`, `create_hypertable` on existing hypertable). Fix for safe re-runs on every deploy.

### Changes needed:

```sql
-- Table creation
CREATE TABLE IF NOT EXISTS raw_telemetry ( ... );

-- Hypertable (only if not already a hypertable)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM timescaledb_information.hypertables
    WHERE hypertable_name = 'raw_telemetry'
  ) THEN
    PERFORM create_hypertable('raw_telemetry', 'received_at');
  END IF;
END $$;

-- Indexes (IF NOT EXISTS)
CREATE INDEX IF NOT EXISTS idx_raw_telemetry_dedup ON ...;
CREATE INDEX IF NOT EXISTS idx_raw_telemetry_machine_id ON ...;

-- Continuous aggregate (check before creating)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM timescaledb_information.continuous_aggregates
    WHERE view_name = 'machine_stats'
  ) THEN
    -- CREATE MATERIALIZED VIEW ... (can't use IF NOT EXISTS with continuous aggregates)
    -- Must be wrapped in dynamic SQL or skipped entirely
    EXECUTE '
      CREATE MATERIALIZED VIEW machine_stats
      WITH (timescaledb.continuous) AS
      SELECT ...
      FROM raw_telemetry
      GROUP BY machine_id, time_bucket(''1 hour'', received_at)
      WITH NO DATA
    ';
  END IF;
END $$;

-- Policies (check before adding — duplicate policies throw errors)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM timescaledb_information.jobs
    WHERE hypertable_name = 'raw_telemetry' AND proc_name = 'policy_compression'
  ) THEN
    PERFORM add_compression_policy('raw_telemetry', INTERVAL '7 days');
  END IF;
END $$;

-- Same pattern for retention and continuous aggregate refresh policies
```

---

## Phase 5: Backup Strategy

TimescaleDB runs in Docker with no managed backups. Options for telemetry data protection:

### Recommended: Cron-based `pg_dump` to S3

```bash
# Add to EC2 crontab (daily at 2am UTC)
0 2 * * * docker exec rooted-timescaledb pg_dump -U rooted -Fc rooted_telemetry | \
  aws s3 cp - s3://rooted-backups/timescale/$(date +\%Y-\%m-\%d).dump
```

This is low-priority given:
- Raw telemetry has 90-day retention (auto-dropped)
- Continuous aggregates can be rebuilt from raw data
- Telemetry loss is inconvenient but not catastrophic (machines keep running)

Can be added later when backup infra is set up for other services.

---

## Verification Checklist

- [ ] `terraform plan` shows only instance type change + user_data update (no destructive changes to RDS, security groups, etc.)
- [ ] After `terraform apply`, EC2 restarts and TimescaleDB container comes up automatically
- [ ] `docker exec rooted-timescaledb psql -U rooted -d rooted_telemetry -c "SELECT 1"` succeeds from EC2
- [ ] `init-timescale.sql` can be run twice without errors
- [ ] API starts without the `TIMESCALE_DATABASE_URL not set` warning
- [ ] Telemetry writes succeed (check API logs for insert confirmations)
- [ ] GitHub Actions deploy workflow completes successfully
- [ ] After deploy, `docker ps` on EC2 shows both `rooted-redis` and `rooted-timescaledb` running

---

## Cost Impact

| Resource | Before | After |
|----------|--------|-------|
| EC2 | t3.small (~$15/mo) | t3.medium (~$30/mo) |
| RDS | db.t3.micro (~$13/mo) | No change |
| TimescaleDB | N/A | $0 (Docker on EC2) |
| **Total** | **~$28/mo** | **~$43/mo** |

Increase: ~$15/mo for the EC2 upgrade.
