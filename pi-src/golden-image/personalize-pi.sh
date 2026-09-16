#!/bin/bash
# =============================================================================
# Rooted Robotics - personalize a Pi flashed from the golden image
# =============================================================================
# Run ONCE PER MACHINE. This is the per-device half of deploy-to-pi-two.sh -
# everything the golden image cannot contain because it must be unique:
#
#     machine name        -> device_config.json, Bluetooth name, hostname
#     device UUID         -> AWS IoT Thing, Vector topic + client_id
#     AWS IoT certs       -> provisioned from YOUR Mac, copied to the Pi
#     Vector config       -> rendered from the pristine .toml.template
#     rooted-iot/-vector  -> enabled and started (they ship disabled)
#     Tailscale           -> optional, joins the tailnet
#
# The common config (NetworkManager, captive portal, iptables, unit files) is
# already in the image via bake-common.sh, so this does NOT touch networking -
# which means it cannot drop your session and needs no cable swap.
#
# CONNECTION: a Pi from the golden image has eth0 static at 192.168.10.1 and no
# WiFi credentials (by design - WiFi is provisioned on site over BLE or the
# captive portal). So connect the ethernet cable directly and set your Mac:
#     sudo ifconfig en9 inet 192.168.10.2 netmask 255.255.255.0 up
#
# Idempotent: safe to re-run. An existing device_config.json is REUSED, never
# regenerated - a fresh UUID would orphan the AWS IoT Thing and the machine's
# history in the webapp.
#
# Usage:
#   ./personalize-pi.sh --machine HARVESTER-koppert-1
#   ./personalize-pi.sh --machine SEEDER-freshleaf-02 --tailscale-key tskey-auth-...
#
# Flags:
#   --host HOST          default 192.168.10.1
#   --user USER          default rooted
#   --machine NAME       must start with SEEDER or HARVESTER (see below)
#   --tailscale-key KEY  reusable, pre-authorized, tagged auth key
#   --skip-iot           do not provision AWS IoT
#   --hostname NAME      system hostname (default: lowercased machine name)
# =============================================================================

set -uo pipefail

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; BLUE='\033[0;34m'; NC='\033[0m'
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PI_SRC="$(cd "${SCRIPT_DIR}/.." && pwd)"
REMOTE_DIR="/opt/rooted-ble"

PI_HOST="192.168.10.1"; PI_USER="rooted"; MACHINE_NAME=""
TAILSCALE_KEY=""; SKIP_IOT="false"; SYS_HOSTNAME=""
OFFICE_WIFI="false"; DO_REBOOT="false"
OFFICE_WIFI_FILE="${HOME}/.rooted-office-wifi"

while [[ $# -gt 0 ]]; do
    case "$1" in
        --host)          PI_HOST="$2"; shift 2 ;;
        --user)          PI_USER="$2"; shift 2 ;;
        --machine)       MACHINE_NAME="$2"; shift 2 ;;
        --tailscale-key) TAILSCALE_KEY="$2"; shift 2 ;;
        --hostname)      SYS_HOSTNAME="$2"; shift 2 ;;
        --skip-iot)      SKIP_IOT="true"; shift ;;
        --office-wifi)   OFFICE_WIFI="true"; shift ;;
        --reboot)        DO_REBOOT="true"; shift ;;
        -h|--help)       sed -n '2,40p' "${BASH_SOURCE[0]}"; exit 0 ;;
        *) echo -e "${RED}Unknown option: $1${NC}"; exit 1 ;;
    esac
done

echo -e "${BLUE}===============================================${NC}"
echo -e "${BLUE}  Rooted Robotics - Personalize Machine        ${NC}"
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
sshx "[ -f ${REMOTE_DIR}/vector/rooted-telemetry.toml.template ]" 2>/dev/null \
    || die "no rooted-telemetry.toml.template - this Pi was not built from the golden image"
ok "golden-image layout confirmed"

