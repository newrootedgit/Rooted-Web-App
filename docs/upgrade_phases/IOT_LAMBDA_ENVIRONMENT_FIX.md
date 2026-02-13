# IoT Lambda Environment & Architecture Optimization

**Status**: Planning  
**Priority**: Medium  
**Timeline**: 2-3 weeks  
**Complexity**: Medium

## Problem Statement

### Current Issues
1. **Environment Configuration**: All Lambda functions hardcoded to prod environment via single `terraform.tfvars`
2. **Unnecessary Lambda**: `machine-config-response` Lambda adds latency/complexity for regular MQTT topic that API can subscribe to directly
3. **No Dev Environment**: Cannot test IoT infrastructure changes without affecting production

### Current Architecture
```
AWS IoT Core
├── Lifecycle Events ($aws/events/presence/+/+)
│   └── IoT Rule → machine-lifecycle Lambda → API /internal/machines/lifecycle-event
└── Config Responses (rooted/machines/+/pong)
    └── IoT Rule → machine-config-response Lambda → API /internal/machines/config-response
```

### Why Lambdas Exist
- **Lifecycle Lambda**: REQUIRED - System topics like `$aws/events/presence` can ONLY be consumed via IoT Rules, not MQTT
- **Config Lambda**: UNNECESSARY - Regular MQTT topic, API can subscribe directly

## Solution Overview

### Phase 1: Multi-Environment Terraform Setup
Enable dev/prod environments with proper isolation

### Phase 2: Remove Config Response Lambda
Eliminate unnecessary Lambda, subscribe to MQTT directly from API

### Phase 3: Update Deployment Workflow
Ensure GitHub Actions deploys to correct environment

---

## Phase 1: Multi-Environment Terraform Setup

### Goals
- Support dev and prod environments
- Separate state and resources per environment
- Environment-specific configuration

### Implementation

#### 1.1 Create Environment-Specific tfvars

**File: `infra/terraform/dev.tfvars`**
```hcl
aws_region          = "us-west-2"
project_name        = "rooted"
environment         = "dev"
api_endpoint        = "http://localhost:8000"
lambda_secret_token = "dev-secret-change-me"
ec2_key_name        = "rooted-dev-key"
```

**File: `infra/terraform/prod.tfvars`**
```hcl
aws_region          = "us-west-2"
project_name        = "rooted"
environment         = "prod"
api_endpoint        = "https://your-prod-domain.com"
lambda_secret_token = "<use-secrets-manager-or-github-secret>"
ec2_key_name        = "rooted-prod-key"
```

**Action**: Move current `terraform.tfvars` → `prod.tfvars`, create `dev.tfvars`

#### 1.2 Update Terraform Backend for Workspaces

**File: `infra/terraform/main.tf`**
```hcl
terraform {
  required_version = ">= 1.0"
  
  backend "s3" {
    bucket         = "rooted-terraform-state"
    key            = "terraform.tfstate"
    region         = "us-west-2"
    dynamodb_table = "rooted-terraform-locks"
    encrypt        = true
  }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
  
  default_tags {
    tags = {
      Project     = var.project_name
      Environment = var.environment
      ManagedBy   = "Terraform"
    }
  }
}
```

#### 1.3 Usage Commands

```bash
# Initialize
cd infra/terraform
terraform init

# Create workspaces
terraform workspace new dev
terraform workspace new prod

# Deploy to dev
terraform workspace select dev
terraform plan -var-file="dev.tfvars"
terraform apply -var-file="dev.tfvars"

# Deploy to prod
terraform workspace select prod
terraform plan -var-file="prod.tfvars"
terraform apply -var-file="prod.tfvars"
```

#### 1.4 Update .gitignore

```gitignore
# Terraform
infra/terraform/.terraform/
infra/terraform/.terraform.lock.hcl
infra/terraform/terraform.tfstate
infra/terraform/terraform.tfstate.backup
infra/terraform/*.tfvars
!infra/terraform/dev.tfvars.example
!infra/terraform/prod.tfvars.example
```

**Action**: Create `.tfvars.example` files, ignore actual tfvars with secrets

### Testing Phase 1
- [ ] Create dev workspace and deploy
- [ ] Verify dev resources created with `-dev` suffix
- [ ] Test lifecycle Lambda calls localhost:8000
- [ ] Verify prod resources unchanged
- [ ] Document workspace switching in README

---

## Phase 2: Remove Config Response Lambda

### Goals
- Eliminate `machine-config-response` Lambda
- Subscribe to `rooted/machines/+/pong` directly from API
- Reduce latency and infrastructure complexity

### Implementation

#### 2.1 Add AWS IoT MQTT Client to API

