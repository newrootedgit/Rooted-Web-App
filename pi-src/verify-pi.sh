#!/bin/bash
# =============================================================================
# Rooted Robotics - verify a Pi is actually provisioned correctly
# =============================================================================
# Replaces "reboot and pray it shows up in the browser" with a checklist.
#
# Runs from your Mac, SSHes into the Pi and checks every artifact the setup is
# supposed to leave behind: cloud-init completion, the venv, the Vector binary,
# IoT certs, the rendered Vector config, all five systemd units, the Bluetooth
# name, the network layout, and a real mutual-TLS handshake against AWS IoT.
#
# Usage:
#   ./verify-pi.sh                                   # prompts for host
#   ./verify-pi.sh --host harvester-07.local
#   ./verify-pi.sh --host 192.168.10.1 --user rooted
#   ./verify-pi.sh --host harvester-07.local --stage firstboot
#
# Flags:
#   --host HOST     Pi hostname or IP (default: prompt)
#   --user USER     SSH username (default: rooted)
#   --stage STAGE   'firstboot' = only check cloud-init finished and the base
#                   install landed. Use right after flashing, before running
#                   deploy-to-pi-one.sh. Default 'full' checks everything.
#
# Exit code is 0 only when nothing FAILed, so it is safe to gate a script on.
# =============================================================================

set -uo pipefail

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; BLUE='\033[0;34m'; NC='\033[0m'

PI_HOST=""; PI_USER="rooted"; STAGE="full"

while [[ $# -gt 0 ]]; do
    case "$1" in
        --host)  PI_HOST="$2"; shift 2 ;;
        --user)  PI_USER="$2"; shift 2 ;;
        --stage) STAGE="$2"; shift 2 ;;
        -h|--help) sed -n '2,28p' "${BASH_SOURCE[0]}"; exit 0 ;;
        *) echo -e "${RED}Unknown option: $1${NC}"; exit 1 ;;
    esac
done

case "$STAGE" in
    firstboot|full) ;;
    *) echo -e "${RED}--stage must be 'firstboot' or 'full'.${NC}"; exit 1 ;;
esac

echo -e "${BLUE}=============================================${NC}"
echo -e "${BLUE}  Rooted Robotics - Verify Pi Setup          ${NC}"
echo -e "${BLUE}=============================================${NC}"
echo ""

if [ -z "$PI_HOST" ]; then
    read -p "Pi hostname or IP: " PI_HOST
fi
[ -n "$PI_HOST" ] || { echo -e "${RED}Host cannot be empty.${NC}"; exit 1; }

# -----------------------------------------------------------------------------
# Connect - prefer key auth, fall back to a password only if the key is refused
# -----------------------------------------------------------------------------
SSH_OPTS=(-o StrictHostKeyChecking=no -o ConnectTimeout=10)
SSH_PREFIX=()

echo "Connecting to ${PI_USER}@${PI_HOST}..."
if ssh "${SSH_OPTS[@]}" -o BatchMode=yes "${PI_USER}@${PI_HOST}" true 2>/dev/null; then
    echo -e "${GREEN}Connected (SSH key)${NC}"
else
    echo -e "${YELLOW}Key auth unavailable - falling back to password.${NC}"
    if ! command -v sshpass &>/dev/null; then
        echo -e "${RED}sshpass not installed and key auth failed.${NC}"
        echo "Either install it (brew install hudochenkov/sshpass/sshpass) or make"
        echo "sure the key in your boot config matches the one you are using."
        exit 1
    fi
    read -s -p "SSH password for ${PI_USER}@${PI_HOST}: " SSH_PASSWORD; echo ""
    if ! sshpass -p "$SSH_PASSWORD" ssh "${SSH_OPTS[@]}" -o NumberOfPasswordPrompts=1 \
         "${PI_USER}@${PI_HOST}" true 2>/dev/null; then
        echo -e "${RED}SSH login failed. Check the host, username and password.${NC}"
        exit 1
    fi
    SSH_PREFIX=(sshpass -p "$SSH_PASSWORD")
    echo -e "${GREEN}Connected (password)${NC}"
