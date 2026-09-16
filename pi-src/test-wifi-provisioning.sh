#!/bin/bash
# =============================================================================
# Rooted Robotics - prove BLE WiFi provisioning works, repeatedly
# =============================================================================
# Runs the REAL connect_to_wifi() out of provisioner.py against real hardware,
# many times, including the failure paths - because one manual success proves
# very little about what a hundred customers will see.
#
# WHY THIS EXISTS. provisioner.py shipped for months with a join that could
# never succeed on a machine that had no WiFi yet: the captive-portal hotspot
# holds wlan0 in AP mode, so `nmcli device wifi connect` only ever saw the
# machine's own hotspot. Every earlier machine was built with WiFi already
# configured, so nothing ever exercised the state a customer actually receives,
# and verify-pi.sh could not see it either - every structural check passed on a
# machine whose first customer interaction was guaranteed to fail.
#
# So this tests BEHAVIOUR, not structure:
#
#   1. happy path, repeated  - does it join reliably, or only sometimes?
#   2. wrong password        - does it fail AND put the hotspot back?
#   3. SSID out of range     - does it fail cleanly, or hang?
#   4. retry after failure   - can the customer simply try again?
#
# Cases 2 and 3 matter as much as case 1. A customer who mistypes a password
# must not be left with neither WiFi nor the captive-portal fallback - that is
# a truck roll.
#
# The BLE transport itself is deliberately not tested here. It was never the
# broken part, and driving GATT from CI needs a browser. What broke, and what
# this covers, is everything that happens after the credentials arrive.
#
# DESTRUCTIVE: repeatedly disconnects WiFi. Bench machines only.
#
# Usage:
#   ./test-wifi-provisioning.sh --host 192.168.10.1 --ssid MyNetwork
#   ./test-wifi-provisioning.sh --host 192.168.10.1 --ssid MyNetwork --runs 5
#
# The password is prompted for, or taken from ROOTED_TEST_PSK. It is never
# passed as a command-line argument - that would put it in ps output and in
# the Pi's sudo log.
# =============================================================================
set -uo pipefail

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; BLUE='\033[0;34m'; NC='\033[0m'

PI_HOST=""; PI_USER="rooted"; SSID=""; RUNS=3
while [ $# -gt 0 ]; do
    case "$1" in
        --host) PI_HOST="$2"; shift 2 ;;
        --user) PI_USER="$2"; shift 2 ;;
        --ssid) SSID="$2"; shift 2 ;;
        --runs) RUNS="$2"; shift 2 ;;
        -h|--help) sed -n '2,42p' "$0"; exit 0 ;;
        *) echo "Unknown option: $1"; exit 1 ;;
    esac
done
[ -n "$PI_HOST" ] || { echo -e "${RED}--host is required${NC}"; exit 1; }
[ -n "$SSID" ]    || { echo -e "${RED}--ssid is required${NC}"; exit 1; }

PSK="${ROOTED_TEST_PSK:-}"
if [ -z "$PSK" ]; then
    read -s -p "WiFi password for '${SSID}' (not echoed, not stored): " PSK; echo ""
fi
[ -n "$PSK" ] || { echo -e "${RED}password cannot be empty${NC}"; exit 1; }

SSH_OPTS=(-o StrictHostKeyChecking=accept-new -o ConnectTimeout=15)
ssh "${SSH_OPTS[@]}" -o BatchMode=yes "${PI_USER}@${PI_HOST}" true 2>/dev/null \
    || { echo -e "${RED}cannot reach ${PI_USER}@${PI_HOST} with a key${NC}"; exit 1; }

# Refuse on anything that looks like it is doing a job. A field machine losing
# WiFi for the duration of this test is an outage.
BUSY=$(ssh "${SSH_OPTS[@]}" "${PI_USER}@${PI_HOST}" \
    'systemctl is-active --quiet autoadjust_seeder_poll 2>/dev/null && echo BUSY || echo IDLE' 2>/dev/null | tr -d '\r')
if [ "$BUSY" = "BUSY" ]; then
    echo -e "${RED}autoadjust_seeder_poll is running - this looks like a working machine.${NC}"
    echo "This test repeatedly drops WiFi. Refusing."
    exit 1
fi

echo -e "${BLUE}=============================================${NC}"
echo -e "${BLUE}  WiFi provisioning behaviour test${NC}"
echo -e "${BLUE}  ${PI_USER}@${PI_HOST} -> '${SSID}', ${RUNS} run(s)${NC}"
echo -e "${BLUE}=============================================${NC}"

REMOTE=$(mktemp -t rooted-wifi-test)
trap 'rm -f "$REMOTE"' EXIT

cat > "$REMOTE" <<'PYEOF'
import importlib.util, json, os, subprocess, sys, time

HOTSPOT = "Rooted-Robotics-Setup"
SSID = os.environ["TEST_SSID"]
PSK  = sys.stdin.readline().rstrip("\n")   # never an argv, never an env var
RUNS = int(os.environ.get("TEST_RUNS", "3"))

