# Deployment Phase 1: Production Infrastructure

**Goal:** Enable rapid dev-to-prod deployment with safe data separation.

---

## Architecture

> **Note on Cloudflare vs ngrok:**  
> Cloudflare is your production solution - it provides DNS, SSL, and DDoS protection for your deployed EC2 instance.  
> ngrok is NOT needed for production. It's only useful for temporarily exposing localhost during local development testing.

```
┌─────────────────────────────────────────────────────────────┐
│ Cloudflare DNS (app.rootedrobotics.com)                     │
│ - Free SSL/HTTPS                                             │
│ - DDoS protection                                            │
│ - CDN caching                                                │
│ - Points to EC2 public IP (NOT localhost/ngrok)             │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ EC2 Instance (Ubuntu)                                        │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Nginx (Port 80)                                        │ │
│  │ - Serves frontend static files                         │ │
│  │ - Reverse proxy /api → localhost:8000                  │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Frontend (Built React app)                             │ │
│  │ Location: /var/www/rooted/dist                         │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ API Server (Fastify + tRPC)                            │ │
│  │ Port: 8000 (default in code)                           │ │
│  │ Process Manager: PM2                                   │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Redis (Docker)                                         │ │
│  │ Port: 6379 (localhost only)                            │ │
│  └────────────────────────────────────────────────────────┘ │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ AWS RDS PostgreSQL (Managed)                                │
│ - Automated backups                                          │
│ - Point-in-time recovery                                     │
│ - Only accessible from EC2 security group                    │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ AWS Lambda (machine_lifecycle)                              │
│ - Receives IoT lifecycle events                              │
│ - Calls API with LAMBDA_SECRET_TOKEN                         │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Raspberry Pi IoT Devices                                     │
│ - Connect via AWS IoT Core (MQTT)                            │
│ - Lifecycle events trigger Lambda → API                      │
└─────────────────────────────────────────────────────────────┘
```

---

## Data Safety Strategy

### Local Development
- **Database:** Docker PostgreSQL (localhost:5433)
- **Redis:** Docker Redis (localhost:6379)
- **Isolation:** Complete separation from production

### Production
- **Database:** AWS RDS PostgreSQL (managed, backed up)
- **Redis:** Docker on EC2 (or ElastiCache later)
- **Isolation:** Different DATABASE_URL, no local access

### IoT Communication
- **Route:** Pi → AWS IoT → Lambda → API → Database
- **Security:** Lambda authenticates to API with `LAMBDA_SECRET_TOKEN`
- **Benefit:** Single validation layer, leverages existing IoT infrastructure

---

## Pre-Deployment Code Changes Required

> **IMPORTANT:** These code changes MUST be made before deployment.

### 1. Fix CORS Configuration

**File:** `apps/api/src/index.ts`

**Current code (line 32):**
```typescript
await app.register(cors, { origin: true });
```

**Change to:**
```typescript
await app.register(cors, {
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
});
```

### 2. Fix Frontend API URL

**File:** `src/lib/trpc/client.ts`

**Current code (line 11):**
```typescript
url: import.meta.env.VITE_API_URL || 'http://localhost:8000/trpc',
```

**Change to:**
```typescript
url: import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api/trpc' : 'http://localhost:8000/trpc'),
```

### 3. Remove Debug Logging (Optional but Recommended)

**File:** `src/lib/trpc/client.ts`

**Remove or wrap in dev check (line 14):**
```typescript
console.log('[tRPC] Auth token:', token ? `${token.slice(0, 20)}...` : 'null');
```

---

## Action Steps

### 1. Terraform Infrastructure (30 min)

**Note:** RDS and security group Terraform files need to be created. Current `infra/terraform/` only contains IoT and Lambda configuration.

**Create these new files:**
```
infra/terraform/
├── rds.tf          # PostgreSQL database (NEW - needs to be created)
├── security.tf     # Security groups (NEW - needs to be created)
├── ec2.tf          # EC2 instance (NEW - optional, can provision manually)
└── redis.tf        # ElastiCache (optional, using Docker initially)
```

