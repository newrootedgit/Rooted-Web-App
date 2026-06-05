#!/bin/bash
# Deploy to Pi One - Initial setup over existing network connection
# This script copies files to the Pi and configures static ethernet

set -e

# Ask user for Raspberry Pi hostname/IP and login username
read -p "Enter the Raspberry Pi hostname or IP (default: rootedpi): " PI_HOST
PI_HOST=${PI_HOST:-rootedpi}

# Test connectivity first
echo "Testing connectivity to ${PI_HOST}..."
if ! ping -c 2 "$PI_HOST" > /dev/null 2>&1; then
    echo "Unable to reach ${PI_HOST}. Please check the connection and try again."
    exit 1
fi
echo "✓ Connection successful"

read -p "Enter the Raspberry Pi login username (default: ubuntu): " PI_LOGIN_USERNAME
PI_LOGIN_USERNAME=${PI_LOGIN_USERNAME:-ubuntu}

# Get SSH password for sudo operations
read -s -p "Enter the SSH password for ${PI_LOGIN_USERNAME}@${PI_HOST}: " SSH_PASSWORD
echo ""

# Create the target directory on the Pi
echo "Creating /opt/rootedpi/ directory on the Pi..."
sshpass -p "$SSH_PASSWORD" ssh -o StrictHostKeyChecking=no "${PI_LOGIN_USERNAME}@${PI_HOST}" "echo '$SSH_PASSWORD' | sudo -S mkdir -p /opt/rootedpi && echo '$SSH_PASSWORD' | sudo -S chown \$USER:\$USER /opt/rootedpi"

# SCP scripts and captive portal to Raspberry Pi
echo "Copying wifi-setup files..."
sshpass -p "$SSH_PASSWORD" scp -o StrictHostKeyChecking=no -r wifi-setup "${PI_LOGIN_USERNAME}@${PI_HOST}":/opt/rootedpi/

echo "Copying captive-portal files..."
sshpass -p "$SSH_PASSWORD" scp -o StrictHostKeyChecking=no -r captive-portal "${PI_LOGIN_USERNAME}@${PI_HOST}":/opt/rootedpi/

# Install dependencies on the Pi
echo "Installing dependencies on the Pi..."
sshpass -p "$SSH_PASSWORD" ssh -o StrictHostKeyChecking=no "${PI_LOGIN_USERNAME}@${PI_HOST}" "
    echo 'Updating package lists...'
    echo '$SSH_PASSWORD' | sudo -S apt update
    echo 'Upgrading packages...'
    echo '$SSH_PASSWORD' | sudo -S apt upgrade -y
    echo 'Installing required packages...'
    echo '$SSH_PASSWORD' | sudo -S DEBIAN_FRONTEND=noninteractive apt install -y \
      network-manager dnsmasq dnsmasq-base iptables iptables-persistent \
      rfkill wireless-tools \
      python3 python3-pip python3-flask python3.12-venv \
      libhidapi-hidraw0 libhidapi-libusb0 libusb-1.0-0 libusb-1.0-0-dev \
      git curl
"

# Execute Ethernet setup script on Raspberry Pi
echo "Running ethernet setup on the Pi..."
sshpass -p "$SSH_PASSWORD" ssh -o StrictHostKeyChecking=no "${PI_LOGIN_USERNAME}@${PI_HOST}" "echo '$SSH_PASSWORD' | sudo -S bash /opt/rootedpi/wifi-setup/setup-ethernet.sh"

echo ""
echo "======================================"
echo "  Deploy to Raspberry Pi One Complete!"
echo "======================================"
echo ""
echo "Ethernet configured on eth0 with IP: 192.168.10.1"
echo ""
echo "Next Steps:"
echo "-----------"
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
echo "======================================"





