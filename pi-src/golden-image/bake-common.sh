#!/bin/bash
# =============================================================================
# Rooted Robotics - bake the COMMON configuration into a reference Pi
# =============================================================================
# Run ONCE, on the reference Pi you are about to capture as a golden image.
#
# This is the half of deploy-to-pi-two.sh that is IDENTICAL on every machine:
#
#     setup-nm.sh                  NetworkManager takes wlan0
#     setup-captive-portal.sh      hotspot + dnsmasq + iptables
#     systemd unit FILES           installed to /etc/systemd/system
#     captive-portal, rooted-ble.timer, rooted-ingest    enabled
#     /home/rooted/te-cli, /var/lib/vector                created
#     rooted-telemetry.toml.template                      staged pristine
#
# It deliberately does NOT do anything device-specific - no machine name, no
# UUID, no AWS IoT certs, no Vector render. Those are personalize-pi.sh's job
# and must not end up in the image.
#
# rooted-iot and rooted-vector are installed but NOT enabled: without
# certificates they would crash-loop on every boot of every machine flashed
# from this image. personalize-pi.sh enables them once certs exist.
#
# PREREQUISITE: deploy-to-pi-one.sh has already run (files + venv + Vector).
#
# CONNECTION: run this over the ETHERNET CABLE at 192.168.10.1. setup-nm.sh
# restarts NetworkManager and drops wlan0, so a WiFi session dies part-way
# through - the same reason the original flow split into two scripts here.
#
# Usage:
#   ./bake-common.sh                       # prompts for host
#   ./bake-common.sh --host 192.168.10.1
# =============================================================================

set -uo pipefail

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; BLUE='\033[0;34m'; NC='\033[0m'
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PI_SRC="$(cd "${SCRIPT_DIR}/.." && pwd)"
REMOTE_DIR="/opt/rooted-ble"
PORTAL_DIR="/opt/rootedpi"

PI_HOST="192.168.10.1"; PI_USER="rooted"

while [[ $# -gt 0 ]]; do
    case "$1" in
        --host) PI_HOST="$2"; shift 2 ;;
        --user) PI_USER="$2"; shift 2 ;;
        -h|--help) sed -n '2,36p' "${BASH_SOURCE[0]}"; exit 0 ;;
        *) echo -e "${RED}Unknown option: $1${NC}"; exit 1 ;;
    esac
done

echo -e "${BLUE}===============================================${NC}"
echo -e "${BLUE}  Bake COMMON config into the reference Pi     ${NC}"
echo -e "${BLUE}===============================================${NC}"
echo ""

# --- connection --------------------------------------------------------------
SSH_OPTS=(-o StrictHostKeyChecking=accept-new -o ConnectTimeout=10)
USE_PASSWORD="false"; SSH_PASSWORD=""

echo "Connecting to ${PI_USER}@${PI_HOST}..."
if ssh "${SSH_OPTS[@]}" -o BatchMode=yes "${PI_USER}@${PI_HOST}" true 2>/dev/null; then
    echo -e "${GREEN}Connected (SSH key)${NC}"
else
    command -v sshpass >/dev/null || { echo -e "${RED}Key auth failed and sshpass missing.${NC}"; exit 1; }
    read -s -p "SSH password for ${PI_USER}@${PI_HOST}: " SSH_PASSWORD; echo ""
    sshpass -p "$SSH_PASSWORD" ssh "${SSH_OPTS[@]}" -o NumberOfPasswordPrompts=1 \
        "${PI_USER}@${PI_HOST}" true 2>/dev/null || { echo -e "${RED}SSH login failed.${NC}"; exit 1; }
    USE_PASSWORD="true"; echo -e "${GREEN}Connected (password)${NC}"
fi

sshx() { if [ "$USE_PASSWORD" = "true" ]; then sshpass -p "$SSH_PASSWORD" ssh "${SSH_OPTS[@]}" "${PI_USER}@${PI_HOST}" "$@";
         else ssh "${SSH_OPTS[@]}" "${PI_USER}@${PI_HOST}" "$@"; fi }
scpx() { if [ "$USE_PASSWORD" = "true" ]; then sshpass -p "$SSH_PASSWORD" scp "${SSH_OPTS[@]}" "$@";
         else scp "${SSH_OPTS[@]}" "$@"; fi }

# Password goes to sudo on STDIN, never interpolated into the remote command -
# so it cannot leak into remote history, `ps`, or logs, and special characters
# cannot break quoting.
NOPASSWD_SUDO="false"
sshx "sudo -n true" >/dev/null 2>&1 && NOPASSWD_SUDO="true"
sudox() {
    if [ "$NOPASSWD_SUDO" = "true" ]; then sshx "sudo $*"
    else printf '%s\n' "$SSH_PASSWORD" | sshx "sudo -S -p '' $*"; fi
}

stage() { echo ""; echo -e "${BLUE}=== $1 ===${NC}"; }
ok()    { echo -e "  ${GREEN}ok${NC} $1"; }
warn()  { echo -e "  ${YELLOW}!${NC}  $1"; }
die()   { echo -e "  ${RED}FAILED${NC} $1"; exit 1; }

# -----------------------------------------------------------------------------
stage "Preflight"
# -----------------------------------------------------------------------------
sudox "true" >/dev/null 2>&1 || die "sudo does not work for ${PI_USER}"
ok "sudo works"

sshx "[ -x ${REMOTE_DIR}/.venv/bin/python3 ] && [ -x /home/rooted/.vector/bin/vector ] && [ -f ${REMOTE_DIR}/setup-scripts/setup-nm.sh ] && [ -d ${PORTAL_DIR}/wifi-setup ]" 2>/dev/null \
    || die "deploy-to-pi-one.sh has not run (missing venv, Vector, or setup scripts)"