**Example `rds.tf`:**
```hcl
resource "aws_db_instance" "rooted_db" {
  identifier           = "rooted-production"
  engine               = "postgres"
  engine_version       = "15"
  instance_class       = "db.t3.micro"
  allocated_storage    = 20
  storage_type         = "gp2"

  db_name              = "rooted_planner"
  username             = "rooted"
  password             = var.db_password  # Pass via -var or tfvars

  vpc_security_group_ids = [aws_security_group.rds.id]
  publicly_accessible    = false
  skip_final_snapshot    = false
  final_snapshot_identifier = "rooted-final-snapshot"

  backup_retention_period = 7
  backup_window          = "03:00-04:00"
  maintenance_window     = "Mon:04:00-Mon:05:00"

  tags = {
    Name        = "rooted-production"
    Environment = "production"
  }
}

resource "aws_security_group" "rds" {
  name        = "rooted-rds-sg"
  description = "Security group for RDS"
  vpc_id      = var.vpc_id

  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.ec2.id]  # Only from EC2
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

output "rds_endpoint" {
  value = aws_db_instance.rooted_db.endpoint
}
```

**Execute (after creating files):**
```bash
cd infra/terraform

# Initialize (if new providers added)
terraform init

# Review changes
terraform plan \
  -var="api_endpoint=https://app.rootedrobotics.com" \
  -var="lambda_secret_token=<your-token>" \
  -var="db_password=<secure-password>" \
  -var="vpc_id=<your-vpc-id>"

# Apply
terraform apply

# Save outputs (DO NOT commit these files)
terraform output rds_endpoint
# Store password in password manager, NOT in files
```

**Outputs needed:**
- RDS endpoint URL
- RDS password (store in password manager only)
- Security group IDs

---

### 2. EC2 Setup (45 min)

**Prerequisites:**
- EC2 instance running Ubuntu 22.04+
- SSH key (.pem file)
- Public IP address (or Elastic IP)
- Security group allowing inbound ports 22 (SSH), 80 (HTTP), 443 (HTTPS)

**Install dependencies:**
```bash
# SSH to EC2
ssh -i ~/.ssh/rooted-key.pem ubuntu@<EC2_IP>

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20+ (LTS)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install pnpm
npm install -g pnpm

# Install Nginx
sudo apt install -y nginx

# Install Docker (for Redis)
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker ubuntu
# Log out and back in for docker group to take effect

# Install PM2 (process manager)
npm install -g pm2
```

**Setup application directory:**
```bash
sudo mkdir -p /var/www/rooted
sudo chown ubuntu:ubuntu /var/www/rooted
cd /var/www/rooted
git clone <repo-url> .
pnpm install
```

**Start Redis:**
```bash
docker run -d \
  --name rooted-redis \
  --restart unless-stopped \
  -p 127.0.0.1:6379:6379 \
  redis:7-alpine
```

---

### 3. Nginx Configuration (15 min)

**Create config:**
```bash
sudo nano /etc/nginx/sites-available/rooted
```

**Content:**
```nginx
server {
    listen 80;
    server_name app.rootedrobotics.com;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;

    # Admin portal
    # Note: Vite outputs admin.html at dist root, not in a subdirectory
    location = /admin {
        root /var/www/rooted/dist;
        try_files /admin.html =404;
    }

    location /admin/ {
        alias /var/www/rooted/dist/;
        try_files $uri /admin.html;
    }

    # API proxy - strips /api prefix when forwarding
    location /api/ {
        proxy_pass http://localhost:8000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Timeout settings for long-running requests
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Main app (must be last - catches all other routes)
    location / {
        root /var/www/rooted/dist;
        try_files $uri /index.html;
    }
}
```

