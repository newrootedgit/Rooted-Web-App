# Staging Environment Setup

A complete, actionable guide to spinning up a full staging environment that mirrors production — separate AWS infrastructure, separate Clerk app, and a dedicated GitHub Actions deploy pipeline.

---

## Overview

Staging sits between local development (Docker) and production (EC2 + RDS + IoT):

```
local dev  →  staging  →  production
(Docker)      (AWS)        (AWS)
```

Staging uses the same Terraform modules as production but in a separate workspace/state, so you can validate migrations, test MQTT flows, and exercise the Lambda lifecycle handler against real AWS IoT before merging to main.

**What staging gets:**
- Its own EC2 instance (t3.small)
- Its own RDS PostgreSQL instance (db.t3.micro)
- Its own AWS IoT policy and topic rules
- Its own Lambda for machine lifecycle events
- Clerk "staging" environment (separate API keys)
- A GitHub Actions environment (`staging`) with its own secrets
- A dedicated deploy workflow (`deploy-staging.yml`)

---

## Phase 1 — AWS Infrastructure (Terraform)

The existing Terraform config already supports a `staging` environment via `var.environment`. We'll use a **separate Terraform workspace** so staging and production have isolated state.

### Step 1.1 — Create a staging Terraform workspace

```bash
cd infra/terraform

# Initialize (if not done already)
terraform init

# Create and switch to staging workspace
terraform workspace new staging
terraform workspace list
# * staging
#   default   (production lives here)
```

### Step 1.2 — Create `terraform.staging.tfvars`

Create this file at `infra/terraform/terraform.staging.tfvars`. **Do not commit real secrets — use placeholders and fill in via CI or 1Password.**

```hcl
# infra/terraform/terraform.staging.tfvars

aws_region          = "us-west-2"
project_name        = "rooted"
environment         = "staging"

# EC2 key pair — create one in AWS console named "rooted-staging-key"
ec2_key_name        = "rooted-staging-key"

# The staging EC2 public IP/domain (fill in after apply, then re-apply)
api_endpoint        = "https://staging.your-domain.com/api/trpc"

# Staging DB password — generate a strong random password
db_password         = "REPLACE_WITH_STAGING_DB_PASSWORD"

# Lambda secret — generate independently from prod
lambda_secret_token = "REPLACE_WITH_STAGING_LAMBDA_SECRET"
```

### Step 1.3 — Apply staging infrastructure

```bash
cd infra/terraform

# Make sure you're in staging workspace
terraform workspace select staging

# Plan to verify resource names will include "staging"
terraform plan -var-file="terraform.staging.tfvars"
# Confirm: resources should be named rooted-staging-web, rooted-staging-eip, etc.

# Apply
terraform apply -var-file="terraform.staging.tfvars"
```

**Expected outputs:**
```
ec2_public_ip       = "X.X.X.X"
rds_endpoint        = "rooted-staging-rds.xxxx.us-west-2.rds.amazonaws.com"
iot_endpoint        = "xxxx-ats.iot.us-west-2.amazonaws.com"
iot_policy_name     = "rooted-machine-policy-staging"
lambda_function_name = "rooted-staging-machine-lifecycle"
```

> **Note:** After you get the EC2 public IP, update `api_endpoint` in `terraform.staging.tfvars` and run `terraform apply` again so the Lambda has the correct endpoint.

### Step 1.4 — Bootstrap the EC2 instance

The user_data script in ec2.tf installs Node.js 20, pnpm, Nginx, Docker, and PM2 automatically on first boot. SSH in once the instance is up to verify:

```bash
# Download your staging key pair from AWS console first
chmod 400 rooted-staging-key.pem

ssh -i rooted-staging-key.pem ubuntu@<STAGING_EC2_IP>

# Verify installs (may take 2-3 minutes after first boot)
node --version   # v20.x.x
pnpm --version   # 9.x.x
pm2 --version
nginx -v
```

---

## Phase 2 — Clerk Staging Environment

