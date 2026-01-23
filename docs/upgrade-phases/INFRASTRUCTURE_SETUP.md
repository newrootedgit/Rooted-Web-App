# Infrastructure Setup Guide

## Overview

This document covers the infrastructure setup for the Rooted Web App, including VM deployment, Terraform configuration, AWS services, and scaling guidelines.

## Current Architecture

```
┌─────────────────────────────────────────┐
│           VM (Single Server)            │
│                                         │
│  ┌──────────────┐  ┌─────────────────┐ │
│  │   Fastify    │  │   PostgreSQL    │ │
│  │   API        │  │   Database      │ │
│  │   (Port      │  │   (Port 5432)   │ │
│  │   3001)      │  │                 │ │
│  └──────────────┘  └─────────────────┘ │
│         │                               │
│  ┌──────────────┐  ┌─────────────────┐ │
│  │    Nginx     │  │     Redis       │ │
│  │  (Port 80/   │  │   (Port 6379)   │ │
│  │   443)       │  │                 │ │
│  └──────────────┘  └─────────────────┘ │
│                                         │
└─────────────────────────────────────────┘
         │
         │ HTTPS
         ▼
    Internet
         │
         ▼
┌─────────────────┐
│  AWS Lambda     │ ← Calls API for machine status updates
└─────────────────┘
```

---

## Phase 1: VM Setup & Configuration

### 1.1 VM Specifications

**Minimum Requirements (Development/Small Scale):**
- **CPU:** 2 vCPUs
- **RAM:** 4 GB
- **Storage:** 50 GB SSD
- **Network:** 1 Gbps
- **OS:** Ubuntu 22.04 LTS

**Recommended (Production - Up to 50 machines):**
- **CPU:** 4 vCPUs
- **RAM:** 8 GB
- **Storage:** 100 GB SSD
- **Network:** 1 Gbps
- **OS:** Ubuntu 22.04 LTS

**Cloud Provider Options:**
- **AWS EC2:** t3.medium ($30/month) or t3.large ($60/month)
- **DigitalOcean:** $24/month (4GB) or $48/month (8GB)
- **Linode:** $24/month (4GB) or $48/month (8GB)
- **Hetzner:** €9/month (4GB) - Best value in Europe

### 1.2 Initial VM Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install pnpm
curl -fsSL https://get.pnpm.io/install.sh | sh -

# Install PostgreSQL 15
sudo apt install -y postgresql postgresql-contrib

# Install Redis
sudo apt install -y redis-server

# Install Nginx
sudo apt install -y nginx

# Install Docker (for future use)
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER

# Install certbot for SSL
sudo apt install -y certbot python3-certbot-nginx
```

### 1.3 PostgreSQL Configuration

**File:** `/etc/postgresql/15/main/postgresql.conf`

```conf
# Connection settings
max_connections = 100
shared_buffers = 1GB          # 25% of RAM for 4GB VM
effective_cache_size = 3GB    # 75% of RAM
work_mem = 10MB
maintenance_work_mem = 256MB

# Write-ahead log
wal_buffers = 16MB
checkpoint_completion_target = 0.9

# Query planner
random_page_cost = 1.1        # For SSD
effective_io_concurrency = 200

# Logging
log_line_prefix = '%t [%p]: [%l-1] user=%u,db=%d,app=%a,client=%h '
log_min_duration_statement = 1000  # Log queries > 1 second
```

**Create database and user:**

```bash
sudo -u postgres psql

CREATE DATABASE rooted_planner;
CREATE USER rooted WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE rooted_planner TO rooted;
\q
```

### 1.4 Nginx Configuration

**File:** `/etc/nginx/sites-available/rooted-api`

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
    limit_req zone=api_limit burst=20 nodelay;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Health check endpoint (no rate limit)
    location /health {
        proxy_pass http://localhost:3001/health;
        access_log off;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/rooted-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 1.5 SSL Certificate Setup

```bash
# Get SSL certificate
sudo certbot --nginx -d api.yourdomain.com