**Enable:**
```bash
sudo ln -s /etc/nginx/sites-available/rooted /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
sudo systemctl enable nginx
```

---

### 4. Environment Configuration (10 min)

**Create production env files on EC2:**

**API Environment (`/var/www/rooted/apps/api/.env.production`):**
```bash
cat > /var/www/rooted/apps/api/.env.production << 'EOF'
NODE_ENV=production

# Database (from Terraform output)
DATABASE_URL=postgresql://rooted:<PASSWORD>@<RDS_ENDPOINT>:5432/rooted_planner

# Redis
REDIS_URL=redis://localhost:6379

# Clerk Authentication
CLERK_PUBLISHABLE_KEY=<from-clerk-dashboard-PRODUCTION-keys>
CLERK_SECRET_KEY=<from-clerk-dashboard-PRODUCTION-keys>

# Lambda → API Authentication (must match Terraform lambda_secret_token)
LAMBDA_SECRET_TOKEN=<same-token-used-in-terraform>

# AWS IoT (for machine provisioning)
AWS_IOT_ENDPOINT=<your-iot-endpoint>.iot.<region>.amazonaws.com
AWS_IOT_POLICY_NAME=rooted-machine-policy-prod
AWS_REGION=us-west-2

# Logging
LOG_LEVEL=info
EOF
```

**Frontend Environment (`/var/www/rooted/.env.production`):**
```bash
cat > /var/www/rooted/.env.production << 'EOF'
# Frontend environment (VITE_ prefix required for client-side access)
VITE_CLERK_PUBLISHABLE_KEY=<from-clerk-dashboard-PRODUCTION-keys>
VITE_API_URL=/api/trpc
EOF
```

**Important:** Use PRODUCTION Clerk keys, not test keys. Create a separate Clerk application for production.

**Generate Prisma client and run migrations:**
```bash
cd /var/www/rooted/apps/api

# Copy env file for prisma commands
cp .env.production .env

# Generate Prisma client
pnpm prisma generate

# Run migrations
pnpm prisma migrate deploy

# Verify connection
pnpm prisma db pull --print
```

---

### 5. Application Build & Deployment (20 min)

**Build frontend:**
```bash
cd /var/www/rooted

# Copy frontend env for build
cp .env.production .env

# Build (includes both main app and admin portal)
pnpm build

# Verify output
ls -la dist/
# Should contain: index.html, admin.html, assets/
```

**Build API:**
```bash
cd /var/www/rooted/apps/api

# Build TypeScript
pnpm build

# Verify output
ls -la dist/
# Should contain: index.js and other compiled files
```

**Create PM2 ecosystem file:**
```bash
cat > /var/www/rooted/apps/api/ecosystem.config.cjs << 'EOF'
module.exports = {
  apps: [{
    name: 'rooted-api',
    script: 'node',
    args: 'dist/index.js',
    cwd: '/var/www/rooted/apps/api',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env_file: '.env.production',
    env: {
      NODE_ENV: 'production',
    },
  }]
};
EOF
```

**Note:** PM2's `env_file` requires pm2 2.5+. Alternatively, source the env manually:

```bash
# Alternative: Load env vars before starting
cd /var/www/rooted/apps/api
set -a; source .env.production; set +a
pm2 start ecosystem.config.cjs
```

**Start and persist:**
```bash
cd /var/www/rooted/apps/api
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup  # Follow the printed command to enable on boot
```

**Verify API is running:**
```bash
# Check PM2 status
pm2 status

# Check health endpoint
curl http://localhost:8000/health
# Expected: {"status":"ok","timestamp":"..."}

# Check logs if issues
pm2 logs rooted-api --lines 50
```

---

### 6. Cloudflare DNS (5 min)

**In Cloudflare dashboard:**
1. Go to rootedrobotics.com DNS settings
2. Add A record:
   - Type: `A`
   - Name: `app`
   - Content: `<EC2_PUBLIC_IP>`
   - Proxy status: `Proxied` (orange cloud)
   - TTL: `Auto`
