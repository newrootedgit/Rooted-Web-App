#!/bin/bash
# Deploy to Pi Two - Full setup over ethernet connection
# Step 2 of 2: Runs entirely OFFLINE on the Pi.
#
# All downloads (apt, pip, Vector) already happened in deploy-to-pi-one.sh.
# This script:
#   - provisions AWS IoT (runs on YOUR computer, which still has internet)
#   - copies the generated device config + certificates to the Pi
#   - runs NetworkManager setup (this disconnects the Pi's WiFi - that's OK,
#     nothing after it needs the Pi to be online)
#   - sets up the captive portal hotspot
#   - configures Bluetooth + installs/enables all systemd services
#
# DO NOT add apt/pip/curl downloads on the Pi to this script - the Pi has no
# internet once NetworkManager takes over wlan0.

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default values - connects via ethernet!
# The host stays 192.168.10.1 on purpose: this script runs setup-nm.sh, which
# restarts NetworkManager and drops wlan0, so it must run over the direct cable.
# rooted.local would be reachable right up until that step killed the session.
DEFAULT_HOSTNAME="192.168.10.1"
DEFAULT_USERNAME="rooted"
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

# =============================================================================
# STEP 2: Verify Step 1 was completed (everything offline depends on it)
# =============================================================================

echo ""
echo "Verifying SSH access..."
# First confirm we can actually log in. Distinguish an auth failure from a
# missing-files failure so we don't hand out misleading "rerun step 1" advice.
if ! sshpass -p "${SSH_PASSWORD}" ssh -o StrictHostKeyChecking=no -o ConnectTimeout=10 \
    -o NumberOfPasswordPrompts=1 "${PI_USER}@${PI_HOST}" "true" 2>/dev/null; then
    echo -e "${RED}SSH login to ${PI_USER}@${PI_HOST} failed (wrong username or password).${NC}"
    echo "Use the SAME account/password you ran deploy-to-pi-one.sh with."
    echo "Test it by hand:  ssh ${PI_USER}@${PI_HOST}"
    exit 1
fi
echo -e "${GREEN}SSH login OK${NC}"

echo "Verifying deploy-to-pi-one.sh was run..."
if ! sshpass -p "${SSH_PASSWORD}" ssh -o StrictHostKeyChecking=no "${PI_USER}@${PI_HOST}" \
    "[ -d ${REMOTE_DIR}/.venv ] && [ -x /home/rooted/.vector/bin/vector ] && [ -f ${REMOTE_DIR}/setup-scripts/setup-nm.sh ] && [ -d /opt/rootedpi/captive-portal ]"; then
    echo -e "${RED}SSH works, but the Pi is missing files from step 1 (venv, Vector, setup scripts, or captive portal).${NC}"
    echo "The Pi has no internet over ethernet, so they cannot be installed now."
    echo "Reconnect the Pi to WiFi and run deploy-to-pi-one.sh first."
    exit 1
fi
echo -e "${GREEN}Step 1 artifacts present${NC}"

# =============================================================================
# STEP 3: Machine Name Selection
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
# STEP 4: Generate Device Configuration
# =============================================================================

echo ""
echo "Generating device configuration..."

# Generate UUID (try uuidgen first, fallback to Python)
if command -v uuidgen &> /dev/null; then
    DEVICE_UUID=$(uuidgen | tr '[:upper:]' '[:lower:]')
else
    DEVICE_UUID=$(python3 -c "import uuid; print(str(uuid.uuid4()))")
fi

echo -e "${GREEN}Device configuration generated:${NC}"
echo "  Device Name: ${MACHINE_NAME}"
echo "  Device ID:   ${DEVICE_UUID}"

# =============================================================================
# STEP 5: AWS IoT Provisioning (runs on YOUR computer - uses YOUR internet,
# not the Pi's. Keep your WiFi connected while on ethernet to the Pi.)
# =============================================================================

echo ""
echo -e "${BLUE}AWS IoT Provisioning${NC}"
echo "────────────────────────"
read -p "Provision AWS IoT for this device? [Y/n]: " PROVISION_IOT
PROVISION_IOT=${PROVISION_IOT:-Y}

IOT_TEMP_DIR="/tmp/rooted-iot-${DEVICE_UUID}"
IOT_ENDPOINT=""

