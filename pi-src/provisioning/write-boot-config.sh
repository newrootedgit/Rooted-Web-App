#!/bin/bash
# =============================================================================
# Rooted Robotics - stamp cloud-init config onto a freshly flashed Pi
# =============================================================================
# Run on your Mac AFTER Raspberry Pi Imager finishes writing Ubuntu 24.04,
# while the boot partition is still mounted. Writes three files:
#
#   user-data       <- user-data.template      (user, packages, venv, Vector)
#   network-config  <- network-config.template (WiFi so first boot is online)
#   meta-data       <- instance-id, so cloud-init treats this as a fresh instance
#
# Do NOT also fill in Pi Imager's advanced options - Imager writes the same two
# filenames and whichever runs last wins. Use one or the other.
#
# Full flow:
#   1. Flash Ubuntu 24.04 with Imager (no advanced options)
#   2. ./write-boot-config.sh --hostname <name>
#   3. Eject, give the Pi PROPER POWER, boot, wait 5-10 min
#   4. ./verify-pi.sh --host <name>.local --stage firstboot
#   5. ./deploy-to-pi-one.sh   (fast now - apt/pip/Vector already done)
#   6. ./deploy-to-pi-two.sh   (over the ethernet cable)
#   7. ./verify-pi.sh --host 192.168.10.1
#
# Usage:
#   ./write-boot-config.sh                          # fully interactive
#   ./write-boot-config.sh --hostname harvester-07 --ssid "Shop WiFi"
#
# Flags (any omitted value is prompted for):
#   --hostname NAME      Pi hostname; also its mDNS name (NAME.local)
#   --ssid SSID          WiFi network to join on first boot
#   --psk PASSWORD       WiFi passphrase or 64-hex PSK
#   --pubkey PATH        SSH public key to install (default: autodetected)
#   --password PASSWORD  Password for the 'rooted' account
#   --boot-dir PATH      Boot partition (default: autodetected)
#   --timezone TZ        Default: America/Denver
#   --regdom CC          WiFi regulatory domain (default: US)
#   --upgrade            Run a full `apt upgrade` on first boot (slow)
#   --no-password        Key-only login; no password for 'rooted'
# =============================================================================

set -euo pipefail

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; BLUE='\033[0;34m'; NC='\033[0m'
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

HOSTNAME_ARG=""; WIFI_SSID=""; WIFI_PSK=""; PUBKEY_PATH=""
ROOTED_PASSWORD=""; BOOT_DIR=""; PACKAGE_UPGRADE="false"; NO_PASSWORD="false"
TIMEZONE="America/Denver"; WIFI_REGDOM="US"

while [[ $# -gt 0 ]]; do
    case "$1" in
        --hostname)     HOSTNAME_ARG="$2"; shift 2 ;;
        --ssid)         WIFI_SSID="$2"; shift 2 ;;
        --psk)          WIFI_PSK="$2"; shift 2 ;;
        --pubkey)       PUBKEY_PATH="$2"; shift 2 ;;
        --password)     ROOTED_PASSWORD="$2"; shift 2 ;;
        --boot-dir)     BOOT_DIR="$2"; shift 2 ;;
        --timezone)     TIMEZONE="$2"; shift 2 ;;
        --regdom)       WIFI_REGDOM="$2"; shift 2 ;;
        --upgrade)      PACKAGE_UPGRADE="true"; shift ;;
        --no-password)  NO_PASSWORD="true"; shift ;;
        -h|--help)      sed -n '2,40p' "${BASH_SOURCE[0]}"; exit 0 ;;
        *) echo -e "${RED}Unknown option: $1${NC}"; exit 1 ;;
    esac
done

echo -e "${BLUE}=============================================${NC}"
echo -e "${BLUE}  Rooted Robotics - Stamp Pi Boot Config     ${NC}"
echo -e "${BLUE}=============================================${NC}"
echo ""

# -----------------------------------------------------------------------------
# Locate the boot partition
# -----------------------------------------------------------------------------
if [ -z "$BOOT_DIR" ]; then
    for candidate in /Volumes/system-boot /Volumes/boot /Volumes/bootfs /boot/firmware; do
        if [ -d "$candidate" ] && [ -f "$candidate/user-data" ]; then
            BOOT_DIR="$candidate"; break
        fi
    done