fi
echo ""

# -----------------------------------------------------------------------------
# The checks themselves run on the Pi. The script is staged into a temp file and
# fed to `bash -s` over stdin, rather than being embedded directly in the ssh
# command substitution. Two reasons:
#   - a quoted heredoc stops the LOCAL shell expanding $VAR, backticks and
#     quotes on the way over
#   - a heredoc written inline inside $( ... ) breaks bash's paren matching as
#     soon as the body contains an unbalanced ')', which every `case` pattern
#     below does. Staging through a file sidesteps that entirely.
# -----------------------------------------------------------------------------
REMOTE_SCRIPT_FILE="$(mktemp -t rooted-verify)"
trap 'rm -f "$REMOTE_SCRIPT_FILE"' EXIT

cat > "$REMOTE_SCRIPT_FILE" <<'REMOTE_CHECKS'
set -uo pipefail

PASS_COUNT=0; FAIL_COUNT=0; WARN_COUNT=0
REMOTE_DIR=/opt/rooted-ble

pass() { echo "PASS|$1"; PASS_COUNT=$((PASS_COUNT+1)); }
fail() { echo "FAIL|$1|${2:-}"; FAIL_COUNT=$((FAIL_COUNT+1)); }
warn() { echo "WARN|$1|${2:-}"; WARN_COUNT=$((WARN_COUNT+1)); }

echo "SECTION|First boot"

# --- cloud-init ---------------------------------------------------------------
# write-boot-config.sh's user-data ends by writing .first-boot-complete. That
# marker is what distinguishes "still installing" from "install failed" - a slow
# Pi and a broken Pi are otherwise indistinguishable from the outside.
if [ -f "${REMOTE_DIR}/.first-boot-complete" ]; then
    pass "cloud-init first boot completed ($(cat ${REMOTE_DIR}/.first-boot-complete 2>/dev/null))"
elif command -v cloud-init &>/dev/null; then
    CI_STATUS=$(cloud-init status 2>/dev/null | head -1)
    if echo "$CI_STATUS" | grep -q running; then
        warn "cloud-init is STILL RUNNING - first boot has not finished" "wait, then re-run; watch with: sudo cloud-init status --wait"
    else
        fail "cloud-init finished but left no completion marker" "the stamp may not have applied, or a runcmd failed: sudo cloud-init status --long; sudo journalctl -u cloud-final -n 50"
    fi
else
    warn "no cloud-init on this Pi" "set up by hand rather than via write-boot-config.sh"
fi

# --- account ------------------------------------------------------------------
if id rooted &>/dev/null; then
    pass "user 'rooted' exists"
else
    fail "user 'rooted' does not exist" "rooted-iot/-ingest/-vector all run as User=rooted and hardcode /home/rooted"
fi

if sudo -n true 2>/dev/null; then
    pass "passwordless sudo works"
else
    warn "passwordless sudo not configured" "deploy scripts still need a password; harmless but slower"
fi

# --- base install -------------------------------------------------------------
if [ -x "${REMOTE_DIR}/.venv/bin/python3" ]; then
    pass "Python venv present"
    MISSING=""
    for mod in bluezero awscrt dbus; do
        "${REMOTE_DIR}/.venv/bin/python3" -c "import ${mod}" 2>/dev/null || MISSING="${MISSING} ${mod}"
    done
    if [ -z "$MISSING" ]; then
        pass "venv dependencies import cleanly"
    else
        fail "venv is missing modules:${MISSING}" "re-run: ${REMOTE_DIR}/.venv/bin/pip install -r ${REMOTE_DIR}/requirements.txt (needs internet)"
    fi
else
    fail "Python venv missing at ${REMOTE_DIR}/.venv" "run deploy-to-pi-one.sh while the Pi has internet"
fi

# rooted-vector.service hardcodes this exact path in ExecStart.
if [ -x /home/rooted/.vector/bin/vector ]; then
    pass "Vector binary at /home/rooted/.vector/bin/vector"
