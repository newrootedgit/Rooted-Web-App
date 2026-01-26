#!/bin/bash
# Deploy to Pi Two - Full setup over ethernet connection
# This script runs NetworkManager setup and configures the BLE provisioner

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default values - connects via ethernet!
DEFAULT_HOSTNAME="192.168.10.1"
DEFAULT_USERNAME="ubuntu"
REMOTE_DIR="/opt/rooted-ble"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Recommended machine names (these have images in the frontend app)
RECOMMENDED_MACHINES=("HARVESTER" "SEEDER" "WASHER")

echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}  Rooted Robotics - Pi Setup (Step 2 of 2)  ${NC}"
echo -e "${BLUE}============================================${NC}"
echo ""
echo "This script completes the Pi setup over ethernet."
echo "Make sure you've run deploy-to-pi-one.sh first!"
echo ""

# =============================================================================
# STEP 1: Collect Pi Credentials (Ethernet Connection)
# =============================================================================

read -p "Enter the Raspberry Pi IP (default: ${DEFAULT_HOSTNAME}): " PI_HOST
PI_HOST=${PI_HOST:-$DEFAULT_HOSTNAME}

# Test connectivity first
echo ""
echo "Testing connectivity to ${PI_HOST}..."
if ! ping -c 2 "$PI_HOST" > /dev/null 2>&1; then
    echo -e "${RED}Unable to reach ${PI_HOST}. Please check the ethernet connection.${NC}"
    echo ""
    echo "Make sure:"
    echo "  1. You ran deploy-to-pi-one.sh first"
    echo "  2. Your computer is connected to the Pi via ethernet"
    echo "  3. Your computer has IP 192.168.10.2 (or similar)"
    exit 1
fi
echo -e "${GREEN}Connection successful${NC}"

read -p "Enter the Raspberry Pi login username (default: ${DEFAULT_USERNAME}): " PI_USER
PI_USER=${PI_USER:-$DEFAULT_USERNAME}

# Get SSH password for sudo operations
read -s -p "Enter the SSH password for ${PI_USER}@${PI_HOST}: " SSH_PASSWORD
echo ""

# Verify SSH credentials work
echo ""
echo "Verifying SSH credentials..."
SSH_RESULT=$(sshpass -p "${SSH_PASSWORD}" ssh -o StrictHostKeyChecking=no -o ConnectTimeout=10 "${PI_USER}@${PI_HOST}" "echo 'SSH OK'" 2>&1)
if [ $? -ne 0 ]; then
    echo -e "${RED}SSH authentication failed.${NC}"
    echo "Error: ${SSH_RESULT}"
    echo ""
    echo "Troubleshooting:"
    echo "  - Check that sshpass is installed: brew install hudochenkov/sshpass/sshpass"
    echo "  - Verify you can SSH manually: ssh ${PI_USER}@${PI_HOST}"
    echo "  - If password has special characters, try escaping them"
    exit 1
fi
echo -e "${GREEN}SSH authentication successful${NC}"

# =============================================================================
# STEP 2: Machine Name Selection
# =============================================================================

echo ""
echo -e "${BLUE}Machine Name Selection${NC}"
echo "────────────────────────"
echo ""
echo "Recommended machine names (these have images in the app):"
for name in "${RECOMMENDED_MACHINES[@]}"; do
    echo -e "  ${GREEN}*${NC} ${name}"
done
echo ""
echo -e "${YELLOW}Note: Custom names will work but won't have an associated image.${NC}"
echo ""

read -p "Enter machine name: " MACHINE_NAME

if [ -z "${MACHINE_NAME}" ]; then
    echo -e "${RED}Machine name cannot be empty.${NC}"
    exit 1
fi

# Check if the name matches one of the recommended names (case-insensitive prefix match)
MACHINE_UPPER=$(echo "${MACHINE_NAME}" | tr '[:lower:]' '[:upper:]')
IS_RECOMMENDED=false
for name in "${RECOMMENDED_MACHINES[@]}"; do
    if [[ "${MACHINE_UPPER}" == "${name}"* ]]; then
        IS_RECOMMENDED=true
        break
    fi
done

if [ "${IS_RECOMMENDED}" = false ]; then
    echo ""
    echo -e "${YELLOW}Warning: '${MACHINE_NAME}' is not a recommended name.${NC}"
    echo -e "${YELLOW}This machine will not have an image displayed in the app.${NC}"
    echo ""
    read -p "Continue anyway? [y/N]: " CONTINUE
    if [[ ! "${CONTINUE}" =~ ^[Yy]$ ]]; then
        echo "Aborted."
        exit 0
    fi
fi

# =============================================================================
# STEP 3: Generate Device Configuration
# =============================================================================

echo ""
echo "Generating device configuration..."

# Generate UUID (try uuidgen first, fallback to Python)
if command -v uuidgen &> /dev/null; then
    DEVICE_UUID=$(uuidgen | tr '[:upper:]' '[:lower:]')
else
    DEVICE_UUID=$(python3 -c "import uuid; print(str(uuid.uuid4()))")
fi

# Create device_config.json (use /tmp to avoid permission issues)
CONFIG_FILE="/tmp/device_config.json"
echo "{
    \"device_name\": \"${MACHINE_NAME}\",
    \"device_id\": \"${DEVICE_UUID}\"
}" > "${CONFIG_FILE}"
cp "${CONFIG_FILE}" "${SCRIPT_DIR}/device_config.json"

echo -e "${GREEN}Device configuration generated:${NC}"
echo "  Device Name: ${MACHINE_NAME}"
echo "  Device ID:   ${DEVICE_UUID}"

# =============================================================================
# STEP 4: Copy Files to Pi
# =============================================================================

echo ""
echo "Copying files to Pi..."

