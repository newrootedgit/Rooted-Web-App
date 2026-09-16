#!/opt/rooted-ble/.venv/bin/python3 -u
import subprocess
import os
import sys
import threading
import time
import re
from bluezero import peripheral
from bluezero import adapter
import json
from json import JSONDecodeError
import dbus

SERVICE_UUID = "322486ee-3b18-476d-86ae-2481eafaea9a"
SSID_UUID    = "322486ee-3b18-476d-86ae-2481eafaea9b"
PASS_UUID    = "322486ee-3b18-476d-86ae-2481eafaea9c"

# The captive-portal access point, created by wifi-setup/setup-captive-portal.sh.
# Must match the con-name there: connect_to_wifi() takes this down to free the
# radio for scanning, and puts it back if the join fails.
HOTSPOT_CONNECTION = "Rooted-Robotics-Setup"
STATUS_UUID  = "322486ee-3b18-476d-86ae-2481eafaea9d"

ONBOARD_UUID     = "322486ee-3b18-476d-86ae-2481eafaea9e"
USER_INFO_UUID   = "322486ee-3b18-476d-86ae-2481eafaea9f"
DEVICE_ID_UUID   = "322486ee-3b18-476d-86ae-2481eafeaea0"

ONBOARD_CODE = "RootedRobotics123"

ONBOARD_STATUS = 0x04

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
STATE_FILE = os.path.join(SCRIPT_DIR, 'onboard_state.json')
DEVICE_FILE = os.path.join(SCRIPT_DIR, 'device_config.json')

# --- Advertising workaround for Broadcom BCM4345C0 (Raspberry Pi onboard BT) ---
# On this chip, bluetoothd/kernel use LE *Extended* Advertising, but the
# controller firmware rejects the "LE Set Extended Advertising Data" HCI command
# with "Invalid Parameters (0x0d)". As a result every D-Bus advertisement
# registration (including bluezero's built-in one) fails and the device never
# shows up in BLE scans, even though the GATT server is running. See
# raspberrypi/linux#7473.
#
# The workaround is to advertise via `btmgmt`, which drives the *legacy* HCI
# advertising commands (LE Set Advertising Parameters / Data / Enable) that the
# chip handles correctly. We keep bluezero for the GATT server and only replace
# its advertisement step (see start_ble).
#
# NOTE: an earlier version of this comment claimed "mgmt-managed advertising
# instances auto-resume after a client disconnects, so no manual re-advertise
# loop needed". That is WRONG, and it was wrong silently. Observed twice on two
# separate builds: after a central connects and disconnects (including a failed
# pairing attempt), the instance is torn down and never comes back. The service
# stays `active` with zero restarts and its startup log still says it is
# advertising, while `btmgmt advinfo` reports "Instances list with 0 items" and
# the machine is invisible to every scanner. For a customer this means the
# machine cannot be onboarded or have its WiFi changed, with nothing to indicate
# why. See _advertising_watchdog below.

BTMGMT = "btmgmt"
HCI_INDEX = "0"  # onboard controller (hci0)


def _build_scan_response(device_name):
    """Build scan-response AD data (hex) carrying the Complete Local Name.

    Keeping the name in the scan response (a separate 31-byte payload) leaves the
    primary packet for flags + the 128-bit service UUID, so the web app can still
    filter by both UUID (onboarding) and name (change-WiFi).
    """
    name = device_name.encode("utf-8")[:29]   # 31 - 2 (length + type) byte cap
    ad = bytes([len(name) + 1, 0x09]) + name  # 0x09 = Complete Local Name
    return ad.hex()


def start_btmgmt_advertising(service_uuid, device_name):
    """Advertise via btmgmt's legacy path (works around the BCM4345C0 ext-adv bug).

    Adds a connectable, general-discoverable instance carrying the service UUID
    in the advertising packet and the device name in the scan response.
    """
    scan_rsp = _build_scan_response(device_name)
    # Clear stale instances first so we don't collide on instance ids.
    _btmgmt("clr-adv")
    output = _btmgmt(
        "add-adv",
        "-c",                 # connectable
        "-g",                 # general discoverable
        "-u", service_uuid,   # 128-bit service UUID in advertising data
        "-s", scan_rsp,       # device name in scan response
        "1")                  # instance id
    if "Instance added" in output:
        print(f"btmgmt advertising active as: {device_name} ({output})")
        return True
    print(f"btmgmt advertising FAILED: {output}")
    return False


def stop_btmgmt_advertising():
    """Remove all advertising instances added via btmgmt."""
    _btmgmt("clr-adv")