# Auto-renewal (certbot sets this up automatically)
sudo systemctl status certbot.timer
```

### 1.6 Application Deployment

**Create systemd service:**

**File:** `/etc/systemd/system/rooted-api.service`

```ini
[Unit]
Description=Rooted API Server
After=network.target postgresql.service redis.service

[Service]
Type=simple
User=rooted
WorkingDirectory=/home/rooted/Rooted-Web-App/apps/api
Environment=NODE_ENV=production
ExecStart=/usr/bin/pnpm start
Restart=on-failure
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl daemon-reload
sudo systemctl enable rooted-api
sudo systemctl start rooted-api
sudo systemctl status rooted-api
```

---

## Phase 2: AWS Infrastructure with Terraform

### 2.1 Install Terraform

```bash
# Install Terraform
wget -O- https://apt.releases.hashicorp.com/gpg | sudo gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/hashicorp.list
sudo apt update && sudo apt install terraform

# Verify
terraform --version
```

### 2.2 Project Structure

```
Rooted-Web-App/
├── infrastructure/
│   ├── terraform/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   ├── outputs.tf
│   │   ├── iot.tf
│   │   ├── lambda.tf
│   │   ├── iam.tf
│   │   └── secrets.tf
│   └── lambda/
│       └── machine-lifecycle/
│           ├── index.js
│           └── package.json
```

### 2.3 Terraform Configuration

**File:** `infrastructure/terraform/variables.tf`

```hcl
variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-west-2"
}

variable "project_name" {
  description = "Project name for resource naming"
  type        = string
  default     = "rooted"
}

variable "environment" {
  description = "Environment (dev, staging, prod)"
  type        = string
  default     = "prod"
}

variable "api_endpoint" {
  description = "Fastify API endpoint URL"
  type        = string
}

variable "lambda_secret_token" {
  description = "Secret token for Lambda to authenticate with API"
  type        = string
  sensitive   = true
}
```

**File:** `infrastructure/terraform/main.tf`

```hcl
terraform {
  required_version = ">= 1.0"
  
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  # Optional: Store state in S3
  # backend "s3" {
  #   bucket = "rooted-terraform-state"
  #   key    = "prod/terraform.tfstate"
  #   region = "us-west-2"
  # }
}

provider "aws" {
  region = var.aws_region
}

# Data sources
data "aws_caller_identity" "current" {}
data "aws_region" "current" {}
```

**File:** `infrastructure/terraform/iot.tf`

```hcl
# IoT Policy for Machines
resource "aws_iot_policy" "machine_policy" {
  name = "${var.project_name}-machine-policy-${var.environment}"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = "iot:Connect"
        Resource = "arn:aws:iot:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:client/$${iot:Connection.Thing.ThingName}"
      },
      {
        Effect = "Allow"
        Action = "iot:Subscribe"
        Resource = "arn:aws:iot:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:topicfilter/rooted/machines/$${iot:Connection.Thing.ThingName}/ping"
      },
      {
        Effect = "Allow"
        Action = "iot:Receive"
        Resource = "arn:aws:iot:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:topic/rooted/machines/$${iot:Connection.Thing.ThingName}/ping"
      },
      {
        Effect = "Allow"
        Action = "iot:Publish"
        Resource = "arn:aws:iot:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:topic/rooted/machines/$${iot:Connection.Thing.ThingName}/pong"
      }
    ]
  })
}

# IoT Rule for Lifecycle Events
resource "aws_iot_topic_rule" "machine_lifecycle" {
  name        = "${var.project_name}_machine_lifecycle_${var.environment}"
  description = "Route machine connection/disconnection events to Lambda"
  enabled     = true
  sql         = "SELECT clientId as deviceId, timestamp, eventType, sessionIdentifier FROM '$aws/events/presence/+/+'"
  sql_version = "2016-03-23"

  lambda {
    function_arn = aws_lambda_function.machine_lifecycle.arn
  }

  error_action {
    cloudwatch_logs {
      log_group_name = aws_cloudwatch_log_group.iot_rule_errors.name
      role_arn       = aws_iam_role.iot_rule.arn
    }
  }
}