if [[ "$PROVISION_IOT" =~ ^[Yy]$ ]]; then
    # Check if AWS CLI is available
    if ! command -v aws &> /dev/null; then
        echo -e "${RED}AWS CLI not installed. Skipping IoT provisioning.${NC}"
        echo "Install with: brew install awscli"
        PROVISION_IOT="n"
    else
        echo "Provisioning AWS IoT Thing: ${DEVICE_UUID}"

        # Run the provisioning script in non-interactive mode
        "${SCRIPT_DIR}/setup-scripts/provision-iot-device.sh" "${DEVICE_UUID}" --output-dir "${IOT_TEMP_DIR}"

        if [ -f "${IOT_TEMP_DIR}/.iot_endpoint" ]; then
            IOT_ENDPOINT=$(cat "${IOT_TEMP_DIR}/.iot_endpoint")
            echo -e "${GREEN}IoT provisioning complete!${NC}"
        else
            echo -e "${RED}IoT provisioning may have failed. Continuing without IoT...${NC}"
            PROVISION_IOT="n"
        fi
    fi
fi

# Create device_config.json with IoT endpoint if available
CONFIG_FILE="/tmp/device_config.json"
if [ -n "$IOT_ENDPOINT" ]; then
    echo "{
    \"device_name\": \"${MACHINE_NAME}\",
    \"device_id\": \"${DEVICE_UUID}\",
    \"aws_iot_endpoint\": \"${IOT_ENDPOINT}\",
    \"aws_region\": \"us-west-2\"
}" > "${CONFIG_FILE}"
else
    echo "{
    \"device_name\": \"${MACHINE_NAME}\",
    \"device_id\": \"${DEVICE_UUID}\"
}" > "${CONFIG_FILE}"
fi

# =============================================================================
# STEP 6: Copy generated config + certificates to Pi (over ethernet)
# =============================================================================

echo ""
echo "Copying device configuration to Pi..."
sshpass -p "${SSH_PASSWORD}" scp -o StrictHostKeyChecking=no \
    "${CONFIG_FILE}" "${PI_USER}@${PI_HOST}:${REMOTE_DIR}/device_config.json"

# Copy IoT certificates if provisioning was done
if [[ "$PROVISION_IOT" =~ ^[Yy]$ ]] && [ -d "${IOT_TEMP_DIR}" ]; then
    echo "  Creating certs directory..."
    sshpass -p "${SSH_PASSWORD}" ssh -o StrictHostKeyChecking=no "${PI_USER}@${PI_HOST}" \
        "echo '${SSH_PASSWORD}' | sudo -S mkdir -p ${REMOTE_DIR}/certs && echo '${SSH_PASSWORD}' | sudo -S chown ${PI_USER}:${PI_USER} ${REMOTE_DIR}/certs"

    echo "  Copying IoT certificates..."
    sshpass -p "${SSH_PASSWORD}" scp -o StrictHostKeyChecking=no \
        "${IOT_TEMP_DIR}/certificate.pem.crt" \
        "${IOT_TEMP_DIR}/private.pem.key" \
        "${IOT_TEMP_DIR}/AmazonRootCA1.pem" \
        "${PI_USER}@${PI_HOST}:${REMOTE_DIR}/certs/"

    # Set proper permissions on private key
    sshpass -p "${SSH_PASSWORD}" ssh -o StrictHostKeyChecking=no "${PI_USER}@${PI_HOST}" \
        "chmod 600 ${REMOTE_DIR}/certs/private.pem.key"
fi

echo -e "${GREEN}Files copied successfully${NC}"

# =============================================================================
# STEP 7: Setup on Pi (NetworkManager, captive portal, Bluetooth, systemd)
# Everything below runs OFFLINE - no downloads.
# =============================================================================

echo ""
echo "Setting up on Pi..."

sshpass -p "${SSH_PASSWORD}" ssh -o StrictHostKeyChecking=no "${PI_USER}@${PI_HOST}" << REMOTE_SCRIPT
set -e

REMOTE_DIR="${REMOTE_DIR}"

# =============================================================================
# Run NetworkManager setup
# NOTE: this hands wlan0 to NetworkManager and disconnects the Pi from WiFi.
# The Pi has NO INTERNET from this point on. SSH survives because eth0 is
# managed by systemd-networkd, not NetworkManager.
# =============================================================================
echo "  Configuring NetworkManager (Pi will drop off WiFi - this is expected)..."
echo "${SSH_PASSWORD}" | sudo -S bash \${REMOTE_DIR}/setup-scripts/setup-nm.sh

# =============================================================================
# Set up captive portal hotspot (offline - packages installed in step 1)
# =============================================================================
echo "  Setting up captive portal..."
echo "${SSH_PASSWORD}" | sudo -S bash /opt/rootedpi/wifi-setup/setup-captive-portal.sh