# A golden image is captured with a shrunk root partition so it flashes fast.
# Growing it is the first thing that has to happen or the Pi runs out of disk
# once telemetry and Vector's 256MB disk buffer start filling up.
ROOT_FREE=$(sshx "df -BG --output=avail / | tail -1 | tr -dc '0-9'" 2>/dev/null | tr -d '\r')
if [ -n "$ROOT_FREE" ] && [ "$ROOT_FREE" -lt 4 ]; then
    warn "only ${ROOT_FREE}GB free on / - expanding the root filesystem"
    ROOT_PART=$(sshx "findmnt -no SOURCE /" 2>/dev/null | tr -d '\r')
    ROOT_DISK=$(echo "$ROOT_PART" | sed 's/p\?[0-9]*$//')
    PART_NUM=$(echo "$ROOT_PART" | grep -oE '[0-9]+$')
    sudox "growpart ${ROOT_DISK} ${PART_NUM}" >/dev/null 2>&1 || warn "growpart reported no change"
    sudox "resize2fs ${ROOT_PART}" >/dev/null 2>&1 || warn "resize2fs reported no change"
    ok "root filesystem expanded ($(sshx 'df -h / | tail -1' 2>/dev/null | awk '{print $2}') total)"
else
    ok "root filesystem has ${ROOT_FREE:-?}GB free"
fi


# -----------------------------------------------------------------------------
stage "Office WiFi (bench testing)"
# -----------------------------------------------------------------------------
# Runs EARLY - before any service is started - for a reason found on machine
# zero: a golden-image Pi has never had internet in its current boot, so its
# clock has never NTP-synced (no RTC on a CM). rooted-iot declares
# After=time-sync.target, so `systemctl restart rooted-iot` queues behind
# systemd-time-wait-sync, which waits for a sync that can never happen offline
# - and the whole script hangs at "Services", forever. Joining WiFi first lets
# NTP sync (observed: ~5s after association), and everything downstream starts
# normally.
#
# A machine straight from the golden image has NO WiFi credentials by design.
# On the bench that also means it cannot reach AWS IoT, so this closes both
# gaps. The PSK lands in /etc/NetworkManager/system-connections/ and would
# SHIP TO THE CUSTOMER - hence opt-in flag, credentials from a gitignored file
# outside the repo, and a removal reminder.
if [ "$OFFICE_WIFI" = "true" ]; then
    if [ ! -f "$OFFICE_WIFI_FILE" ]; then
        warn "no ${OFFICE_WIFI_FILE} - skipping (see SETUP.md for how to create it)"
    else
        OW_SSID=$(grep -m1 '^SSID=' "$OFFICE_WIFI_FILE" | cut -d= -f2-)
        OW_PSK=$(grep -m1 '^PSK=' "$OFFICE_WIFI_FILE" | cut -d= -f2-)
        if [ -z "$OW_SSID" ] || [ -z "$OW_PSK" ]; then
            warn "${OFFICE_WIFI_FILE} is missing SSID= or PSK="
        else
            # wlan0 runs as an AP (the captive portal hotspot) until something
            # takes it, and an interface in AP mode cannot scan - so the hotspot
            # has to come down before the join will find any networks.
            sudox "nmcli connection down Rooted-Robotics-Setup" >/dev/null 2>&1
            sshx "sudo nmcli device wifi rescan" >/dev/null 2>&1
            sleep 6
            # PSK passed over stdin, never on the command line, so it cannot be
            # read out of `ps` on the Pi.
            if printf '%s\n' "$OW_PSK" | sshx "read -r P; sudo nmcli device wifi connect '${OW_SSID}' password \"\$P\"" >/dev/null 2>&1; then
                sleep 5
                WIP=$(sshx "ip -4 -o addr show wlan0 | awk '{print \$4}'" 2>/dev/null | tr -d '\r')
                ok "joined ${OW_SSID} (wlan0 ${WIP:-?})"
                warn "REMOVE BEFORE SHIPPING - the office PSK is now stored on this Pi:"
                warn "  ssh ${PI_USER}@<host> \"sudo nmcli connection delete '${OW_SSID}'\""
            else
                warn "could not join ${OW_SSID}"
            fi
        fi
    fi
else
    warn "office WiFi not joined (pass --office-wifi to test on the bench)"
fi