else
    fail "Vector binary missing at /home/rooted/.vector/bin/vector" "rooted-vector.service ExecStart points here; run deploy-to-pi-one.sh with internet"
fi

# Vector exits with config error 78 and crash-loops if data_dir does not exist.
if [ -d /var/lib/vector ]; then
    pass "Vector data_dir /var/lib/vector exists"
else
    fail "/var/lib/vector missing" "Vector will exit 78 on start; fix: sudo mkdir -p /var/lib/vector"
fi

# --- root filesystem size ------------------------------------------------------
# A golden image is captured with a SHRUNK root so it flashes fast, and
# personalize-pi.sh grows it back on first run. If that grow silently failed the
# machine runs on the shrunk partition - and Vector's disk buffer alone is capped
# at 256MB, with telemetry_log.jsonl and journald on top, so it fills within
# weeks and then fails in ways that look like anything but a disk problem.
ROOT_TOTAL_G=$(df -BG --output=size / 2>/dev/null | tail -1 | tr -dc '0-9')
ROOT_AVAIL_G=$(df -BG --output=avail / 2>/dev/null | tail -1 | tr -dc '0-9')
DISK_TOTAL_G=$(lsblk -bdno SIZE "$(lsblk -no PKNAME "$(findmnt -no SOURCE /)" 2>/dev/null | head -1 | sed 's|^|/dev/|')" 2>/dev/null | awk '{printf "%d", $1/1024/1024/1024}')

if [ -n "$ROOT_TOTAL_G" ] && [ -n "$DISK_TOTAL_G" ] && [ "$DISK_TOTAL_G" -gt 0 ]; then
    # Unclaimed space beyond ~4GB means the filesystem never grew to fill the disk.
    UNCLAIMED=$((DISK_TOTAL_G - ROOT_TOTAL_G))
    if [ "$UNCLAIMED" -gt 4 ]; then
        fail "root filesystem is ${ROOT_TOTAL_G}GB on a ${DISK_TOTAL_G}GB disk - ${UNCLAIMED}GB unclaimed" \
             "growpart/resize2fs did not run; fix: sudo growpart /dev/mmcblk0 2 && sudo resize2fs /dev/mmcblk0p2"
    else
        pass "root filesystem ${ROOT_TOTAL_G}GB fills the ${DISK_TOTAL_G}GB disk"
    fi
elif [ -n "$ROOT_AVAIL_G" ]; then
    pass "root filesystem ${ROOT_TOTAL_G:-?}GB total, ${ROOT_AVAIL_G}GB free"
fi

if [ -n "$ROOT_AVAIL_G" ] && [ "$ROOT_AVAIL_G" -lt 2 ]; then
    fail "only ${ROOT_AVAIL_G}GB free on /" "Vector's 256MB buffer plus telemetry logs will fill this"
fi

if command -v avahi-daemon &>/dev/null && systemctl is-active --quiet avahi-daemon; then
    pass "avahi-daemon running (<hostname>.local resolves)"
else
    warn "avahi-daemon not running" "you will have to find this Pi by IP instead of hostname.local"
fi

if [ "$STAGE" = "firstboot" ]; then
    echo "TOTALS|${PASS_COUNT}|${FAIL_COUNT}|${WARN_COUNT}"
    exit 0
fi

# =============================================================================
echo "SECTION|Device identity"
# =============================================================================
DEVICE_ID=""; DEVICE_NAME=""; IOT_ENDPOINT=""
if [ -f "${REMOTE_DIR}/device_config.json" ]; then
    DEVICE_ID=$(python3 -c "import json;print(json.load(open('${REMOTE_DIR}/device_config.json')).get('device_id',''))" 2>/dev/null)
    DEVICE_NAME=$(python3 -c "import json;print(json.load(open('${REMOTE_DIR}/device_config.json')).get('device_name',''))" 2>/dev/null)
    IOT_ENDPOINT=$(python3 -c "import json;print(json.load(open('${REMOTE_DIR}/device_config.json')).get('aws_iot_endpoint',''))" 2>/dev/null)

    if [ -n "$DEVICE_ID" ]; then
        pass "device_config.json valid - ${DEVICE_NAME:-<unnamed>} / ${DEVICE_ID}"
    else
        fail "device_config.json has no device_id" "re-run deploy-to-pi-two.sh"
    fi
    [ -n "$IOT_ENDPOINT" ] || fail "device_config.json has no aws_iot_endpoint" "IoT provisioning was skipped or failed in deploy-to-pi-two.sh"
