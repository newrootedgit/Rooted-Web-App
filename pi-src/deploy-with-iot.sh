#!/bin/bash
# Deploy to Raspberry Pi with AWS IoT support

PI_USER="rooted"
PI_HOST="$1"

if [ -z "$PI_HOST" ]; then
    echo "Usage: ./deploy-with-iot.sh <pi-hostname-or-ip>"
    exit 1
fi

echo "Deploying to $PI_USER@$PI_HOST..."

# Copy files
scp provisioner.py aws_iot_registration.py requirements.txt setup-aws-iot.sh "$PI_USER@$PI_HOST:/opt/rooted-ble/"

# Run setup on Pi
ssh "$PI_USER@$PI_HOST" << 'EOF'
cd /opt/rooted-ble
chmod +x setup-aws-iot.sh
./setup-aws-iot.sh

# Install Python dependencies
source .venv/bin/activate
pip3 install -r requirements.txt

# Update systemd service with AWS env vars
sudo tee /etc/systemd/system/rooted-ble.service > /dev/null << 'SERVICE'
[Unit]
Description=Rooted BLE Provisioning Service
After=bluetooth.target

[Service]
Type=simple
User=rooted
WorkingDirectory=/opt/rooted-ble
Environment="AWS_REGION=us-west-2"
Environment="AWS_IOT_ENDPOINT=a2jotz5yvt34r4-ats.iot.us-west-2.amazonaws.com"
Environment="AWS_IOT_POLICY_NAME=rooted-machine-policy-prod"
Environment="AWS_ACCESS_KEY_ID=YOUR_ACCESS_KEY"
Environment="AWS_SECRET_ACCESS_KEY=YOUR_SECRET_KEY"
ExecStart=/opt/rooted-ble/.venv/bin/python3 /opt/rooted-ble/provisioner.py
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
SERVICE

sudo systemctl daemon-reload
sudo systemctl restart rooted-ble
sudo systemctl status rooted-ble
EOF

echo "Deployment complete!"
echo ""
echo "IMPORTANT: Update AWS credentials in /etc/systemd/system/rooted-ble.service on the Pi"
echo "Then run: sudo systemctl daemon-reload && sudo systemctl restart rooted-ble"