def is_advertising():
    """True if the controller currently has at least one advertising instance.

    This is the ground truth - not whether this process thinks it advertised at
    startup. `btmgmt advinfo` prints "Instances list with N items".
    """
    output = _btmgmt("advinfo")
    match = re.search(r"Instances list with (\d+) item", output)
    if match:
        return int(match.group(1)) > 0
    # Unparseable output (timeout, btmgmt missing, format change): report True so
    # a broken probe cannot trigger an endless re-advertise loop. A genuinely
    # dead advert still gets caught on the next tick once the probe recovers.
    print(f"[adv-watchdog] could not parse advinfo, assuming OK: {output!r}")
    return True


def _advertising_watchdog(service_uuid, device_name, interval=30):
    """Re-arm the BLE advertisement if the controller drops it.

    Runs forever in a daemon thread. Safe to call btmgmt from here while the
    GATT server is published: verified on-device that both advinfo (read) and
    clr-adv/add-adv (write) complete normally while bluezero holds the adapter.
    The startup ORDERING still matters (advertise before app.publish(), see
    start_ble) - this is only about the steady state afterwards.

    Without this, one disconnected client permanently ends the machine's
    discoverability and the only recovery is `systemctl restart rooted-ble` -
    which is not something a customer can be expected to know.
    """
    consecutive_failures = 0
    while True:
        time.sleep(interval)
        try:
            if is_advertising():
                consecutive_failures = 0
                continue
            print("[adv-watchdog] advertisement is GONE - re-arming")
            if start_btmgmt_advertising(service_uuid, device_name):
                consecutive_failures = 0
                print("[adv-watchdog] re-armed successfully")
            else:
                consecutive_failures += 1
                print(f"[adv-watchdog] re-arm FAILED ({consecutive_failures} in a row)")
                # Repeated failure means the controller is wedged beyond what
                # clr-adv/add-adv can fix. Bounce the adapter power and let the
                # next tick re-add the instance.
                if consecutive_failures >= 3:
                    print("[adv-watchdog] bouncing the adapter")
                    _btmgmt("power", "off")
                    time.sleep(2)
                    _btmgmt("power", "on")
                    time.sleep(2)
                    consecutive_failures = 0
        except Exception as exc:  # never let the watchdog thread die
            print(f"[adv-watchdog] unexpected error, continuing: {exc}")


def _btmgmt(*args):
    """Run a btmgmt command and return its combined output.

    We pass an empty stdin via input="" (a pipe that closes at EOF) rather than
    /dev/null. btmgmt hangs indefinitely when its stdin is /dev/null - which is
    what both subprocess.DEVNULL and the default systemd service stdin provide -
    but runs a one-shot command correctly when given a pipe that reaches EOF.
    The timeout is a backstop against any other stall.
    """
    try:
        result = subprocess.run(
            [BTMGMT, "--index", HCI_INDEX, *args],
            input="", capture_output=True, text=True, timeout=15)
        return (result.stdout + result.stderr).strip()
    except subprocess.TimeoutExpired:
        return "btmgmt timed out"
    except FileNotFoundError:
        return "btmgmt not found"


def get_device_config():
    """Load device config, auto-generating device_id if missing."""
    config = {}

    if os.path.exists(DEVICE_FILE):
        try:
            with open(DEVICE_FILE, 'r') as f:
                config = json.load(f)
        except (JSONDecodeError, IOError) as e:
            print(f"Error loading device config: {e}")

    return config