echo "  Enabling captive portal service..."
echo "${SSH_PASSWORD}" | sudo -S systemctl enable captive-portal.service
echo "${SSH_PASSWORD}" | sudo -S systemctl restart captive-portal.service

# =============================================================================
# Set Bluetooth adapter name
# =============================================================================
echo "  Setting Bluetooth adapter name to '${MACHINE_NAME}'..."

# Check if bluetooth config exists, create if not
if [ ! -f /etc/bluetooth/main.conf ]; then
    echo "  Creating /etc/bluetooth/main.conf..."
    echo "${SSH_PASSWORD}" | sudo -S mkdir -p /etc/bluetooth
    echo "${SSH_PASSWORD}" | sudo -S tee /etc/bluetooth/main.conf > /dev/null << BTCONF
[General]
Name = ${MACHINE_NAME}
DiscoverableTimeout = 0
PairableTimeout = 0

[Policy]
AutoEnable=true
BTCONF
else
    # File exists, update the Name setting
    echo "${SSH_PASSWORD}" | sudo -S sed -i "s/^#Name = .*/Name = ${MACHINE_NAME}/" /etc/bluetooth/main.conf
    echo "${SSH_PASSWORD}" | sudo -S sed -i "s/^Name = .*/Name = ${MACHINE_NAME}/" /etc/bluetooth/main.conf
    # Add Name if it doesn't exist in [General] section
    if ! grep -q "^Name = " /etc/bluetooth/main.conf; then
        echo "${SSH_PASSWORD}" | sudo -S sed -i '/^\[General\]/a Name = ${MACHINE_NAME}' /etc/bluetooth/main.conf
    fi
fi

# Set PRETTY_HOSTNAME to override BlueZ hostname plugin
echo "  Setting PRETTY_HOSTNAME for Bluetooth..."
echo "${SSH_PASSWORD}" | sudo -S bash -c "echo 'PRETTY_HOSTNAME=${MACHINE_NAME}' > /etc/machine-info"

# Restart bluetooth service to apply the name change
echo "${SSH_PASSWORD}" | sudo -S systemctl restart bluetooth

# =============================================================================
# Fix file permissions for preset lock file
# =============================================================================
echo "  Fixing preset file permissions..."
echo "${SSH_PASSWORD}" | sudo -S mkdir -p /home/rooted/te-cli
echo "${SSH_PASSWORD}" | sudo -S chown -R ${PI_USER}:${PI_USER} /home/rooted/te-cli
# Remove stale lock file if owned by root
if [ -f /home/rooted/te-cli/TE_Variable_Values.json.lock ]; then
    echo "${SSH_PASSWORD}" | sudo -S rm -f /home/rooted/te-cli/TE_Variable_Values.json.lock
fi

# =============================================================================
# Install and enable systemd services
# =============================================================================
echo "  Installing systemd service files..."
echo "${SSH_PASSWORD}" | sudo -S cp \${REMOTE_DIR}/rooted-ble.service /etc/systemd/system/
echo "${SSH_PASSWORD}" | sudo -S cp \${REMOTE_DIR}/rooted-ble.timer /etc/systemd/system/

# Install IoT service if it exists
if [ -f "\${REMOTE_DIR}/rooted-iot.service" ]; then
    echo "  Installing AWS IoT service..."
    echo "${SSH_PASSWORD}" | sudo -S cp \${REMOTE_DIR}/rooted-iot.service /etc/systemd/system/
fi

# Install ingest service if it exists
if [ -f "\${REMOTE_DIR}/rooted-ingest.service" ]; then
    echo "  Installing telemetry ingest service..."
    echo "${SSH_PASSWORD}" | sudo -S cp \${REMOTE_DIR}/rooted-ingest.service /etc/systemd/system/
fi

# Install Vector service (binary was installed in step 1)
echo "  Installing Vector service..."
echo "${SSH_PASSWORD}" | sudo -S cp \${REMOTE_DIR}/vector/rooted-vector.service /etc/systemd/system/

# Write environment file with device ID and IoT endpoint (required: the vector
# unit references it via EnvironmentFile with ignore_errors=no)
echo "${SSH_PASSWORD}" | sudo -S tee /etc/default/vector > /dev/null << VECTORENV
ROOTED_DEVICE_ID=${DEVICE_UUID}
AWS_IOT_ENDPOINT=${IOT_ENDPOINT}
VECTORENV