# CloudWatch Log Group for IoT Rule Errors
resource "aws_cloudwatch_log_group" "iot_rule_errors" {
  name              = "/aws/iot/rules/${var.project_name}-lifecycle-errors-${var.environment}"
  retention_in_days = 7
}
```

**File:** `infrastructure/terraform/lambda.tf`

```hcl
# Lambda Function
resource "aws_lambda_function" "machine_lifecycle" {
  filename         = "${path.module}/../lambda/machine-lifecycle.zip"
  function_name    = "${var.project_name}-machine-lifecycle-${var.environment}"
  role            = aws_iam_role.lambda_exec.arn
  handler         = "index.handler"
  source_code_hash = filebase64sha256("${path.module}/../lambda/machine-lifecycle.zip")
  runtime         = "nodejs18.x"
  timeout         = 30
  memory_size     = 256

  environment {
    variables = {
      API_ENDPOINT    = var.api_endpoint
      SECRET_TOKEN    = var.lambda_secret_token
      ENVIRONMENT     = var.environment
    }
  }

  depends_on = [
    aws_cloudwatch_log_group.lambda_logs
  ]
}

# CloudWatch Log Group for Lambda
resource "aws_cloudwatch_log_group" "lambda_logs" {
  name              = "/aws/lambda/${var.project_name}-machine-lifecycle-${var.environment}"
  retention_in_days = 14
}

# Lambda Permission for IoT Rule
resource "aws_lambda_permission" "allow_iot" {
  statement_id  = "AllowExecutionFromIoT"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.machine_lifecycle.function_name
  principal     = "iot.amazonaws.com"
  source_arn    = aws_iot_topic_rule.machine_lifecycle.arn
}

# Dead Letter Queue (SQS)
resource "aws_sqs_queue" "lambda_dlq" {
  name                      = "${var.project_name}-machine-lifecycle-dlq-${var.environment}"
  message_retention_seconds = 1209600  # 14 days
  
  tags = {
    Name        = "${var.project_name}-lambda-dlq"
    Environment = var.environment
  }
}

# Update Lambda to use DLQ
resource "aws_lambda_function_event_invoke_config" "machine_lifecycle" {
  function_name = aws_lambda_function.machine_lifecycle.function_name

  destination_config {
    on_failure {
      destination = aws_sqs_queue.lambda_dlq.arn
    }
  }

  maximum_retry_attempts = 2
}
```

**File:** `infrastructure/terraform/iam.tf`

```hcl
# Lambda Execution Role
resource "aws_iam_role" "lambda_exec" {
  name = "${var.project_name}-lambda-exec-${var.environment}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

# Lambda Basic Execution Policy
resource "aws_iam_role_policy_attachment" "lambda_basic" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

# Lambda SQS Policy (for DLQ)
resource "aws_iam_role_policy" "lambda_sqs" {
  name = "${var.project_name}-lambda-sqs-${var.environment}"
  role = aws_iam_role.lambda_exec.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "sqs:SendMessage"
        ]
        Resource = aws_sqs_queue.lambda_dlq.arn
      }
    ]
  })
}

# IoT Rule Role
resource "aws_iam_role" "iot_rule" {
  name = "${var.project_name}-iot-rule-${var.environment}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "iot.amazonaws.com"
        }
      }
    ]
  })
}

# IoT Rule CloudWatch Logs Policy
resource "aws_iam_role_policy" "iot_cloudwatch" {
  name = "${var.project_name}-iot-cloudwatch-${var.environment}"
  role = aws_iam_role.iot_rule.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = "${aws_cloudwatch_log_group.iot_rule_errors.arn}:*"
      }
    ]
  })
}
```

**File:** `infrastructure/terraform/outputs.tf`

```hcl
output "iot_endpoint" {
  description = "AWS IoT endpoint for device connections"
  value       = data.aws_iot_endpoint.data.endpoint_address
}