else
    fail "device_config.json missing" "run deploy-to-pi-two.sh"
fi

# --- IoT certificates ---------------------------------------------------------
CERTS_OK=1
for f in certificate.pem.crt private.pem.key AmazonRootCA1.pem; do
    if [ -f "${REMOTE_DIR}/certs/${f}" ]; then :; else
        fail "missing cert: certs/${f}"; CERTS_OK=0
    fi
done
[ "$CERTS_OK" = "1" ] && pass "AWS IoT certificates present"

if [ -f "${REMOTE_DIR}/certs/private.pem.key" ]; then
    MODE=$(stat -c '%a' "${REMOTE_DIR}/certs/private.pem.key" 2>/dev/null)
    if [ "$MODE" = "600" ]; then
        pass "private key permissions are 600"
    else
        warn "private key is mode ${MODE}, expected 600" "fix: chmod 600 ${REMOTE_DIR}/certs/private.pem.key"
    fi
fi

# =============================================================================
echo "SECTION|Vector configuration"
# =============================================================================
TOML="${REMOTE_DIR}/vector/rooted-telemetry.toml"
if [ -f "$TOML" ]; then
    # The deploy scripts sed @@PLACEHOLDER@@ tokens out of this file in place.
    if grep -q '@@' "$TOML"; then
        fail "Vector config still contains unsubstituted @@ placeholders" "deploy-to-pi-two.sh did not finish its sed step; re-run finish-pi-setup.sh"
    else
        pass "Vector config placeholders substituted"

        # This is the known footgun: only deploy-to-pi-one.sh copies a fresh
        # rooted-telemetry.toml. Re-running deploy-to-pi-two.sh alone with a new
        # UUID finds no placeholders left to replace, so the config silently
        # keeps publishing under the PREVIOUS device id while device_config.json
        # and /etc/default/vector both show the new one.
        TOML_ID=$(grep -oP '(?<=^client_id = ")[^"]+' "$TOML" 2>/dev/null | sed 's/-vector$//')
        if [ -n "$DEVICE_ID" ] && [ -n "$TOML_ID" ]; then
            if [ "$TOML_ID" = "$DEVICE_ID" ]; then
                pass "Vector config device id matches device_config.json"
            else
                fail "Vector config device id MISMATCH: toml=${TOML_ID} config=${DEVICE_ID}" "telemetry is publishing under the wrong device; re-copy the toml from the repo then re-run finish-pi-setup.sh"
            fi
        fi

        TOML_EP=$(grep -oP '(?<=^host = ")[^"]+' "$TOML" 2>/dev/null)
        if [ -n "$IOT_ENDPOINT" ] && [ -n "$TOML_EP" ] && [ "$TOML_EP" != "$IOT_ENDPOINT" ]; then
            fail "Vector config endpoint MISMATCH: toml=${TOML_EP} config=${IOT_ENDPOINT}" "same cause as an id mismatch - stale toml"
        fi
    fi
else
    fail "Vector config missing at ${TOML}" "run deploy-to-pi-one.sh"
fi

# rooted-vector.service declares EnvironmentFile without a '-' prefix, so a
# missing file makes the unit fail to start outright.
if [ -f /etc/default/vector ]; then
    ENV_ID=$(grep -oP '(?<=^ROOTED_DEVICE_ID=).*' /etc/default/vector 2>/dev/null)
    if [ -n "$DEVICE_ID" ] && [ "$ENV_ID" != "$DEVICE_ID" ]; then
        warn "/etc/default/vector device id (${ENV_ID}) != device_config.json (${DEVICE_ID})" "cosmetic today - the toml is what Vector actually reads - but a sign of a partial re-provision"
    else
        pass "/etc/default/vector consistent"
    fi