# -----------------------------------------------------------------------------
stage "Machine identity"
# -----------------------------------------------------------------------------
# Reuse an existing identity. Minting a new UUID on a re-run would orphan the
# AWS IoT Thing and the machine's history in the webapp.
EXISTING=$(sshx "cat ${REMOTE_DIR}/device_config.json 2>/dev/null" 2>/dev/null || true)
DEVICE_UUID=""; IOT_ENDPOINT=""
if [ -n "$EXISTING" ]; then
    DEVICE_UUID=$(printf '%s' "$EXISTING" | python3 -c "import sys,json;print(json.load(sys.stdin).get('device_id',''))" 2>/dev/null || true)
    EXIST_NAME=$(printf '%s' "$EXISTING" | python3 -c "import sys,json;print(json.load(sys.stdin).get('device_name',''))" 2>/dev/null || true)
    IOT_ENDPOINT=$(printf '%s' "$EXISTING" | python3 -c "import sys,json;print(json.load(sys.stdin).get('aws_iot_endpoint',''))" 2>/dev/null || true)
    [ -n "$DEVICE_UUID" ] && { ok "reusing existing identity: ${EXIST_NAME:-<unnamed>} / ${DEVICE_UUID}"; [ -z "$MACHINE_NAME" ] && MACHINE_NAME="$EXIST_NAME"; }
fi

if [ -z "$MACHINE_NAME" ]; then
    # The NAME is functionally load-bearing. Both machineType.ts and
    # telemetry_ingest.py derive the machine TYPE by prefix match; anything that
    # is not SEEDER*/HARVESTER* becomes OTHER, which drops telemetry frames and
    # returns an empty parts list.
    echo "  Machine type (PREFIX MATCH - drives telemetry parsing and parts tracking):"
    echo "    1) SEEDER      2) HARVESTER      3) Other (see warning)"
    read -p "  Type [1-3]: " T
    case "$T" in
        1) MT="SEEDER" ;; 2) MT="HARVESTER" ;;
        3) read -p "  Custom prefix: " MT; MT=$(printf '%s' "$MT" | tr '[:lower:]' '[:upper:]') ;;
        *) die "pick 1, 2 or 3" ;;
    esac
    read -p "  Customer (e.g. koppert, freshleaf, gorilla-greens): " CUST
    CUST=$(printf '%s' "$CUST" | tr '[:upper:]' '[:lower:]' | tr -cs 'a-z0-9-' '-' | sed 's/^-*//; s/-*$//')
    read -p "  Unit number (e.g. 01): " UNIT
    UNIT=$(printf '%s' "$UNIT" | tr -cd 'a-zA-Z0-9')
    MACHINE_NAME="$MT"; [ -n "$CUST" ] && MACHINE_NAME="${MACHINE_NAME}-${CUST}"; [ -n "$UNIT" ] && MACHINE_NAME="${MACHINE_NAME}-${UNIT}"
fi
[ -n "$MACHINE_NAME" ] || die "machine name cannot be empty"

NAME_UPPER=$(printf '%s' "$MACHINE_NAME" | tr '[:lower:]' '[:upper:]')
case "$NAME_UPPER" in
    SEEDER*)    ok "machine name: ${MACHINE_NAME}  (type SEEDER)" ;;
    HARVESTER*) ok "machine name: ${MACHINE_NAME}  (type HARVESTER)" ;;
    *)  warn "'${MACHINE_NAME}' does not start with SEEDER or HARVESTER."
        warn "It will classify as OTHER: telemetry frames DROPPED, parts list EMPTY."
        warn "(WASHER is NOT a recognised type despite older scripts suggesting it.)"
        read -p "  Continue anyway? [y/N]: " C; [[ "$C" =~ ^[Yy]$ ]] || exit 0 ;;
esac

if [ -z "$DEVICE_UUID" ]; then
    DEVICE_UUID=$(uuidgen 2>/dev/null | tr '[:upper:]' '[:lower:]')
    [ -n "$DEVICE_UUID" ] || DEVICE_UUID=$(python3 -c "import uuid;print(uuid.uuid4())")
    ok "new device id: ${DEVICE_UUID}"