output "iot_policy_name" {
  description = "IoT policy name for machine certificates"
  value       = aws_iot_policy.machine_policy.name
}

output "lambda_function_name" {
  description = "Lambda function name"
  value       = aws_lambda_function.machine_lifecycle.function_name
}

output "dlq_url" {
  description = "Dead Letter Queue URL"
  value       = aws_sqs_queue.lambda_dlq.url
}

data "aws_iot_endpoint" "data" {
  endpoint_type = "iot:Data-ATS"
}
```

### 2.4 Deploy with Terraform

**Create terraform.tfvars:**

```hcl
aws_region          = "us-west-2"
project_name        = "rooted"
environment         = "prod"
api_endpoint        = "https://api.yourdomain.com"
lambda_secret_token = "generate-a-secure-random-token-here"
```

**Deploy:**

```bash
cd infrastructure/terraform

# Initialize
terraform init

# Plan
terraform plan

# Apply
terraform apply

# Save outputs
terraform output -json > outputs.json
```

---

## Phase 3: Application Changes

### 3.1 Environment Variables

**File:** `apps/api/.env`

Add:
```env
# Lambda Authentication
LAMBDA_SECRET_TOKEN=same-token-as-terraform-tfvars

# AWS IoT (from terraform outputs)
AWS_IOT_ENDPOINT=xxxxx.iot.us-west-2.amazonaws.com
AWS_IOT_POLICY_NAME=rooted-machine-policy-prod
```

### 3.2 Database Migration

**File:** `apps/api/prisma/migrations/YYYYMMDDHHMMSS_add_machine_connection_events/migration.sql`

```sql
-- Add columns to machines table
ALTER TABLE machines 
  ADD COLUMN IF NOT EXISTS status VARCHAR DEFAULT 'offline',
  ADD COLUMN IF NOT EXISTS last_seen_at TIMESTAMP,
  ADD COLUMN IF NOT EXISTS current_wifi_ssid VARCHAR;

-- Create machine_connection_events table
CREATE TABLE IF NOT EXISTS machine_connection_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  machine_id UUID NOT NULL REFERENCES machines(id) ON DELETE CASCADE,
  event_type VARCHAR NOT NULL, -- 'connected' | 'disconnected'
  timestamp TIMESTAMP NOT NULL,
  wifi_ssid VARCHAR,
  session_id VARCHAR,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_machine_connection_events_machine_id ON machine_connection_events(machine_id);
CREATE INDEX idx_machine_connection_events_timestamp ON machine_connection_events(timestamp DESC);
CREATE INDEX idx_machine_connection_events_type ON machine_connection_events(event_type);
```

Run migration:
```bash
cd apps/api
pnpm prisma migrate dev --name add_machine_connection_events
pnpm prisma generate
```

### 3.3 Update Prisma Schema

**File:** `apps/api/prisma/schema.prisma`

Add:
```prisma
model machines {
  // ... existing fields
  status            String?   @default("offline")
  last_seen_at      DateTime?
  current_wifi_ssid String?
  
  connection_events machine_connection_events[]
}