else
    fail "/etc/default/vector missing" "rooted-vector.service uses EnvironmentFile= without '-', so it will refuse to start"
fi

# =============================================================================
echo "SECTION|Services"
# =============================================================================
check_unit() {
    local unit="$1" required="$2"
    if ! systemctl list-unit-files "$unit" &>/dev/null || \
       [ -z "$(systemctl list-unit-files "$unit" --no-legend 2>/dev/null)" ]; then
        if [ "$required" = "required" ]; then
            fail "${unit} is not installed" "run deploy-to-pi-two.sh"
        else
            warn "${unit} is not installed"
        fi
        return
    fi

    local enabled active
    enabled=$(systemctl is-enabled "$unit" 2>/dev/null || echo unknown)
    active=$(systemctl is-active "$unit" 2>/dev/null || echo unknown)

    if [ "$active" = "active" ] && { [ "$enabled" = "enabled" ] || [ "$enabled" = "static" ]; }; then
        pass "${unit} (${active}, ${enabled})"
    elif [ "$active" = "active" ]; then
        warn "${unit} is running but ${enabled} - it will NOT come back after reboot" "fix: sudo systemctl enable ${unit}"
    else
        fail "${unit} is ${active} (${enabled})" "logs: sudo journalctl -u ${unit} -n 40 --no-pager"
    fi

    # A unit that restarts constantly reports 'active' at any instant, so status
    # alone would call a crash-loop healthy. But NRestarts is CUMULATIVE for the
    # life of the unit and never resets - a service that crash-looped while the
    # Pi had no internet and then recovered still shows a high count forever.
    # So a high count only means something if the service ALSO has not stayed up
    # long: check how long it has been in the active state.
    local nrestarts uptime_s enter_ts
    nrestarts=$(systemctl show "$unit" -p NRestarts --value 2>/dev/null || echo 0)
    if [ "${nrestarts:-0}" -gt 5 ]; then
        enter_ts=$(systemctl show "$unit" -p ActiveEnterTimestampMonotonic --value 2>/dev/null)
        # Monotonic clock in microseconds since boot; compare against uptime.
        if [ -n "$enter_ts" ] && [ "$enter_ts" -gt 0 ] 2>/dev/null; then
            local now_us
            now_us=$(awk '{printf "%.0f", $1 * 1000000}' /proc/uptime 2>/dev/null)
            uptime_s=$(( (now_us - enter_ts) / 1000000 ))
        else
            uptime_s=0
        fi
        if [ "${uptime_s:-0}" -lt 120 ]; then
            fail "${unit} has restarted ${nrestarts} times and has only been up ${uptime_s}s - it is crash-looping" \
                 "logs: sudo journalctl -u ${unit} -n 40 --no-pager"
        else
            warn "${unit} has ${nrestarts} historical restarts but has been stable for ${uptime_s}s" \
                 "the count is cumulative and never resets - likely from an earlier outage"
        fi
    fi
}

check_unit captive-portal.service required
check_unit rooted-ble.timer      required
check_unit rooted-iot.service    required
check_unit rooted-ingest.service required
check_unit rooted-vector.service required

# =============================================================================
echo "SECTION|Bluetooth"
# =============================================================================
if systemctl is-active --quiet bluetooth; then
    pass "bluetooth service active"
else
    fail "bluetooth service not active" "the mobile app will not see this machine over BLE"
fi

if [ -f /etc/machine-info ]; then
    PRETTY=$(grep -oP '(?<=^PRETTY_HOSTNAME=).*' /etc/machine-info 2>/dev/null | tr -d '"')
    if [ -n "$DEVICE_NAME" ] && [ "$PRETTY" != "$DEVICE_NAME" ]; then
        warn "Bluetooth name '${PRETTY}' != machine name '${DEVICE_NAME}'" "the app will advertise under the wrong name; re-run finish-pi-setup.sh"
    elif [ -n "$PRETTY" ]; then
        pass "Bluetooth advertises as '${PRETTY}'"
    fi
