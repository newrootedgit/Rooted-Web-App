# Deployment Phase 2: Lessons Learned & Production Checklist

**Status:** Completed on 2026-01-27

This document captures the actual deployment experience, issues encountered, and solutions applied during the first production deployment.

---

## What We Learned

### 1. Build Locally, Deploy Binaries

**Issue:** Building on a t3.small EC2 instance is slow and resource-intensive.

**Solution:** Build locally on development machine and SCP only the compiled artifacts:
- Frontend: `dist/` directory
- API: `apps/api/dist/` directory
- Prisma schema: `apps/api/prisma/`
- Dependencies: `package.json` and `pnpm-lock.yaml`

**Benefits:**
- Faster deployments
- Less load on production server
- Consistent build environment

### 2. Prisma Binary Targets

**Issue:** Prisma Client generated on macOS (darwin-arm64) doesn't work on Linux (debian-openssl-3.0.x).

**Error:**
```
PrismaClientInitializationError: Prisma Client could not locate the Query Engine for runtime "debian-openssl-3.0.x".
```

**Solution:** Always regenerate Prisma Client on the target server:
```bash
cd /var/www/rooted/apps/api
pnpm prisma generate
```

**Better Solution (Future):** Add to `schema.prisma`:
```prisma
generator client {
  provider      = "prisma-client-js"
  output        = "./src/generated/prisma"
  binaryTargets = ["native", "debian-openssl-3.0.x"]
}
```

### 3. Prisma Client Path in Compiled Code

**Issue:** After regenerating Prisma on EC2, the compiled code in `dist/` still looked for the old client location.

**Solution:** Copy generated client to where compiled code expects it:
```bash
mkdir -p dist/generated
cp -r src/generated/prisma dist/generated/
```

**Root Cause:** TypeScript compilation bakes in import paths. The generated Prisma client must exist at the expected location relative to `dist/`.

### 4. RDS Endpoint Format

**Issue:** Terraform outputs RDS endpoint as `hostname:5432`, but we were adding `:5432` again in DATABASE_URL.

**Error:**
```
P1013: The provided database string is invalid. invalid port number in database URL.
```

**Solution:** Use the endpoint exactly as provided:
```bash
# Correct
DATABASE_URL=postgresql://rooted:PASSWORD@rooted-prod.xxxxx.rds.amazonaws.com:5432/rooted_planner

# Wrong (double port)
DATABASE_URL=postgresql://rooted:PASSWORD@rooted-prod.xxxxx.rds.amazonaws.com:5432:5432/rooted_planner
```

### 5. PostgreSQL Version Specificity

**Issue:** Terraform failed with `engine_version = "15.5"`.

**Error:**
```
Cannot find version 15.5 for postgres
```

**Solution:** Use major version only:
```hcl
engine_version = "15"  # AWS will use latest 15.x
```

### 6. Directory Structure Must Exist Before SCP

**Issue:** `scp` fails if target directories don't exist.

**Solution:** Create directories first via SSH:
```bash
ssh -i ~/.ssh/rooted-prod-key.pem ubuntu@EC2_IP \
  "sudo mkdir -p /var/www/rooted/apps/api && sudo chown -R ubuntu:ubuntu /var/www/rooted"
```

### 7. pnpm Lockfile Required for Production

**Issue:** `pnpm install --frozen-lockfile` fails without `pnpm-lock.yaml`.

**Solution:** Always copy lockfile to production:
```bash
scp -i ~/.ssh/rooted-prod-key.pem pnpm-lock.yaml ubuntu@EC2_IP:/var/www/rooted/
```

Or use `pnpm install --prod` (without frozen-lockfile) if lockfile isn't available.

### 8. Environment Helper Functions

**Improvement:** Created `isProd()` helper functions for cleaner environment checks:

**Frontend:** `src/lib/env.ts`
```typescript
export const isProd = () => import.meta.env.PROD;
```

**Backend:** `apps/api/src/lib/env.ts`
```typescript
export const isProd = () => process.env.NODE_ENV === 'production';
```

**Usage:**
- CORS configuration: Allow all origins in dev, restrict in prod
- API URL: Use relative `/api/trpc` in prod, configurable in dev
- Debug logging: Only log in development

---

## Deployment Workflow (Refined)

### Step 1: Build Locally
```bash
# Build frontend
pnpm build

# Build API
cd apps/api
pnpm build
cd ../..
```

### Step 2: Create Directories on EC2
```bash
ssh -i ~/.ssh/rooted-prod-key.pem ubuntu@EC2_IP \
  "sudo mkdir -p /var/www/rooted/apps/api && sudo chown -R ubuntu:ubuntu /var/www/rooted"
```