model machine_connection_events {
  id         String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  machine_id String   @db.Uuid
  event_type String   @db.VarChar
  timestamp  DateTime @db.Timestamp(6)
  wifi_ssid  String?  @db.VarChar
  session_id String?  @db.VarChar
  created_at DateTime @default(now()) @db.Timestamp(6)
  
  machine machines @relation(fields: [machine_id], references: [id], onDelete: Cascade)
  
  @@index([machine_id])
  @@index([timestamp(sort: Desc)])
  @@index([event_type])
}
```

---

## Phase 4: Capacity Planning & Scaling

### 4.1 VM Capacity Estimates

**PostgreSQL Storage:**
- Base database: ~100 MB
- Per machine: ~1 KB
- Per connection event: ~200 bytes
- 50 machines × 2 events/day × 365 days = 7.3 MB/year

**Estimated capacity on 100GB SSD:**
- **Machines:** 100,000+ machines
- **Events:** 500 million events (50+ years at current rate)
- **Realistic limit:** 10-20 GB for database, rest for logs/backups

**PostgreSQL Connections:**
- Max connections: 100 (configured)
- API uses connection pooling: ~10 connections
- Remaining: 90 for admin/monitoring

**API Throughput (4 vCPU, 8GB RAM):**
- Simple queries: 1,000-2,000 req/sec
- Complex queries: 100-500 req/sec
- Lambda lifecycle updates: 10-50 req/sec (plenty of headroom)

**Redis Memory (if used for caching):**
- 1 GB allocated
- Can cache ~100,000 machine status records

### 4.2 When to Migrate to RDS

**Migrate when you hit ANY of these:**

1. **Scale Triggers:**
   - 100+ machines with frequent reconnects (>10/hour each)
   - 1,000+ API requests per minute sustained
   - Database size > 20 GB
   - Need multi-region deployment

2. **Operational Triggers:**
   - Need automated backups with point-in-time recovery
   - Need read replicas for analytics
   - Team size > 3 developers (need staging/dev environments)
   - Compliance requirements (SOC2, HIPAA)

3. **Performance Triggers:**
   - Query latency > 100ms for simple queries
   - Connection pool exhaustion
   - CPU usage > 70% sustained
   - Disk I/O bottlenecks

**Migration Cost:**
- RDS db.t3.medium (2 vCPU, 4GB): ~$60/month
- RDS db.t3.large (2 vCPU, 8GB): ~$120/month
- Multi-AZ (high availability): 2x cost

### 4.3 Load Testing Recommendations

**Test scenarios:**

```bash
# Install k6 for load testing
brew install k6  # macOS
# or
sudo apt install k6  # Ubuntu

# Test script: test-api-load.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '2m', target: 10 },   // Ramp up to 10 users
    { duration: '5m', target: 10 },   // Stay at 10 users
    { duration: '2m', target: 50 },   // Ramp up to 50 users
    { duration: '5m', target: 50 },   // Stay at 50 users
    { duration: '2m', target: 0 },    // Ramp down
  ],
};

export default function () {
  let res = http.get('https://api.yourdomain.com/api/machines/list');
  check(res, { 'status is 200': (r) => r.status === 200 });
  sleep(1);
}

# Run test
k6 run test-api-load.js
```

**Baseline metrics to establish:**
- P95 latency for machine list endpoint
- Throughput (requests/sec)
- Error rate at different load levels
- Database connection pool usage

### 4.4 Monitoring Thresholds

**Set up alerts for:**

| Metric | Warning | Critical |
|--------|---------|----------|
| CPU Usage | 60% | 80% |
| Memory Usage | 70% | 85% |
| Disk Usage | 70% | 85% |
| PostgreSQL Connections | 70/100 | 90/100 |
| API Response Time (P95) | 500ms | 1000ms |
| Error Rate | 1% | 5% |
| Lambda Errors | 5/hour | 20/hour |
| DLQ Depth | 1 message | 10 messages |

**Monitoring setup:**

```bash
# Install node_exporter for Prometheus metrics
wget https://github.com/prometheus/node_exporter/releases/download/v1.6.1/node_exporter-1.6.1.linux-amd64.tar.gz
tar xvfz node_exporter-1.6.1.linux-amd64.tar.gz
sudo cp node_exporter-1.6.1.linux-amd64/node_exporter /usr/local/bin/
sudo useradd -rs /bin/false node_exporter

# Create systemd service
sudo tee /etc/systemd/system/node_exporter.service > /dev/null <<EOF
[Unit]
Description=Node Exporter
After=network.target

