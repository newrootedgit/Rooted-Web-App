#!/bin/bash
# =============================================================================
# Rooted Robotics - install the Grayhill te-cli toolchain onto a Pi
# =============================================================================
# Run this on the REFERENCE Pi before build-golden-image.sh captures it, so the
# toolchain ships in the image instead of being rebuilt by hand on every seeder.
#
# WHY THIS EXISTS. te-cli was the one part of a seeder that no script installed.
# deploy-seeder.sh, install-seeder-services.sh and install-seeder-integrity.sh
# all assume /home/rooted/te-cli already exists with a working venv - they only
# drop the two .py files in and install units. The actual install lived in prose
# in one customer's folder (Freshleaf_Foods/seeder/SETUP_GUIDE_READ_ME.md), as
# about ten minutes of manual apt/clone/venv/pip/udev steps.
#
# Two things about that were worse than the ten minutes:
#
#   - The udev rules are load-bearing and read as optional cleanup. Without them
#     the `rooted` user cannot open the HID device, so the poll service fails
#     against hardware that is physically fine. Correct code, correct hardware,
#     wrong permissions, silent failure.
#
#   - `git clone` with no ref tracks Grayhill's HEAD. Across a hundred machines
#     that splits the fleet along build-date lines, invisibly. TE_CLI_REF below
#     pins the commit that refarm Dubai runs today.
#
# WHAT THIS DELIBERATELY DOES NOT INSTALL. Customer seeder scripts
# (autoadjust_seeder_*.py) and tuned settings (TE_Variable_Values.json,
# PIN_Values.json). Those are per-machine and belong to deploy-seeder.sh. A
# golden image must stay customer-neutral: baking one site's presets into the
# image would ship them to every other site.
#
# Idempotent. Safe to re-run; it converges rather than reinstalling.
#
# Usage:
#   ./install-te-cli.sh --host 192.168.10.1
#   ./install-te-cli.sh --host rooted.local --user rooted
#   ./install-te-cli.sh --host 10.0.0.5 --ref <other-sha>    # override the pin
# =============================================================================
set -euo pipefail

RED='\033[0;31m'; GREEN='\033[0;32m'; BLUE='\033[0;34m'; YELLOW='\033[0;33m'; NC='\033[0m'

# Grayhill te-cli, refs/heads/main as of 2026-09-16. This is the exact commit
# running on SEEDER_REFARM_2, i.e. the version proven against real hardware
# rather than whatever main happens to be on the day a machine is built.
TE_CLI_REF="0074c49bc1502d12911b7e5a4ab40d91b99df1fe"
TE_CLI_URL="https://github.com/Grayhill/te-cli.git"

PI_HOST=""; PI_USER="rooted"
while [ $# -gt 0 ]; do
    case "$1" in
        --host) PI_HOST="$2"; shift 2 ;;
        --user) PI_USER="$2"; shift 2 ;;
        --ref)  TE_CLI_REF="$2"; shift 2 ;;
        -h|--help) sed -n '2,38p' "$0"; exit 0 ;;
        *) echo "Unknown option: $1"; exit 1 ;;
    esac
done
[ -n "$PI_HOST" ] || read -p "Pi hostname or IP: " PI_HOST

SSH_OPTS=(-o ConnectTimeout=15 -o StrictHostKeyChecking=accept-new)

echo -e "${BLUE}=============================================${NC}"
echo -e "${BLUE}  Install te-cli on ${PI_USER}@${PI_HOST}${NC}"
echo -e "${BLUE}  pinned to ${TE_CLI_REF:0:12}${NC}"
echo -e "${BLUE}=============================================${NC}"

ssh "${SSH_OPTS[@]}" -o BatchMode=yes "${PI_USER}@${PI_HOST}" true 2>/dev/null \
    || { echo -e "${RED}Cannot SSH to ${PI_USER}@${PI_HOST} with a key.${NC}"; exit 1; }

# Staged through a file rather than a heredoc inside $( ). Remote scripts here
# contain `case` patterns whose unbalanced ')' break command substitution - the
# same trap verify-pi.sh documents.
REMOTE_SCRIPT=$(mktemp -t rooted-te-cli)
trap 'rm -f "$REMOTE_SCRIPT"' EXIT

cat > "$REMOTE_SCRIPT" <<'REMOTE'
set -euo pipefail
TE_DIR="$HOME/te-cli"
say() { echo "  $*"; }

# --- apt dependencies ---------------------------------------------------------
# Lock::Timeout because unattended-upgrades may hold the lock on a freshly
# booted Pi; without it this aborts rather than waiting.
export DEBIAN_FRONTEND=noninteractive
APT="sudo apt-get -o DPkg::Lock::Timeout=900 -y"
say "apt: refreshing package lists"
$APT update >/dev/null 2>&1 || true

# python3-venv is the metapackage and tracks the distro's python3; the setup
# guide named python3.12-venv explicitly. Ask for the generic one and let apt
# resolve it, so this does not break on a future Ubuntu with a newer python.
PKGS="git python3-venv libhidapi-hidraw0 libhidapi-libusb0 libusb-1.0-0 libusb-1.0-0-dev"
say "apt: installing ${PKGS}"
$APT install $PKGS >/dev/null || { echo "FATAL: apt install failed"; exit 1; }