class MachineBLE:
    def __init__(self):
        self.ssid = ""
        self.password = ""
        self.status_chr = None  # Set when client subscribes to notifications
        self.is_onboarded = False
        self.user_info = None
        

    def _safe_notify(self, value):
        """Safely send notification, handling client disconnection gracefully."""
        if not self.status_chr:
            return False
        try:
            self.status_chr.set_value(value)
            return True
        except dbus.exceptions.DBusException as e:
            # Client disconnected - this is expected when phone moves away or app closes
            print(f"Client disconnected (notification failed): {e.get_dbus_name()}")
            self.status_chr = None
            return False
        except Exception as e:
            print(f"Unexpected error sending notification: {e}")
            self.status_chr = None
            return False

    def on_status_notify(self, notifying, characteristic):
        """Called when client subscribes/unsubscribes to status notifications"""
        if notifying:
            self.status_chr = characteristic
            print("Client subscribed to status notifications")
        else:
            print("Client unsubscribed from status notifications")

    def on_ssid_write(self, value, options):
        self.ssid = bytes(value).decode('utf-8')
        print(f"SSID received: {self.ssid}")

    def on_onboard_write(self, value, options):
        code = bytes(value).decode('utf-8')
        if code == ONBOARD_CODE:
            self.is_onboarded = True
            # Send back onboarding success status (0x04)
            self._safe_notify([ONBOARD_STATUS])
            print("Device successfully onboarded.")
        else:
            print("Invalid onboarding code received.")

    def on_user_info_write(self, value, options):
        try:
            user_info = bytes(value).decode('utf-8')
            self.user_info = json.loads(user_info)
            with open(STATE_FILE, 'w') as f:
                json.dump(self.user_info, f)
            print(f"User info received: {self.user_info}")
        except JSONDecodeError:
            print("Invalid JSON received for user info.")
        except dbus.exceptions.DBusException as e:
            print(f"Client disconnected during user_info write: {e.get_dbus_name()}")
        except Exception as e:
            print(f"Error in user_info write: {e}")

    def on_pass_write(self, value, options):
        if not self.is_onboarded:
            print("Device not onboarded. Ignoring password write.")
            return
        self.password = bytes(value).decode('utf-8')
        print("Password received. Attempting Wi-Fi connection...")
        # Run WiFi connection in background thread so BLE write can complete
        thread = threading.Thread(target=self.connect_to_wifi)
        thread.start()

    def _hotspot_active(self):
        """Is wlan0 currently serving the setup hotspot?"""
        try:
            out = subprocess.run(
                ["nmcli", "-t", "-f", "NAME,DEVICE", "connection", "show", "--active"],
                capture_output=True, text=True, timeout=15,
            ).stdout
            return any(
                line.startswith(f"{HOTSPOT_CONNECTION}:") for line in out.splitlines()
            )
        except Exception as exc:
            print(f"could not determine hotspot state, assuming it is up: {exc}")
            return True

    def _set_hotspot(self, up):
        verb = "up" if up else "down"
        try:
            subprocess.run(
                ["sudo", "nmcli", "connection", verb, HOTSPOT_CONNECTION],
                capture_output=True, text=True, timeout=45,
            )
            print(f"setup hotspot brought {verb}")
        except Exception as exc:
            print(f"failed to bring hotspot {verb}: {exc}")

    def _ssid_visible(self, attempts=3):
        """Rescan and report whether the target SSID is in range.

        One rescan is not enough: the radio has just left AP mode and the first
        scan often comes back before the driver has results.
        """
        for i in range(attempts):
            try:
                subprocess.run(["sudo", "nmcli", "device", "wifi", "rescan"],
                               capture_output=True, text=True, timeout=45)
            except Exception:
                pass
            time.sleep(3)
            try:
                out = subprocess.run(["nmcli", "-t", "-f", "SSID", "device", "wifi", "list"],
                                     capture_output=True, text=True, timeout=30).stdout
                if any(line == self.ssid for line in out.splitlines()):
                    return True
                print(f"scan {i + 1}/{attempts}: {self.ssid!r} not visible yet")
            except Exception as exc:
                print(f"scan {i + 1}/{attempts} failed: {exc}")
        return False

    def connect_to_wifi(self):
        # THE HOTSPOT OWNS THE RADIO.
        #
        # wlan0 cannot serve an access point and scan for networks at the same
        # time. On a machine straight from the golden image there is no saved
        # WiFi, so the captive portal brings up Rooted-Robotics-Setup in AP
        # mode - and then `nmcli device wifi connect` fails with
        #     Error: No network with SSID 'X' found.
        # no matter how correct the credentials are, because the only network
        # the radio can see is the one it is broadcasting itself.
        #
        # This is the customer's very first interaction with the machine, and
        # it failed on HARVESTER-koppert-1 exactly this way: BLE handed over
        # the SSID and password perfectly, and the join could never succeed.
        #
        # So drop the AP, scan, join - and put the AP back if the join fails,
        # because a customer who mistypes a password must not be left with
        # neither WiFi nor the captive-portal fallback.
        if not self.is_onboarded:
            print("Device not onboarded. Cannot connect to Wi-Fi.")
            return

        if not self.ssid:
            print("SSID not set.")
            return

        self._safe_notify([0x01])  # Connecting

        restore_hotspot = self._hotspot_active()
        if restore_hotspot:
            print("setup hotspot is holding wlan0 - taking it down to scan")
            self._set_hotspot(False)
            time.sleep(2)

        try:
            if not self._ssid_visible():
                print(f"Failed: {self.ssid!r} is not in range after rescanning")
                self._safe_notify([0x03])
                return

            cmd = ["sudo", "nmcli", "device", "wifi", "connect", self.ssid,
                   "password", self.password]
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=60)
            if result.returncode == 0:
                print("Success!")
                # Joined: leave the AP down. Bringing it back would take the
                # radio away from the network we just joined.
                restore_hotspot = False
                self._safe_notify([0x02])  # Success
            else:
                print(f"Failed: {result.stderr.strip()}")
                self._safe_notify([0x03])  # Failure
        except Exception as e:
            print(f"Error: {e}")
            self._safe_notify([0x03])
        finally:
            # finally, not the failure branch: an exception mid-join must not
            # cost the customer their fallback either.
            if restore_hotspot:
                print("join did not succeed - restoring the setup hotspot")
                self._set_hotspot(True)


