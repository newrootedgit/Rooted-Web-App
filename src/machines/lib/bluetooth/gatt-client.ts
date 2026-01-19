import { SERVICE_UUID, SSID_UUID, PASS_UUID, STATUS_UUID, ONBOARD_UUID, ONBOARDING_CODE, StatusCode, USER_INFO_UUID } from './constants';

export type ConnectionState = 'disconnected' | 'connecting' | 'connected';

export interface GATTClientEvents {
  onStatusChange?: (status: StatusCode) => void;
  onDisconnect?: () => void;
}

/**
 * GATT client for communicating with a Machine IoT device.
 * Handles WiFi credential provisioning and status notifications.
 */
export class MachineGATTClient {
  private device: BluetoothDevice;
  private server: BluetoothRemoteGATTServer | null = null;
  private service: BluetoothRemoteGATTService | null = null;
  private statusChar: BluetoothRemoteGATTCharacteristic | null = null;
  private events: GATTClientEvents;

  constructor(device: BluetoothDevice, events: GATTClientEvents = {}) {
    this.device = device;
    this.events = events;

    // Listen for disconnection
    this.device.addEventListener('gattserverdisconnected', () => {
      this.server = null;
      this.service = null;
      this.statusChar = null;
      this.events.onDisconnect?.();
    });
  }

  get name(): string {
    return this.device.name || 'Unknown Device';
  }

  get id(): string {
    return this.device.id;
  }

  get isConnected(): boolean {
    return this.server?.connected ?? false;
  }

  async connect(): Promise<void> {
    if (!this.device.gatt) {
      throw new Error('GATT not available on this device');
    }

    this.server = await this.device.gatt.connect();
    this.service = await this.server.getPrimaryService(SERVICE_UUID);
  }

  disconnect(): void {
    this.device.gatt?.disconnect();
  }

  async writeOnboardingCode(): Promise<void> {
    if (!this.service) {
      throw new Error('Not connected to device');
    }

    const encoder = new TextEncoder();
    const onboardChar = await this.service.getCharacteristic(ONBOARD_UUID);
    await onboardChar.writeValue(encoder.encode(ONBOARDING_CODE));
  }

  async writeWiFiCredentials(ssid: string, password: string): Promise<void> {
    if (!this.service) {
      throw new Error('Not connected to device');
    }

    const encoder = new TextEncoder();

    const ssidChar = await this.service.getCharacteristic(SSID_UUID);
    await ssidChar.writeValue(encoder.encode(ssid));

    const passChar = await this.service.getCharacteristic(PASS_UUID);
    await passChar.writeValue(encoder.encode(password));
  }

  // Need to remove any here

  async writeUserInfo(userInfo: Record<string, any>): Promise<void> {
    if (!this.service) {
      throw new Error('Not connected to device');
    }

    const encoder = new TextEncoder();
    const userInfoChar = await this.service.getCharacteristic(USER_INFO_UUID);
    const userInfoStr = JSON.stringify(userInfo);
    await userInfoChar.writeValue(encoder.encode(userInfoStr));
  }

  async subscribeToStatus(): Promise<void> {
    if (!this.service) {
      throw new Error('Not connected to device');
    }

    this.statusChar = await this.service.getCharacteristic(STATUS_UUID);
    await this.statusChar.startNotifications();

    this.statusChar.addEventListener('characteristicvaluechanged', (event) => {
      const value = (event.target as BluetoothRemoteGATTCharacteristic).value;
      if (value && value.byteLength > 0) {
        const status = value.getUint8(0) as StatusCode;
        this.events.onStatusChange?.(status);
      }
    });
  }
}
