#!/bin/bash
# Deploy to Raspberry Pi with AWS IoT support
# Assumes certificates are already provisioned via provision-iot-device.sh

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
echo -e "${BLUE}  Rooted Robotics - Deploy with AWS IoT        ${NC}"
echo -e "${BLUE}================================================${NC}"
echo ""
echo -e "${YELLOW}Prerequisites:${NC}"
echo "  1. Run provision-iot-device.sh first to create certificates"
echo "  2. Certificates should be in /opt/rooted-ble/certs/ on Pi"
echo ""

# Get Pi connection info
read -p "Enter the Raspberry Pi IP (default: ${DEFAULT_HOSTNAME}): " PI_HOST
PI_HOST=${PI_HOST:-$DEFAULT_HOSTNAME}

read -p "Enter the Raspberry Pi username (default: ${DEFAULT_USERNAME}): " PI_USER
PI_USER=${PI_USER:-$DEFAULT_USERNAME}

read -s -p "Enter the SSH password for ${PI_USER}@${PI_HOST}: " SSH_PASSWORD
echo ""

# Check if sshpass is installed
if ! command -v sshpass &> /dev/null; then
    echo -e "${RED}Error: sshpass is not installed${NC}"
    echo "Install with: brew install hudochenkov/sshpass/sshpass"
    exit 1
fi

echo ""
echo -e "${GREEN}[1/5] Copying Python files to Pi...${NC}"

sshpass -p "$SSH_PASSWORD" scp \
  "$SCRIPT_DIR/provisioner.py" \
  "$SCRIPT_DIR/requirements.txt" \
  "${PI_USER}@${PI_HOST}:/opt/rooted-ble/"

# Copy aws/ directory
sshpass -p "$SSH_PASSWORD" ssh "${PI_USER}@${PI_HOST}" "mkdir -p /opt/rooted-ble/aws"
sshpass -p "$SSH_PASSWORD" scp \
  "$SCRIPT_DIR/aws/"*.py \
  "${PI_USER}@${PI_HOST}:/opt/rooted-ble/aws/"

# Copy telemetry ingest to the path rooted-ingest.service's ExecStart expects
sshpass -p "$SSH_PASSWORD" ssh "${PI_USER}@${PI_HOST}" "mkdir -p /home/rooted/te-cli"
sshpass -p "$SSH_PASSWORD" scp \
  "$SCRIPT_DIR/aws/telemetry_ingest.py" \
  "${PI_USER}@${PI_HOST}:/home/rooted/te-cli/"

echo -e "${GREEN}[2/5] Copying systemd service files...${NC}"

sshpass -p "$SSH_PASSWORD" scp \
  "$SCRIPT_DIR/rooted-ble.service" \
  "$SCRIPT_DIR/rooted-iot.service" \
  "$SCRIPT_DIR/rooted-telemetry.service" \
  "$SCRIPT_DIR/rooted-ingest.service" \
  "${PI_USER}@${PI_HOST}:/tmp/"

echo -e "${GREEN}[3/5] Copying Vector config...${NC}"

sshpass -p "$SSH_PASSWORD" ssh "${PI_USER}@${PI_HOST}" "mkdir -p /opt/rooted-ble/vector"
sshpass -p "$SSH_PASSWORD" scp \
  "$SCRIPT_DIR/vector/rooted-telemetry.toml" \
  "$SCRIPT_DIR/vector/rooted-vector.service" \
  "${PI_USER}@${PI_HOST}:/opt/rooted-ble/vector/"

echo -e "${GREEN}[4/5] Installing services on Pi...${NC}"

# Read device_id and IoT endpoint from Pi's existing config
DEVICE_ID=$(sshpass -p "$SSH_PASSWORD" ssh "${PI_USER}@${PI_HOST}" \
  "python3 -c \"import json; c=json.load(open('/opt/rooted-ble/device_config.json')); print(c['device_id'])\"")
IOT_ENDPOINT=$(sshpass -p "$SSH_PASSWORD" ssh "${PI_USER}@${PI_HOST}" \
  "python3 -c \"import json; c=json.load(open('/opt/rooted-ble/device_config.json')); print(c.get('aws_iot_endpoint',''))\"")