def start_ble():
    machine = MachineBLE()
    config = get_device_config()

    if not config.get('device_name') or not config.get('device_id'):
        print("Device configuration incomplete. Please ensure device_name and device_id are set.")
        return

    device_name = config['device_name']
    device_id = config['device_id']

    adapters = list(adapter.Adapter.available())
    if not adapters:
        print("No Bluetooth adapters found!")
        return

    adapter_address = adapters[0].address
    print(f"Using adapter: {adapter_address}")
    print(f"Device ID: {device_id}")

    app = peripheral.Peripheral(adapter_address, local_name=device_name)
    app.add_service(srv_id=1, uuid=SERVICE_UUID, primary=True)

    app.add_characteristic(srv_id=1, chr_id=1, uuid=SSID_UUID,
                           value=[], notifying=False, flags=['write'],
                           write_callback=machine.on_ssid_write)

    app.add_characteristic(srv_id=1, chr_id=2, uuid=PASS_UUID,
                           value=[], notifying=False, flags=['write'],
                           write_callback=machine.on_pass_write)

    app.add_characteristic(srv_id=1, chr_id=4, uuid=ONBOARD_UUID,
                           value=[], notifying=False, flags=['write'],
                           write_callback=machine.on_onboard_write)

    app.add_characteristic(srv_id=1, chr_id=5, uuid=USER_INFO_UUID,
                           value=[], notifying=False, flags=['write'],
                           write_callback=machine.on_user_info_write)

    # Device ID characteristic - readable by frontend
    app.add_characteristic(srv_id=1, chr_id=6, uuid=DEVICE_ID_UUID,
                           value=list(device_id.encode('utf-8')),
                           notifying=False, flags=['read'])

    app.add_characteristic(srv_id=1, chr_id=3, uuid=STATUS_UUID,
                           value=[0x00], notifying=False,
                           flags=['notify'],
                           notify_callback=machine.on_status_notify)

    # Advertise via btmgmt's legacy path (the BCM4345C0 rejects bluetoothd's
    # extended-advertising path - see the module notes above). This MUST happen
    # before app.publish(): once bluezero registers its GATT application with
    # bluetoothd, bluetoothd takes control of the adapter and concurrent btmgmt
    # mgmt commands block indefinitely. So we set advertising up first, then
    # neutralise bluezero's own (doomed) advertisement so publish() only
    # registers the GATT server.
    app.ad_manager.register_advertisement = lambda *a, **k: None
    app.ad_manager.unregister_advertisement = lambda *a, **k: None

    start_btmgmt_advertising(SERVICE_UUID, device_name)

    # Keep it advertising. A central connecting and disconnecting tears the
    # instance down and it does NOT come back on its own - see the module notes.
    # Daemon thread so it cannot keep the process alive on shutdown.
    threading.Thread(
        target=_advertising_watchdog,
        args=(SERVICE_UUID, device_name),
        daemon=True,
        name="adv-watchdog",
    ).start()

    print(f"GATT Server running. Advertising as: {device_name}")
    print("Advertising watchdog started (checks every 30s)")

    try:
        app.publish()
    except dbus.exceptions.DBusException as e:
        # Handle client disconnection gracefully - this is normal behavior
        error_name = e.get_dbus_name()
        if "ServiceUnknown" in error_name or "NoReply" in error_name:
            print(f"BLE client disconnected: {error_name}")
        else:
            print(f"DBus error: {e}")
            raise
    except KeyboardInterrupt:
        print("Shutting down BLE server...")


if __name__ == '__main__':
    print("=== Rooted BLE Provisioner Starting ===")
    print(f"Python version: {sys.version}")
    start_ble()