fi

if [ -z "$BOOT_DIR" ] || [ ! -d "$BOOT_DIR" ]; then
    echo -e "${RED}Could not find the Pi's boot partition.${NC}"
    echo ""
    echo "Currently mounted volumes:"
    ls -1 /Volumes 2>/dev/null | sed 's/^/  /'
    echo ""
    echo -e "${YELLOW}SD card (Pi 4/5):${NC} flash with Imager, then re-insert the card."
    echo ""
    echo -e "${YELLOW}eMMC (Compute Module 4/5):${NC} there is no card to re-insert. Put the"
    echo "module back into USB mass-storage mode so its eMMC is exported again:"
    echo ""
    echo "  sudo ~/usbboot/rpiboot -d ~/usbboot/mass-storage-gadget64"
    echo ""
    echo "The module must be in usbboot mode first: fit the nRPIBOOT jumper, or on"
    echo "carriers like the Waveshare base board hold the BOOT button while powering on."
    echo ""
    echo "If it is mounted somewhere unusual, pass it explicitly:"
    echo "  ./write-boot-config.sh --boot-dir /Volumes/<name>"
    exit 1
fi

if [ ! -f "${BOOT_DIR}/user-data" ]; then
    echo -e "${YELLOW}Warning: ${BOOT_DIR} has no existing 'user-data' file.${NC}"
    echo "That is what a stock Ubuntu Pi image looks like, so this may not be the"
    echo "right partition (Raspberry Pi OS does not use cloud-init)."
    read -p "Write to ${BOOT_DIR} anyway? [y/N]: " CONFIRM
    [[ "$CONFIRM" =~ ^[Yy]$ ]] || { echo "Aborted."; exit 0; }
fi

echo -e "${GREEN}Boot partition: ${BOOT_DIR}${NC}"
echo ""

# -----------------------------------------------------------------------------
# Collect settings
# -----------------------------------------------------------------------------
if [ -z "$HOSTNAME_ARG" ]; then
    read -p "Hostname for this Pi (e.g. harvester-07): " HOSTNAME_ARG
fi
# Must be DNS-safe or avahi will not publish <name>.local, which loses the whole
# "no more IP hunting" benefit.
if ! [[ "$HOSTNAME_ARG" =~ ^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$ ]]; then
    echo -e "${RED}'${HOSTNAME_ARG}' is not a valid hostname.${NC}"
    echo "Lowercase letters, digits and hyphens only; must start and end"
    echo "alphanumeric (e.g. harvester-07). Uppercase and underscores break mDNS."
    exit 1
fi