echo "  Device ID:    ${DEVICE_ID}"
echo "  IoT Endpoint: ${IOT_ENDPOINT}"

sshpass -p "$SSH_PASSWORD" ssh "${PI_USER}@${PI_HOST}" << ENDSSH
# Install Python dependencies
cd /opt/rooted-ble
source .venv/bin/activate
pip3 install -q awsiotsdk

# Fix preset file permissions (prevent root-owned lock files)
sudo mkdir -p /home/rooted/te-cli
sudo chown -R rooted:rooted /home/rooted/te-cli
rm -f /home/rooted/te-cli/TE_Variable_Values.json.lock

# Move service files and set up systemd
echo "Setting up systemd services..."
sudo mv /tmp/rooted-ble.service /etc/systemd/system/
sudo mv /tmp/rooted-iot.service /etc/systemd/system/
sudo mv /tmp/rooted-telemetry.service /etc/systemd/system/
sudo mv /tmp/rooted-ingest.service /etc/systemd/system/

# Install Vector if not already installed
if ! command -v vector &> /dev/null; then
    echo "Installing Vector..."
    curl --proto '=https' --tlsv1.2 -sSfL https://sh.vector.dev | bash -s -- -y
fi

# Write Vector environment file with device ID and IoT endpoint
sudo tee /etc/default/vector > /dev/null << VECTORENV
ROOTED_DEVICE_ID=${DEVICE_ID}
AWS_IOT_ENDPOINT=${IOT_ENDPOINT}
VECTORENV

# Install Vector service
sudo cp /opt/rooted-ble/vector/rooted-vector.service /etc/systemd/system/

# Reload systemd
sudo systemctl daemon-reload

# Enable services to start on boot
sudo systemctl enable rooted-ble.service
sudo systemctl enable rooted-iot.service
sudo systemctl enable rooted-telemetry.service
sudo systemctl enable rooted-ingest.service
sudo systemctl enable rooted-vector.service

# Restart services
sudo systemctl restart rooted-ble.service
sudo systemctl restart rooted-iot.service
sudo systemctl restart rooted-telemetry.service
sudo systemctl restart rooted-ingest.service
sudo systemctl restart rooted-vector.service

echo "Services installed and started"
ENDSSH

echo -e "${GREEN}[5/5] Verifying services...${NC}"

sshpass -p "$SSH_PASSWORD" ssh "${PI_USER}@${PI_HOST}" << 'ENDSSH'
echo ""
echo "=== Service Status ==="
echo ""
echo "rooted-ble (BLE Provisioner):"
sudo systemctl is-active rooted-ble.service || true
echo ""
echo "rooted-iot (AWS IoT Connection):"
sudo systemctl is-active rooted-iot.service || true
echo ""
echo "rooted-telemetry (Telemetry Uplink):"
sudo systemctl is-active rooted-telemetry.service || true
echo ""
echo "rooted-ingest (UDP Telemetry Ingest):"
sudo systemctl is-active rooted-ingest.service || true
echo ""
echo "rooted-vector (Vector Telemetry Pipeline):"
sudo systemctl is-active rooted-vector.service || true
ENDSSH

echo ""
echo -e "${GREEN}================================================${NC}"
echo -e "${GREEN}  Deployment complete!                         ${NC}"
echo -e "${GREEN}================================================${NC}"
echo ""
echo "Services running:"
echo "  - rooted-ble.service       : BLE provisioning (WiFi setup)"
echo "  - rooted-iot.service       : AWS IoT connection (stays online)"
echo "  - rooted-telemetry.service : Telemetry uplink (legacy, parked)"
echo "  - rooted-ingest.service    : UDP telemetry ingest (ClearCore → JSONL)"
echo "  - rooted-vector.service    : Vector telemetry pipeline (tails JSONL → MQTT)"
echo ""
echo "Useful commands:"
echo "  ssh ${PI_USER}@${PI_HOST}"
echo "  sudo systemctl status rooted-ble"
echo "  sudo systemctl status rooted-iot"
echo "  sudo journalctl -u rooted-iot -f"
echo ""
