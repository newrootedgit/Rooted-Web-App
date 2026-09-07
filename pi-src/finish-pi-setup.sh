#!/bin/bash
# Finish a Pi setup that aborted partway through deploy-to-pi-two.sh.
#
# Use this when deploy-to-pi-two.sh already provisioned AWS IoT and copied the
# certs to the Pi, but then died at the NetworkManager step (e.g. the netplan
# 'ip addr flush wlan0' failure). Because the remote block runs under `set -e`,
# an abort there skips the captive portal, Bluetooth, systemd install, and -
# critically - enabling/starting rooted-iot and rooted-vector.
#
# This script re-runs ONLY those remaining on-Pi steps. It does NOT re-provision
# AWS IoT: it reuses the certs and device identity already on the Pi, so the
# machine keeps the same device_id / Thing you already created.
#
# It also pushes the up-to-date setup-nm.sh from this repo to the Pi first, so
# the netplan fix is applied. Runs over the ethernet link (Pi offline).

set -e

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; BLUE='\033[0;34m'; NC='\033[0m'

DEFAULT_HOSTNAME="192.168.10.1"
DEFAULT_USERNAME="ubuntu"
REMOTE_DIR="/opt/rooted-ble"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}  Rooted Robotics - Finish Pi Setup         ${NC}"
echo -e "${BLUE}============================================${NC}"
echo ""

# --- Collect Pi credentials --------------------------------------------------
read -p "Enter the Raspberry Pi IP (default: ${DEFAULT_HOSTNAME}): " PI_HOST
PI_HOST=${PI_HOST:-$DEFAULT_HOSTNAME}

echo "Testing connectivity to ${PI_HOST}..."
if ! ping -c 2 "$PI_HOST" > /dev/null 2>&1; then
    echo -e "${RED}Unable to reach ${PI_HOST}. Check the ethernet connection.${NC}"; exit 1
fi
echo -e "${GREEN}Connection successful${NC}"

read -p "Enter the Raspberry Pi login username (default: ${DEFAULT_USERNAME}): " PI_USER
PI_USER=${PI_USER:-$DEFAULT_USERNAME}
read -s -p "Enter the SSH password for ${PI_USER}@${PI_HOST}: " SSH_PASSWORD; echo ""

# --- Verify SSH --------------------------------------------------------------
if ! sshpass -p "${SSH_PASSWORD}" ssh -o StrictHostKeyChecking=no -o ConnectTimeout=10 \
    -o NumberOfPasswordPrompts=1 "${PI_USER}@${PI_HOST}" "true" 2>/dev/null; then
    echo -e "${RED}SSH login failed (wrong username or password).${NC}"; exit 1
fi
echo -e "${GREEN}SSH login OK${NC}"

# --- Verify the IoT half already happened (certs + endpoint present) ---------
echo ""
echo "Checking that AWS IoT certs are already on the Pi..."
if ! sshpass -p "${SSH_PASSWORD}" ssh -o StrictHostKeyChecking=no "${PI_USER}@${PI_HOST}" \
    "[ -f ${REMOTE_DIR}/certs/certificate.pem.crt ] && [ -f ${REMOTE_DIR}/certs/private.pem.key ] && [ -f ${REMOTE_DIR}/certs/AmazonRootCA1.pem ] && [ -f ${REMOTE_DIR}/device_config.json ]"; then
    echo -e "${RED}The Pi is missing certs or device_config.json.${NC}"
    echo "That means IoT provisioning did NOT complete. Run deploy-to-pi-two.sh instead."
    exit 1
fi

# --- Read the device identity + endpoint off the Pi --------------------------
DEVICE_JSON=$(sshpass -p "${SSH_PASSWORD}" ssh -o StrictHostKeyChecking=no \
    "${PI_USER}@${PI_HOST}" "cat ${REMOTE_DIR}/device_config.json")
DEVICE_UUID=$(echo "$DEVICE_JSON"  | python3 -c "import sys,json;print(json.load(sys.stdin)['device_id'])")
MACHINE_NAME=$(echo "$DEVICE_JSON" | python3 -c "import sys,json;print(json.load(sys.stdin).get('device_name',''))")
IOT_ENDPOINT=$(echo "$DEVICE_JSON" | python3 -c "import sys,json;print(json.load(sys.stdin).get('aws_iot_endpoint',''))")

