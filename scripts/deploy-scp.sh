#!/bin/bash
set -e

# Configuration
EC2_IP=$(cd infra/terraform && terraform output -raw ec2_public_ip)
SSH_KEY="$HOME/.ssh/rooted-prod-key.pem"
EC2_USER="ubuntu"
APP_DIR="/var/www/rooted"

echo "🚀 Deploying to $EC2_IP..."

# Build locally
echo "📦 Building frontend..."
pnpm build

echo "📦 Building API..."
cd apps/api
pnpm build
cd ../..

# Create deployment package
echo "📦 Creating deployment package..."
mkdir -p .deploy
rsync -av --exclude='node_modules' --exclude='.git' --exclude='.deploy' \
  dist/ .deploy/dist/
rsync -av --exclude='node_modules' \
  apps/api/dist/ .deploy/api-dist/
rsync -av --exclude='node_modules' \
  apps/api/prisma/ .deploy/prisma/
cp apps/api/package.json .deploy/api-package.json

# SCP to EC2
echo "📤 Uploading to EC2..."
ssh -i "$SSH_KEY" "$EC2_USER@$EC2_IP" "sudo mkdir -p $APP_DIR && sudo chown ubuntu:ubuntu $APP_DIR"

rsync -avz --delete -e "ssh -i $SSH_KEY" \
  .deploy/dist/ "$EC2_USER@$EC2_IP:$APP_DIR/dist/"

rsync -avz --delete -e "ssh -i $SSH_KEY" \
  .deploy/api-dist/ "$EC2_USER@$EC2_IP:$APP_DIR/apps/api/dist/"

rsync -avz -e "ssh -i $SSH_KEY" \
  .deploy/prisma/ "$EC2_USER@$EC2_IP:$APP_DIR/apps/api/prisma/"

scp -i "$SSH_KEY" .deploy/api-package.json "$EC2_USER@$EC2_IP:$APP_DIR/apps/api/package.json"

# Cleanup
rm -rf .deploy

echo "✅ Deployment package uploaded!"
echo ""
echo "Next steps:"
echo "1. SSH into EC2: ssh -i $SSH_KEY $EC2_USER@$EC2_IP"
echo "2. Run setup script on EC2"