fi

[ -n "$SYS_HOSTNAME" ] || SYS_HOSTNAME=$(printf '%s' "$MACHINE_NAME" | tr '[:upper:]' '[:lower:]' | tr -cs 'a-z0-9-' '-' | sed 's/^-*//; s/-*$//')

# -----------------------------------------------------------------------------
stage "AWS IoT"
# -----------------------------------------------------------------------------
if [ "$SKIP_IOT" = "true" ]; then
    warn "skipped (--skip-iot) - this machine will never show online in the webapp"
elif sshx "[ -f ${REMOTE_DIR}/certs/certificate.pem.crt ]" 2>/dev/null && [ -n "$IOT_ENDPOINT" ]; then
    ok "certificates already present for ${DEVICE_UUID}"
elif ! command -v aws >/dev/null; then
    warn "AWS CLI not installed - skipping (brew install awscli)"
else
    IOT_TMP="/tmp/rooted-iot-${DEVICE_UUID}"
    if "${PI_SRC}/setup-scripts/provision-iot-device.sh" "${DEVICE_UUID}" --output-dir "${IOT_TMP}"; then
        [ -f "${IOT_TMP}/.iot_endpoint" ] && IOT_ENDPOINT=$(cat "${IOT_TMP}/.iot_endpoint")
        sudox "mkdir -p ${REMOTE_DIR}/certs && chown ${PI_USER}:${PI_USER} ${REMOTE_DIR}/certs"
        scpx "${IOT_TMP}/certificate.pem.crt" "${IOT_TMP}/private.pem.key" "${IOT_TMP}/AmazonRootCA1.pem" \
             "${PI_USER}@${PI_HOST}:${REMOTE_DIR}/certs/" >/dev/null || die "copying certificates"
        sshx "chmod 600 ${REMOTE_DIR}/certs/private.pem.key"
        rm -rf "${IOT_TMP}"
        ok "IoT provisioned, endpoint ${IOT_ENDPOINT}"
    else
        warn "IoT provisioning failed - continuing without it"
    fi
fi

# -----------------------------------------------------------------------------
stage "Device configuration"
# -----------------------------------------------------------------------------
# Refresh the BLE provisioner from the repo before anything else.
#
# The image is a BASE, not the final word on Pi-side code. Without this, a fix
# to provisioner.py only reaches machines built after the next full image
# rebuild - so a two-line fix would mean recapturing and re-verifying a 2GB
# artifact, and every machine flashed from the older image carries the bug
# silently.
#
# That is not hypothetical. Golden image v3 was captured with a provisioner
# that could never complete BLE WiFi setup: the captive-portal hotspot holds
# wlan0 in AP mode, so `nmcli device wifi connect` only ever saw the machine's
# own hotspot and returned "No network with SSID 'X' found" regardless of the
# credentials. Every machine from that image would have failed a customer's
# first interaction with it. Syncing here makes the image's age stop being a
# correctness risk.
#
# Only the file, not a restart: rooted-ble is restarted in the Services stage
# below, once the identity it reads actually exists.
if [ -f "${PI_SRC}/provisioner.py" ]; then
    scpx "${PI_SRC}/provisioner.py" "${PI_USER}@${PI_HOST}:/tmp/provisioner.py" >/dev/null \
        && sudox "install -o root -g root -m 644 /tmp/provisioner.py ${REMOTE_DIR}/provisioner.py" \
        && sshx "rm -f /tmp/provisioner.py" >/dev/null 2>&1
    PV=$(sshx "grep -c HOTSPOT_CONNECTION ${REMOTE_DIR}/provisioner.py 2>/dev/null" 2>/dev/null | tr -d '\r')
    if [ "${PV:-0}" -gt 0 ]; then
        ok "provisioner.py synced from the repo (hotspot-aware WiFi join present)"
    else
        warn "provisioner.py synced but has no HOTSPOT_CONNECTION" "this build predates the AP-blocks-scan fix; BLE WiFi setup will fail for the customer"
    fi
else
    warn "no ${PI_SRC}/provisioner.py to sync" "the machine keeps whatever the image shipped"
