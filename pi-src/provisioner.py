#!/home/rooted/pi-ble-src/.venv/bin/python3
import subprocess
from bluezero import peripheral
from bluezero import adapter

SERVICE_UUID = "322486ee-3b18-476d-86ae-2481eafaea9a"
SSID_UUID    = "322486ee-3b18-476d-86ae-2481eafaea9b"
PASS_UUID    = "322486ee-3b18-476d-86ae-2481eafaea9c"
STATUS_UUID  = "322486ee-3b18-476d-86ae-2481eafaea9d"

class MachineBLE:
    def __init__(self):
        self.ssid = ""
        self.password = ""
        self.status_chr = None

    def on_ssid_write(self, value, options):
        self.ssid = bytes(value).decode('utf-8')
        print(f"SSID received: {self.ssid}")

    def on_pass_write(self, value, options):
        self.password = bytes(value).decode('utf-8')
        print("Password received. Attempting Wi-Fi connection...")
        self.connect_to_wifi()

    def connect_to_wifi(self):
        if self.status_chr:
            self.status_chr.set_value([0x01])  # Connecting

        cmd = ["sudo", "nmcli", "device", "wifi", "connect", self.ssid, "password", self.password]
        try:
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
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

    # SSID characteristic - write only, no notifications
    app.add_characteristic(srv_id=1, chr_id=1, uuid=SSID_UUID,
                           value=[], notifying=False, flags=['write'],
                           write_callback=machine.on_ssid_write)

    # Password characteristic - write only, no notifications
    app.add_characteristic(srv_id=1, chr_id=2, uuid=PASS_UUID,
                           value=[], notifying=False, flags=['write'],
                           write_callback=machine.on_pass_write)

    # Status characteristic - notify only
    machine.status_chr = app.add_characteristic(srv_id=1, chr_id=3, uuid=STATUS_UUID,
                                               value=[0x00], notifying=True,
                                               flags=['notify'])

    print(f"GATT Server running. Advertising as: {hostname}")
    app.publish()

if __name__ == '__main__':
    start_ble()