### Step 3: SCP Built Files
```bash
# Frontend
scp -i ~/.ssh/rooted-prod-key.pem -r dist ubuntu@EC2_IP:/var/www/rooted/

# API
scp -i ~/.ssh/rooted-prod-key.pem -r apps/api/dist ubuntu@EC2_IP:/var/www/rooted/apps/api/
scp -i ~/.ssh/rooted-prod-key.pem -r apps/api/prisma ubuntu@EC2_IP:/var/www/rooted/apps/api/
scp -i ~/.ssh/rooted-prod-key.pem apps/api/package.json ubuntu@EC2_IP:/var/www/rooted/apps/api/

# Dependencies
scp -i ~/.ssh/rooted-prod-key.pem pnpm-lock.yaml ubuntu@EC2_IP:/var/www/rooted/
scp -i ~/.ssh/rooted-prod-key.pem package.json ubuntu@EC2_IP:/var/www/rooted/
```

### Step 4: Setup on EC2
```bash
ssh -i ~/.ssh/rooted-prod-key.pem ubuntu@EC2_IP

cd /var/www/rooted/apps/api

# Install dependencies
pnpm install --prod

# Install Prisma CLI
pnpm add -D prisma
pnpm add @prisma/client

# Create environment file
cat > .env.production << EOF
NODE_ENV=production
DATABASE_URL=postgresql://rooted:PASSWORD@RDS_ENDPOINT:5432/rooted_planner
REDIS_URL=redis://localhost:6379
CLERK_PUBLISHABLE_KEY=pk_prod_xxxxx
CLERK_SECRET_KEY=sk_prod_xxxxx
LAMBDA_SECRET_TOKEN=your_token
AWS_REGION=us-west-2
LOG_LEVEL=info
PORT=8000
EOF

# Generate Prisma Client for Linux
cp .env.production .env
pnpm prisma generate

# Copy to dist location
mkdir -p dist/generated
cp -r src/generated/prisma dist/generated/

# Run migrations
pnpm prisma migrate deploy

# Start with PM2
set -a; source .env.production; set +a
pm2 start ecosystem.config.cjs
pm2 save
```

### Step 5: Configure Nginx (One-time)
```bash
sudo tee /etc/nginx/sites-available/rooted > /dev/null << 'EOF'
server {
    listen 80;
    server_name app.rootedrobotics.com;

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;

    location = /admin {
        root /var/www/rooted/dist;
        try_files /admin.html =404;
    }

    location /admin/ {
        alias /var/www/rooted/dist/;
        try_files $uri /admin.html;
    }

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
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    location / {
        root /var/www/rooted/dist;
        try_files $uri /index.html;
    }
}
EOF

sudo ln -sf /etc/nginx/sites-available/rooted /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
```

### Step 6: Point Cloudflare DNS
1. Go to Cloudflare DNS settings for `rootedrobotics.com`
2. Add A record:
   - Name: `app`
   - Content: `<EC2_PUBLIC_IP>`
   - Proxy: Enabled (orange cloud)
3. SSL/TLS → Full mode
4. Enable "Always Use HTTPS"

---

## Production Verification Checklist

### Infrastructure
- [ ] RDS database created and accessible from EC2
- [ ] EC2 instance running with Elastic IP
- [ ] Security groups configured (EC2 allows 22/80/443, RDS allows 5432 from EC2)
- [ ] Redis container running: `docker ps | grep rooted-redis`
- [ ] Nginx running: `sudo systemctl status nginx`
- [ ] Nginx config valid: `sudo nginx -t`

### Application
- [ ] API dependencies installed: `cd /var/www/rooted/apps/api && pnpm list`
- [ ] Prisma Client generated for Linux: `ls -la src/generated/prisma`
- [ ] Prisma Client copied to dist: `ls -la dist/generated/prisma`
- [ ] Database migrations applied: `pnpm prisma migrate status`
- [ ] Environment variables set: `cat .env.production` (verify all keys present)
- [ ] PM2 running API: `pm2 status`
- [ ] API health check passes: `curl http://localhost:8000/health`
- [ ] PM2 startup configured: `pm2 startup` (run the printed command)

### DNS & SSL
- [ ] Cloudflare DNS A record points to EC2 IP
- [ ] Cloudflare proxy enabled (orange cloud)
- [ ] SSL/TLS mode set to "Full"
- [ ] "Always Use HTTPS" enabled
- [ ] DNS propagated: `nslookup app.rootedrobotics.com`
- [ ] HTTPS works: `curl -I https://app.rootedrobotics.com`

### Frontend
- [ ] Frontend loads: `https://app.rootedrobotics.com`
- [ ] No console errors in browser
- [ ] Static assets load (check Network tab)
- [ ] API calls work (check Network tab for `/api/trpc` calls)

### API
- [ ] Health endpoint: `https://app.rootedrobotics.com/api/health`
- [ ] tRPC endpoint accessible: `https://app.rootedrobotics.com/api/trpc`
- [ ] CORS configured correctly (no CORS errors in browser)
- [ ] Authentication works (Clerk sign-in flow)