**File: `apps/api/src/lib/iot/mqtt-client.ts`**
```typescript
import { mqtt, iot } from 'aws-iot-device-sdk-v2';
import { handleConfigResponse } from '../../domains/machine-domain/mqtt/handleConfigResponse.js';

let connection: mqtt.MqttClientConnection | null = null;

export async function initIoTMqttClient() {
  if (connection) return connection;

  const config = iot.AwsIotMqttConnectionConfigBuilder.new_mtls_builder_from_path(
    process.env.IOT_CERT_PATH!,
    process.env.IOT_KEY_PATH!
  )
    .with_certificate_authority_from_path(process.env.IOT_CA_PATH!)
    .with_client_id(`rooted-api-${process.env.ENVIRONMENT}`)
    .with_endpoint(process.env.IOT_ENDPOINT!)
    .build();

  const client = new mqtt.MqttClient();
  connection = client.new_connection(config);

  connection.on('connect', () => {
    console.log('Connected to AWS IoT Core');
  });

  connection.on('error', (error) => {
    console.error('IoT connection error:', error);
  });

  await connection.connect();

  // Subscribe to config responses
  await connection.subscribe(
    'rooted/machines/+/pong',
    mqtt.QoS.AtLeastOnce,
    async (topic, payload) => {
      try {
        const message = JSON.parse(new TextDecoder().decode(payload));
        await handleConfigResponse(message);
      } catch (error) {
        console.error('Error handling config response:', error);
      }
    }
  );

  return connection;
}

export async function disconnectIoTMqtt() {
  if (connection) {
    await connection.disconnect();
    connection = null;
  }
}
```

#### 2.2 Initialize MQTT Client on API Startup

**File: `apps/api/src/index.ts`**
```typescript
import { initIoTMqttClient, disconnectIoTMqtt } from './lib/iot/mqtt-client.js';

// After fastify.listen()
await initIoTMqttClient();

// On shutdown
fastify.addHook('onClose', async () => {
  await disconnectIoTMqtt();
});
```

#### 2.3 Add Environment Variables

**File: `apps/api/.env.example`**
```env
# AWS IoT Core
IOT_ENDPOINT=your-iot-endpoint.iot.us-west-2.amazonaws.com
IOT_CERT_PATH=/path/to/cert.pem
IOT_KEY_PATH=/path/to/private.key
IOT_CA_PATH=/path/to/AmazonRootCA1.pem
```

#### 2.4 Remove Config Lambda from Terraform

**File: `infra/terraform/lambda.tf`**
```hcl
# Remove entire machine_config_response Lambda resource
# Remove machine_config_response CloudWatch log group
# Keep only machine_lifecycle Lambda
```

**File: `infra/terraform/iot.tf`**
```hcl
# Remove aws_iot_topic_rule.machine_config_response
# Keep only aws_iot_topic_rule.machine_lifecycle
```

#### 2.5 Remove Internal Route (Optional)

**File: `apps/api/src/domains/machine-domain/internal-routes.ts`**
```typescript
// Remove /internal/machines/config-response endpoint
// No longer needed since API handles directly
```

#### 2.6 Install Dependencies

```bash
cd apps/api
pnpm add aws-iot-device-sdk-v2
```

### Testing Phase 2
- [ ] API connects to IoT Core on startup
- [ ] API receives messages on `rooted/machines/+/pong`
- [ ] Config responses processed correctly
- [ ] No errors in CloudWatch logs
- [ ] Verify Lambda no longer invoked
- [ ] Test in dev environment first

---

## Phase 3: Update Deployment Workflow

### Goals
- Deploy correct environment from GitHub Actions
- Support manual environment selection
- Maintain prod safety

### Implementation

#### 3.1 Update GitHub Actions Workflow

**File: `.github/workflows/deploy.yml`**
```yaml
name: Deploy

on:
  workflow_dispatch:
    inputs:
      environment:
        description: 'Environment to deploy'
        required: true
        type: choice
        options:
          - dev
          - prod
        default: prod

jobs:
  deploy:
    name: Deploy to ${{ github.event.inputs.environment }}
    runs-on: ubuntu-latest
    environment: ${{ github.event.inputs.environment }}

    steps:
      # ... existing build steps ...

      - name: Deploy to EC2
        env:
          ENVIRONMENT: ${{ github.event.inputs.environment }}
          EC2_HOST: ${{ secrets.EC2_HOST }}
          EC2_USER: ${{ secrets.EC2_USER }}
        run: |
          # Deploy based on environment
          # ... existing deployment logic ...
```

#### 3.2 Add Terraform Deployment Step (Optional)

If you want to deploy infrastructure from GitHub Actions:

```yaml
      - name: Deploy Infrastructure
        if: github.event.inputs.deploy_infra == 'true'
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          ENVIRONMENT: ${{ github.event.inputs.environment }}
        run: |
          cd infra/terraform
          terraform init
          terraform workspace select $ENVIRONMENT
          terraform apply -var-file="${ENVIRONMENT}.tfvars" -auto-approve
```

### Testing Phase 3
- [ ] Trigger workflow with dev environment
- [ ] Verify deploys to dev EC2
- [ ] Trigger workflow with prod environment
- [ ] Verify deploys to prod EC2
- [ ] Test rollback procedure

---

## Migration Plan

### Pre-Migration Checklist
- [ ] Backup current Terraform state
- [ ] Document current prod configuration
- [ ] Create dev AWS resources (EC2, RDS if needed)
- [ ] Test MQTT client locally
- [ ] Review all environment variables