# Our Vector build (musl) does NOT interpolate \${VAR} env vars in its config, so
# bake the device ID and IoT endpoint into the config directly at deploy time.
echo "  Rendering Vector config..."
echo "${SSH_PASSWORD}" | sudo -S sed -i "s|@@AWS_IOT_ENDPOINT@@|${IOT_ENDPOINT}|g; s|@@ROOTED_DEVICE_ID@@|${DEVICE_UUID}|g" \${REMOTE_DIR}/vector/rooted-telemetry.toml

# Reload systemd
echo "  Reloading systemd..."
echo "${SSH_PASSWORD}" | sudo -S systemctl daemon-reload

# Enable the timer (will start the service on boot)
echo "  Enabling BLE timer..."
echo "${SSH_PASSWORD}" | sudo -S systemctl enable rooted-ble.timer
echo "  Starting BLE timer..."
echo "${SSH_PASSWORD}" | sudo -S systemctl start rooted-ble.timer

# Enable and start IoT service if certificates exist
if [ -f "\${REMOTE_DIR}/certs/certificate.pem.crt" ]; then
    echo "  Enabling AWS IoT service..."
    echo "${SSH_PASSWORD}" | sudo -S systemctl enable rooted-iot.service
    echo "  Starting AWS IoT service..."
    echo "${SSH_PASSWORD}" | sudo -S systemctl start rooted-iot.service
fi

# Enable and start ingest service (always - it listens for UDP from ClearCore)
if [ -f /etc/systemd/system/rooted-ingest.service ]; then
    echo "  Enabling telemetry ingest service..."
    echo "${SSH_PASSWORD}" | sudo -S systemctl enable rooted-ingest.service
    echo "  Starting telemetry ingest service..."
    echo "${SSH_PASSWORD}" | sudo -S systemctl restart rooted-ingest.service
fi

# Enable and start Vector if IoT is provisioned
if [ -f "\${REMOTE_DIR}/certs/certificate.pem.crt" ] && [ -n "${IOT_ENDPOINT}" ]; then
    # Vector's data_dir (checkpoints + disk buffer) must exist before start or
    # it exits with a config error (status 78) and crash-loops until it does.
    echo "  Creating Vector data_dir..."
    echo "${SSH_PASSWORD}" | sudo -S mkdir -p /var/lib/vector
    echo "  Enabling Vector service..."
    echo "${SSH_PASSWORD}" | sudo -S systemctl enable rooted-vector.service
    echo "  Starting Vector service..."
    echo "${SSH_PASSWORD}" | sudo -S systemctl start rooted-vector.service
fi

echo "  Setup complete!"
REMOTE_SCRIPT

# =============================================================================
# STEP 8: Cleanup and Summary
# =============================================================================

# Remove local device_config.json and temp IoT files
rm -f "${CONFIG_FILE}" 2>/dev/null || true
rm -rf "${IOT_TEMP_DIR}" 2>/dev/null || true

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
if [ -n "$IOT_ENDPOINT" ]; then
echo "  IoT Endpoint: ${IOT_ENDPOINT}"
echo "  IoT Status:   Provisioned"
else
echo "  IoT Status:   Not provisioned"
fi
echo ""
echo "Services:"
echo "  - captive-portal.service   : WiFi onboarding hotspot (Rooted-Robotics-Setup)"
echo "  - rooted-ble.timer         : BLE provisioning (runs on boot)"
if [ -n "$IOT_ENDPOINT" ]; then
echo "  - rooted-iot.service       : AWS IoT connection (always running)"
echo "  - rooted-vector.service    : Vector telemetry pipeline (always running)"
fi
echo ""
echo "WiFi onboarding (either method works):"
echo "  - Connect to the 'Rooted-Robotics-Setup' hotspot and use the captive portal"
echo "  - Or provision over BLE with the mobile app"
echo ""
echo "Useful commands on the Pi:"
echo "  sudo systemctl status captive-portal      # Check captive portal"
echo "  sudo systemctl status rooted-ble.timer    # Check BLE timer"
echo "  sudo systemctl status rooted-ble.service  # Check BLE service"
if [ -n "$IOT_ENDPOINT" ]; then
echo "  sudo systemctl status rooted-iot.service     # Check IoT service"
echo "  sudo systemctl status rooted-vector.service  # Check Vector telemetry"
echo "  sudo journalctl -u rooted-iot -f             # Watch IoT logs"
echo "  sudo journalctl -u rooted-vector -f          # Watch Vector logs"
fi
echo ""
echo -e "${YELLOW}Important: Save the Device ID above - you'll need it to identify this machine.${NC}"
echo ""
echo "You can now disconnect the ethernet cable."