### Admin Portal
- [ ] Admin portal loads: `https://app.rootedrobotics.com/admin`
- [ ] Redirects to Clerk sign-in when not authenticated
- [ ] Shows "Access Denied" for non-admin users
- [ ] Shows dashboard for admin users (with `isAdmin` metadata)

### Clerk Configuration
- [ ] Production Clerk application created
- [ ] Domain `app.rootedrobotics.com` added to allowed domains
- [ ] Production keys used in `.env.production`
- [ ] Admin user has `isAdmin: true` in public metadata
- [ ] Sign-in flow works end-to-end

### Database
- [ ] Can connect from API: Check PM2 logs for successful connection
- [ ] Tables created: `pnpm prisma studio` (optional, for verification)
- [ ] Migrations applied: `pnpm prisma migrate status`
- [ ] RDS backups enabled: Check AWS Console

### Monitoring
- [ ] PM2 logs accessible: `pm2 logs rooted-api`
- [ ] Nginx access logs: `sudo tail -f /var/log/nginx/access.log`
- [ ] Nginx error logs: `sudo tail -f /var/log/nginx/error.log`
- [ ] Redis logs: `docker logs rooted-redis`

---

## Common Issues & Solutions

### API Won't Start
```bash
# Check logs
pm2 logs rooted-api --lines 50

# Common fixes
cd /var/www/rooted/apps/api
pnpm prisma generate
mkdir -p dist/generated && cp -r src/generated/prisma dist/generated/
pm2 restart rooted-api
```

### Database Connection Failed
```bash
# Verify DATABASE_URL format
cat .env.production | grep DATABASE_URL

# Test connection
pnpm prisma db pull --print

# Check RDS security group allows EC2
```

### 502 Bad Gateway
```bash
# Check if API is running
pm2 status

# Check Nginx config
sudo nginx -t

# Check Nginx error log
sudo tail -f /var/log/nginx/error.log
```

### CORS Errors
```bash
# Verify CORS_ORIGIN in .env.production
# Should be: https://app.rootedrobotics.com

# Restart API
pm2 restart rooted-api
```

### Prisma Binary Not Found
```bash
# Regenerate on EC2
cd /var/www/rooted/apps/api
pnpm prisma generate
mkdir -p dist/generated && cp -r src/generated/prisma dist/generated/
pm2 restart rooted-api
```

---

## Future Improvements

### 1. Automated Deployment Script
Create a single script that:
- Builds locally
- SCPs files
- Runs setup commands via SSH
- Verifies health

### 2. Prisma Binary Targets in Schema
Add to `apps/api/prisma/schema.prisma`:
```prisma
generator client {
  provider      = "prisma-client-js"
  output        = "./src/generated/prisma"
  binaryTargets = ["native", "debian-openssl-3.0.x"]
}
```

This allows generating both Mac and Linux binaries locally.

### 3. Environment Variable Management
Use AWS Systems Manager Parameter Store or Secrets Manager instead of `.env` files.

### 4. CI/CD Pipeline
GitHub Actions workflow:
- Run tests
- Build on push to main
- Deploy to EC2 automatically
- Run health checks
- Rollback on failure

### 5. Monitoring & Alerting
- CloudWatch metrics for EC2 and RDS
- PM2 monitoring: `pm2 monitor`
- Uptime monitoring (e.g., UptimeRobot)
- Error tracking (e.g., Sentry)

### 6. Blue-Green Deployment
- Run two PM2 instances
- Deploy to inactive instance
- Health check
- Switch Nginx upstream
- Zero-downtime deployments

---

## Cost Tracking

**Actual Monthly Costs:**
- EC2 t3.small: ~$15
- RDS db.t3.micro: ~$15
- Elastic IP: $0 (while attached)
- Data transfer: ~$5
- Cloudflare: $0 (free tier)

**Total: ~$35/month**

---

## Deployment Timeline

**Total Time:** ~2 hours (first deployment)

**Breakdown:**
- Terraform setup: 30 min
- EC2 provisioning: 10 min
- RDS creation: 10 min
- Code changes (isProd): 10 min
- Build and SCP: 15 min
- EC2 setup and troubleshooting: 45 min
- DNS configuration: 5 min
- Verification: 10 min

**Future deployments:** ~10 minutes with automated script

---

## Next Steps

1. **Test thoroughly** - Create test data, verify all features work
2. **Set up monitoring** - CloudWatch, PM2 monitoring, uptime checks
3. **Document runbook** - Common operations, troubleshooting steps
4. **Create deployment script** - Automate the manual steps
5. **Plan Phase 3** - CI/CD, scaling, advanced monitoring

---

## Resources

- **EC2 IP:** 54.149.122.72
- **Domain:** https://app.rootedrobotics.com
- **Admin Portal:** https://app.rootedrobotics.com/admin
- **SSH:** `ssh -i ~/.ssh/rooted-prod-key.pem ubuntu@54.149.122.72`
- **Terraform:** `infra/terraform/`
- **Deployment Scripts:** `scripts/`

---

**Deployment completed successfully on 2026-01-27** ✅