ok "deploy-to-pi-one.sh artifacts present"

# Warn if this session will be killed by setup-nm.sh. $SSH_CONNECTION's third
# field is this session's server-side address; whichever interface owns it is
# the one we are actually riding on.
SESSION_IP=$(sshx 'echo $SSH_CONNECTION' 2>/dev/null | awk '{print $3}' | tr -d '\r')
SESSION_IFACE=$(sshx "ip -o -4 addr show | grep -w ${SESSION_IP} | head -1 | awk '{print \$2}'" 2>/dev/null | tr -d '\r')
ok "session arrives on ${SESSION_IFACE:-unknown} (${SESSION_IP:-?})"
if [ "$SESSION_IFACE" = "wlan0" ]; then
    warn "You are on WiFi. setup-nm.sh restarts NetworkManager and will drop this"
    warn "session mid-run. Connect the ethernet cable and use --host 192.168.10.1."
    read -p "  Continue anyway? [y/N]: " C
    [[ "$C" =~ ^[Yy]$ ]] || exit 0
fi

# -----------------------------------------------------------------------------
stage "Staging the pristine Vector config template"
# -----------------------------------------------------------------------------
# The image must carry an UNRENDERED template. deploy-to-pi-two.sh sed's the
# live .toml in place, which is only correct the first time - a second run finds
# no @@PLACEHOLDER@@ tokens and silently leaves the previous device id in place.
# personalize-pi.sh always renders from this template instead.
scpx "${PI_SRC}/vector/rooted-telemetry.toml" \
     "${PI_USER}@${PI_HOST}:${REMOTE_DIR}/vector/rooted-telemetry.toml.template" >/dev/null \
    || die "copying rooted-telemetry.toml.template"
sshx "grep -q '@@ROOTED_DEVICE_ID@@' ${REMOTE_DIR}/vector/rooted-telemetry.toml.template" 2>/dev/null \
    || die "template has no @@ROOTED_DEVICE_ID@@ placeholder - wrong file?"
ok "rooted-telemetry.toml.template staged (placeholders intact)"

# Any already-rendered config is device-specific and must not reach the image.
sudox "rm -f ${REMOTE_DIR}/vector/rooted-telemetry.toml /etc/default/vector"
ok "removed any rendered Vector config"

# -----------------------------------------------------------------------------
stage "Directories and permissions"
# -----------------------------------------------------------------------------
sudox "mkdir -p ${REMOTE_DIR}/certs ${REMOTE_DIR}/vector /home/rooted/te-cli /var/lib/vector"
sudox "chown -R ${PI_USER}:${PI_USER} ${REMOTE_DIR} ${PORTAL_DIR} /home/rooted/te-cli"
sudox "rm -f /home/rooted/te-cli/TE_Variable_Values.json.lock"
ok "directories, ownership, /var/lib/vector"

# -----------------------------------------------------------------------------
stage "NetworkManager handover (wlan0)"
# -----------------------------------------------------------------------------
if sshx "[ -f /etc/NetworkManager/conf.d/20-manage-wlan0.conf ]" 2>/dev/null; then
    ok "already applied - skipping"
else
    sudox "bash ${REMOTE_DIR}/setup-scripts/setup-nm.sh" || die "setup-nm.sh"
    ok "wlan0 handed to NetworkManager"
fi

# -----------------------------------------------------------------------------
stage "Captive portal"
# -----------------------------------------------------------------------------
sudox "bash ${PORTAL_DIR}/wifi-setup/setup-captive-portal.sh" || die "setup-captive-portal.sh"
sudox "systemctl enable captive-portal.service" >/dev/null 2>&1
ok "captive portal installed and enabled"

# -----------------------------------------------------------------------------
stage "systemd units"
# -----------------------------------------------------------------------------
for u in rooted-ble.service rooted-ble.timer rooted-iot.service rooted-ingest.service; do
    sshx "[ -f ${REMOTE_DIR}/${u} ]" 2>/dev/null && { sudox "cp ${REMOTE_DIR}/${u} /etc/systemd/system/"; ok "installed ${u}"; }
done
sudox "cp ${REMOTE_DIR}/vector/rooted-vector.service /etc/systemd/system/" && ok "installed rooted-vector.service"
sudox "systemctl daemon-reload"

# Enable only what works without a device identity. rooted-iot and
# rooted-vector need certificates; enabling them here would make every machine
# flashed from this image crash-loop from first boot until personalized.
sudox "systemctl enable rooted-ble.timer rooted-ingest.service" >/dev/null 2>&1
ok "enabled rooted-ble.timer, rooted-ingest.service"
sudox "systemctl disable rooted-iot.service rooted-vector.service" >/dev/null 2>&1
ok "left rooted-iot + rooted-vector DISABLED (no certs until personalization)"

echo ""
echo -e "${GREEN}===============================================${NC}"
echo -e "${GREEN}  Common config baked                          ${NC}"
echo -e "${GREEN}===============================================${NC}"
echo ""
echo "This Pi now holds everything that is identical across the fleet."
echo ""
echo -e "${YELLOW}Next:${NC}"
echo "  1. Sanity-check it:      ../verify-pi.sh --host ${PI_HOST}"
echo "     Expect FAILs for device identity, certs and Vector - correct at this"
echo "     stage, because none of that exists yet by design."
echo "  2. De-personalize and capture:   ./build-golden-image.sh"
echo ""
echo "Do NOT run personalize-pi.sh on this Pi before capturing - it would bake a"
echo "device identity into the image and every machine would share it."
