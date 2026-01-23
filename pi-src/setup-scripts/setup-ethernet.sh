#!/bin/bash
# Setup static ethernet IP on the Raspberry Pi
# This allows direct connection from a computer via ethernet cable

set -e

ETHERNET_IP="192.168.10.1"
ETHERNET_NETMASK="24"
ETHERNET_INTERFACE="eth0"

echo "Configuring static ethernet on ${ETHERNET_INTERFACE}..."

# Check if NetworkManager is available
if command -v nmcli &> /dev/null; then
    echo "Using NetworkManager to configure ethernet..."

    # Delete existing ethernet connection if it exists
    nmcli connection delete "static-ethernet" 2>/dev/null || true

    # Create new static ethernet connection
    nmcli connection add \
        type ethernet \
        con-name "static-ethernet" \
        ifname "${ETHERNET_INTERFACE}" \
        ipv4.addresses "${ETHERNET_IP}/${ETHERNET_NETMASK}" \
        ipv4.method manual \
        connection.autoconnect yes

    # Bring up the connection
    nmcli connection up "static-ethernet"

    echo "Ethernet configured via NetworkManager"
else
    echo "NetworkManager not found, using netplan..."

    # Create netplan configuration
    cat > /etc/netplan/99-static-ethernet.yaml << EOF
network:
  version: 2
  renderer: networkd
  ethernets:
    ${ETHERNET_INTERFACE}:
      addresses:
        - ${ETHERNET_IP}/${ETHERNET_NETMASK}
      optional: true
EOF

    # Apply netplan configuration
    netplan apply

    echo "Ethernet configured via netplan"
fi

echo ""
echo "Static ethernet configured:"
echo "  Interface: ${ETHERNET_INTERFACE}"
echo "  IP Address: ${ETHERNET_IP}/${ETHERNET_NETMASK}"
echo ""
echo "Connect your computer to the Pi via ethernet and set your IP to 192.168.10.2"