3. Save

**Configure SSL/TLS:**
1. Go to SSL/TLS settings
2. Set mode to "Full" (not "Full (strict)" unless you have origin cert)
3. Enable "Always Use HTTPS"

**Wait 2-5 minutes for DNS propagation.**

**Verify:**
```bash
# From your local machine
curl -I https://app.rootedrobotics.com
# Should return 200 OK

curl https://app.rootedrobotics.com/api/health
# Should return {"status":"ok","timestamp":"..."}
```

---

### 7. Deployment Script (20 min)

**Create script:**
```bash
mkdir -p scripts
cat > scripts/deploy.sh << 'SCRIPT'
#!/bin/bash
set -e

EC2_HOST="ubuntu@<EC2_IP>"
SSH_KEY="~/.ssh/rooted-key.pem"
APP_DIR="/var/www/rooted"

echo "Deploying to production..."

# SSH and deploy
ssh -i $SSH_KEY $EC2_HOST << 'ENDSSH'
set -e
cd /var/www/rooted

# Pull latest code
echo "Pulling latest code..."
git pull origin main

# Install dependencies (in case of changes)
echo "Installing dependencies..."
pnpm install --frozen-lockfile

# Build frontend
echo "Building frontend..."
cp .env.production .env
pnpm build

# Build and deploy API
echo "Building API..."
cd apps/api
cp .env.production .env
pnpm build

# Run database migrations
echo "Running migrations..."
pnpm prisma migrate deploy

# Restart API with zero-downtime reload
echo "Restarting API..."
pm2 reload rooted-api

# Wait for startup
sleep 5

# Health check
echo "Checking health..."
if curl -sf http://localhost:8000/health > /dev/null; then
    echo "Health check passed!"
else
    echo "Health check FAILED!"
    pm2 logs rooted-api --lines 20
    exit 1
fi

echo "Deployment complete!"
ENDSSH

echo ""
echo "Live at: https://app.rootedrobotics.com"
echo "Admin:   https://app.rootedrobotics.com/admin"
SCRIPT

chmod +x scripts/deploy.sh
```

**Usage:**
```bash
./scripts/deploy.sh
```

---

## Verification Checklist

- [ ] **Pre-deployment code changes applied** (CORS, API URL)
- [ ] RDS created and accessible from EC2
- [ ] EC2 has all dependencies installed (Node 20+, pnpm, nginx, docker, pm2)
- [ ] Redis container running (`docker ps`)
- [ ] Nginx config valid (`sudo nginx -t`)
- [ ] API connected to RDS (`pm2 logs rooted-api`)
- [ ] Cloudflare DNS pointing to EC2
- [ ] HTTPS working via Cloudflare
- [ ] Health check works: `curl https://app.rootedrobotics.com/api/health`
- [ ] Frontend loads at https://app.rootedrobotics.com
- [ ] Admin portal loads at https://app.rootedrobotics.com/admin
- [ ] Admin portal redirects to Clerk sign-in when not authenticated
- [ ] Admin portal shows "Access Denied" for non-admin users
- [ ] Admin dashboard loads for admin users
- [ ] Lambda can call API (check CloudWatch logs for lifecycle events)
- [ ] Deployment script works end-to-end

---

## Rollback Plan

**If deployment fails:**

1. **Check logs first:**
   ```bash
   pm2 logs rooted-api --lines 100
   sudo tail -f /var/log/nginx/error.log
   docker logs rooted-redis
   ```

2. **Rollback code:**
   ```bash
   cd /var/www/rooted
   git log --oneline -5  # Find previous working commit
   git reset --hard <previous-commit>
   pnpm install
   pnpm build
   cd apps/api && pnpm build
   pm2 reload rooted-api
   ```