fi

CFG="/tmp/rooted-device-config-$$.json"
if [ -n "$IOT_ENDPOINT" ]; then
    printf '{\n    "device_name": "%s",\n    "device_id": "%s",\n    "aws_iot_endpoint": "%s",\n    "aws_region": "us-west-2"\n}\n' \
        "$MACHINE_NAME" "$DEVICE_UUID" "$IOT_ENDPOINT" > "$CFG"
else
    printf '{\n    "device_name": "%s",\n    "device_id": "%s"\n}\n' "$MACHINE_NAME" "$DEVICE_UUID" > "$CFG"
fi
scpx "$CFG" "${PI_USER}@${PI_HOST}:${REMOTE_DIR}/device_config.json" >/dev/null || die "copying device_config.json"
rm -f "$CFG"
ok "device_config.json written"

# Render Vector's config from the PRISTINE template every time. The old flow
# sed'd the live file in place, so a re-provision with a new UUID found no
# placeholders left and silently kept publishing under the previous device id.
sudox "sed -e 's|@@AWS_IOT_ENDPOINT@@|${IOT_ENDPOINT}|g' -e 's|@@ROOTED_DEVICE_ID@@|${DEVICE_UUID}|g' ${REMOTE_DIR}/vector/rooted-telemetry.toml.template > ${REMOTE_DIR}/vector/rooted-telemetry.toml"
sshx "grep -q '@@' ${REMOTE_DIR}/vector/rooted-telemetry.toml" 2>/dev/null \
    && die "Vector config still has unsubstituted placeholders" || ok "Vector config rendered"

sudox "bash -c \"printf 'ROOTED_DEVICE_ID=%s\nAWS_IOT_ENDPOINT=%s\n' '${DEVICE_UUID}' '${IOT_ENDPOINT}' > /etc/default/vector\""
ok "/etc/default/vector written"

# -----------------------------------------------------------------------------
stage "Identity: hostname and Bluetooth"
# -----------------------------------------------------------------------------
sudox "hostnamectl set-hostname ${SYS_HOSTNAME}"
ok "hostname set to ${SYS_HOSTNAME}"

# BlueZ takes the advertised name from main.conf, but its hostname plugin
# overrides it with PRETTY_HOSTNAME when set - so both must agree.
sudox "mkdir -p /etc/bluetooth"
sudox "bash -c \"if [ ! -f /etc/bluetooth/main.conf ]; then printf '[General]\nName = %s\nDiscoverableTimeout = 0\nPairableTimeout = 0\n\n[Policy]\nAutoEnable=true\n' '${MACHINE_NAME}' > /etc/bluetooth/main.conf; else sed -i 's/^#\\?Name = .*/Name = ${MACHINE_NAME}/' /etc/bluetooth/main.conf; grep -q '^Name = ' /etc/bluetooth/main.conf || sed -i '/^\\[General\\]/a Name = ${MACHINE_NAME}' /etc/bluetooth/main.conf; fi\""
sudox "bash -c \"echo 'PRETTY_HOSTNAME=${MACHINE_NAME}' > /etc/machine-info\""
sudox "systemctl restart bluetooth"
ok "Bluetooth advertises as '${MACHINE_NAME}'"

# -----------------------------------------------------------------------------
stage "Services"
# -----------------------------------------------------------------------------
# These ship DISABLED in the golden image because without certificates they
# crash-loop. Enable them only now that the identity exists.
# Guarded restart. rooted-iot and rooted-vector declare After=time-sync.target,
# and on a Pi that has never been online this boot (no RTC, no NTP) that target
# NEVER completes - a plain `systemctl restart` queues behind it and blocks this
# script forever. The Office WiFi stage above normally prevents that by getting
# time synced first; this timeout is the backstop for offline runs. On timeout
# the start job stays queued in systemd and fires the moment time syncs (e.g.
# when the customer provisions WiFi on site) - the cold-boot verify is what
# confirms the final state either way.
start_guarded() {
    local unit="$1"
    sudox "systemctl enable ${unit}" >/dev/null 2>&1
    if sudox "timeout 45 systemctl restart ${unit}" >/dev/null 2>&1; then
        ok "${unit} enabled and started"
    else
        warn "${unit} start is QUEUED behind time-sync (no internet yet) - it will start once the clock syncs"
    fi
}
if sshx "[ -f ${REMOTE_DIR}/certs/certificate.pem.crt ]" 2>/dev/null; then
    sudox "mkdir -p /var/lib/vector"
    start_guarded rooted-iot.service
    [ -n "$IOT_ENDPOINT" ] && start_guarded rooted-vector.service
