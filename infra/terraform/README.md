# Terraform Infrastructure

This directory contains Terraform configuration for deploying Rooted infrastructure to AWS.

## Resources Created

- **AWS IoT Core**: Device connectivity and lifecycle events
- **Lambda Function**: Machine lifecycle event handler
- **RDS PostgreSQL**: Production database (db.t3.micro)
- **Security Groups**: EC2 and RDS network isolation
- **VPC/Subnets**: Uses default VPC for simplicity

## Prerequisites

1. AWS CLI configured with credentials
2. Terraform >= 1.0 installed
3. Generate secure passwords for:
   - `db_password` (RDS master password)
   - `lambda_secret_token` (Lambda → API authentication)

## Usage

### Initialize Terraform

```bash
cd infra/terraform
terraform init
```

### Plan Deployment

```bash
terraform plan \
  -var="api_endpoint=https://app.rootedrobotics.com" \
  -var="lambda_secret_token=YOUR_SECURE_TOKEN" \
  -var="db_password=YOUR_SECURE_PASSWORD"
```

### Apply Infrastructure

```bash
terraform apply \
  -var="api_endpoint=https://app.rootedrobotics.com" \
  -var="lambda_secret_token=YOUR_SECURE_TOKEN" \
  -var="db_password=YOUR_SECURE_PASSWORD"
```

### Get Outputs

```bash
# RDS endpoint for DATABASE_URL
terraform output rds_endpoint

# EC2 security group ID (for manual EC2 setup)
terraform output ec2_security_group_id

# IoT endpoint for device configuration
terraform output iot_endpoint
```

## Important Notes

- **Store passwords securely**: Use a password manager, NOT in files or git
- **RDS deletion protection**: Enabled by default to prevent accidental deletion
- **Backup retention**: 7 days of automated backups
- **Storage**: Auto-scaling from 20GB to 100GB
- **Encryption**: Storage encryption enabled

## Environment Variables Needed

After deployment, use these outputs in your `.env.production`:

```bash
# From terraform output rds_endpoint
DATABASE_URL=postgresql://rooted:YOUR_PASSWORD@ENDPOINT:5432/rooted_planner

# Same token used in terraform apply
LAMBDA_SECRET_TOKEN=YOUR_SECURE_TOKEN

# From terraform output iot_endpoint
AWS_IOT_ENDPOINT=ENDPOINT.iot.us-west-2.amazonaws.com
```

## Cost Estimate

- RDS db.t3.micro: ~$15/month
- Lambda: ~$0 (free tier)
- Data transfer: ~$5/month
- **Total: ~$20/month**

## Cleanup

To destroy all resources:

```bash
# Disable deletion protection first
terraform apply -var="..." -var deletion_protection=false

# Then destroy
terraform destroy -var="..." 
```