# --- source tree --------------------------------------------------------------
if [ -d "$TE_DIR/.git" ]; then
    say "git: existing clone, fetching"
    git -C "$TE_DIR" fetch --quiet origin || { echo "FATAL: git fetch failed"; exit 1; }
elif [ -e "$TE_DIR" ] && [ -n "$(ls -A "$TE_DIR" 2>/dev/null)" ]; then
    # Refuse rather than clobber. This directory also holds customer seeder
    # scripts and tuned presets on a machine that has been deployed; destroying
    # it to make a clone succeed would take the settings with it.
    echo "FATAL: $TE_DIR exists, is not empty, and is not a git clone."
    echo "       It may hold customer presets. Inspect and move it aside by hand."
    exit 1
else
    say "git: cloning te-cli"
    git clone --quiet "$TE_CLI_URL_R" "$TE_DIR" || { echo "FATAL: git clone failed"; exit 1; }
fi

CURRENT=$(git -C "$TE_DIR" rev-parse HEAD 2>/dev/null || echo none)
if [ "$CURRENT" != "$TE_CLI_REF_R" ]; then
    say "git: checking out ${TE_CLI_REF_R:0:12}"
    # Detached HEAD on purpose: a branch would drift on the next fetch, which is
    # the whole problem this pin exists to solve.
    git -C "$TE_DIR" checkout --quiet --detach "$TE_CLI_REF_R" \
        || { echo "FATAL: cannot check out $TE_CLI_REF_R"; exit 1; }
else
    say "git: already at ${TE_CLI_REF_R:0:12}"
fi

# --- venv ---------------------------------------------------------------------
if [ ! -x "$TE_DIR/venv/bin/python" ]; then
    say "venv: creating"
    python3 -m venv "$TE_DIR/venv" || { echo "FATAL: venv creation failed"; exit 1; }
else
    say "venv: present"
fi
PY="$TE_DIR/venv/bin/python"

say "pip: installing te-cli and hid bindings"
"$PY" -m pip install --quiet --upgrade pip || { echo "FATAL: pip upgrade failed"; exit 1; }
# Both base and [dev] extras, matching the configuration proven on
# SEEDER_REFARM_2 rather than a trimmed one nobody has run against hardware.
"$PY" -m pip install --quiet "$TE_DIR" || { echo "FATAL: pip install te-cli failed"; exit 1; }
"$PY" -m pip install --quiet "$TE_DIR[dev]" || { echo "FATAL: pip install te-cli[dev] failed"; exit 1; }
"$PY" -m pip install --quiet hidapi || { echo "FATAL: pip install hidapi failed"; exit 1; }

# --- udev ---------------------------------------------------------------------
# Without these the rooted user cannot open the encoder's hidraw node, and the
# poll service fails against hardware that is physically fine.
if [ -d "$TE_DIR/udev" ] && [ -n "$(ls -A "$TE_DIR/udev" 2>/dev/null)" ]; then
    say "udev: installing rules from te-cli/udev"
    sudo cp "$TE_DIR"/udev/* /etc/udev/rules.d/ || { echo "FATAL: copying udev rules failed"; exit 1; }
    sudo udevadm control --reload-rules >/dev/null 2>&1 || true
    sudo udevadm trigger >/dev/null 2>&1 || true
else
    echo "FATAL: no udev rules in $TE_DIR/udev - the encoder will be permission-blocked"
    exit 1
fi

# --- verify -------------------------------------------------------------------
# Installing without proving the imports work is how the te-cli step silently
# half-succeeds. Both of these are what the poll service needs at boot.
"$PY" -c "import te" 2>/dev/null   || { echo "FATAL: 'import te' fails after install"; exit 1; }
"$PY" -c "import hid" 2>/dev/null  || { echo "FATAL: 'import hid' fails after install"; exit 1; }
[ -x "$TE_DIR/venv/bin/te" ]       || { echo "FATAL: te entrypoint missing from venv"; exit 1; }

# --- provenance ---------------------------------------------------------------
# Baked into the image so a machine can report which toolchain it carries, and
# so drift in the unpinned transitive deps is auditable after the fact.
sudo bash -c "printf 'TE_CLI_REF=%s\nINSTALLED=%s\n' '$TE_CLI_REF_R' '$(date -u +%Y-%m-%dT%H:%M:%SZ)' > /etc/rooted-te-cli-release"
"$PY" -m pip freeze > "$TE_DIR/venv/pip-freeze.txt" 2>/dev/null || true
sudo chown -R "$(id -un):$(id -gn)" "$TE_DIR"

echo "OK|$(git -C "$TE_DIR" rev-parse --short HEAD)|$("$PY" --version 2>&1)"
REMOTE

# The pinned values are interpolated as env vars rather than expanded into the
# quoted heredoc, so the remote body stays literal and greppable.
if ssh "${SSH_OPTS[@]}" "${PI_USER}@${PI_HOST}" \
        "TE_CLI_REF_R='${TE_CLI_REF}' TE_CLI_URL_R='${TE_CLI_URL}' bash -s" < "$REMOTE_SCRIPT"; then
    echo ""
    echo -e "${GREEN}  te-cli installed and verified${NC}"
    echo ""
    echo "  Next: capture the image with ./build-golden-image.sh"
    echo "  It asserts te-cli is present and strips any customer presets."
else
    echo ""
    echo -e "${RED}  te-cli install FAILED - see the FATAL line above${NC}"
    exit 1
fi