if [ -z "$DEVICE_UUID" ] || [ -z "$IOT_ENDPOINT" ]; then
    echo -e "${RED}device_config.json is missing device_id or aws_iot_endpoint.${NC}"
    echo "Run deploy-to-pi-two.sh to (re)provision IoT."; exit 1
fi
echo -e "${GREEN}Found existing device:${NC}"
echo "  Device Name:  ${MACHINE_NAME}"
echo "  Device ID:    ${DEVICE_UUID}"
echo "  IoT Endpoint: ${IOT_ENDPOINT}"

# --- Push the up-to-date setup-nm.sh (contains the netplan fix) ---------------
echo ""
echo "Updating setup-nm.sh on the Pi (netplan fix)..."
sshpass -p "${SSH_PASSWORD}" scp -o StrictHostKeyChecking=no \
    "${SCRIPT_DIR}/setup-scripts/setup-nm.sh" \
    "${PI_USER}@${PI_HOST}:${REMOTE_DIR}/setup-scripts/setup-nm.sh"

# --- Run the remaining on-Pi steps (mirrors deploy-to-pi-two.sh STEP 7) ------
echo ""
echo "Running remaining setup on the Pi..."
sshpass -p "${SSH_PASSWORD}" ssh -o StrictHostKeyChecking=no "${PI_USER}@${PI_HOST}" << REMOTE_SCRIPT
set -e
REMOTE_DIR="${REMOTE_DIR}"

echo "  Configuring NetworkManager (Pi will drop off WiFi - this is expected)..."
echo "${SSH_PASSWORD}" | sudo -S bash \${REMOTE_DIR}/setup-scripts/setup-nm.sh

echo "  Setting up captive portal..."
echo "${SSH_PASSWORD}" | sudo -S bash /opt/rootedpi/wifi-setup/setup-captive-portal.sh
echo "${SSH_PASSWORD}" | sudo -S systemctl enable captive-portal.service
echo "${SSH_PASSWORD}" | sudo -S systemctl restart captive-portal.service

echo "  Setting Bluetooth adapter name to '${MACHINE_NAME}'..."
if [ ! -f /etc/bluetooth/main.conf ]; then
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
    echo "${SSH_PASSWORD}" | sudo -S sed -i "s/^#Name = .*/Name = ${MACHINE_NAME}/" /etc/bluetooth/main.conf
    echo "${SSH_PASSWORD}" | sudo -S sed -i "s/^Name = .*/Name = ${MACHINE_NAME}/" /etc/bluetooth/main.conf
    if ! grep -q "^Name = " /etc/bluetooth/main.conf; then
        echo "${SSH_PASSWORD}" | sudo -S sed -i '/^\[General\]/a Name = ${MACHINE_NAME}' /etc/bluetooth/main.conf
    fi
fi
echo "${SSH_PASSWORD}" | sudo -S bash -c "echo 'PRETTY_HOSTNAME=${MACHINE_NAME}' > /etc/machine-info"
echo "${SSH_PASSWORD}" | sudo -S systemctl restart bluetooth

echo "  Fixing preset file permissions..."
echo "${SSH_PASSWORD}" | sudo -S mkdir -p /home/rooted/te-cli
echo "${SSH_PASSWORD}" | sudo -S chown -R ${PI_USER}:${PI_USER} /home/rooted/te-cli
if [ -f /home/rooted/te-cli/TE_Variable_Values.json.lock ]; then
    echo "${SSH_PASSWORD}" | sudo -S rm -f /home/rooted/te-cli/TE_Variable_Values.json.lock
fi