# Ensure remote directory exists
sshpass -p "${SSH_PASSWORD}" ssh -o StrictHostKeyChecking=no "${PI_USER}@${PI_HOST}" \
    "echo '${SSH_PASSWORD}' | sudo -S mkdir -p ${REMOTE_DIR} && echo '${SSH_PASSWORD}' | sudo -S chown ${PI_USER}:${PI_USER} ${REMOTE_DIR}"

# Files to copy
FILES_TO_COPY=(
    "provisioner.py"
    "requirements.txt"
    "device_config.json"
    "rooted-ble.service"
    "rooted-ble.timer"
    "ble-wrapper.sh"
)

for file in "${FILES_TO_COPY[@]}"; do
    if [ -f "${SCRIPT_DIR}/${file}" ]; then
        echo "  Copying ${file}..."
        sshpass -p "${SSH_PASSWORD}" scp -o StrictHostKeyChecking=no \
            "${SCRIPT_DIR}/${file}" "${PI_USER}@${PI_HOST}:${REMOTE_DIR}/"
    else
        echo -e "${YELLOW}  Warning: ${file} not found, skipping...${NC}"
    fi
done

echo -e "${GREEN}Files copied successfully${NC}"

# =============================================================================
# STEP 5: Setup on Pi (NetworkManager, venv, dependencies, systemd)
# =============================================================================

echo ""
echo "Setting up on Pi..."

sshpass -p "${SSH_PASSWORD}" ssh -o StrictHostKeyChecking=no "${PI_USER}@${PI_HOST}" << REMOTE_SCRIPT
set -e

REMOTE_DIR="${REMOTE_DIR}"

# Make scripts executable
chmod +x \${REMOTE_DIR}/ble-wrapper.sh
chmod +x \${REMOTE_DIR}/setup-scripts/*.sh 2>/dev/null || true

# =============================================================================
# Run NetworkManager setup
# =============================================================================
echo "  Setting up NetworkManager for WiFi provisioning..."
echo "${SSH_PASSWORD}" | sudo -S bash \${REMOTE_DIR}/setup-scripts/setup-nm.sh

# Note: All apt packages and Python venv were installed in deploy-to-pi-one.sh (while internet was available)

# Verify Python venv exists
if [ ! -d "\${REMOTE_DIR}/.venv" ]; then
    echo "  ERROR: Python venv not found. Did you run deploy-to-pi-one.sh first?"
    exit 1
fi
echo "  Python virtual environment found."

# =============================================================================
# Set Bluetooth adapter name
# =============================================================================
echo "  Setting Bluetooth adapter name to '${MACHINE_NAME}'..."
echo "${SSH_PASSWORD}" | sudo -S sed -i "s/^#Name = .*/Name = ${MACHINE_NAME}/" /etc/bluetooth/main.conf
echo "${SSH_PASSWORD}" | sudo -S sed -i "s/^Name = .*/Name = ${MACHINE_NAME}/" /etc/bluetooth/main.conf
# Add Name if it doesn't exist in [General] section
if ! grep -q "^Name = " /etc/bluetooth/main.conf; then
    echo "${SSH_PASSWORD}" | sudo -S sed -i '/^\[General\]/a Name = ${MACHINE_NAME}' /etc/bluetooth/main.conf
fi
# Restart bluetooth service to apply the name change
echo "${SSH_PASSWORD}" | sudo -S systemctl restart bluetooth

# =============================================================================
# Install and enable systemd services
# =============================================================================
echo "  Installing systemd service files..."
echo "${SSH_PASSWORD}" | sudo -S cp \${REMOTE_DIR}/rooted-ble.service /etc/systemd/system/
echo "${SSH_PASSWORD}" | sudo -S cp \${REMOTE_DIR}/rooted-ble.timer /etc/systemd/system/

# Reload systemd
echo "  Reloading systemd..."
echo "${SSH_PASSWORD}" | sudo -S systemctl daemon-reload

# Enable the timer (will start the service on boot)
echo "  Enabling BLE timer..."
echo "${SSH_PASSWORD}" | sudo -S systemctl enable rooted-ble.timer

# Start the timer now (optional - for immediate testing)
echo "  Starting BLE timer..."
echo "${SSH_PASSWORD}" | sudo -S systemctl start rooted-ble.timer

echo "  Setup complete!"
REMOTE_SCRIPT

# =============================================================================
# STEP 6: Cleanup and Summary
# =============================================================================

# Remove local device_config.json (it's now on the Pi)
rm -f "${CONFIG_FILE}" "${SCRIPT_DIR}/device_config.json" 2>/dev/null || true

echo ""
echo -e "${GREEN}=========================================${NC}"
echo -e "${GREEN}  Deployment Complete!                  ${NC}"
echo -e "${GREEN}=========================================${NC}"
echo ""
echo "Summary:"
echo "  Pi Host:      ${PI_HOST}"
echo "  Machine Name: ${MACHINE_NAME}"
echo "  Device ID:    ${DEVICE_UUID}"
echo "  Install Path: ${REMOTE_DIR}"
echo ""
echo "The BLE provisioner will run for 5 minutes after each boot."
echo ""
echo "Useful commands on the Pi:"
echo "  sudo systemctl status rooted-ble.timer   # Check timer status"
echo "  sudo systemctl status rooted-ble.service # Check service status"
echo "  sudo journalctl -u rooted-ble.service    # View service logs"
echo "  cat /var/log/rooted-ble.log              # View wrapper logs"
echo ""
echo -e "${YELLOW}Important: Save the Device ID above - you'll need it to identify this machine.${NC}"
echo ""
echo "You can now disconnect the ethernet cable."
echo "The Pi will advertise via BLE for 5 minutes after each boot."
