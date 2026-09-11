#!/bin/bash
# =============================================================================
# Rooted Robotics - make a Pi's SSH and update behaviour deterministic
# =============================================================================
# Run once on the reference Pi before capturing the golden image, so every
# machine inherits it. Safe and idempotent to re-run on an existing machine.
#
# WHY. On 2026-09-08 at 17:47 unattended-upgrades upgraded openssh-server from
# 1:9.6p1-3ubuntu13.14 to ...13.19 on the reference build. At 18:53 the journal
# shows:
#     sshd[105119]: Received signal 15; terminating.
#     systemd[1]: Stopping ssh.service - OpenBSD Secure Shell server...
#     systemd[1]: Stopped ssh.service
# and nothing ever started it again. Ubuntu 24.04 migrates sshd to socket
# activation during that upgrade, and the migration left this machine with
# NEITHER ssh.service nor ssh.socket listening - so port 22 was refused, a
# reboot did not fix it, and the board was only recoverable by rewriting the
# boot partition over rpiboot.
#
# On a machine in a customer's facility with no HDMI, that is an unrecoverable
# failure requiring a site visit. This script removes both halves of the cause:
#
#   1. openssh and the kernel are held back from UNATTENDED upgrades. Security
#      updates still matter - apply them deliberately, not at 17:47 on a Tuesday
#      to a harvester that is mid-run.
#   2. sshd runs as a plain always-listening service, with socket activation
#      disabled. Socket activation is what broke here and buys a headless
#      machine nothing.
# =============================================================================

set -uo pipefail

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; BLUE='\033[0;34m'; NC='\033[0m'
PI_HOST="192.168.10.1"; PI_USER="rooted"

while [[ $# -gt 0 ]]; do
    case "$1" in
        --host) PI_HOST="$2"; shift 2 ;;
        --user) PI_USER="$2"; shift 2 ;;
        -h|--help) sed -n '2,34p' "${BASH_SOURCE[0]}"; exit 0 ;;
        *) echo -e "${RED}Unknown option: $1${NC}"; exit 1 ;;
    esac
done

SSH_OPTS=(-o StrictHostKeyChecking=accept-new -o ConnectTimeout=10)
USE_PASSWORD="false"; SSH_PASSWORD=""

echo -e "${BLUE}===============================================${NC}"
echo -e "${BLUE}  Harden SSH + update behaviour                ${NC}"
echo -e "${BLUE}===============================================${NC}"
echo ""
echo "Connecting to ${PI_USER}@${PI_HOST}..."
if ssh "${SSH_OPTS[@]}" -o BatchMode=yes "${PI_USER}@${PI_HOST}" true 2>/dev/null; then
    echo -e "${GREEN}Connected (SSH key)${NC}"
else
    command -v sshpass >/dev/null || { echo -e "${RED}Key auth failed and sshpass missing.${NC}"; exit 1; }
    read -s -p "SSH password: " SSH_PASSWORD; echo ""
    USE_PASSWORD="true"
fi
sshx() { if [ "$USE_PASSWORD" = "true" ]; then sshpass -p "$SSH_PASSWORD" ssh "${SSH_OPTS[@]}" "${PI_USER}@${PI_HOST}" "$@";
         else ssh "${SSH_OPTS[@]}" "${PI_USER}@${PI_HOST}" "$@"; fi }
NOPASSWD_SUDO="false"; sshx "sudo -n true" >/dev/null 2>&1 && NOPASSWD_SUDO="true"
sudox() { if [ "$NOPASSWD_SUDO" = "true" ]; then sshx "sudo $*";
          else printf '%s\n' "$SSH_PASSWORD" | sshx "sudo -S -p '' $*"; fi }

stage() { echo ""; echo -e "${BLUE}=== $1 ===${NC}"; }
ok()   { echo -e "  ${GREEN}ok${NC} $1"; }
warn() { echo -e "  ${YELLOW}!${NC}  $1"; }
die()  { echo -e "  ${RED}FAILED${NC} $1"; exit 1; }

sudox "true" >/dev/null 2>&1 || die "sudo does not work for ${PI_USER}"

# -----------------------------------------------------------------------------
stage "1. Hold openssh and the kernel back from unattended upgrades"
# -----------------------------------------------------------------------------
sudox "bash -c 'cat > /etc/apt/apt.conf.d/51rooted-unattended-blacklist <<EOF
// Rooted Robotics - see golden-image/harden-updates.sh
//
// An unattended openssh-server upgrade stopped ssh.service and left neither it
// nor ssh.socket listening, making the machine unreachable over SSH with no
// self-recovery. A kernel upgrade has the same character: it needs a reboot to
// take effect, and rebooting a harvester unattended is not acceptable.
//
// These are held from UNATTENDED upgrades only. Apply them deliberately with
//     sudo apt-get install --only-upgrade openssh-server
// during a maintenance window.
Unattended-Upgrade::Package-Blacklist {
    \"openssh-server\";
    \"openssh-client\";
    \"openssh-sftp-server\";
    \"linux-image-.*\";
    \"linux-headers-.*\";
    \"linux-raspi-.*\";
    \"linux-firmware\";
};

// Never reboot a machine on its own.
Unattended-Upgrade::Automatic-Reboot \"false\";
EOF'" || die "writing blacklist"
ok "wrote /etc/apt/apt.conf.d/51rooted-unattended-blacklist"