else
    warn "no certificates - rooted-iot and rooted-vector left disabled"
fi
sudox "timeout 45 systemctl restart rooted-ingest.service" >/dev/null 2>&1 && ok "rooted-ingest restarted" || warn "rooted-ingest restart queued or failed"

# -----------------------------------------------------------------------------
stage "Tailscale"
# -----------------------------------------------------------------------------
# Key handling: --tailscale-key wins; otherwise ~/.rooted-tailscale-key is read
# automatically. That file is written by the save-helper (see SETUP.md) as
#     KEY=tskey-auth-...
#     CREATED=YYYY-MM-DD
# so this script can do the "remember to refresh every 90 days" job for you.
# An EXPIRED auth key only blocks NEW joins - machines already on the tailnet
# are tagged and never expire - so the worst case is this stage failing here at
# the bench, where the fix is a 2-minute key regeneration and a re-run.
TS_KEY_FILE="${HOME}/.rooted-tailscale-key"
TS_KEY_AGE=""
if [ -z "$TAILSCALE_KEY" ] && [ -f "$TS_KEY_FILE" ]; then
    if grep -q '^KEY=' "$TS_KEY_FILE"; then
        TAILSCALE_KEY=$(grep -m1 '^KEY=' "$TS_KEY_FILE" | cut -d= -f2-)
        TS_CREATED=$(grep -m1 '^CREATED=' "$TS_KEY_FILE" | cut -d= -f2-)
        if [ -n "$TS_CREATED" ]; then
            TS_KEY_AGE=$(( ( $(date +%s) - $(date -j -f %Y-%m-%d "$TS_CREATED" +%s 2>/dev/null || echo 0) ) / 86400 ))
        fi
    else
        # Legacy format: file is the bare key.
        TAILSCALE_KEY=$(head -1 "$TS_KEY_FILE")
    fi
    [ -n "$TAILSCALE_KEY" ] && ok "using auth key from ${TS_KEY_FILE}${TS_KEY_AGE:+ (${TS_KEY_AGE} days old)}"
fi

if [ -n "$TS_KEY_AGE" ] && [ "$TS_KEY_AGE" -ge 75 ]; then
    warn "auth key is ${TS_KEY_AGE} days old - Tailscale keys live at most 90."
    warn "Regenerate soon (admin console -> Settings -> Keys) and re-run the"
    warn "save-helper, or this stage will start failing at the bench."
fi

if [ -n "$TAILSCALE_KEY" ]; then
    if sshx "command -v tailscale >/dev/null" 2>/dev/null; then
        if sudox "tailscale up --authkey=${TAILSCALE_KEY} --hostname=${SYS_HOSTNAME} --accept-dns=false"; then
            ok "joined the tailnet as ${SYS_HOSTNAME}"
        else
            warn "tailscale up FAILED."
            if [ -n "$TS_KEY_AGE" ] && [ "$TS_KEY_AGE" -ge 85 ]; then
                warn "The key is ${TS_KEY_AGE} days old - almost certainly expired."
            fi
            warn "Fix: regenerate the key (reusable + pre-authorized + tag:rooted-machine),"
            warn "re-run the save-helper, then re-run this script - it is safe to re-run"
            warn "and will skip everything already done. Existing machines are unaffected."
        fi
    else
        warn "tailscale not installed on this Pi (should be in the golden image)"
    fi
else
    warn "no auth key (flag or ~/.rooted-tailscale-key) - join manually: sudo tailscale up"
fi