3. **Database rollback (if migration caused issues):**
   ```bash
   # RDS has automated backups - restore from AWS Console
   # Or rollback specific migration:
   cd /var/www/rooted/apps/api
   pnpm prisma migrate resolve --rolled-back <migration-name>
   ```

4. **Emergency: Revert to maintenance mode:**
   ```bash
   # Temporarily serve a static maintenance page
   sudo bash -c 'echo "Site under maintenance" > /var/www/rooted/dist/index.html'
   ```

---

## Cost Estimate

| Resource | Monthly Cost |
|----------|-------------|
| EC2 t3.small | ~$15 |
| RDS db.t3.micro | ~$15 |
| Data transfer | ~$5 |
| Cloudflare (free tier) | $0 |
| **Total** | **~$35/month** |

---

## Security Notes

- RDS only accessible from EC2 security group (no public access)
- Redis bound to localhost only (127.0.0.1)
- Lambda authenticates to API with `LAMBDA_SECRET_TOKEN`
- Clerk handles user authentication with production keys
- Cloudflare provides DDoS protection and SSL termination
- All secrets stored in `.env.production` files (not in git)
- Regular security updates via `sudo apt update && sudo apt upgrade`

**Never commit:**
- `.env` files with real credentials
- AWS access keys
- Clerk secret keys
- Database passwords
- `LAMBDA_SECRET_TOKEN`

---

## Support Commands

```bash
# === PM2 (API) ===
pm2 status                    # Check if API is running
pm2 logs rooted-api           # View API logs (live)
pm2 logs rooted-api --lines 100  # View last 100 lines
pm2 restart rooted-api        # Restart (brief downtime)
pm2 reload rooted-api         # Reload (zero downtime)
pm2 stop rooted-api           # Stop API
pm2 delete rooted-api         # Remove from PM2

# === Nginx ===
sudo systemctl status nginx   # Check Nginx status
sudo nginx -t                 # Test config syntax
sudo systemctl restart nginx  # Restart Nginx
sudo tail -f /var/log/nginx/access.log   # Access logs
sudo tail -f /var/log/nginx/error.log    # Error logs

# === Redis ===
docker ps                     # Check if Redis is running
docker logs rooted-redis      # View Redis logs
docker restart rooted-redis   # Restart Redis

# === Database ===
cd /var/www/rooted/apps/api
pnpm prisma studio            # Open Prisma Studio (DB GUI)
pnpm prisma migrate status    # Check migration status
pnpm prisma db pull --print   # Verify DB connection

# === Application ===
cd /var/www/rooted
git status                    # Check for uncommitted changes
git log --oneline -5          # Recent commits
pnpm build                    # Rebuild frontend
cd apps/api && pnpm build     # Rebuild API
```

---

## Troubleshooting

### API returns 502 Bad Gateway
1. Check if API is running: `pm2 status`
2. Check API logs: `pm2 logs rooted-api`
3. Verify port matches Nginx config (should be 8000)
4. Check Nginx error log: `sudo tail /var/log/nginx/error.log`

### Database connection failed
1. Check RDS security group allows EC2
2. Verify DATABASE_URL in `.env.production`
3. Test connection: `pnpm prisma db pull --print`
4. Check RDS is running in AWS Console

### Admin portal shows blank page
1. Check browser console for errors
2. Verify `admin.html` exists in `dist/`
3. Check VITE_CLERK_PUBLISHABLE_KEY is set
4. Verify Clerk application has correct domain

### Health check fails during deploy
1. Increase sleep time in deploy script
2. Check PM2 logs for startup errors
3. Verify all environment variables are set
4. Check database migration succeeded

---

## Next Phase (Future)

**Phase 2: CI/CD Automation**
- GitHub Actions for auto-deployment on push to main
- Automated testing before deploy
- Slack/Discord notifications on deploy

**Phase 3: Scaling**
- Move Redis to ElastiCache
- Add Application Load Balancer
- Multi-AZ RDS for high availability
- EC2 Auto Scaling Group
