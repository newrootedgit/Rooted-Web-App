#!/bin/bash
# Deploy to Raspberry Pi with AWS IoT support
# Run this AFTER deploy-to-pi-two.sh

set -e

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEFAULT_HOSTNAME="192.168.10.1"
DEFAULT_USERNAME="rooted"

echo -e "${BLUE}================================================${NC}"
echo -e "${BLUE}  Rooted Robotics - AWS IoT Setup (Optional)  ${NC}"
echo -e "${BLUE}================================================${NC}"
echo ""
echo "This script adds AWS IoT connectivity to your Pi."
echo -e "${YELLOW}Run this AFTER deploy-to-pi-two.sh completes.${NC}"
echo ""

# Get Pi connection info
read -p "Enter the Raspberry Pi IP (default: ${DEFAULT_HOSTNAME}): " PI_HOST
PI_HOST=${PI_HOST:-$DEFAULT_HOSTNAME}

read -p "Enter the Raspberry Pi username (default: ${DEFAULT_USERNAME}): " PI_USER
PI_USER=${PI_USER:-$DEFAULT_USERNAME}

read -s -p "Enter the SSH password for ${PI_USER}@${PI_HOST}: " SSH_PASSWORD
echo ""

# AWS credentials
echo ""
echo -e "${YELLOW}Enter AWS IoT credentials:${NC}"
read -p "AWS Access Key ID: " AWS_ACCESS_KEY_ID
read -s -p "AWS Secret Access Key: " AWS_SECRET_ACCESS_KEY
echo ""

# AWS IoT config
AWS_REGION="us-west-2"
AWS_IOT_ENDPOINT="a2jotz5yvt34r4-ats.iot.us-west-2.amazonaws.com"
AWS_IOT_POLICY_NAME="rooted-machine-policy-prod"

echo ""
echo -e "${GREEN}Deploying AWS IoT files to Pi...${NC}"

# Copy files
sshpass -p "$SSH_PASSWORD" scp \
  "$SCRIPT_DIR/aws_iot_registration.py" \
  "$SCRIPT_DIR/setup-aws-iot.sh" \
  "${PI_USER}@${PI_HOST}:/opt/rooted-ble/"

# Update requirements.txt
sshpass -p "$SSH_PASSWORD" scp \
  "$SCRIPT_DIR/requirements.txt" \
  "${PI_USER}@${PI_HOST}:/opt/rooted-ble/"

# Update provisioner.py
sshpass -p "$SSH_PASSWORD" scp \
  "$SCRIPT_DIR/provisioner.py" \
  "${PI_USER}@${PI_HOST}:/opt/rooted-ble/"

echo -e "${GREEN}Installing AWS IoT dependencies...${NC}"

sshpass -p "$SSH_PASSWORD" ssh "${PI_USER}@${PI_HOST}" << 'ENDSSH'
cd /opt/rooted-ble

# Run setup script
chmod +x setup-aws-iot.sh
./setup-aws-iot.sh

# Install Python dependencies
source .venv/bin/activate
pip3 install awsiotsdk boto3
ENDSSH

echo -e "${GREEN}Updating systemd service...${NC}"

# Create service file content with variables expanded
SERVICE_CONTENT="[Unit]
Description=Rooted BLE Provisioning Service
After=bluetooth.target network.target

[Service]
Type=simple
User=rooted
WorkingDirectory=/opt/rooted-ble
Environment=\"AWS_REGION=${AWS_REGION}\"
Environment=\"AWS_IOT_ENDPOINT=${AWS_IOT_ENDPOINT}\"
Environment=\"AWS_IOT_POLICY_NAME=${AWS_IOT_POLICY_NAME}\"
Environment=\"AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}\"
Environment=\"AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}\"
ExecStart=/opt/rooted-ble/.venv/bin/python3 /opt/rooted-ble/provisioner.py
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target"

# Write service file to Pi
echo '$SSH_PASSWORD' | sudo -S chmod 644 /opt/rooted-ble/certs/private.pem.key
sshpass -p "$SSH_PASSWORD" ssh "${PI_USER}@${PI_HOST}" bash << ENDSSH
echo '$SSH_PASSWORD' | sudo -S bash -c "cat > /etc/systemd/system/rooted-ble.service" << 'EOF'
$SERVICE_CONTENT
EOF

echo '$SSH_PASSWORD' | sudo -S systemctl daemon-reload
echo '$SSH_PASSWORD' | sudo -S systemctl restart rooted-ble
ENDSSH

echo ""
echo -e "${GREEN}✓ AWS IoT setup complete!${NC}"
echo ""
echo "Next steps:"
echo "  1. Provision WiFi on the Pi via BLE"
echo "  2. Pi will auto-register with AWS IoT"
echo "  3. Check dashboard for online status"
echo ""
echo "To check status:"
echo "  ssh ${PI_USER}@${PI_HOST}"
echo "  sudo systemctl status rooted-ble"
echo "  sudo journalctl -u rooted-ble -f"

