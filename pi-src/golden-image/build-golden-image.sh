#!/bin/bash
# =============================================================================
# Rooted Robotics - de-personalize a reference Pi and capture a golden image
# =============================================================================
# Run against a FULLY BUILT AND VERIFIED reference Pi. Two phases:
#
#   Phase 1 (this script, over SSH): strip every device-specific artifact, then
#           shut the Pi down cleanly.
#   Phase 2 (manual, guided): rpiboot the eMMC and dd it to a file.
#
# WHY THE STRIPPING MATTERS. A golden image is copied to every machine you
# build. Anything left behind is duplicated across the fleet:
#
#   AWS IoT certs   -> every Pi shares one client id; AWS IoT disconnects each
#                      one as the next connects. Looks like random dropouts.
#   Tailscale state -> two nodes fight over one identity; flapping online/offline
#   /etc/machine-id -> duplicate DHCP leases and merged journals
#   SSH host keys   -> every machine has the same host key
#   Office WiFi PSK -> your office password ships to every customer site
#   device_config   -> every machine reports as the same machine in the webapp
#
# Every one of those is silent. Nothing errors; the fleet just misbehaves in
# ways that are very hard to trace back to the image.
#
# Usage:
#   ./build-golden-image.sh --host 192.168.10.1
#   ./build-golden-image.sh --host 192.168.10.1 --no-shutdown   # inspect first
# =============================================================================

set -uo pipefail

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; BLUE='\033[0;34m'; NC='\033[0m'
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PI_SRC="$(cd "${SCRIPT_DIR}/.." && pwd)"
REMOTE_DIR="/opt/rooted-ble"

PI_HOST="192.168.10.1"; PI_USER="rooted"; DO_SHUTDOWN="true"; ASSUME_YES="false"

while [[ $# -gt 0 ]]; do
    case "$1" in
        --host)        PI_HOST="$2"; shift 2 ;;
        --user)        PI_USER="$2"; shift 2 ;;
        --no-shutdown) DO_SHUTDOWN="false"; shift ;;
        --yes)         ASSUME_YES="true"; shift ;;
        -h|--help)     sed -n '2,30p' "${BASH_SOURCE[0]}"; exit 0 ;;
        *) echo -e "${RED}Unknown option: $1${NC}"; exit 1 ;;
    esac
done

echo -e "${BLUE}===============================================${NC}"
echo -e "${BLUE}  Build Golden Image - de-personalize          ${NC}"
echo -e "${BLUE}===============================================${NC}"
echo ""

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
CUR_NAME=$(sshx "python3 -c \"import json;print(json.load(open('${REMOTE_DIR}/device_config.json')).get('device_name',''))\" 2>/dev/null" 2>/dev/null | tr -d '\r')
CUR_ID=$(sshx "python3 -c \"import json;print(json.load(open('${REMOTE_DIR}/device_config.json')).get('device_id',''))\" 2>/dev/null" 2>/dev/null | tr -d '\r')
if [ -n "$CUR_ID" ]; then
    echo "  This Pi is currently: ${CUR_NAME:-<unnamed>} / ${CUR_ID}"
    echo -e "  ${YELLOW}That identity is about to be destroyed.${NC}"
    echo "  If it is a real machine you intend to keep, stop now."
    echo ""
    echo "  Delete its AWS IoT Thing afterwards so it is not left orphaned:"
    echo "    aws iot list-thing-principals --thing-name ${CUR_ID}"
    echo "    aws iot delete-thing --thing-name ${CUR_ID}"
else
    ok "no device identity present"
fi
echo ""
if [ "$ASSUME_YES" != "true" ]; then
    read -p "Proceed with de-personalization? [y/N]: " C
    [[ "$C" =~ ^[Yy]$ ]] || { echo "Aborted."; exit 0; }
fi

