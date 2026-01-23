#!/bin/bash
# Setup NetworkManager and WiFi configuration on Raspberry Pi
# This script prepares the Pi for WiFi provisioning via BLE

set -e

echo "Setting up NetworkManager..."

# Ensure NetworkManager is installed and running
systemctl enable NetworkManager
systemctl start NetworkManager

# Disable and stop wpa_supplicant if it conflicts
systemctl stop wpa_supplicant 2>/dev/null || true
systemctl disable wpa_supplicant 2>/dev/null || true

# Tell NetworkManager to manage WiFi
cat > /etc/NetworkManager/conf.d/10-globally-managed-devices.conf << 'EOF'
[keyfile]
unmanaged-devices=none
EOF

# Enable WiFi via rfkill
rfkill unblock wifi 2>/dev/null || true

# Restart NetworkManager to pick up changes
systemctl restart NetworkManager

# Wait for NetworkManager to be ready
sleep 3

# Verify NetworkManager is managing the WiFi device
echo ""
echo "NetworkManager device status:"
nmcli device status

echo ""
echo "NetworkManager setup complete!"
echo ""
echo "The Pi is now ready for WiFi provisioning via BLE."
echo "WiFi credentials can be configured using: nmcli device wifi connect <SSID> password <PASSWORD>"