# apt's own parser is the only authority on whether this file is valid; a syntax
# error here would silently disable ALL unattended security updates.
if sshx "apt-config dump >/dev/null 2>&1" 2>/dev/null; then
    ok "apt config parses cleanly"
else
    die "apt config is invalid - check /etc/apt/apt.conf.d/51rooted-unattended-blacklist"
fi
BL=$(sshx "apt-config dump 2>/dev/null | grep -c 'Unattended-Upgrade::Package-Blacklist::'" 2>/dev/null | tr -d '\r')
ok "blacklist entries active: ${BL:-0}"
RB=$(sshx "apt-config dump 2>/dev/null | grep -i 'Automatic-Reboot ' | head -1" 2>/dev/null | tr -d '\r')
ok "${RB:-Automatic-Reboot not set}"

# -----------------------------------------------------------------------------
stage "2. Make sshd deterministic (always-listening service, no socket activation)"
# -----------------------------------------------------------------------------
# Socket activation is what broke: the upgrade stopped ssh.service and the
# socket never took over. A plain service either runs or fails visibly.
sudox "systemctl disable --now ssh.socket" >/dev/null 2>&1 || true
ok "ssh.socket disabled and stopped"
sudox "systemctl unmask ssh.service" >/dev/null 2>&1 || true
sudox "systemctl enable ssh.service" >/dev/null 2>&1 || die "enabling ssh.service"
sudox "systemctl restart ssh.service" >/dev/null 2>&1 || die "restarting ssh.service"
ok "ssh.service enabled and started"

# Handle a CRASH: bring sshd back if the process exits on its own.
sudox "mkdir -p /etc/systemd/system/ssh.service.d"
sudox "bash -c 'cat > /etc/systemd/system/ssh.service.d/10-rooted-resilience.conf <<EOF
[Unit]
# Do not give up permanently after repeated restarts.
StartLimitIntervalSec=0

[Service]
# Covers a crash - sshd exiting on its own.
# It does NOT cover \`systemctl stop\`: see the watchdog timer below.
Restart=always
RestartSec=5
# No-op when host keys exist; rescues a golden-image machine whose keys were
# stripped before capture.
ExecStartPre=-/usr/bin/ssh-keygen -A
EOF'" || die "writing ssh.service drop-in"
sudox "systemctl daemon-reload"
sudox "systemctl restart ssh.service" >/dev/null 2>&1 || die "restart after drop-in"
ok "ssh.service drop-in installed (crash recovery)"

# -----------------------------------------------------------------------------
stage "3. Watchdog timer (recovers from a DELIBERATE stop)"
# -----------------------------------------------------------------------------
# Restart=always does NOT restart a unit stopped with `systemctl stop` - systemd
# treats an explicit stop as intentional. The openssh-server postinst stops
# ssh.service exactly that way during an upgrade, which is precisely how this
# machine became unreachable. So Restart= alone is insufficient, and a periodic
# check is the only thing that recovers from it. Verified the hard way: with
# only the drop-in installed, `systemctl stop ssh` left the board unreachable
# and it had to be rescued over rpiboot.
sudox "bash -c 'cat > /etc/systemd/system/rooted-ssh-watchdog.service <<EOF
[Unit]
Description=Ensure sshd is running (Rooted)
After=network.target

[Service]
Type=oneshot
ExecStart=/bin/bash -c \"/usr/bin/ssh-keygen -A; systemctl is-active --quiet ssh.service || systemctl start ssh.service\"
EOF'" || die "writing watchdog service"

sudox "bash -c 'cat > /etc/systemd/system/rooted-ssh-watchdog.timer <<EOF
[Unit]
Description=Check every 2 minutes that sshd is running (Rooted)

[Timer]
OnBootSec=60
OnUnitActiveSec=120
AccuracySec=10

[Install]
WantedBy=timers.target
EOF'" || die "writing watchdog timer"

sudox "systemctl daemon-reload"
sudox "systemctl enable --now rooted-ssh-watchdog.timer" >/dev/null 2>&1 || die "enabling watchdog timer"
WD=$(sshx "systemctl is-enabled rooted-ssh-watchdog.timer 2>&1; systemctl is-active rooted-ssh-watchdog.timer 2>&1" 2>/dev/null | tr '\n' '/' | tr -d '\r')
ok "rooted-ssh-watchdog.timer: ${WD%/}"

# -----------------------------------------------------------------------------
stage "Verifying"
# -----------------------------------------------------------------------------
SVC=$(sshx "systemctl is-enabled ssh.service 2>&1; systemctl is-active ssh.service 2>&1" 2>/dev/null | tr '\n' '/' | tr -d '\r')
SOCK=$(sshx "systemctl is-enabled ssh.socket 2>&1" 2>/dev/null | tr -d '\r')
ok "ssh.service: ${SVC%/}"
ok "ssh.socket:  ${SOCK} (should be disabled/masked)"
LISTEN=$(sshx "ss -tlnp 2>/dev/null | grep -c ':22 '" 2>/dev/null | tr -d '\r')
if [ "${LISTEN:-0}" -ge 1 ]; then ok "sshd is listening on port 22"; else die "nothing listening on port 22"; fi

echo ""
echo -e "${GREEN}===============================================${NC}"
echo -e "${GREEN}  Hardening applied                            ${NC}"
echo -e "${GREEN}===============================================${NC}"
echo ""
echo "openssh and kernel upgrades are now deliberate, not unattended:"
echo "  sudo apt-get install --only-upgrade openssh-server"
echo ""
echo "Security updates for everything else still apply automatically."