echo "  Installing systemd service files..."
echo "${SSH_PASSWORD}" | sudo -S cp \${REMOTE_DIR}/rooted-ble.service /etc/systemd/system/
echo "${SSH_PASSWORD}" | sudo -S cp \${REMOTE_DIR}/rooted-ble.timer /etc/systemd/system/
[ -f "\${REMOTE_DIR}/rooted-iot.service" ]    && echo "${SSH_PASSWORD}" | sudo -S cp \${REMOTE_DIR}/rooted-iot.service /etc/systemd/system/
[ -f "\${REMOTE_DIR}/rooted-ingest.service" ] && echo "${SSH_PASSWORD}" | sudo -S cp \${REMOTE_DIR}/rooted-ingest.service /etc/systemd/system/
echo "${SSH_PASSWORD}" | sudo -S cp \${REMOTE_DIR}/vector/rooted-vector.service /etc/systemd/system/

echo "  Writing /etc/default/vector..."
echo "${SSH_PASSWORD}" | sudo -S tee /etc/default/vector > /dev/null << VECTORENV
ROOTED_DEVICE_ID=${DEVICE_UUID}
AWS_IOT_ENDPOINT=${IOT_ENDPOINT}
VECTORENV

# Our Vector build (musl) does NOT interpolate \${VAR} env vars in its config, so
# bake the device ID and IoT endpoint into the config directly at deploy time.
echo "  Rendering Vector config..."
echo "${SSH_PASSWORD}" | sudo -S sed -i "s|@@AWS_IOT_ENDPOINT@@|${IOT_ENDPOINT}|g; s|@@ROOTED_DEVICE_ID@@|${DEVICE_UUID}|g" \${REMOTE_DIR}/vector/rooted-telemetry.toml

echo "  Reloading systemd..."
echo "${SSH_PASSWORD}" | sudo -S systemctl daemon-reload

echo "  Enabling + starting BLE timer..."
echo "${SSH_PASSWORD}" | sudo -S systemctl enable rooted-ble.timer
echo "${SSH_PASSWORD}" | sudo -S systemctl start rooted-ble.timer

if [ -f "\${REMOTE_DIR}/certs/certificate.pem.crt" ]; then
    echo "  Enabling + starting AWS IoT service..."
    echo "${SSH_PASSWORD}" | sudo -S systemctl enable rooted-iot.service
    echo "${SSH_PASSWORD}" | sudo -S systemctl restart rooted-iot.service
fi

if [ -f /etc/systemd/system/rooted-ingest.service ]; then
    echo "  Enabling + starting telemetry ingest service..."
    echo "${SSH_PASSWORD}" | sudo -S systemctl enable rooted-ingest.service
    echo "${SSH_PASSWORD}" | sudo -S systemctl restart rooted-ingest.service
fi

if [ -f "\${REMOTE_DIR}/certs/certificate.pem.crt" ] && [ -n "${IOT_ENDPOINT}" ]; then
    echo "  Enabling + starting Vector service..."
    # Vector's data_dir must exist before start or it errors with status 78.
    echo "${SSH_PASSWORD}" | sudo -S mkdir -p /var/lib/vector
    echo "${SSH_PASSWORD}" | sudo -S systemctl enable rooted-vector.service
    echo "${SSH_PASSWORD}" | sudo -S systemctl restart rooted-vector.service
fi

sleep 3
echo ""
echo "  --- rooted-iot.service ---"
echo "${SSH_PASSWORD}" | sudo -S systemctl --no-pager --lines=0 status rooted-iot.service || true
echo "  --- rooted-vector.service ---"
echo "${SSH_PASSWORD}" | sudo -S systemctl --no-pager --lines=0 status rooted-vector.service || true
echo "  Setup complete!"
REMOTE_SCRIPT

echo ""
echo -e "${GREEN}=========================================${NC}"
echo -e "${GREEN}  Finish Complete                        ${NC}"
echo -e "${GREEN}=========================================${NC}"
echo "  Machine Name: ${MACHINE_NAME}"
echo "  Device ID:    ${DEVICE_UUID}"
echo "  IoT Endpoint: ${IOT_ENDPOINT}"
echo ""
echo "Watch the connection come up:"
echo "  ssh ${PI_USER}@${PI_HOST} 'sudo journalctl -u rooted-iot -f'"
echo "  ssh ${PI_USER}@${PI_HOST} 'sudo journalctl -u rooted-vector -f'"
echo ""
echo "You can now disconnect the ethernet cable."