Clerk supports multiple environments (instances) per application. Create a dedicated staging instance so that staging users and sessions are completely isolated from production.

### Step 2.1 — Create a Clerk staging instance

1. Go to [dashboard.clerk.com](https://dashboard.clerk.com)
2. Select your Rooted application
3. Click **"Create instance"** → name it `rooted-staging`
4. Choose **"Development"** type (or "Production" if you want a full-featured instance)
5. Copy the new keys:
   - `CLERK_PUBLISHABLE_KEY` → starts with `pk_test_` (staging)
   - `CLERK_SECRET_KEY` → starts with `sk_test_` (staging)

### Step 2.2 — Configure allowed origins in Clerk

In the staging Clerk dashboard:
- **Allowed origins:** `https://staging.your-domain.com`, `http://localhost:3000`
- **Redirect URLs:** `https://staging.your-domain.com/`, `http://localhost:3000/`

---

## Phase 3 — Staging Environment Variables on EC2

SSH into the staging EC2 instance and create the environment file:

```bash
ssh -i rooted-staging-key.pem ubuntu@<STAGING_EC2_IP>

sudo mkdir -p /var/www/rooted/apps/api
sudo chown -R ubuntu:ubuntu /var/www/rooted

cat > /var/www/rooted/apps/api/.env.production << 'EOF'
# ── Database ──────────────────────────────────────────────────────────────────
DATABASE_URL="postgresql://rooted:<STAGING_DB_PASSWORD>@<RDS_STAGING_ENDPOINT>:5432/rooted_planner"

# ── Redis ─────────────────────────────────────────────────────────────────────
# Option A: Run Redis on the staging EC2 itself (simplest)
REDIS_URL="redis://localhost:6379"

# ── Clerk Authentication ───────────────────────────────────────────────────────
CLERK_PUBLISHABLE_KEY="pk_test_<STAGING_CLERK_KEY>"
CLERK_SECRET_KEY="sk_test_<STAGING_CLERK_SECRET>"

# ── CORS ──────────────────────────────────────────────────────────────────────
CORS_ORIGIN="https://staging.your-domain.com"

# ── AWS IoT ───────────────────────────────────────────────────────────────────
AWS_IOT_ENDPOINT="<IOT_ENDPOINT_FROM_TERRAFORM_OUTPUT>"
AWS_IOT_POLICY_NAME="rooted-machine-policy-staging"
AWS_ACCESS_KEY_ID="<STAGING_AWS_ACCESS_KEY>"
AWS_SECRET_ACCESS_KEY="<STAGING_AWS_SECRET>"
AWS_REGION="us-west-2"

# ── Lambda Auth ───────────────────────────────────────────────────────────────
LAMBDA_SECRET_TOKEN="<STAGING_LAMBDA_SECRET>"

# ── App Config ────────────────────────────────────────────────────────────────
ENVIRONMENT="staging"
NODE_ENV="production"
PORT=8000
CONFIG_TTL_MS=100000
CLEANUP_INTERVAL_MS=60000
EOF

chmod 600 /var/www/rooted/apps/api/.env.production
```

### Install Redis on the staging EC2 (optional, avoids another AWS service)

```bash
sudo apt-get update
sudo apt-get install -y redis-server
sudo systemctl enable redis-server
sudo systemctl start redis-server
redis-cli ping   # PONG
```

---

## Phase 4 — Nginx Configuration on Staging EC2

```bash
sudo tee /etc/nginx/sites-available/rooted-staging << 'EOF'
server {
    listen 80;
    server_name staging.your-domain.com;

    # Redirect HTTP → HTTPS (configure after adding SSL cert)
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name staging.your-domain.com;

    # SSL — provision via certbot (see Phase 5)
    ssl_certificate     /etc/letsencrypt/live/staging.your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/staging.your-domain.com/privkey.pem;

    # Serve frontend static files
    root /var/www/rooted/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy tRPC API
    location /api/trpc/ {
        proxy_pass http://localhost:8000/trpc/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Health check passthrough
    location /health {
        proxy_pass http://localhost:8000/health;
    }
}
EOF

sudo ln -sf /etc/nginx/sites-available/rooted-staging /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Phase 5 — SSL Certificate

```bash
sudo apt-get install -y certbot python3-certbot-nginx

# Point your DNS A record: staging.your-domain.com → <STAGING_EC2_IP> first
sudo certbot --nginx -d staging.your-domain.com

sudo systemctl reload nginx
```

---

## Phase 6 — GitHub Actions: Staging Deploy Workflow

Create a new workflow file that mirrors `deploy.yml` but targets the staging environment and secrets.

### Step 6.1 — Add GitHub Actions environment

1. Go to your GitHub repo → **Settings → Environments**
2. Create environment: `staging`
3. Add the following secrets to the `staging` environment:

| Secret Name             | Value                                      |
|-------------------------|--------------------------------------------|
| `EC2_HOST`              | `<STAGING_EC2_IP>`                         |
| `EC2_SSH_KEY`           | Contents of `rooted-staging-key.pem`       |
| `CLERK_PUBLISHABLE_KEY` | Staging Clerk publishable key (`pk_test_`) |

### Step 6.2 — Create `.github/workflows/deploy-staging.yml`

```yaml
name: Deploy to Staging

on:
  # Auto-deploy when PRs are merged into main
  push:
    branches: [main]
  # Also allow manual trigger
  workflow_dispatch:

env:
  EC2_USER: ubuntu
  APP_DIR: /var/www/rooted

jobs:
  deploy:
    name: Build and Deploy to Staging
    runs-on: ubuntu-latest
    environment: staging

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install

      - name: Install API dependencies
        run: cd apps/api && pnpm install

      - name: Generate Prisma Client
        env:
          DATABASE_URL: "postgresql://dummy:dummy@localhost:5432/dummy"
        run: cd apps/api && pnpm exec prisma generate

      - name: Build API
        run: cd apps/api && pnpm build

      - name: Build frontend
        env:
          VITE_CLERK_PUBLISHABLE_KEY: ${{ secrets.CLERK_PUBLISHABLE_KEY }}
          VITE_API_URL: /api/trpc
        run: pnpm build

      - name: Setup SSH
        run: |
          mkdir -p ~/.ssh
          echo "${{ secrets.EC2_SSH_KEY }}" > ~/.ssh/deploy_key
          chmod 600 ~/.ssh/deploy_key
          ssh-keyscan -H ${{ secrets.EC2_HOST }} >> ~/.ssh/known_hosts

      - name: Deploy files to staging EC2
        run: |
          ssh -i ~/.ssh/deploy_key ${{ env.EC2_USER }}@${{ secrets.EC2_HOST }} \
            "mkdir -p ${{ env.APP_DIR }}/apps/api"

          rsync -avz --delete -e "ssh -i ~/.ssh/deploy_key" \
            dist/ ${{ env.EC2_USER }}@${{ secrets.EC2_HOST }}:${{ env.APP_DIR }}/dist/

          rsync -avz --delete -e "ssh -i ~/.ssh/deploy_key" \
            apps/api/dist/ ${{ env.EC2_USER }}@${{ secrets.EC2_HOST }}:${{ env.APP_DIR }}/apps/api/dist/

          rsync -avz -e "ssh -i ~/.ssh/deploy_key" \
            apps/api/prisma/ ${{ env.EC2_USER }}@${{ secrets.EC2_HOST }}:${{ env.APP_DIR }}/apps/api/prisma/

          scp -i ~/.ssh/deploy_key \
            apps/api/package.json ${{ env.EC2_USER }}@${{ secrets.EC2_HOST }}:${{ env.APP_DIR }}/apps/api/

      - name: Finalize deployment on staging EC2
        run: |
          ssh -i ~/.ssh/deploy_key ${{ env.EC2_USER }}@${{ secrets.EC2_HOST }} << 'ENDSSH'
          set -e
          cd /var/www/rooted/apps/api

          pnpm install --prod
          pnpm add -D prisma@6
          pnpm exec prisma generate

          mkdir -p dist/generated
          cp -r src/generated/prisma dist/generated/

          # Run migrations against staging RDS
          pnpm exec prisma migrate deploy

          # Reload with staging env
          set -a; source .env.production; set +a
          pm2 reload rooted-api || pm2 start dist/index.js --name rooted-api

          sleep 5
          curl -sf http://localhost:8000/health || (pm2 logs rooted-api --lines 30 && exit 1)

          echo "✓ Staging deployment complete"
          ENDSSH

      - name: Cleanup
        if: always()
        run: rm -f ~/.ssh/deploy_key
```

---

## Phase 7 — First Deploy & Database Bootstrap

### Step 7.1 — Initialize the PM2 process on staging EC2

On the first deploy you need PM2 to be aware of the app. SSH in after the workflow runs:

```bash
ssh -i rooted-staging-key.pem ubuntu@<STAGING_EC2_IP>
cd /var/www/rooted/apps/api

set -a; source .env.production; set +a

# Start for the first time
pm2 start dist/index.js --name rooted-api

# Save so it survives reboots
pm2 save
pm2 startup   # follow the printed sudo command
```

### Step 7.2 — Verify migrations applied

```bash
# From staging EC2
cd /var/www/rooted/apps/api
set -a; source .env.production; set +a
pnpm exec prisma migrate status
```

Expected output: all migrations listed as `Applied`.

### Step 7.3 — Seed staging data (optional)

If you want realistic data in staging, run a seed script. Create `apps/api/prisma/seed-staging.ts` based on the existing Prisma schema:

```typescript
// apps/api/prisma/seed-staging.ts
import { PrismaClient } from '../src/generated/prisma'

const prisma = new PrismaClient()

async function main() {
  // Create a staging tenant
  const tenant = await prisma.tenants.upsert({
    where: { id: 'staging-tenant-1' },
    update: {},
    create: { id: 'staging-tenant-1', name: 'Staging Farm Co.' },
  })

  // Create a staging farm
  await prisma.farms.upsert({
    where: { id: 'staging-farm-1' },
    update: {},
    create: {
      id: 'staging-farm-1',
      tenant_id: tenant.id,
      name: 'Staging Farm',
      timezone: 'America/Los_Angeles',
    },
  })

  console.log('Staging seed complete')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
```

Run it:

```bash
cd apps/api
DATABASE_URL="<STAGING_DATABASE_URL>" npx tsx prisma/seed-staging.ts
```

---

## Phase 8 — DNS Configuration

Point a staging subdomain at the staging EC2 Elastic IP.

| Record | Type | Value                  |
|--------|------|------------------------|
| `staging.your-domain.com` | A | `<STAGING_EC2_ELASTIC_IP>` |

After DNS propagates (~5 min for most registrars):

```bash
curl -sf https://staging.your-domain.com/health
# {"status":"ok"}
```

---

## Environment Variables Reference

Full list of environment variables needed for the staging `.env.production` file on EC2 and corresponding GitHub Actions secrets:

| Variable | Where set | Notes |
|---|---|---|
| `DATABASE_URL` | EC2 `.env.production` | Points to staging RDS endpoint |
| `REDIS_URL` | EC2 `.env.production` | `redis://localhost:6379` if local |
| `CLERK_PUBLISHABLE_KEY` | EC2 + GitHub secret | Staging Clerk `pk_test_` key |
| `CLERK_SECRET_KEY` | EC2 `.env.production` | Staging Clerk `sk_test_` key |
| `VITE_CLERK_PUBLISHABLE_KEY` | GitHub secret | Used during frontend build |
| `CORS_ORIGIN` | EC2 `.env.production` | `https://staging.your-domain.com` |
| `AWS_IOT_ENDPOINT` | EC2 `.env.production` | From Terraform output |
| `AWS_IOT_POLICY_NAME` | EC2 `.env.production` | `rooted-machine-policy-staging` |
| `AWS_ACCESS_KEY_ID` | EC2 `.env.production` | IAM user with IoT permissions |
| `AWS_SECRET_ACCESS_KEY` | EC2 `.env.production` | Corresponding secret |
| `AWS_REGION` | EC2 `.env.production` | `us-west-2` |
| `LAMBDA_SECRET_TOKEN` | EC2 `.env.production` | Must match Terraform `lambda_secret_token` |
| `ENVIRONMENT` | EC2 `.env.production` | `staging` |
| `NODE_ENV` | EC2 `.env.production` | `production` |
| `EC2_HOST` | GitHub secret (staging env) | Staging EC2 IP |
| `EC2_SSH_KEY` | GitHub secret (staging env) | Contents of `rooted-staging-key.pem` |

---

## Cost Estimate

| Resource | Type | Monthly Cost (est.) |
|---|---|---|
| EC2 t3.small | 1 instance | ~$15 |
| RDS db.t3.micro | PostgreSQL 15, 20GB gp3 | ~$15 |
| Elastic IP | 1 EIP | ~$4 |
| Lambda invocations | Low volume in staging | ~$0 |
| IoT Core | Low device count | ~$1 |
| **Total** | | **~$35/month** |

> To save costs when staging isn't actively needed, stop the EC2 and RDS instances:
> ```bash
> aws ec2 stop-instances --instance-ids <STAGING_INSTANCE_ID>
> aws rds stop-db-instance --db-instance-identifier rooted-staging-rds
> ```

---

## Checklist

Use this checklist when setting up staging for the first time:

### Infrastructure
- [ ] Terraform workspace `staging` created
- [ ] `terraform.staging.tfvars` created (secrets stored securely, not committed)
- [ ] `terraform apply` succeeded in staging workspace
- [ ] EC2 Elastic IP obtained
- [ ] RDS endpoint obtained
- [ ] IoT endpoint and policy name noted from outputs

### EC2 Setup
- [ ] Can SSH into staging EC2
- [ ] Node.js 20, pnpm, PM2, Nginx, Redis all installed and running
- [ ] `/var/www/rooted/apps/api/.env.production` created with correct staging values
- [ ] Nginx config deployed and tested (`nginx -t`)
- [ ] SSL certificate issued via certbot

### DNS
- [ ] `staging.your-domain.com` A record points to staging Elastic IP
- [ ] `curl https://staging.your-domain.com/health` returns `{"status":"ok"}`

### Clerk
- [ ] Staging Clerk instance created
- [ ] Staging keys copied
- [ ] Allowed origins configured in Clerk dashboard

### GitHub Actions
- [ ] `staging` environment created in GitHub repo settings
- [ ] `EC2_HOST`, `EC2_SSH_KEY`, `CLERK_PUBLISHABLE_KEY` secrets added to staging environment
- [ ] `.github/workflows/deploy-staging.yml` committed and pushed
- [ ] First manual workflow dispatch succeeded

### Database
- [ ] `prisma migrate status` shows all migrations applied on staging RDS
- [ ] (Optional) staging seed data loaded

### Smoke Tests
- [ ] Frontend loads at `https://staging.your-domain.com`
- [ ] Clerk login works with staging credentials
- [ ] tRPC calls succeed (open browser devtools → Network tab)
- [ ] `/health` endpoint returns 200
- [ ] PM2 shows `rooted-api` as `online` (`pm2 list`)

---

## Teardown

When staging is no longer needed:

```bash
cd infra/terraform
terraform workspace select staging
terraform destroy -var-file="terraform.staging.tfvars"
terraform workspace select default
terraform workspace delete staging
```

This destroys all staging AWS resources (EC2, RDS, Elastic IP, Lambda, IoT rules). The staging Terraform state is deleted with the workspace.