# -----------------------------------------------------------------------------
stage "Pre-capture audit: does the Pi match the repo?"
# -----------------------------------------------------------------------------
# A golden image is only as good as the files on the reference Pi. Anything
# hand-copied during debugging, or copied from a since-edited source, gets baked
# into every machine - silently, because nothing about a stale file looks wrong.
# This caught a real one: setup-captive-portal.sh had been copied to the Pi
# minutes before its stale "password: raspberry" line was fixed in the repo.
DRIFT=0
audit_file() { # $1 local (relative to pi-src), $2 remote
    local L R
    L=$(shasum -a 256 "${PI_SRC}/$1" 2>/dev/null | awk '{print $1}')
    R=$(sshx "sha256sum '$2' 2>/dev/null | awk '{print \$1}'" 2>/dev/null | tr -d '\r')
    if [ -z "$R" ]; then echo -e "  ${RED}MISSING${NC}  $2"; DRIFT=$((DRIFT+1))
    elif [ "$L" != "$R" ]; then echo -e "  ${RED}DRIFTED${NC}  $2"; DRIFT=$((DRIFT+1)); fi
}
for f in provisioner.py requirements.txt ble-wrapper.sh rooted-ble.service \
         rooted-ble.timer rooted-iot.service rooted-ingest.service; do
    audit_file "$f" "${REMOTE_DIR}/$f"
