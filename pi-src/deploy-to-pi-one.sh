#!/bin/bash
# Deploy to Pi One - Initial setup over existing network connection (WiFi)
# Step 1 of 2: Everything that needs the Pi's INTERNET happens here:
#   - apt packages (captive portal + BLE/IoT dependencies)
#   - all file copies (wifi-setup, captive-portal, BLE provisioner, aws, vector)
#   - Python venv + pip dependencies
#   - Vector telemetry binary install
# It finishes by configuring static ethernet on eth0 (does NOT touch wlan0,
# so the Pi keeps its WiFi internet connection).
#
# deploy-to-pi-two.sh runs over the ethernet cable and is fully OFFLINE on
# the Pi side - do not add any downloads there.

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}============================================${NC}"
echo -e "${GREEN}  Rooted Robotics - Pi Setup (Step 1 of 2)  ${NC}"
echo -e "${GREEN}============================================${NC}"
echo ""

# Fix line endings for Windows compatibility
find "${SCRIPT_DIR}" -name "*.sh" -exec sed -i.bak 's/\r$//' {} \; -exec rm -f {}.bak \;

# Ask user for Raspberry Pi hostname/IP and login username
read -p "Enter the Raspberry Pi hostname or IP (default: rootedpi): " PI_HOST
PI_HOST=${PI_HOST:-rootedpi}

# Test connectivity first
echo "Testing connectivity to ${PI_HOST}..."
if ! ping -c 2 "$PI_HOST" > /dev/null 2>&1; then
    echo -e "${RED}Unable to reach ${PI_HOST}. Please check the connection and try again.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Connection successful${NC}"

read -p "Enter the Raspberry Pi login username (default: ubuntu): " PI_USER
PI_USER=${PI_USER:-ubuntu}

# Get SSH password for sudo operations
read -s -p "Enter the SSH password for ${PI_USER}@${PI_HOST}: " SSH_PASSWORD
echo ""

# Check if sshpass is installed
if ! command -v sshpass &> /dev/null; then
    echo -e "${RED}Error: sshpass is not installed${NC}"
    echo "Install with: brew install hudochenkov/sshpass/sshpass"
    exit 1
fi

# =============================================================================
# [1/5] Install apt packages (NEEDS INTERNET - Pi is still on WiFi)
# =============================================================================
echo ""
echo -e "${GREEN}[1/5] Installing packages on Pi...${NC}"

sshpass -p "$SSH_PASSWORD" ssh -o StrictHostKeyChecking=no "${PI_USER}@${PI_HOST}" << ENDSSH
echo 'Updating package lists...'
echo '$SSH_PASSWORD' | sudo -S apt update
echo 'Upgrading packages...'
echo '$SSH_PASSWORD' | sudo -S DEBIAN_FRONTEND=noninteractive apt upgrade -y
echo 'Installing required packages...'
echo '$SSH_PASSWORD' | sudo -S DEBIAN_FRONTEND=noninteractive apt install -y \
    network-manager dnsmasq dnsmasq-base iptables iptables-persistent \
    rfkill wireless-tools \
    bluez bluetooth \
    python3 python3-pip python3-flask python3.12-venv python3-dev \
    pkg-config libcairo2-dev libgirepository1.0-dev libglib2.0-dev libdbus-1-dev \
    libhidapi-hidraw0 libhidapi-libusb0 libusb-1.0-0 libusb-1.0-0-dev \
    git curl
ENDSSH

# =============================================================================
# [2/5] Copy all files to the Pi
# =============================================================================
echo ""
echo -e "${GREEN}[2/5] Copying files to Pi...${NC}"

# Create directories
sshpass -p "$SSH_PASSWORD" ssh -o StrictHostKeyChecking=no "${PI_USER}@${PI_HOST}" \
    "echo '$SSH_PASSWORD' | sudo -S mkdir -p /opt/rootedpi /opt/rooted-ble/setup-scripts /opt/rooted-ble/aws /opt/rooted-ble/vector && \
     echo '$SSH_PASSWORD' | sudo -S chown -R ${PI_USER}:${PI_USER} /opt/rootedpi /opt/rooted-ble"

# Captive portal flow files -> /opt/rootedpi
echo "  Copying wifi-setup files..."
sshpass -p "$SSH_PASSWORD" scp -o StrictHostKeyChecking=no -r \
    "${SCRIPT_DIR}/wifi-setup" "${PI_USER}@${PI_HOST}:/opt/rootedpi/"

echo "  Copying captive-portal files..."
sshpass -p "$SSH_PASSWORD" scp -o StrictHostKeyChecking=no -r \
    "${SCRIPT_DIR}/captive-portal" "${PI_USER}@${PI_HOST}:/opt/rootedpi/"

# Setup scripts -> /opt/rooted-ble/setup-scripts
echo "  Copying setup scripts..."
sshpass -p "$SSH_PASSWORD" scp -o StrictHostKeyChecking=no \
    "${SCRIPT_DIR}/setup-scripts/setup-ethernet.sh" \
    "${SCRIPT_DIR}/setup-scripts/setup-nm.sh" \
    "${PI_USER}@${PI_HOST}:/opt/rooted-ble/setup-scripts/"

# BLE provisioner / IoT / telemetry files -> /opt/rooted-ble
echo "  Copying BLE provisioner files..."
FILES_TO_COPY=(
    "provisioner.py"
    "requirements.txt"
    "rooted-ble.service"
    "rooted-iot.service"
    "rooted-ingest.service"
    "rooted-ble.timer"
    "ble-wrapper.sh"
)
for file in "${FILES_TO_COPY[@]}"; do
    if [ -f "${SCRIPT_DIR}/${file}" ]; then
        echo "    ${file}"
        sshpass -p "$SSH_PASSWORD" scp -o StrictHostKeyChecking=no \
            "${SCRIPT_DIR}/${file}" "${PI_USER}@${PI_HOST}:/opt/rooted-ble/"
    else
        echo -e "${YELLOW}    Warning: ${file} not found, skipping...${NC}"
    fi
