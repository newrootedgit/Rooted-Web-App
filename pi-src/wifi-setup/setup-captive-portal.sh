#!/bin/bash
# Captive Portal Setup for Raspberry Pi 4
# FIXED: Uses correct dnsmasq-shared.d directory for NetworkManager

set -e

echo "======================================"
echo "  Captive Portal Setup (Fixed)"
echo "======================================"
echo ""

if [ "$EUID" -ne 0 ]; then 
    echo "Please run as root (use sudo)"
    exit 1
fi

echo ""
echo "Captive portal will be copied to /opt/captive-portal"
echo "Wifi Manager script will also be copied there"
echo "This is where captive portal service will look for the Flask app"
echo ""
# Remove old directory first to ensure clean update
sudo rm -rf /opt/captive-portal
sudo cp -r /opt/rootedpi/captive-portal /opt/captive-portal
sudo cp /opt/rootedpi/wifi-setup/wifi-manager-nmcli.sh /opt/captive-portal/wifi-manager-nmcli.sh
chmod +x /opt/captive-portal/wifi-manager-nmcli.sh
echo "✓ Captive portal files copied to /opt/captive-portal"

HOTSPOT_INTERFACE="wlan0"
HOTSPOT_IP="10.42.0.1"

# --- Hotspot password ---------------------------------------------------------
# MUST be set explicitly. `nmcli device wifi hotspot` with no password argument
# does NOT create an open network - it GENERATES A RANDOM WPA KEY that exists
# only on that one machine. Reading it back requires already being logged in,
# so the recovery/onboarding hotspot became unjoinable on every machine built
# that way. (Observed: a field machine advertising Rooted-Robotics-Setup with
# PSK 7Pr3si4thJ49, knowable by nobody.)
#
# This is a FLEET-WIDE shared credential and it is the ONLY access control on
# the portal - captive_portal.py itself asks for no code, it just accepts an
# SSID and password and joins. Anyone within WiFi range who knows this string
# can therefore point a machine at a different network. That is an accepted
# trade: the alternative, a per-machine password, cannot be typed by a customer
# who has no other way in, which is the exact situation the hotspot exists for.
#
# Change it here and it applies to every machine built afterwards; existing
# machines pick it up on the next run of this script.
HOTSPOT_PASSWORD="${HOTSPOT_PASSWORD:-RootedSetup2026}"