# -----------------------------------------------------------------------------
if [ "$DO_REBOOT" = "true" ]; then
stage "Cold-boot test"
# -----------------------------------------------------------------------------
# `systemctl start` proves a service runs; it does NOT prove it comes up on its
# own after a power cycle. Wrong ordering or a missing After= shows up only on a
# cold boot - and these machines get power-cycled in the field constantly.
# rooted-iot and rooted-vector both depend on network-online.target and
# time-sync.target, the classic sources of boot-order flakiness.
    echo "  rebooting ${PI_HOST}..."
    sudox "systemd-run --on-active=1 systemctl reboot" >/dev/null 2>&1 || sudox "reboot" >/dev/null 2>&1 || true
    sleep 15
    echo -n "  waiting for it to come back"
    BACK="false"
    for i in $(seq 1 60); do
        if ssh -o StrictHostKeyChecking=accept-new -o BatchMode=yes -o ConnectTimeout=5 \
             "${PI_USER}@${PI_HOST}" true 2>/dev/null; then BACK="true"; break; fi
        echo -n "."; sleep 5
    done
    echo ""
    if [ "$BACK" = "true" ]; then
        ok "back up after reboot"
        # Give the units their Restart=10s window before judging them.
        sleep 20
        if [ -x "${PI_SRC}/verify-pi.sh" ]; then
            echo ""
            echo -e "${BLUE}--- verify-pi.sh (post-reboot) ---${NC}"
            "${PI_SRC}/verify-pi.sh" --host "${PI_HOST}" --user "${PI_USER}"
            VERIFY_RC=$?
        fi
    else
        die "did not come back within 5 minutes - check it on HDMI"
    fi
fi

# -----------------------------------------------------------------------------
stage "Deployment ledger"
# -----------------------------------------------------------------------------
# Records which golden image this machine was built from, without ever copying
# the multi-GB image anywhere. The image id comes from /etc/rooted-image-release,
# baked in by build-golden-image.sh at capture time; the customer is already
# encoded in the machine name (TYPE-customer-n). One committed CSV answers
# "which image is that customer's machine running?" forever.
IMAGE_ID=$(sshx "grep -s '^IMAGE_ID=' /etc/rooted-image-release 2>/dev/null | cut -d= -f2" 2>/dev/null | tr -d '\r')
IMAGE_ID=${IMAGE_ID:-unknown-pre-release-image}
LEDGER="${SCRIPT_DIR}/images/DEPLOYMENTS.csv"
if [ -f "$LEDGER" ]; then
    if grep -q ",${DEVICE_UUID}," "$LEDGER"; then
        ok "already in DEPLOYMENTS.csv (re-personalization run)"
    else
        printf '%s,%s,%s,%s,%s\n' "$(date +%Y-%m-%d)" "$MACHINE_NAME" "$DEVICE_UUID" "$IMAGE_ID" "" >> "$LEDGER"
        ok "recorded in golden-image/images/DEPLOYMENTS.csv (image: ${IMAGE_ID})"
        warn "remember to commit the ledger: git add pi-src/golden-image/images/DEPLOYMENTS.csv"
    fi
else
    warn "no ${LEDGER} - deployment not recorded"
fi

# -----------------------------------------------------------------------------
echo ""
echo -e "${GREEN}===============================================${NC}"
echo -e "${GREEN}  Personalization complete                     ${NC}"
echo -e "${GREEN}===============================================${NC}"
echo "  Machine:   ${MACHINE_NAME}"
echo "  Hostname:  ${SYS_HOSTNAME}"
echo "  Device ID: ${DEVICE_UUID}"
echo "  Endpoint:  ${IOT_ENDPOINT:-<not provisioned>}"
echo "  Image:     ${IMAGE_ID}"
echo ""
if [ "$DO_REBOOT" != "true" ]; then
echo -e "${YELLOW}Verify (and prove it survives a power cycle):${NC}"
echo "  ./personalize-pi.sh --host ${PI_HOST} --reboot"
echo "  ../verify-pi.sh --host ${PI_HOST}"
echo ""
fi
echo -e "${YELLOW}Save the Device ID.${NC} Then add the customer machine code from"
echo "rooted-machines-code/customer-code/<customer>/<machine>/pi/."