done

echo "  Copying aws/ Python modules..."
# This glob includes telemetry_ingest.py, which rooted-ingest.service runs
# directly from /opt/rooted-ble/aws/ (no longer staged under te-cli).
sshpass -p "$SSH_PASSWORD" scp -o StrictHostKeyChecking=no \
    "${SCRIPT_DIR}/aws/"*.py "${PI_USER}@${PI_HOST}:/opt/rooted-ble/aws/"

echo "  Copying Vector telemetry config..."
sshpass -p "$SSH_PASSWORD" scp -o StrictHostKeyChecking=no \
    "${SCRIPT_DIR}/vector/rooted-telemetry.toml" \
    "${SCRIPT_DIR}/vector/rooted-vector.service" \
    "${PI_USER}@${PI_HOST}:/opt/rooted-ble/vector/"

# =============================================================================
# [3/5] Python venv + pip dependencies (NEEDS INTERNET)
# =============================================================================
echo ""
echo -e "${GREEN}[3/5] Creating Python venv and installing dependencies...${NC}"

sshpass -p "$SSH_PASSWORD" ssh -o StrictHostKeyChecking=no "${PI_USER}@${PI_HOST}" << ENDSSH
set -e
chmod +x /opt/rooted-ble/setup-scripts/*.sh /opt/rooted-ble/ble-wrapper.sh

if [ ! -d /opt/rooted-ble/.venv ]; then
    python3 -m venv /opt/rooted-ble/.venv
fi
echo '  Installing Python dependencies (this may take a minute)...'
/opt/rooted-ble/.venv/bin/pip install --upgrade pip --quiet
/opt/rooted-ble/.venv/bin/pip install -r /opt/rooted-ble/requirements.txt --quiet
ENDSSH

# =============================================================================
# [4/5] Install Vector binary (NEEDS INTERNET)
# =============================================================================
echo ""
echo -e "${GREEN}[4/5] Installing Vector telemetry binary...${NC}"

sshpass -p "$SSH_PASSWORD" ssh -o StrictHostKeyChecking=no "${PI_USER}@${PI_HOST}" << ENDSSH
set -e
# rooted-vector.service runs the binary from this fixed path:
TARGET=/home/rooted/.vector/bin/vector

if [ -x "\$TARGET" ]; then
    echo '  Vector already installed'
else
    # Install Vector if it isn't anywhere yet
    if [ ! -x "\$HOME/.vector/bin/vector" ] && ! command -v vector &> /dev/null; then
        echo '  Downloading Vector...'
        curl --proto '=https' --tlsv1.2 -sSfL https://sh.vector.dev | bash -s -- -y
    fi

    # Find wherever the installer actually put it
    if [ -x "\$HOME/.vector/bin/vector" ]; then
        SRC="\$HOME/.vector/bin/vector"
    else
        SRC="\$(command -v vector)"
    fi

    # Stage it at the service's expected path - but skip if it's already there.
    # When the SSH user IS rooted, \$HOME/.vector == /home/rooted/.vector, so
    # copying would be a file-onto-itself error that aborts the whole deploy.
    if [ "\$SRC" != "\$TARGET" ]; then
        echo "  Staging vector binary at \$TARGET..."
        echo '$SSH_PASSWORD' | sudo -S mkdir -p /home/rooted/.vector/bin
        echo '$SSH_PASSWORD' | sudo -S cp "\$SRC" "\$TARGET"
    else
        echo '  Vector binary already at expected path'
    fi
fi
ENDSSH

# =============================================================================
# [5/5] Configure static ethernet (does NOT touch wlan0/WiFi)
# =============================================================================
echo ""
echo -e "${GREEN}[5/5] Configuring static ethernet...${NC}"

sshpass -p "$SSH_PASSWORD" ssh -o StrictHostKeyChecking=no "${PI_USER}@${PI_HOST}" \
    "echo '$SSH_PASSWORD' | sudo -S bash /opt/rooted-ble/setup-scripts/setup-ethernet.sh"

echo ""
echo -e "${GREEN}======================================${NC}"
echo -e "${GREEN}  Step 1 Complete!                    ${NC}"
echo -e "${GREEN}======================================${NC}"
echo ""
echo "Everything that needs the Pi's internet is done."
echo "Ethernet configured on eth0 with IP: 192.168.10.1"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo "─────────────"
echo "1. Connect your computer directly to the Pi via ethernet cable"
echo ""
echo "2. Set a static IP on your computer in the 192.168.10.x subnet:"
echo ""
echo "   macOS:"
echo "     sudo ifconfig en0 inet 192.168.10.2 netmask 255.255.255.0 up"
echo "     (Use 'networksetup -listallhardwareports' to find your ethernet interface)"
echo ""
echo "   Linux:"
echo "     sudo ip addr add 192.168.10.2/24 dev eth0"
echo ""
echo "   Windows (Run as Administrator in PowerShell):"
echo "     Get-NetAdapter  # Find your ethernet adapter name"
echo "     New-NetIPAddress -InterfaceAlias \"Ethernet\" -IPAddress 192.168.10.2 -PrefixLength 24"
echo ""
echo "3. Test connectivity:"
echo "     ping 192.168.10.1"
echo ""
echo "4. Run the second deployment script:"
echo "     ./deploy-to-pi-two.sh"
echo ""
echo -e "${GREEN}======================================${NC}"
