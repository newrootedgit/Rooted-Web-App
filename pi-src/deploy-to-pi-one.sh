#!/bin/bash
# Deploy to Pi One - Initial setup over existing network connection
# This script copies setup files to the Pi and configures static ethernet

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}  Rooted Robotics - Pi Setup (Step 1 of 2)  ${NC}"
echo -e "${BLUE}============================================${NC}"
echo ""
echo "This script sets up ethernet for direct connection."
echo "Run this over your existing network (WiFi/LAN)."
echo ""

# Ask user for Raspberry Pi hostname/IP and login username
read -p "Enter the Raspberry Pi hostname or IP (default: rootedpi): " PI_HOST
PI_HOST=${PI_HOST:-rootedpi}

# Test connectivity first
echo ""
echo "Testing connectivity to ${PI_HOST}..."
if ! ping -c 2 "$PI_HOST" > /dev/null 2>&1; then
    echo -e "${RED}Unable to reach ${PI_HOST}. Please check the connection and try again.${NC}"
    exit 1
fi
echo -e "${GREEN}Connection successful${NC}"

read -p "Enter the Raspberry Pi login username (default: ubuntu): " PI_USER
PI_USER=${PI_USER:-ubuntu}

# Get SSH password for sudo operations
read -s -p "Enter the SSH password for ${PI_USER}@${PI_HOST}: " SSH_PASSWORD
echo ""

# Verify SSH credentials work
echo ""
echo "Verifying SSH credentials..."

# Check if sshpass is installed
if ! command -v sshpass &> /dev/null; then
    echo -e "${RED}sshpass is not installed.${NC}"
    echo "Install it with: brew install hudochenkov/sshpass/sshpass"
    exit 1
fi

# Temporarily disable exit on error for SSH test
set +e
SSH_RESULT=$(sshpass -p "${SSH_PASSWORD}" ssh -o StrictHostKeyChecking=no -o ConnectTimeout=10 "${PI_USER}@${PI_HOST}" "echo 'SSH OK'" 2>&1)
SSH_EXIT_CODE=$?
set -e

if [ $SSH_EXIT_CODE -ne 0 ]; then
    echo -e "${RED}SSH authentication failed (exit code: ${SSH_EXIT_CODE}).${NC}"
    echo "Error: ${SSH_RESULT}"
    echo ""
    echo "Troubleshooting:"
    echo "  - sshpass exit code 1: Invalid command line argument"
    echo "  - sshpass exit code 2: Conflicting arguments"
    echo "  - sshpass exit code 3: General runtime error"
    echo "  - sshpass exit code 5: Invalid/incorrect password"
    echo "  - sshpass exit code 6: Host public key unknown"
    echo ""
    echo "Try manually: ssh ${PI_USER}@${PI_HOST}"
    exit 1
fi
echo -e "${GREEN}SSH authentication successful${NC}"

# Create the target directory on the Pi
echo ""
echo "Creating /opt/rooted-ble/ directory on the Pi..."
sshpass -p "$SSH_PASSWORD" ssh -o StrictHostKeyChecking=no "${PI_USER}@${PI_HOST}" \
    "echo '$SSH_PASSWORD' | sudo -S mkdir -p /opt/rooted-ble && echo '$SSH_PASSWORD' | sudo -S chown ${PI_USER}:${PI_USER} /opt/rooted-ble"

# Copy setup scripts and requirements to Raspberry Pi
echo "Copying setup scripts..."
sshpass -p "$SSH_PASSWORD" scp -o StrictHostKeyChecking=no -r \
    "${SCRIPT_DIR}/setup-scripts" "${PI_USER}@${PI_HOST}":/opt/rooted-ble/

echo "Copying requirements.txt..."
sshpass -p "$SSH_PASSWORD" scp -o StrictHostKeyChecking=no \
    "${SCRIPT_DIR}/requirements.txt" "${PI_USER}@${PI_HOST}":/opt/rooted-ble/

# Install ALL dependencies while we have internet access
echo ""
echo "Installing all dependencies on the Pi (this may take a few minutes)..."
sshpass -p "$SSH_PASSWORD" ssh -o StrictHostKeyChecking=no "${PI_USER}@${PI_HOST}" << REMOTE_SCRIPT
set -e
echo "Updating package lists..."
echo '${SSH_PASSWORD}' | sudo -S apt-get update -qq

echo "Installing required packages..."
echo '${SSH_PASSWORD}' | sudo -S apt-get install -y -qq \
    network-manager \
    pkg-config \
    libcairo2-dev \
    libgirepository1.0-dev \
    python3-dev \
    libdbus-1-dev \
    libglib2.0-dev \
    python3-venv \
    python3-dbus \
    bluetooth \
    bluez \
    rfkill

echo "All packages installed successfully!"

# Create Python virtual environment and install pip packages
REMOTE_DIR="/opt/rooted-ble"
echo "Creating Python virtual environment..."
python3 -m venv --system-site-packages \${REMOTE_DIR}/.venv

echo "Installing Python packages (bluezero)..."
\${REMOTE_DIR}/.venv/bin/pip install --quiet -r \${REMOTE_DIR}/requirements.txt

echo "Python environment ready!"
REMOTE_SCRIPT

# Execute Ethernet setup script on Raspberry Pi
echo ""
echo "Running ethernet setup on the Pi..."
sshpass -p "$SSH_PASSWORD" ssh -o StrictHostKeyChecking=no "${PI_USER}@${PI_HOST}" \
    "echo '$SSH_PASSWORD' | sudo -S bash /opt/rooted-ble/setup-scripts/setup-ethernet.sh"

echo ""
echo -e "${GREEN}============================================${NC}"
echo -e "${GREEN}  Step 1 Complete - Ethernet Configured!   ${NC}"
echo -e "${GREEN}============================================${NC}"
echo ""
echo "Ethernet configured on eth0 with IP: 192.168.10.1"
echo ""
echo -e "${BLUE}Next Steps:${NC}"
echo "───────────"
echo ""
echo "1. Connect your computer directly to the Pi via ethernet cable"
echo ""
echo "2. Set a static IP on your computer in the 192.168.10.x subnet:"
echo ""
echo -e "   ${YELLOW}macOS:${NC}"
echo "     sudo ifconfig en0 inet 192.168.10.2 netmask 255.255.255.0 up"
echo "     (Use 'networksetup -listallhardwareports' to find your ethernet interface)"
echo ""
echo -e "   ${YELLOW}Linux:${NC}"
echo "     sudo ip addr add 192.168.10.2/24 dev eth0"
echo ""
echo -e "   ${YELLOW}Windows (Run as Administrator in PowerShell):${NC}"
echo "     Get-NetAdapter  # Find your ethernet adapter name"
echo "     New-NetIPAddress -InterfaceAlias \"Ethernet\" -IPAddress 192.168.10.2 -PrefixLength 24"
echo ""
echo "3. Test connectivity:"
echo "     ping 192.168.10.1"
echo ""
echo "4. Run the second deployment script:"
echo -e "     ${GREEN}./deploy-to-pi-two.sh${NC}"
echo ""
echo "============================================"