### Migration Steps

#### Step 1: Setup Dev Environment (Week 1)
1. Create `dev.tfvars` and `prod.tfvars`
2. Initialize Terraform workspaces
3. Deploy dev infrastructure
4. Test dev Lambda with localhost:8000
5. Verify dev resources isolated from prod

#### Step 2: Add MQTT Client (Week 2)
1. Install `aws-iot-device-sdk-v2` in API
2. Create IoT certificates for API client
3. Implement `mqtt-client.ts`
4. Test in dev environment
5. Monitor for 48 hours

#### Step 3: Remove Config Lambda (Week 2-3)
1. Deploy MQTT client to prod
2. Monitor both Lambda and MQTT client in parallel
3. Verify no messages lost
4. Remove Lambda from Terraform
5. Apply Terraform changes
6. Clean up Lambda code and IoT Rule

#### Step 4: Update Workflows (Week 3)
1. Update GitHub Actions with environment selection
2. Test dev deployment
3. Test prod deployment
4. Document new deployment process

### Rollback Plan
- Keep Lambda code in git history
- Terraform state backups before each apply
- Can redeploy Lambda within 15 minutes if needed
- MQTT client can be disabled via feature flag

---

## Environment Variables Summary

### API Environment Variables

**Dev (`apps/api/.env.development`)**
```env
DATABASE_URL=postgresql://rooted:dev_password@localhost:5433/rooted_dev
REDIS_URL=redis://localhost:6379
LAMBDA_SECRET_TOKEN=dev-secret-change-me
IOT_ENDPOINT=your-iot-endpoint.iot.us-west-2.amazonaws.com
IOT_CERT_PATH=/path/to/dev-cert.pem
IOT_KEY_PATH=/path/to/dev-private.key
IOT_CA_PATH=/path/to/AmazonRootCA1.pem
ENVIRONMENT=dev
PORT=8000
```

**Prod (`apps/api/.env.production` on EC2)**
```env
DATABASE_URL=postgresql://rooted:prod_password@prod-rds:5432/rooted_prod
REDIS_URL=redis://prod-redis:6379
LAMBDA_SECRET_TOKEN=<from-secrets-manager>
IOT_ENDPOINT=your-iot-endpoint.iot.us-west-2.amazonaws.com
IOT_CERT_PATH=/etc/rooted/certs/prod-cert.pem
IOT_KEY_PATH=/etc/rooted/certs/prod-private.key
IOT_CA_PATH=/etc/rooted/certs/AmazonRootCA1.pem
ENVIRONMENT=prod
PORT=8000
```

---

## Success Metrics

### Phase 1 Success
- ✅ Dev and prod workspaces exist
- ✅ Resources tagged with correct environment
- ✅ Dev Lambda calls localhost:8000
- ✅ Prod Lambda unchanged
- ✅ No cross-environment interference

### Phase 2 Success
- ✅ API subscribes to MQTT successfully
- ✅ Config responses processed < 100ms latency
- ✅ Zero message loss
- ✅ Config Lambda removed from infrastructure
- ✅ CloudWatch costs reduced

### Phase 3 Success
- ✅ GitHub Actions deploys to correct environment
- ✅ Manual environment selection works
- ✅ Deployment time unchanged
- ✅ Zero production incidents

---

## Cost Impact

### Current Costs
- 2 Lambda functions × $0.20/million invocations
- 2 CloudWatch log groups × $0.50/GB
- IoT Rules: $0.15/million actions

### After Migration
- 1 Lambda function (50% reduction)
- 1 CloudWatch log group (50% reduction)
- 1 IoT Rule (50% reduction)
- MQTT connection: ~$0.08/month (negligible)

**Estimated Savings**: ~$5-10/month (minimal but cleaner architecture)

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| MQTT connection drops | High | Auto-reconnect logic, health checks |
| Message loss during migration | Medium | Run both systems in parallel for 48h |
| Dev Lambda can't reach localhost | Medium | Use ngrok or VPN for dev testing |
| Terraform state corruption | High | S3 backend with versioning, backups |
| Wrong environment deployment | High | Manual approval for prod, clear naming |

---

## Documentation Updates

After completion, update:
- [ ] `README.md` - Add environment setup instructions
- [ ] `docs/machine-iot/ARCH.md` - Update architecture diagram
- [ ] `infra/terraform/README.md` - Document workspace usage
- [ ] `.github/workflows/README.md` - Document deployment process

---

## Future Enhancements

### Phase 4 (Optional): Terraform Remote State
- Move to S3 backend with DynamoDB locking
- Enable state sharing across team
- Add state versioning and backups

### Phase 5 (Optional): Secrets Management
- Move secrets to AWS Secrets Manager
- Rotate Lambda secret tokens
- Automate certificate renewal

### Phase 6 (Optional): Monitoring & Alerts
- CloudWatch alarms for MQTT disconnects
- Lambda error rate alerts
- Cost anomaly detection
