#!/home/rooted/pi-ble-src/.venv/bin/python3
import subprocess
import os
import threading
from bluezero import peripheral
from bluezero import adapter
import json
from json import JSONDecodeError

SERVICE_UUID = "322486ee-3b18-476d-86ae-2481eafaea9a"
SSID_UUID    = "322486ee-3b18-476d-86ae-2481eafaea9b"
PASS_UUID    = "322486ee-3b18-476d-86ae-2481eafaea9c"
STATUS_UUID  = "322486ee-3b18-476d-86ae-2481eafaea9d"

ONBOARD_UUID   = "322486ee-3b18-476d-86ae-2481eafaea9e"
USER_INFO_UUID = "322486ee-3b18-476d-86ae-2481eafaea9f"

ONBOARD_CODE = "RootedRobotics123"

ONBOARD_STATUS = 0x04

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
STATE_FILE = os.path.join(SCRIPT_DIR, 'onboard_state.json')



class MachineBLE:
    def __init__(self):
        self.ssid = ""
        self.password = ""
        self.status_chr = None  # Set when client subscribes to notifications
        self.is_onboarded = False
        self.user_info = None

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
            # Send back onboarding success status (Ox04)
            if self.status_chr:
                self.status_chr.set_value([ONBOARD_STATUS]) 
            print("Device successfully onboarded.")
        else:
            print("Invalid onboarding code received.")

    def on_user_info_write(self, value, options):
        user_info = bytes(value).decode('utf-8')
        try:
            self.user_info = json.loads(user_info)
            with open(STATE_FILE, 'w') as f:
                json.dump(self.user_info, f)
        except JSONDecodeError:
            print("Invalid JSON received for user info.")
            return
        print(f"User info received: {self.user_info}")

    def on_pass_write(self, value, options):
        if not self.is_onboarded:
            print("Device not onboarded. Ignoring password write.")
            return
        self.password = bytes(value).decode('utf-8')
        print("Password received. Attempting Wi-Fi connection...")
        # Run WiFi connection in background thread so BLE write can complete
        thread = threading.Thread(target=self.connect_to_wifi)
        thread.start()

    def connect_to_wifi(self):
        if not self.is_onboarded:
            print("Device not onboarded. Cannot connect to Wi-Fi.")
            return
        
        if not self.ssid:
            print("SSID not set.")
            return
        
        if self.status_chr:
            self.status_chr.set_value([0x01])  # Connecting

        cmd = ["sudo", "nmcli", "device", "wifi", "connect", self.ssid, "password", self.password]
        try:
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=60)
            if result.returncode == 0:
                print("Success!")
                if self.status_chr:
                    self.status_chr.set_value([0x02])  # Success
            else:
                print(f"Failed: {result.stderr}")
                if self.status_chr:
                    self.status_chr.set_value([0x03])  # Failure
        except Exception as e:
            print(f"Error: {e}")
            if self.status_chr:
                self.status_chr.set_value([0x03])

def start_ble():
    machine = MachineBLE()
    hostname = "TEST_DEVICE"

    adapters = list(adapter.Adapter.available())
    if not adapters:
        print("No Bluetooth adapters found!")
        return

    adapter_address = adapters[0].address
    print(f"Using adapter: {adapter_address}")

    app = peripheral.Peripheral(adapter_address, local_name=hostname)
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
    

    app.add_characteristic(srv_id=1, chr_id=3, uuid=STATUS_UUID,
                           value=[0x00], notifying=False,
                           flags=['notify'],
                           notify_callback=machine.on_status_notify)

    print(f"GATT Server running. Advertising as: {hostname}")
    app.publish()

if __name__ == '__main__':
    start_ble()