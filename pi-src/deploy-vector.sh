#!/bin/bash
# Deploy Vector telemetry pipeline + ingest service to a Raspberry Pi
#
# Deploys:
#   - telemetry_ingest.py  (UDP listener: ClearCore CSV → JSONL)
#   - rooted-ingest.service (systemd unit for the above)
#   - rooted-telemetry.toml (Vector config: JSONL → MQTT to AWS IoT)
#   - rooted-vector.service (systemd unit for Vector)

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEFAULT_HOSTNAME="192.168.10.1"
DEFAULT_USERNAME="rooted"
REMOTE_DIR="/opt/rooted-ble"

# Helper: run a command on the Pi via SSH (no heredoc, no stdin conflicts)
run_ssh() {
    sshpass -p "$SSH_PASSWORD" ssh -o StrictHostKeyChecking=no "${PI_USER}@${PI_HOST}" "$1"
}

echo -e "${BLUE}================================================${NC}"
echo -e "${BLUE}  Rooted - Deploy Vector Telemetry Pipeline      ${NC}"
echo -e "${BLUE}================================================${NC}"
echo ""

# ─── Connection info ─────────────────────────────────────────────────

read -p "Raspberry Pi IP (default: ${DEFAULT_HOSTNAME}): " PI_HOST
PI_HOST=${PI_HOST:-$DEFAULT_HOSTNAME}

read -p "SSH username (default: ${DEFAULT_USERNAME}): " PI_USER
PI_USER=${PI_USER:-$DEFAULT_USERNAME}

read -s -p "SSH password for ${PI_USER}@${PI_HOST}: " SSH_PASSWORD
echo ""

# Check sshpass
if ! command -v sshpass &> /dev/null; then
    echo -e "${RED}Error: sshpass is not installed${NC}"
    echo "Install with: brew install hudochenkov/sshpass/sshpass"
    exit 1
fi

# ─── Device / IoT info ──────────────────────────────────────────────

echo ""
read -p "Device ID (UUID): " DEVICE_ID
if [ -z "$DEVICE_ID" ]; then
    echo -e "${RED}Device ID is required.${NC}"
    exit 1
fi

read -p "AWS IoT Endpoint (e.g. xxxxxx-ats.iot.us-west-2.amazonaws.com): " IOT_ENDPOINT
if [ -z "$IOT_ENDPOINT" ]; then
    echo -e "${RED}AWS IoT Endpoint is required.${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}[1/5] Copying ingest script + Vector config...${NC}"

# Ensure directories exist
run_ssh "mkdir -p ${REMOTE_DIR}/aws ${REMOTE_DIR}/vector"

# Copy telemetry ingest script
sshpass -p "$SSH_PASSWORD" scp -o StrictHostKeyChecking=no \
    "${SCRIPT_DIR}/aws/telemetry_ingest.py" \
    "${PI_USER}@${PI_HOST}:${REMOTE_DIR}/aws/"

# Copy Vector config + service files
sshpass -p "$SSH_PASSWORD" scp -o StrictHostKeyChecking=no \
    "${SCRIPT_DIR}/vector/rooted-telemetry.toml" \
    "${SCRIPT_DIR}/vector/rooted-vector.service" \
    "${PI_USER}@${PI_HOST}:${REMOTE_DIR}/vector/"

echo -e "${GREEN}[2/5] Copying systemd service files...${NC}"

sshpass -p "$SSH_PASSWORD" scp -o StrictHostKeyChecking=no \
    "${SCRIPT_DIR}/rooted-ingest.service" \
    "${PI_USER}@${PI_HOST}:/tmp/"

echo -e "${GREEN}[3/5] Installing Vector (if needed)...${NC}"

run_ssh "export PATH=\$HOME/.vector/bin:\$PATH && \
if ! command -v vector &> /dev/null; then \
    echo '  Installing Vector...' && \
    curl --proto '=https' --tlsv1.2 -sSfL https://sh.vector.dev | bash -s -- -y; \
else \
    echo \"  Vector already installed: \$(vector --version)\"; \
fi"

echo -e "${GREEN}[4/5] Configuring services...${NC}"

# Write /etc/default/vector with device ID and IoT endpoint
run_ssh "echo '${SSH_PASSWORD}' | sudo -S bash -c 'cat > /etc/default/vector << EOF
ROOTED_DEVICE_ID=${DEVICE_ID}
AWS_IOT_ENDPOINT=${IOT_ENDPOINT}
EOF'"

# Find the actual vector binary path
VECTOR_BIN=$(run_ssh "export PATH=\$HOME/.vector/bin:\$PATH && command -v vector")
VECTOR_BIN=$(echo "$VECTOR_BIN" | tr -d '\r\n')
echo "  Vector binary: ${VECTOR_BIN}"

# Patch vector service file with actual binary path and install
run_ssh "sed 's|/usr/bin/vector|${VECTOR_BIN}|g' ${REMOTE_DIR}/vector/rooted-vector.service > /tmp/rooted-vector.service"

# Install service files
run_ssh "echo '${SSH_PASSWORD}' | sudo -S mv /tmp/rooted-ingest.service /etc/systemd/system/"
run_ssh "echo '${SSH_PASSWORD}' | sudo -S mv /tmp/rooted-vector.service /etc/systemd/system/"

# Reload, enable, start
run_ssh "echo '${SSH_PASSWORD}' | sudo -S systemctl daemon-reload"
run_ssh "echo '${SSH_PASSWORD}' | sudo -S systemctl enable rooted-ingest.service"
run_ssh "echo '${SSH_PASSWORD}' | sudo -S systemctl enable rooted-vector.service"

echo "  Starting services..."
run_ssh "echo '${SSH_PASSWORD}' | sudo -S systemctl restart rooted-ingest.service"
run_ssh "echo '${SSH_PASSWORD}' | sudo -S systemctl restart rooted-vector.service"

echo -e "${GREEN}[5/5] Verifying services...${NC}"
echo ""
echo "=== Service Status ==="
echo ""
echo -n "rooted-ingest (UDP → JSONL):  "
run_ssh "echo '${SSH_PASSWORD}' | sudo -S systemctl is-active rooted-ingest.service" || true
echo -n "rooted-vector (JSONL → MQTT): "
run_ssh "echo '${SSH_PASSWORD}' | sudo -S systemctl is-active rooted-vector.service" || true
echo ""
echo "Recent ingest logs:"
run_ssh "echo '${SSH_PASSWORD}' | sudo -S journalctl -u rooted-ingest --no-pager -n 5 2>/dev/null" || true

echo ""
echo -e "${GREEN}================================================${NC}"
echo -e "${GREEN}  Deployment complete!                          ${NC}"
echo -e "${GREEN}================================================${NC}"
echo ""
echo "  Device ID:    ${DEVICE_ID}"
echo "  IoT Endpoint: ${IOT_ENDPOINT}"
echo ""
echo "Services:"
echo "  - rooted-ingest.service  : ClearCore UDP → JSONL"
echo "  - rooted-vector.service  : JSONL → AWS IoT MQTT"
echo ""
echo "Useful commands:"
echo "  sudo journalctl -u rooted-ingest -f    # Watch ingest logs"
echo "  sudo journalctl -u rooted-vector -f    # Watch Vector logs"
echo "  tail -f /home/rooted/telemetry_log.jsonl  # Raw JSONL"
echo ""