else
    warn "/etc/machine-info missing" "BlueZ will fall back to the system hostname for the advertised name"
fi

# =============================================================================
echo "SECTION|Network"
# =============================================================================
# eth0 is the direct-cable service link, owned by systemd-networkd via
# 99-eth0-static.yaml so that setup-nm.sh stubbing out 50-cloud-init.yaml
# cannot take it away.
ETH_IP=$(ip -4 addr show eth0 2>/dev/null | grep -oP '(?<=inet\s)\d+(\.\d+){3}' | head -1)
if [ "$ETH_IP" = "192.168.10.1" ]; then
    pass "eth0 static IP 192.168.10.1"
elif [ -n "$ETH_IP" ]; then
    warn "eth0 has ${ETH_IP}, expected 192.168.10.1" "direct-cable access will not work at the documented address"
else
    warn "eth0 has no IPv4 address" "expected if no cable is attached"
fi

if command -v nmcli &>/dev/null; then
    WLAN_STATE=$(nmcli -t -f DEVICE,STATE device status 2>/dev/null | grep '^wlan0:' | cut -d: -f2)
    case "$WLAN_STATE" in
        connected)            pass "wlan0 managed by NetworkManager (connected)" ;;
        disconnected)         pass "wlan0 managed by NetworkManager (disconnected, ready to provision)" ;;
        unmanaged|"")         fail "wlan0 is '${WLAN_STATE:-absent}' to NetworkManager" "BLE/captive-portal provisioning cannot drive WiFi; re-run setup-nm.sh" ;;
        *)                    warn "wlan0 state is '${WLAN_STATE}'" ;;
    esac

    # setup-nm.sh deliberately marks eth0 unmanaged. If NM grabs it, it will
    # fight systemd-networkd over the static address.
    ETH_STATE=$(nmcli -t -f DEVICE,STATE device status 2>/dev/null | grep '^eth0:' | cut -d: -f2)
    if [ "$ETH_STATE" = "unmanaged" ] || [ -z "$ETH_STATE" ]; then
        pass "eth0 correctly left unmanaged by NetworkManager"
    else
        warn "NetworkManager is managing eth0 (state: ${ETH_STATE})" "it will fight systemd-networkd over 192.168.10.1"
    fi
else
    fail "nmcli not installed" "NetworkManager is required for WiFi provisioning"
fi

# =============================================================================
echo "SECTION|AWS IoT connectivity"
# =============================================================================
# This is the check that actually answers "will it show up in the webapp?".
# Everything above can pass while the cert is revoked, the policy is wrong or
# the network blocks 8883 - only a real handshake proves the path works.
if [ -n "$IOT_ENDPOINT" ] && [ -f "${REMOTE_DIR}/certs/certificate.pem.crt" ]; then
    if ! getent hosts "$IOT_ENDPOINT" >/dev/null 2>&1; then
        fail "cannot resolve IoT endpoint ${IOT_ENDPOINT}" "the Pi has no working DNS - is it on WiFi yet?"
    else
        pass "IoT endpoint resolves"
        TLS_OUT=$(echo | timeout 15 openssl s_client -connect "${IOT_ENDPOINT}:8883" \
            -CAfile "${REMOTE_DIR}/certs/AmazonRootCA1.pem" \
            -cert "${REMOTE_DIR}/certs/certificate.pem.crt" \
            -key "${REMOTE_DIR}/certs/private.pem.key" 2>&1)
        if echo "$TLS_OUT" | grep -q "Verify return code: 0"; then
            pass "mutual-TLS handshake with AWS IoT succeeded"
        else
            REASON=$(echo "$TLS_OUT" | grep -m1 "Verify return code:" || echo "connection failed")
            fail "mutual-TLS handshake with AWS IoT FAILED (${REASON})" "check the cert is active and the IoT policy is attached: aws iot list-thing-principals --thing-name ${DEVICE_ID}"
        fi
    fi