[Service]
User=node_exporter
Group=node_exporter
Type=simple
ExecStart=/usr/local/bin/node_exporter

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable node_exporter
sudo systemctl start node_exporter
```

---

## Phase 5: Backup & Disaster Recovery

### 5.1 PostgreSQL Backups

**Automated daily backups:**

```bash
# Create backup script
sudo tee /usr/local/bin/backup-postgres.sh > /dev/null <<'EOF'
#!/bin/bash
BACKUP_DIR="/var/backups/postgresql"
DATE=$(date +%Y%m%d_%H%M%S)
FILENAME="rooted_planner_${DATE}.sql.gz"

mkdir -p $BACKUP_DIR

# Dump database
sudo -u postgres pg_dump rooted_planner | gzip > "${BACKUP_DIR}/${FILENAME}"

# Keep only last 7 days
find $BACKUP_DIR -name "*.sql.gz" -mtime +7 -delete

echo "Backup completed: ${FILENAME}"
EOF

sudo chmod +x /usr/local/bin/backup-postgres.sh

# Add to crontab (daily at 2 AM)
sudo crontab -e
# Add line:
0 2 * * * /usr/local/bin/backup-postgres.sh >> /var/log/postgres-backup.log 2>&1
```

**Optional: Upload to S3:**

```bash
# Install AWS CLI
sudo apt install awscli

# Configure AWS credentials
aws configure

# Update backup script to upload to S3
# Add after pg_dump line:
aws s3 cp "${BACKUP_DIR}/${FILENAME}" "s3://your-backup-bucket/postgres/${FILENAME}"
```

### 5.2 Restore Procedure

```bash
# Restore from backup
gunzip -c /var/backups/postgresql/rooted_planner_YYYYMMDD_HHMMSS.sql.gz | sudo -u postgres psql rooted_planner

# Or from S3
aws s3 cp s3://your-backup-bucket/postgres/rooted_planner_YYYYMMDD_HHMMSS.sql.gz - | gunzip | sudo -u postgres psql rooted_planner
```

---

## Phase 6: Security Hardening

### 6.1 Firewall Configuration

```bash
# Install UFW
sudo apt install ufw

# Default policies
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Allow SSH
sudo ufw allow 22/tcp

# Allow HTTP/HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Allow PostgreSQL only from localhost
sudo ufw allow from 127.0.0.1 to any port 5432

# Enable firewall
sudo ufw enable
sudo ufw status
```

### 6.2 Fail2Ban for Brute Force Protection

```bash
# Install fail2ban
sudo apt install fail2ban

# Configure
sudo tee /etc/fail2ban/jail.local > /dev/null <<EOF
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5

[sshd]
enabled = true

[nginx-http-auth]
enabled = true
EOF

sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

### 6.3 Automatic Security Updates

```bash
# Install unattended-upgrades
sudo apt install unattended-upgrades

# Enable
sudo dpkg-reconfigure -plow unattended-upgrades
```

---

## Summary

### What You Have Now
- Single VM running all services
- PostgreSQL on same VM
- Nginx reverse proxy with SSL
- Systemd service management
- Automated backups

### Capacity
- **Machines:** 50-100 comfortably
- **Events:** Millions (years of data)
- **API Load:** 1,000+ req/min
- **Storage:** 100 GB (plenty of headroom)

### When to Scale
- Migrate to RDS when you hit 100+ machines or need HA
- Add load balancer when you need multiple API servers
- Consider managed services when team grows

### Costs
- **Current (VM only):** $30-60/month
- **With RDS:** $90-180/month
- **Full AWS (RDS + ALB + Multi-AZ):** $300+/month

### Next Steps
1. Deploy VM with this configuration
2. Set up Terraform and deploy AWS resources
3. Implement IoT connectivity (see IOT_CONNECTIVITY.md)
4. Set up monitoring and alerts
5. Test with load testing tools