# --- WiFi: inherit from the card if Imager already wrote it ------------------
# Imager's advanced options store a 64-character hex PSK derived from the
# passphrase, NOT the passphrase - it cannot be recovered by retyping. Reading
# it back off the card also keeps the credential out of shell history.
if [ -z "$WIFI_SSID" ] || [ -z "$WIFI_PSK" ]; then
    for src in "${BOOT_DIR}/network-config.rooted-orig" "${BOOT_DIR}/network-config"; do
        [ -f "$src" ] || continue
        INHERITED=$(ROOTED_NC="$src" python3 -c '
import os, re, sys
text = open(os.environ["ROOTED_NC"]).read()
m = re.search(r"access-points:\s*\n\s*([\"\x27]?)(.+?)\1\s*:\s*\n(.*?)(?=\n\S|\Z)", text, re.S)
if not m:
    sys.exit(1)
ssid, body = m.group(2), m.group(3)
p = re.search(r"password:\s*[\"\x27]?([^\"\x27\n]+)", body)
if not p:
    sys.exit(1)
print(ssid); print(p.group(1).strip())
' 2>/dev/null) || continue

        INH_SSID=$(printf '%s\n' "$INHERITED" | sed -n 1p)
        INH_PSK=$(printf '%s\n' "$INHERITED" | sed -n 2p)
        if [ -n "$INH_SSID" ] && [ -n "$INH_PSK" ]; then
            [ -z "$WIFI_SSID" ] && WIFI_SSID="$INH_SSID"
            [ -z "$WIFI_PSK" ]  && WIFI_PSK="$INH_PSK"
            if [ ${#INH_PSK} -eq 64 ]; then PSK_KIND="64-hex PSK"; else PSK_KIND="passphrase"; fi
            echo -e "${GREEN}Inherited WiFi from the card: '${WIFI_SSID}' (${PSK_KIND})${NC}"
            break
        fi
    done
fi

if [ -z "$WIFI_SSID" ]; then
    read -p "WiFi SSID for first boot: " WIFI_SSID
fi
[ -n "$WIFI_SSID" ] || { echo -e "${RED}WiFi SSID cannot be empty.${NC}"; exit 1; }

if [ -z "$WIFI_PSK" ]; then
    read -s -p "WiFi password: " WIFI_PSK; echo ""
fi
[ -n "$WIFI_PSK" ] || { echo -e "${RED}WiFi password cannot be empty.${NC}"; exit 1; }

# --- SSH public key ---
if [ -z "$PUBKEY_PATH" ]; then
    for candidate in "$HOME/.ssh/id_ed25519.pub" "$HOME/.ssh/id_rsa.pub" "$HOME/.ssh/id_ecdsa.pub"; do
        [ -f "$candidate" ] && { PUBKEY_PATH="$candidate"; break; }
    done
fi
if [ -z "$PUBKEY_PATH" ] || [ ! -f "$PUBKEY_PATH" ]; then
    echo ""
    echo -e "${YELLOW}No SSH public key found in ~/.ssh.${NC}"
    read -p "Generate an ed25519 key now? [Y/n]: " GENKEY
    if [[ ! "${GENKEY:-Y}" =~ ^[Nn]$ ]]; then
        ssh-keygen -t ed25519 -f "$HOME/.ssh/id_ed25519" -N "" -C "rooted-pi-provisioning"
        PUBKEY_PATH="$HOME/.ssh/id_ed25519.pub"
    else
        echo -e "${RED}An SSH key is required.${NC}"; exit 1
    fi
fi
SSH_PUBKEY="$(tr -d '\n' < "$PUBKEY_PATH")"
echo -e "${GREEN}SSH key: ${PUBKEY_PATH}${NC}"

# --- Password for the 'rooted' account ---
# Still needed because deploy-to-pi-one/-two drive sudo through sshpass.
PASSWORD_HASH=""
if [ "$NO_PASSWORD" = "false" ]; then
    if [ -z "$ROOTED_PASSWORD" ]; then
        echo ""
        echo "Password for the 'rooted' account (the deploy scripts prompt for this)."
        read -s -p "Password: " ROOTED_PASSWORD; echo ""
        read -s -p "Confirm:  " ROOTED_PASSWORD_CONFIRM; echo ""
        if [ "$ROOTED_PASSWORD" != "$ROOTED_PASSWORD_CONFIRM" ]; then
            echo -e "${RED}Passwords do not match. Nothing was written - re-run.${NC}"; exit 1
        fi
    fi
    [ -n "$ROOTED_PASSWORD" ] || { echo -e "${RED}Password cannot be empty (use --no-password for key-only).${NC}"; exit 1; }

    # SHA-512 crypt hash. Python's crypt module is tried first, but it was
    # REMOVED in Python 3.13 - and macOS ships LibreSSL, whose `openssl passwd`
    # has no -6 option. So each path covers the other's gap: modern Python needs
    # the openssl fallback, stock macOS openssl needs the Python path.
    PASSWORD_HASH="$(ROOTED_PW="$ROOTED_PASSWORD" python3 -c '
import os, sys
try:
    import crypt
except ImportError:
    sys.exit(1)
print(crypt.crypt(os.environ["ROOTED_PW"], crypt.mksalt(crypt.METHOD_SHA512)))
' 2>/dev/null)" || true

    if [ -z "$PASSWORD_HASH" ]; then
        PASSWORD_HASH="$(openssl passwd -6 "$ROOTED_PASSWORD" 2>/dev/null)" || true
    fi
    if [ -z "$PASSWORD_HASH" ]; then
        echo -e "${RED}Could not generate a SHA-512 password hash.${NC}"
        echo "Neither python3's crypt module nor 'openssl passwd -6' is available."
        echo "brew install openssl, or re-run with --no-password."
        exit 1
    fi
else
    echo -e "${YELLOW}Key-only login: 'rooted' will have no password.${NC}"
    echo -e "${YELLOW}The sshpass-based deploy scripts will NOT work against it.${NC}"
fi

# -----------------------------------------------------------------------------
# Render the templates
# -----------------------------------------------------------------------------
# Substitution goes through Python, not sed: SSIDs, WiFi passwords and crypt
# hashes routinely contain characters sed treats specially (& / | \).
# json.dumps() doubles as the YAML quoter - a JSON string is a valid YAML
# double-quoted scalar, so an SSID with spaces, quotes or a colon survives.
render() {
    local template="$1" output="$2"
    ROOTED_TEMPLATE="$template" ROOTED_OUTPUT="$output" \
    R_HOSTNAME="$HOSTNAME_ARG" R_PUBKEY="$SSH_PUBKEY" R_HASH="$PASSWORD_HASH" \
    R_SSID="$WIFI_SSID" R_PSK="$WIFI_PSK" R_UPGRADE="$PACKAGE_UPGRADE" \
    R_NOPASS="$NO_PASSWORD" R_TZ="$TIMEZONE" R_REGDOM="$WIFI_REGDOM" \
    python3 <<'PYEOF'
import json, os

src = os.environ["ROOTED_TEMPLATE"]
dst = os.environ["ROOTED_OUTPUT"]

with open(src) as f:
    text = f.read()

subs = {
    "@@HOSTNAME@@":        os.environ["R_HOSTNAME"],
    "@@SSH_PUBKEY@@":      json.dumps(os.environ["R_PUBKEY"]),
    "@@PASSWORD_HASH@@":   json.dumps(os.environ["R_HASH"]),
    "@@WIFI_SSID@@":       json.dumps(os.environ["R_SSID"]),
    "@@WIFI_PSK@@":        json.dumps(os.environ["R_PSK"]),
    "@@PACKAGE_UPGRADE@@": os.environ["R_UPGRADE"],
    "@@TIMEZONE@@":        json.dumps(os.environ["R_TZ"]),
    "@@WIFI_REGDOM@@":     os.environ["R_REGDOM"],
}
for token, value in subs.items():
    text = text.replace(token, value)

# Key-only mode: strip the password lines rather than emitting an empty hash,
# which cloud-init would install as an unusable-but-present password entry.
if os.environ["R_NOPASS"] == "true":
    kept = []
    for line in text.splitlines(keepends=True):
        stripped = line.strip()
        if stripped.startswith("passwd:"):
            continue
        if stripped == "lock_passwd: false":
            kept.append(line.replace("lock_passwd: false", "lock_passwd: true")); continue
        if stripped == "ssh_pwauth: true":
            kept.append(line.replace("ssh_pwauth: true", "ssh_pwauth: false")); continue
        kept.append(line)
    text = "".join(kept)

if "@@" in text:
    leftover = [ln for ln in text.splitlines() if "@@" in ln]
    raise SystemExit("Unsubstituted placeholder(s) in %s:\n  %s" % (dst, "\n  ".join(leftover)))

with open(dst, "w") as f:
    f.write(text)
PYEOF
}

echo ""
echo "Writing cloud-init files..."

STAMP="$(date +%s)"
for f in user-data network-config meta-data; do
    if [ -f "${BOOT_DIR}/${f}" ] && [ ! -f "${BOOT_DIR}/${f}.rooted-orig" ]; then
        cp "${BOOT_DIR}/${f}" "${BOOT_DIR}/${f}.rooted-orig"
    fi
done

render "${SCRIPT_DIR}/user-data.template"      "${BOOT_DIR}/user-data"
echo "  user-data"
render "${SCRIPT_DIR}/network-config.template" "${BOOT_DIR}/network-config"
echo "  network-config"

# NoCloud keys "have I already run?" off instance-id. A unique one per run means
# re-stamping a card you have already booted actually re-runs first boot instead
# of cloud-init silently skipping everything.
cat > "${BOOT_DIR}/meta-data" <<EOF
instance-id: rooted-${HOSTNAME_ARG}-${STAMP}
local-hostname: ${HOSTNAME_ARG}
EOF
echo "  meta-data"

# ...but meta-data is NOT authoritative if the kernel command line pins one.
# Raspberry Pi Imager writes `ds=nocloud;i=rpi-imager-<n>` into cmdline.txt, and
# cloud-init gives that priority over meta-data. Bumping meta-data alone then
# does nothing: cloud-init sees the same pinned id, decides it has already run
# for this instance, and SILENTLY SKIPS the entire user-data - which looks
# exactly like a config that ran and did not help. This cost several debugging
# cycles on a live board. Keep both in sync.
if [ -f "${BOOT_DIR}/cmdline.txt" ] && grep -q 'ds=nocloud' "${BOOT_DIR}/cmdline.txt" 2>/dev/null; then
    cp "${BOOT_DIR}/cmdline.txt" "${BOOT_DIR}/cmdline.txt.rooted-orig" 2>/dev/null || true
    ROOTED_ID="rooted-${HOSTNAME_ARG}-${STAMP}" ROOTED_CMDLINE="${BOOT_DIR}/cmdline.txt" python3 - <<'PYEOF'
import os, re
p = os.environ["ROOTED_CMDLINE"]
new_id = os.environ["ROOTED_ID"]
text = open(p).read().strip()
if re.search(r'i=[^\s;]+', text):
    text = re.sub(r'i=[^\s;]+', 'i=' + new_id, text)
else:
    # ds=nocloud present without an i= token: append one.
    text = re.sub(r'(ds=nocloud)', r'\1;i=' + new_id, text)
open(p, "w").write(text + "\n")
PYEOF
    echo "  cmdline.txt instance-id synced"
fi

# Confirm on disk, so a failure here can never be mistaken for success.
if grep -q "hostname: ${HOSTNAME_ARG}" "${BOOT_DIR}/user-data" 2>/dev/null; then
    echo -e "${GREEN}Verified: user-data written correctly${NC}"
else
    echo -e "${RED}user-data does not contain the expected hostname - stamp FAILED.${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}=============================================${NC}"
echo -e "${GREEN}  Boot config written                       ${NC}"
echo -e "${GREEN}=============================================${NC}"
echo ""
echo "  Hostname:     ${HOSTNAME_ARG}  (reachable as ${HOSTNAME_ARG}.local)"
echo "  WiFi SSID:    ${WIFI_SSID}"
echo "  SSH key:      ${PUBKEY_PATH}"
echo "  Login:        rooted"
if [ "$PACKAGE_UPGRADE" = "true" ]; then
echo "  apt upgrade:  yes (adds several minutes to first boot)"
else
echo "  apt upgrade:  no (pass --upgrade to enable)"
fi
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "─────────────"
echo "1. Eject:"
echo "     diskutil eject ${BOOT_DIR}"
echo ""
echo -e "   ${YELLOW}2. POWER IT PROPERLY. This is the step that has bitten us:${NC}"
echo "     - Disconnect the USB-C cable from your Mac. A laptop USB port supplies"
echo "       ~0.9-1.5A; a CM5 wants a real 5V supply with headroom. Underpowered,"
echo "       it browns out or never POSTs - which looks exactly like a config bug."
echo "     - On a Compute Module, make sure it is NOT still in usbboot mode"
echo "       (nRPIBOOT jumper off / BOOT button not held), or it will re-enter the"
echo "       mass-storage gadget and never boot the image you just wrote."
echo "     - Power it from a proper supply, then check it actually rebooted:"
echo "         system_profiler SPUSBDataType | grep -i raspberry"
echo "       If that still shows a Raspberry Pi USB device, it did NOT boot."
echo ""
echo "3. Wait 5-10 minutes for the unattended install, then:"
echo "     ping ${HOSTNAME_ARG}.local"
echo "     ./verify-pi.sh --host ${HOSTNAME_ARG}.local --stage firstboot"
echo ""
echo "4. Your normal flow - step one is fast now, its apt/pip/Vector are no-ops:"
echo "     ./deploy-to-pi-one.sh      # host: ${HOSTNAME_ARG}.local, user: rooted"
echo "     ./deploy-to-pi-two.sh      # over the ethernet cable"
echo ""
echo "5. ./verify-pi.sh --host 192.168.10.1"
echo ""