else
    warn "skipping IoT handshake - no endpoint or certificates" "this machine will never appear online in the webapp"
fi

# The Vector source tails this file; if nothing ever writes it, telemetry is
# silently empty even with every service green.
if [ -f /home/rooted/telemetry_log.jsonl ]; then
    LINES=$(wc -l < /home/rooted/telemetry_log.jsonl 2>/dev/null || echo 0)
    if [ "${LINES:-0}" -gt 0 ]; then
        pass "telemetry log has ${LINES} record(s)"
    else
        warn "telemetry log exists but is empty" "expected until the ClearCore starts sending UDP"
    fi
else
    warn "no /home/rooted/telemetry_log.jsonl yet" "created by rooted-ingest.service on the first UDP packet from the ClearCore"
fi

echo "TOTALS|${PASS_COUNT}|${FAIL_COUNT}|${WARN_COUNT}"
REMOTE_CHECKS

# The ${arr[@]+"${arr[@]}"} form is deliberate: macOS ships bash 3.2, where
# expanding an empty array as "${arr[@]}" under `set -u` aborts with "unbound
# variable". SSH_PREFIX is empty whenever key auth worked, i.e. the common case.
REMOTE_OUTPUT=$(${SSH_PREFIX[@]+"${SSH_PREFIX[@]}"} ssh "${SSH_OPTS[@]}" \
    "${PI_USER}@${PI_HOST}" "STAGE='${STAGE}' bash -s" < "$REMOTE_SCRIPT_FILE")
SSH_RC=$?
if [ $SSH_RC -ne 0 ] && [ -z "$REMOTE_OUTPUT" ]; then
    echo -e "${RED}Failed to run checks on the Pi (ssh exited ${SSH_RC}).${NC}"
    exit 1
fi

# -----------------------------------------------------------------------------
# Render results
# -----------------------------------------------------------------------------
FAILS=0; WARNS=0; PASSES=0
while IFS= read -r line; do
    KIND="${line%%|*}"; REST="${line#*|}"
    case "$KIND" in
        SECTION)
            echo ""
            echo -e "${BLUE}${REST}${NC}"
            echo "────────────────────────────────────────────"
            ;;
        PASS) echo -e "  ${GREEN}✓${NC} ${REST}" ;;
        WARN)
            MSG="${REST%%|*}"; HINT="${REST#*|}"
            echo -e "  ${YELLOW}!${NC} ${MSG}"
            [ -n "$HINT" ] && [ "$HINT" != "$MSG" ] && echo -e "      ${YELLOW}→ ${HINT}${NC}"
            ;;
        FAIL)
            MSG="${REST%%|*}"; HINT="${REST#*|}"
            echo -e "  ${RED}✗${NC} ${MSG}"
            [ -n "$HINT" ] && [ "$HINT" != "$MSG" ] && echo -e "      ${RED}→ ${HINT}${NC}"
            ;;
        TOTALS)
            PASSES="${REST%%|*}"; REST="${REST#*|}"
            FAILS="${REST%%|*}"; WARNS="${REST#*|}"
            ;;
    esac
done <<< "$REMOTE_OUTPUT"

echo ""
echo -e "${BLUE}=============================================${NC}"
if [ "${FAILS:-0}" -eq 0 ]; then
    echo -e "${GREEN}  All checks passed${NC}  (${PASSES} ok, ${WARNS} warning(s))"
    echo -e "${BLUE}=============================================${NC}"
    if [ "$STAGE" = "firstboot" ]; then
        echo ""
        echo "First boot is complete. Next: ./deploy-to-pi-one.sh"
        echo "  host: ${PI_HOST}   user: ${PI_USER}"
    else
        echo ""
        echo "This Pi should appear online in the webapp."
    fi
    exit 0
else
    echo -e "${RED}  ${FAILS} check(s) FAILED${NC}  (${PASSES} ok, ${WARNS} warning(s))"
    echo -e "${BLUE}=============================================${NC}"
    echo ""
    echo "Fix the ✗ items above, then re-run this script."
    exit 1
fi