# Import the real provisioner rather than reimplementing its logic - a test
# that reimplements the thing it is testing proves only that two copies agree.
spec = importlib.util.spec_from_file_location("provisioner", "/opt/rooted-ble/provisioner.py")
prov = importlib.util.module_from_spec(spec)
spec.loader.exec_module(prov)          # safe: start_ble() is under __main__

results = []
def record(name, ok, detail=""):
    results.append((name, ok, detail))
    print(("  PASS  " if ok else "  FAIL  ") + name + (f"  [{detail}]" if detail else ""))

def sh(*args, timeout=60):
    return subprocess.run(args, capture_output=True, text=True, timeout=timeout)

def hotspot_up():
    out = sh("nmcli", "-t", "-f", "NAME", "connection", "show", "--active").stdout
    return HOTSPOT in out.splitlines()

def online():
    return sh("ping", "-c", "1", "-W", "2", "8.8.8.8", timeout=10).returncode == 0

def reset_to_customer_state():
    """Forget the target network and bring the hotspot up: a factory machine."""
    sh("sudo", "nmcli", "connection", "delete", SSID, timeout=45)
    sh("sudo", "nmcli", "connection", "up", HOTSPOT, timeout=60)
    time.sleep(4)

def attempt(ssid, psk):
    m = prov.MachineBLE()
    m.is_onboarded = True
    m.ssid = ssid
    m.password = psk
    t0 = time.time()
    m.connect_to_wifi()
    return time.time() - t0

# --- 1. happy path, repeated -------------------------------------------------
print(f"\n--- happy path x{RUNS} ---")
times = []
for i in range(RUNS):
    reset_to_customer_state()
    if not hotspot_up():
        record(f"run {i+1}: precondition (hotspot up)", False, "could not reach customer state")
        continue
    took = attempt(SSID, PSK)
    time.sleep(5)
    ok = online() and not hotspot_up()
    times.append(took)
    record(f"run {i+1}: joined '{SSID}' and got online", ok, f"{took:.0f}s")

# --- 2. wrong password -------------------------------------------------------
print("\n--- wrong password ---")
reset_to_customer_state()
attempt(SSID, PSK + "-definitely-wrong")
time.sleep(4)
record("wrong password does not get online", not online())
record("wrong password RESTORES the hotspot", hotspot_up(),
       "customer keeps the captive-portal fallback")

# --- 3. SSID out of range ----------------------------------------------------
print("\n--- SSID not in range ---")
reset_to_customer_state()
took = attempt("rooted-no-such-network-zzz", PSK)
time.sleep(3)
record("absent SSID fails rather than hanging", took < 90, f"{took:.0f}s")
record("absent SSID RESTORES the hotspot", hotspot_up())

# --- 4. retry after a failure ------------------------------------------------
print("\n--- retry after failure (the customer tries again) ---")
took = attempt(SSID, PSK)
time.sleep(5)
record("good credentials work after a failed attempt", online() and not hotspot_up(), f"{took:.0f}s")

# --- leave the machine usable ------------------------------------------------
if not online():
    print("\n  restoring connectivity...")
    attempt(SSID, PSK)
    time.sleep(5)

failed = [r for r in results if not r[1]]
print(f"\n{'='*45}")
print(f"  {len(results)-len(failed)}/{len(results)} passed" + (f", {len(failed)} FAILED" if failed else ""))
if times:
    print(f"  join time: min {min(times):.0f}s  max {max(times):.0f}s  avg {sum(times)/len(times):.0f}s")
print(f"  online at exit: {online()}")
print(f"{'='*45}")
sys.exit(1 if failed else 0)
PYEOF

# The script is staged as a file and the password goes on stdin, so the
# password is never an argv anywhere: not in ps on either machine, not in the
# Pi's sudo log, not in shell history.
scp "${SSH_OPTS[@]}" "$REMOTE" "${PI_USER}@${PI_HOST}:/tmp/rooted-wifi-test.py" >/dev/null 2>&1 \
    || { echo -e "${RED}could not stage the test on the Pi${NC}"; exit 1; }

# The SERVICE's interpreter, not system python3. bluezero lives only in
# /opt/rooted-ble/.venv, and rooted-ble.service runs that interpreter by
# absolute path - so importing provisioner.py under system python3 dies on
# `ModuleNotFoundError: No module named 'bluezero'` and the test would look
# broken when the code is fine.
VENV_PY=/opt/rooted-ble/.venv/bin/python3
# -u is not optional. Python block-buffers stdout when it is not a terminal, and
# over SSH it is not, so without this the run prints NOTHING for its whole
# multi-minute duration and then dumps everything at once. A test that looks
# hung is a test people kill before it finishes.
printf '%s\n' "$PSK" | ssh "${SSH_OPTS[@]}" "${PI_USER}@${PI_HOST}" \
    "TEST_SSID='${SSID}' TEST_RUNS='${RUNS}' sudo -E ${VENV_PY} -u /tmp/rooted-wifi-test.py; rc=\$?; rm -f /tmp/rooted-wifi-test.py; exit \$rc"
RC=$?

echo ""
if [ $RC -eq 0 ]; then
    echo -e "${GREEN}  every case passed${NC}"
else
    echo -e "${RED}  failures above - do not ship this build${NC}"
fi
exit $RC