if [ ${#HOTSPOT_PASSWORD} -lt 8 ]; then
    echo "ERROR: HOTSPOT_PASSWORD must be at least 8 characters (WPA2 minimum)."
    exit 1
fi
FLASK_PORT="80"

# echo "Step 1: Installing dependencies..."
# apt-get update
# apt-get install -y dnsmasq-base iptables python3-flask
# echo "✓ Dependencies installed"
# echo ""

echo "Step 2: Configuring NetworkManager for dnsmasq..."

# Configure NetworkManager to use dnsmasq
cat > /etc/NetworkManager/conf.d/30-dnsmasq.conf <<EOF
[main]
dns=dnsmasq
rc-manager=file

[connection]
wifi.dns=dnsmasq
EOF

# CRITICAL FIX: Use dnsmasq-shared.d directory (not dnsmasq.d)
# NetworkManager's dnsmasq reads from dnsmasq-shared.d when using ipv4.method=shared
mkdir -p /etc/NetworkManager/dnsmasq-shared.d

# Create captive portal DNS config in CORRECT directory
cat > /etc/NetworkManager/dnsmasq-shared.d/99-captive-portal.conf <<EOF
# Captive Portal DNS - Hijack ALL domains
# Redirect everything to captive portal
address=/#/${HOTSPOT_IP}

# Specific captive portal detection URLs
address=/connectivitycheck.gstatic.com/${HOTSPOT_IP}
address=/clients3.google.com/${HOTSPOT_IP}
address=/captive.apple.com/${HOTSPOT_IP}
address=/msftconnecttest.com/${HOTSPOT_IP}
address=/www.msftconnecttest.com/${HOTSPOT_IP}

# Logging (optional, comment out to disable)
log-queries
log-facility=/var/log/dnsmasq-captive.log
EOF

nmcli general reload

echo "✓ NetworkManager dnsmasq configured"
echo "✓ DNS config placed in: /etc/NetworkManager/dnsmasq-shared.d/"
echo ""

echo "Step 3: Configuring hotspot..."

if nmcli connection show "Rooted-Robotics-Setup" &>/dev/null; then
    echo "Updating existing Rooted-Robotics-Setup hotspot..."
else
    echo "Creating Rooted-Robotics-Setup hotspot..."
    # `password` is REQUIRED here - omitting it makes nmcli invent a random key
    # that nobody can ever know. See the HOTSPOT_PASSWORD notes at the top.
    nmcli device wifi hotspot \
        ifname wlan0 \
        con-name Rooted-Robotics-Setup \
        ssid Rooted-Robotics-Setup \
        password "${HOTSPOT_PASSWORD}"
fi

# Applied on BOTH paths, so a machine built before the password was pinned gets
# corrected the next time this runs, rather than keeping its unknowable key.
nmcli connection modify "Rooted-Robotics-Setup" \
    ipv4.method shared \
    ipv4.addresses "${HOTSPOT_IP}/24" \
    connection.autoconnect yes \
    connection.autoconnect-priority -999 \
    802-11-wireless-security.key-mgmt wpa-psk \
    802-11-wireless-security.psk "${HOTSPOT_PASSWORD}"

# Verify the PSK actually took - a silently-unjoinable hotspot is the whole bug.
ACTUAL_PSK=$(nmcli -s -g 802-11-wireless-security.psk connection show "Rooted-Robotics-Setup" 2>/dev/null)
if [ "$ACTUAL_PSK" = "$HOTSPOT_PASSWORD" ]; then
    echo "✓ Hotspot configured with the known password (priority: -999, only activates if no WiFi available)"
else
    echo "✗ Hotspot password did NOT take (got '${ACTUAL_PSK:-<empty>}')."
    echo "  The hotspot would be unjoinable. Fix before shipping this machine."
    exit 1
fi

echo ""

echo "Step 4: Setting up iptables..."

# Clear existing rules
iptables -t nat -F
iptables -F

# Redirect HTTP/HTTPS to captive portal
iptables -t nat -A PREROUTING -i ${HOTSPOT_INTERFACE} -p tcp --dport 80 -j DNAT --to-destination ${HOTSPOT_IP}:${FLASK_PORT}
iptables -t nat -A PREROUTING -i ${HOTSPOT_INTERFACE} -p tcp --dport 443 -j REDIRECT --to-port 80

# Allow DNS
iptables -A INPUT -i ${HOTSPOT_INTERFACE} -p udp --dport 53 -j ACCEPT

# Allow DHCP
iptables -A INPUT -i ${HOTSPOT_INTERFACE} -p udp --dport 67 -j ACCEPT

# Allow forwarding
iptables -A FORWARD -i ${HOTSPOT_INTERFACE} -j ACCEPT

echo "✓ iptables configured"
echo ""

echo "Step 5: Making iptables persistent..."
# iptables-persistent is installed by deploy-to-pi-one.sh (while the Pi still
# has internet). This script runs offline, so only verify it's present.
if ! dpkg -s iptables-persistent >/dev/null 2>&1; then
    echo "⚠ ERROR: iptables-persistent is not installed and the Pi is offline."
    echo "  Run deploy-to-pi-one.sh first (it installs all apt packages)."
    exit 1
fi
iptables-save > /etc/iptables/rules.v4
echo "✓ iptables rules saved"
echo ""

echo "Step 6: Creating Flask service..."
cat > /etc/systemd/system/captive-portal.service <<EOF
[Unit]
Description=Captive Portal Flask App
After=network.target NetworkManager.service
Wants=NetworkManager.service

[Service]
Type=simple
User=root
WorkingDirectory=/opt/captive-portal
ExecStart=/usr/bin/python3 /opt/captive-portal/captive_portal.py
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
echo "✓ Flask service created"
echo ""

echo "Step 7: Setting up clock sync on WiFi connect..."
# The Pi has no real-time clock, so its clock is wrong on every boot. AWS IoT
# uses TLS mutual auth, which fails the cert time-window check if the clock is
# off - so the IoT/Vector services can't connect until NTP corrects the clock.
# Force an immediate resync the moment wlan0 comes up (NetworkManager-managed),
# and make time-sync.target actually block until the clock is set so the
# IoT/Vector units (After=time-sync.target) connect on the first try.
cat > /etc/NetworkManager/dispatcher.d/50-timesync <<'DISPATCH'
#!/bin/bash
# Force NTP resync as soon as wlan0 comes up (Pi has no RTC)
interface="$1"
action="$2"
if [ "$interface" = "wlan0" ] && [ "$action" = "up" ]; then
    timedatectl set-ntp true
    systemctl restart systemd-timesyncd
fi
DISPATCH
chown root:root /etc/NetworkManager/dispatcher.d/50-timesync
chmod 755 /etc/NetworkManager/dispatcher.d/50-timesync

# Make time-sync.target wait for an actual sync (not enabled by default)
systemctl enable systemd-time-wait-sync.service >/dev/null 2>&1 || true
echo "✓ Clock sync on WiFi connect configured"
echo ""

echo "======================================"
echo "  Setup Complete!"
echo "======================================"
echo ""

echo "Configuration Summary:"
echo "---------------------"
echo "• Hotspot Interface: ${HOTSPOT_INTERFACE}"
echo "• Captive Portal IP: ${HOTSPOT_IP}"
echo "• Flask Port: ${FLASK_PORT}"
echo "• DNS Config: /etc/NetworkManager/dnsmasq-shared.d/99-captive-portal.conf"
echo ""

echo "Next Steps:"
echo "-----------"
echo "1. Create your Flask app at: /opt/captive-portal/captive_portal.py"
echo " By default, a sample app is already present."
echo ""
echo "2. Restart NetworkManager:"
echo "   sudo systemctl restart NetworkManager"
echo ""
echo "3. Start hotspot:"
echo "   sudo nmcli connection up Rooted-Robotics-Setup"
echo ""
echo "4. Enable and start captive portal:"
echo "   sudo systemctl enable captive-portal"
echo "   sudo systemctl start captive-portal"
echo ""

echo "Testing:"
echo "--------"
echo "• Check dnsmasq is running:"
echo "  ps aux | grep dnsmasq"
echo ""
echo "• Test DNS hijacking (when in AP mode):"
echo "  dig @${HOTSPOT_IP} google.com"
echo "  (should return ${HOTSPOT_IP})"
echo ""
echo "• Check dnsmasq logs:"
echo "  sudo tail -f /var/log/dnsmasq-captive.log"
echo ""
echo "• Test Flask app locally:"
echo "  curl http://${HOTSPOT_IP}"
echo ""
echo "• Check Flask logs:"
echo "  sudo journalctl -u captive-portal -f"
echo ""

echo "Client Testing:"
echo "---------------"
echo "1. Connect phone/laptop to 'Rooted-Robotics-Setup' WiFi (password: ${HOTSPOT_PASSWORD})"
echo "2. Captive portal should pop up automatically"
echo "3. If not, browse to: http://google.com"
echo ""

echo "✅ Setup complete! DNS config is now in the correct directory."
echo ""