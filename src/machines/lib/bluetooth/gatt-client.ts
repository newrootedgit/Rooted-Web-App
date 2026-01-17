import { SERVICE_UUID, SSID_UUID, PASS_UUID, STATUS_UUID, ONBOARD_UUID, ONBOARDING_CODE, StatusCode } from './constants';

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

  /**
   * Connect to the device's GATT server and get the provisioning service.
   */
  async connect(): Promise<void> {
    if (!this.device.gatt) {
      throw new Error('GATT not available on this device');
    }

    this.server = await this.device.gatt.connect();
    this.service = await this.server.getPrimaryService(SERVICE_UUID);
  }

  /**
   * Disconnect from the device.
   */
  disconnect(): void {
    this.device.gatt?.disconnect();
  }

  /**
   * Send the onboarding code to the device.
   * Device must be onboarded before WiFi provisioning will work.
   */
  async writeOnboardingCode(): Promise<void> {
    if (!this.service) {
      throw new Error('Not connected to device');
    }

    const encoder = new TextEncoder();
    const onboardChar = await this.service.getCharacteristic(ONBOARD_UUID);
    await onboardChar.writeValue(encoder.encode(ONBOARDING_CODE));
  }

  /**
   * Write WiFi credentials to the device.
   * The device will attempt to connect after receiving the password.
   */
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

  /**
   * Subscribe to status notifications from the device.
   * The device will notify when WiFi connection status changes.
   */
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