done
for f in "${PI_SRC}"/aws/*.py; do audit_file "aws/$(basename "$f")" "${REMOTE_DIR}/aws/$(basename "$f")"; done
audit_file vector/rooted-vector.service "${REMOTE_DIR}/vector/rooted-vector.service"
audit_file setup-scripts/setup-nm.sh "${REMOTE_DIR}/setup-scripts/setup-nm.sh"
audit_file setup-scripts/setup-ethernet.sh "${REMOTE_DIR}/setup-scripts/setup-ethernet.sh"
for f in "${PI_SRC}"/wifi-setup/*.sh; do audit_file "wifi-setup/$(basename "$f")" "${PORTAL_DIR}/wifi-setup/$(basename "$f")"; done
audit_file captive-portal/captive_portal.py "${PORTAL_DIR}/captive-portal/captive_portal.py"

if [ "$DRIFT" -ne 0 ]; then
    echo ""
    echo "  Re-copy the drifted files to the Pi, then re-run. Simplest:"
    echo "    ./deploy-to-pi-one.sh   (host ${PI_HOST}, re-copies everything)"
    die "${DRIFT} file(s) on the Pi do not match the repo - refusing to capture"
fi
ok "every tracked file on the Pi matches the repo"

# The image's whole value is that these self-heal in the field. Capturing
# without them ships machines that need a human for failures we already fixed.
for unit in rooted-ssh-watchdog.timer rooted-sshd-keygen.service; do
    if sshx "systemctl is-enabled ${unit}" 2>/dev/null | grep -q enabled; then
        ok "${unit} enabled"
    else
        die "${unit} is not enabled - run golden-image/harden-updates.sh first"
    fi
done
if sshx "grep -q _advertising_watchdog ${REMOTE_DIR}/provisioner.py" 2>/dev/null; then
    ok "BLE advertising watchdog present in provisioner.py"
else
    die "provisioner.py has no BLE advertising watchdog - a dropped advert would need a manual restart"
fi

# -----------------------------------------------------------------------------
stage "Stopping services"
# -----------------------------------------------------------------------------
sudox "systemctl stop rooted-iot.service rooted-vector.service rooted-ingest.service captive-portal.service rooted-ble.timer rooted-ble.service" >/dev/null 2>&1
ok "services stopped"
# Must ship DISABLED: without certificates they crash-loop from first boot on
# every machine flashed from this image. personalize-pi.sh re-enables them.
sudox "systemctl disable rooted-iot.service rooted-vector.service" >/dev/null 2>&1
ok "rooted-iot + rooted-vector disabled"

# -----------------------------------------------------------------------------
stage "Device identity"
# -----------------------------------------------------------------------------
sudox "rm -f ${REMOTE_DIR}/device_config.json"
sudox "rm -f ${REMOTE_DIR}/certs/certificate.pem.crt ${REMOTE_DIR}/certs/private.pem.key ${REMOTE_DIR}/certs/AmazonRootCA1.pem"
ok "device_config.json and AWS IoT certificates removed"

# The image must carry an UNRENDERED template; personalize-pi.sh renders from it
# every time. Rendering in place is what let a re-provision silently keep the
# previous device id.
scpx "${PI_SRC}/vector/rooted-telemetry.toml" \
     "${PI_USER}@${PI_HOST}:/tmp/rooted-telemetry.toml.template" >/dev/null || die "staging template"
sudox "mv /tmp/rooted-telemetry.toml.template ${REMOTE_DIR}/vector/rooted-telemetry.toml.template"
sudox "rm -f ${REMOTE_DIR}/vector/rooted-telemetry.toml /etc/default/vector"
sshx "grep -q '@@ROOTED_DEVICE_ID@@' ${REMOTE_DIR}/vector/rooted-telemetry.toml.template" 2>/dev/null \
    || die "template lost its placeholders"
ok "pristine rooted-telemetry.toml.template staged, rendered config removed"

sudox "rm -f /etc/machine-info"
sudox "hostnamectl set-hostname rooted"
ok "hostname reset to 'rooted', PRETTY_HOSTNAME cleared"

# -----------------------------------------------------------------------------
stage "Network credentials"
# -----------------------------------------------------------------------------
# Every saved WiFi profile except the captive-portal hotspot is a customer's or
# your office's network, and would ship to every machine.
sudox "bash -c \"nmcli -t -f NAME,TYPE connection show | grep ':802-11-wireless' | cut -d: -f1 | grep -v '^Rooted-Robotics-Setup$' | while read -r n; do nmcli connection delete \\\"\\\$n\\\"; done\"" >/dev/null 2>&1
REMAIN=$(sshx "nmcli -t -f NAME,TYPE connection show 2>/dev/null | grep ':802-11-wireless' | cut -d: -f1 | tr '\n' ' '" 2>/dev/null | tr -d '\r')
ok "WiFi profiles removed (remaining: ${REMAIN:-none})"

# cloud-init leaves the WiFi PSK in plaintext on the boot partition. It is not
# used again after first boot, but it would ship on every machine.
sudox "bash -c 'if [ -f /boot/firmware/network-config ]; then printf \"version: 2\n\" > /boot/firmware/network-config; fi'" >/dev/null 2>&1
ok "boot-partition network-config wiped"

# Remove stray copies of the CLOUD-INIT config left on the boot partition.
# These matter for two reasons: *.rooted-orig and *.pre-sshfix hold the original
# WiFi PSK in plaintext (so wiping only network-config would miss it), and
# user-data.full / user-data.pre-* are full configs that would ship on every
# machine and confuse anyone debugging one later.
#
# Scoped to the cloud-init filenames on purpose. A blanket /boot/firmware/*.bak
# would also delete Ubuntu's kernel and firmware backups (vmlinuz.bak,
# initrd.img.bak, *.dtb.bak, start*.elf.bak) that an apt kernel upgrade leaves
# behind - not ours to remove, and deleting them removes the rollback path if a
# kernel update ever leaves a machine unbootable.
sudox "bash -c 'rm -f /boot/firmware/user-data.rooted-orig /boot/firmware/network-config.rooted-orig /boot/firmware/meta-data.rooted-orig /boot/firmware/cmdline.txt.rooted-orig /boot/firmware/cmdline.txt.rooted-bak /boot/firmware/user-data.full /boot/firmware/user-data.pre-sshfix /boot/firmware/rooted-diag.txt'" >/dev/null 2>&1
STRAY=$(sshx "ls /boot/firmware/ 2>/dev/null | grep -cE '(rooted-orig|user-data\.full|pre-sshfix|rooted-diag)'" 2>/dev/null | tr -d '\r')
if [ "${STRAY:-0}" = "0" ]; then
    ok "stray cloud-init config copies removed"
else
    warn "${STRAY} stray config file(s) still on the boot partition"
fi

# --- Reset the cloud-init instance-id pinned on the kernel command line ------
# Raspberry Pi Imager writes `ds=nocloud;i=<id>` into cmdline.txt, and cloud-init
# gives that PRIORITY OVER meta-data. Whatever id is pinned here gets baked into
# the image, so every machine flashed from it inherits the same one - and once
# any of them records that id, cloud-init decides it has already run and SILENTLY
# SKIPS user-data on later boots. That is not hypothetical: it is exactly why
# four separate boot-partition repairs on this reference build did nothing at
# all, with no error to show for it.
# Dropping the i= token makes cloud-init fall back to meta-data, which is
# per-machine and can be set at flash time.
if sshx "sudo test -f /boot/firmware/cmdline.txt" 2>/dev/null; then
    sudox "bash -c \"sed -i -E 's/;i=[^[:space:];]+//g; s/(ds=nocloud)[[:space:]]*\\\$/\\1/' /boot/firmware/cmdline.txt\"" >/dev/null 2>&1
    PINNED=$(sshx "sudo grep -oE 'i=[^ ;]+' /boot/firmware/cmdline.txt 2>/dev/null | head -1" 2>/dev/null | tr -d '\r')
    if [ -z "$PINNED" ]; then
        ok "cmdline.txt instance-id pin removed (cloud-init will use meta-data)"
    else
        warn "cmdline.txt still pins ${PINNED} - machines from this image may skip cloud-init"
    fi
    # meta-data becomes the single source of truth; a generic id is fine because
    # each machine has its own /var/lib/cloud state.
    sudox "bash -c 'printf \"instance-id: rooted-golden\nlocal-hostname: rooted\n\" > /boot/firmware/meta-data'" >/dev/null 2>&1
    ok "meta-data reset to a generic instance-id"
fi

# --- Ship a clean first-boot user-data ---------------------------------------
# Whatever repair or stamp config accumulated on this reference build must not
# be what a hundred machines execute on first boot. This minimal, fully-offline
# config does only what a fresh golden-image machine needs: regenerate SSH host
# keys (stripped below) and arm the watchdog. Everything else is personalize-
# pi.sh's job, over SSH, where failures are visible.
sudox "bash -c 'cat > /boot/firmware/user-data <<EOF
#cloud-config
# Rooted golden image - first boot (generated by build-golden-image.sh)
# Fully offline: no packages, no downloads. Per-machine setup happens over SSH
# via golden-image/personalize-pi.sh.
hostname: rooted
manage_etc_hosts: true
preserve_hostname: false
package_update: false
package_upgrade: false

bootcmd:
  # Host keys are stripped from the image (shared keys = one identity for the
  # whole fleet); regenerate before sshd starts.
  - |
    ssh-keygen -A

runcmd:
  - [ systemctl, enable, --now, rooted-ssh-watchdog.timer ]

final_message: \"Rooted golden image first boot complete after \\\$UPTIME seconds.\"
EOF'" || die "writing golden user-data"
UD_OK=$(sshx "head -2 /boot/firmware/user-data | grep -c 'cloud-config'" 2>/dev/null | tr -d '\r')
[ "${UD_OK:-0}" = "1" ] && ok "clean golden-image user-data written" || die "user-data verification failed"

# Verify no plaintext PSK survives anywhere on the boot partition.
PSK_HITS=$(sshx "sudo grep -rlE '[0-9a-f]{64}' /boot/firmware/*.yaml /boot/firmware/user-data* /boot/firmware/network-config* 2>/dev/null | wc -l" 2>/dev/null | tr -d '\r')
if [ "${PSK_HITS:-0}" = "0" ]; then
    ok "no plaintext WiFi PSK left on the boot partition"
else
    warn "possible PSK still present in ${PSK_HITS} boot-partition file(s) - check before shipping"
fi

# -----------------------------------------------------------------------------
stage "Tailscale"
# -----------------------------------------------------------------------------
if sshx "command -v tailscale >/dev/null" 2>/dev/null; then
    sudox "tailscale logout" >/dev/null 2>&1
    sudox "systemctl stop tailscaled" >/dev/null 2>&1
    sudox "rm -rf /var/lib/tailscale/*"
    ok "logged out, node state wiped (package kept)"
else
    warn "tailscale not installed - install it before capture so it is in the image"
fi

# -----------------------------------------------------------------------------
stage "Machine identity"
# -----------------------------------------------------------------------------
# Regenerates automatically on next boot when absent.
sudox "truncate -s 0 /etc/machine-id" && ok "/etc/machine-id cleared" || warn "could not clear /etc/machine-id"
sudox "rm -f /var/lib/dbus/machine-id"

# cloud-init must re-run on the new machine (hostname, growpart, ssh keys).
sudox "cloud-init clean --logs" >/dev/null 2>&1
ok "cloud-init state cleared"

# NOTE: SSH host keys are deliberately NOT removed here. Deleting them restarts
# sshd and kills every connection that follows, which previously produced
# "kex_exchange_identification: Connection reset by peer" mid-run and left the
# remaining steps silently unverified. They are removed at the very end, after
# all other work and after verification.

# -----------------------------------------------------------------------------
stage "Image identity"
# -----------------------------------------------------------------------------
# Baked into the image ON PURPOSE - this is image-specific, not device-specific.
# Every machine flashed from this image carries its own lineage
# (cat /etc/rooted-image-release in the field), and personalize-pi.sh reads it
# to append the machine to golden-image/images/DEPLOYMENTS.csv, so "which image is
# that customer's machine running?" is answerable from git instead of memory.
IMAGE_ID="rooted-golden-$(date +%Y%m%d)"
GIT_SHA=$(git -C "${PI_SRC}" rev-parse --short HEAD 2>/dev/null || echo unknown)
sudox "bash -c \"printf 'IMAGE_ID=%s\nBUILD_DATE=%s\nREPO_SHA=%s\n' '${IMAGE_ID}' '$(date -u +%Y-%m-%dT%H:%M:%SZ)' '${GIT_SHA}' > /etc/rooted-image-release\"" \
    || die "writing /etc/rooted-image-release"
ok "baked ${IMAGE_ID} (repo ${GIT_SHA}) into /etc/rooted-image-release"

# -----------------------------------------------------------------------------
stage "Runtime data and logs"
# -----------------------------------------------------------------------------
sudox "rm -rf /var/lib/vector/*"
sudox "rm -f /home/rooted/telemetry_log.jsonl"
sudox "rm -f /home/rooted/te-cli/TE_Variable_Values.json.lock"
ok "Vector buffers and telemetry log cleared"
sudox "journalctl --rotate" >/dev/null 2>&1
sudox "journalctl --vacuum-time=1s" >/dev/null 2>&1
sudox "bash -c 'rm -rf /var/log/*.gz /var/log/*.1 /var/tmp/* /tmp/*'" >/dev/null 2>&1
sudox "apt-get clean" >/dev/null 2>&1
sshx "rm -f ~/.bash_history" >/dev/null 2>&1
ok "logs, apt cache and history cleared"

# -----------------------------------------------------------------------------
stage "Zeroing free space"
# -----------------------------------------------------------------------------
# Deleted files leave their contents on disk, so an image of a 29GB filesystem
# compresses to ~29GB of noise unless the free space is actually zeros. This
# takes a few minutes and is the difference between a ~2GB and a ~25GB artifact.
echo "  filling free space with zeros (several minutes)..."
sudox "bash -c 'dd if=/dev/zero of=/ZEROFILL bs=4M status=none || true; sync; rm -f /ZEROFILL; sync'" >/dev/null 2>&1
ok "free space zeroed"

DISK=$(sshx "df -h / | tail -1 | awk '{print \$2\" total, \"\$3\" used\"}'" 2>/dev/null | tr -d '\r')
ok "root filesystem: ${DISK}"

# -----------------------------------------------------------------------------
stage "Verifying nothing device-specific remains"
# -----------------------------------------------------------------------------
LEFT=0
# Confirm the connection is alive FIRST. Every check below is worthless if SSH
# is broken, and a broken connection must never be mistaken for a clean result.
if ! sshx "echo ALIVE" 2>/dev/null | grep -q ALIVE; then
    die "lost the SSH connection - cannot verify. Power-cycle the Pi and re-run."
fi
ok "connection alive - verification is meaningful"

check_gone() {
    # The remote command reports PRESENT/ABSENT explicitly. Testing the exit
    # status alone would treat an SSH failure as "file is gone" - which is how
    # a broken run could report a clean image that was never actually cleaned.
    local out
    out=$(sshx "if sudo test -e '$1'; then echo PRESENT; else echo ABSENT; fi" 2>/dev/null | tr -d '\r' | tail -1)
    case "$out" in
        ABSENT)  echo -e "  ${GREEN}gone${NC} $1" ;;
        PRESENT) echo -e "  ${RED}STILL PRESENT:${NC} $1"; LEFT=$((LEFT+1)) ;;
        *)       echo -e "  ${RED}UNVERIFIABLE:${NC} $1 (no answer from the Pi)"; LEFT=$((LEFT+1)) ;;
    esac
}
check_gone "${REMOTE_DIR}/device_config.json"
check_gone "${REMOTE_DIR}/certs/private.pem.key"
check_gone "${REMOTE_DIR}/vector/rooted-telemetry.toml"
check_gone "/etc/default/vector"
check_gone "/etc/machine-info"

MID=$(sshx "if sudo test -s /etc/machine-id; then echo PRESENT; else echo ABSENT; fi" 2>/dev/null | tr -d '\r' | tail -1)
case "$MID" in
    ABSENT)  echo -e "  ${GREEN}gone${NC} /etc/machine-id is empty" ;;
    PRESENT) echo -e "  ${RED}STILL PRESENT:${NC} /etc/machine-id is non-empty"; LEFT=$((LEFT+1)) ;;
    *)       echo -e "  ${RED}UNVERIFIABLE:${NC} /etc/machine-id"; LEFT=$((LEFT+1)) ;;
esac

# Confirm the pristine template survived - personalize-pi.sh depends on it.
TPL=$(sshx "if sudo test -e '${REMOTE_DIR}/vector/rooted-telemetry.toml.template'; then echo PRESENT; else echo ABSENT; fi" 2>/dev/null | tr -d '\r' | tail -1)
case "$TPL" in
    PRESENT) echo -e "  ${GREEN}ok${NC}   rooted-telemetry.toml.template present (required)" ;;
    *)       echo -e "  ${RED}MISSING:${NC} rooted-telemetry.toml.template"; LEFT=$((LEFT+1)) ;;
esac

# Free space must actually be zeros or conv=sparse buys nothing on restore.
FREE_G=$(sshx "df -BG --output=avail / 2>/dev/null | tail -1 | tr -dc '0-9'" 2>/dev/null | tr -d '\r')
if [ -n "$FREE_G" ]; then
    ok "root filesystem has ${FREE_G}GB free (zeroed)"
else
    echo -e "  ${RED}UNVERIFIABLE:${NC} could not read free space - zeroing may not have run"
    LEFT=$((LEFT+1))
fi

if [ "$LEFT" -ne 0 ]; then
    echo ""
    die "${LEFT} item(s) failed verification - do NOT capture this image"
fi

# --- Last on-Pi action: remove SSH host keys ---------------------------------
# Deliberately last: nothing may depend on SSH afterwards. Two subtleties, both
# learned the hard way on this build:
#
#   1. The watchdog timer regenerates missing host keys every 2 minutes - which
#      is the point on a live machine, and exactly wrong in the window between
#      key removal and power-off: it re-created the keys and they would have
#      shipped identically on every machine. STOP the timer (but leave it
#      ENABLED, so machines flashed from the image still get it on boot).
#   2. The keys must be removed IMMEDIATELY before shutdown, not mid-script.
stage "Removing SSH host keys (final step)"
sudox "systemctl stop rooted-ssh-watchdog.timer" >/dev/null 2>&1 || true
WD_EN=$(sshx "systemctl is-enabled rooted-ssh-watchdog.timer 2>&1" 2>/dev/null | tr -d '\r')
if [ "$WD_EN" = "enabled" ]; then
    ok "watchdog timer stopped for capture (stays enabled in the image)"
else
    warn "watchdog timer is '${WD_EN}' - machines from this image will lack SSH self-healing"
fi
# Key removal, sync, and the shutdown must all ride ONE SSH connection.
# OpenSSH re-executes itself for every incoming connection and reads the host
# key files from disk each time - so the moment the files are gone, no NEW
# connection can complete key exchange ("kex_exchange_identification:
# Connection reset by peer"), even though the daemon stays up. A follow-up
# sshx for sync or poweroff therefore always fails. Verified live: the split
# version left the Pi running with no way in.
# The poweroff is scheduled 3s out via a transient timer so it fires after
# this connection closes; KEYSGONE is echoed back on the same channel as the
# only trustworthy confirmation we will ever get.
if [ "$DO_SHUTDOWN" = "true" ]; then
    RESULT=$(sudox "bash -c 'rm -f /etc/ssh/ssh_host_*; ls /etc/ssh/ssh_host_* >/dev/null 2>&1 && echo KEYSLEFT || echo KEYSGONE; sync; systemd-run --on-active=3 systemctl poweroff >/dev/null 2>&1 && echo POWEROFF_SCHEDULED || echo POWEROFF_FAILED'" 2>/dev/null | tr -d '\r')
else
    RESULT=$(sudox "bash -c 'rm -f /etc/ssh/ssh_host_*; ls /etc/ssh/ssh_host_* >/dev/null 2>&1 && echo KEYSLEFT || echo KEYSGONE; sync'" 2>/dev/null | tr -d '\r')
fi
echo "$RESULT" | grep -q KEYSGONE || die "host keys not confirmed removed (got: ${RESULT:-no response})"
ok "SSH host keys removed (regenerate on first boot of each machine)"
if [ "$DO_SHUTDOWN" = "true" ]; then
    echo "$RESULT" | grep -q POWEROFF_SCHEDULED || die "poweroff was not scheduled (got: ${RESULT})"
    ok "poweroff scheduled (fires in 3s, after this connection closes)"
fi

echo ""
echo -e "${GREEN}===============================================${NC}"
echo -e "${GREEN}  De-personalized and ready to capture         ${NC}"
echo -e "${GREEN}===============================================${NC}"

if [ "$DO_SHUTDOWN" = "true" ]; then
    echo ""
    # sync and poweroff already happened on the same connection that removed the
    # host keys (see above) - no SSH is possible from here on, by design.
    # CONFIRM it actually powered off: a scheduled poweroff that silently failed
    # would leave the capture to be taken from a live filesystem.
    echo -n "  waiting for it to stop responding"
    DOWN="false"
    for i in $(seq 1 30); do
        if ! ping -c 1 -W 1000 "$PI_HOST" >/dev/null 2>&1; then
            # Two consecutive failures, so a single dropped packet is not enough.
            sleep 2
            ping -c 1 -W 1000 "$PI_HOST" >/dev/null 2>&1 || { DOWN="true"; break; }
        fi
        echo -n "."; sleep 3
    done
    echo ""
    if [ "$DOWN" = "true" ]; then
        echo -e "  ${GREEN}Pi is powered off.${NC} Safe to remove power and enter usbboot mode."
    else
        echo -e "  ${RED}Pi is STILL RESPONDING after 90s - it did not shut down.${NC}"
        echo "  Do NOT pull power yet; a hard cut on a live filesystem is how the last"
        echo "  reference build was lost. Try again:"
        echo "    ssh ${PI_USER}@${PI_HOST} 'sudo poweroff'"
        exit 1
    fi
fi

cat <<'NEXTSTEPS'

───────────────────────────────────────────────
 Phase 2 - capture the image
───────────────────────────────────────────────

1. Put the CM5 into usbboot mode (hold BOOT on the Waveshare board while
   powering on), then export the eMMC:

     sudo ~/usbboot/rpiboot -d ~/usbboot/mass-storage-gadget64

2. Find the device (it is the ~31GB external physical disk):

     diskutil list external physical

3. Unmount it but keep the device node, then capture. Use the RAW node
   (/dev/rdiskN) - it is far faster than /dev/diskN:

     diskutil unmountDisk /dev/diskN
     sudo dd if=/dev/rdiskN bs=4m | gzip -1 > rooted-golden-$(date +%Y%m%d).img.gz

   Ctrl-T shows progress. Free space was zeroed, so this compresses well.

4. Restore to a new CM5 - use conv=sparse, it matters a lot:

     diskutil unmountDisk /dev/diskN
     gunzip -c rooted-golden-YYYYMMDD.img.gz | sudo dd of=/dev/rdiskN bs=4m conv=sparse

   The image spans the whole ~29GB eMMC, but the free space was zeroed above,
   so only ~3.3GB is real data. conv=sparse SEEKS over runs of zeros instead of
   writing them, cutting the write from 15-25 min to roughly 3-5 min. That is
   the same win as shrinking the partition, without needing resize2fs (which
   macOS does not have, and which the mass-storage-gadget's initramfs does not
   ship either - it has e2fsck and sfdisk but no resize2fs).

   TRADE-OFF: where the image holds zeros, the target's existing blocks are
   left untouched rather than overwritten. On a factory-fresh CM5 that is
   nothing. On a module being RE-flashed, stale data survives in what the new
   filesystem treats as free space - harmless functionally, but it is not an
   erase. If the module previously held customer data, drop conv=sparse and
   take the slow full write.

   Raspberry Pi Imager ("Use custom") also works, but writes all 29GB.

5. Personalize the new machine:

     ./personalize-pi.sh --machine HARVESTER-<customer>-<n> --reboot

   Since the image is NOT shrunk, the root filesystem already fills the eMMC
   and no grow is needed. verify-pi.sh checks this either way and fails if the
   filesystem is small relative to the disk.

NEXTSTEPS
