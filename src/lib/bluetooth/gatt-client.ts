import { SERVICE_UUID, SSID_UUID, PASS_UUID, STATUS_UUID, ONBOARD_UUID, ONBOARDING_CODE, USER_INFO_UUID, DEVICE_INFO_UUID } from './constants';
import type { StatusCode, GATTClientEvents } from '../../../shared';

// Re-export types from shared for convenience
export type { ConnectionState, GATTClientEvents } from '../../../shared';

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
      console.log('[BLE] Device disconnected:', { name: this.name, id: this.id });
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

    console.log('[BLE] Connecting to device:', { name: this.name, id: this.id });
    this.server = await this.device.gatt.connect();
    console.log('[BLE] Connected to GATT server');
    this.service = await this.server.getPrimaryService(SERVICE_UUID);
    console.log('[BLE] Got primary service:', SERVICE_UUID);
  }

  disconnect(): void {
    console.log('[BLE] Disconnecting from device');
    this.device.gatt?.disconnect();
  }

  async read_device_id(): Promise<string> { 
    if (!this.service) { 
      throw new Error('Not connected to device');
    }

    const  deviceInfoChar = await this.service.getCharacteristic(DEVICE_INFO_UUID);
    console.log('[BLE] Reading device ID characteristic');
    const value = await deviceInfoChar.readValue();
    const decoder = new TextDecoder();
    const deviceId = decoder.decode(value);
    console.log('[BLE] Device ID read:', deviceId);
    return deviceId;
  }

  async writeOnboardingCode(): Promise<void> {
    if (!this.service) {
      throw new Error('Not connected to device');
    }

    console.log('[BLE] Writing onboarding code:', ONBOARDING_CODE);
    const encoder = new TextEncoder();
    const onboardChar = await this.service.getCharacteristic(ONBOARD_UUID);
    await onboardChar.writeValue(encoder.encode(ONBOARDING_CODE));
    console.log('[BLE] Onboarding code written successfully');
  }

  async writeWiFiCredentials(ssid: string, password: string): Promise<void> {
    if (!this.service) {
      throw new Error('Not connected to device');
    }

    console.log('[BLE] Writing WiFi credentials:', { ssid, password: '***' });
    const encoder = new TextEncoder();

    const ssidChar = await this.service.getCharacteristic(SSID_UUID);
    await ssidChar.writeValue(encoder.encode(ssid));
    console.log('[BLE] SSID written');

    const passChar = await this.service.getCharacteristic(PASS_UUID);
    await passChar.writeValue(encoder.encode(password));
    console.log('[BLE] Password written');
  }

  // Need to remove any here

  async writeUserInfo(userInfo: Record<string, any>): Promise<void> {
    if (!this.service) {
      throw new Error('Not connected to device');
    }

    console.log('[BLE] Writing user info:', userInfo);
    const encoder = new TextEncoder();
    const userInfoChar = await this.service.getCharacteristic(USER_INFO_UUID);
    const userInfoStr = JSON.stringify(userInfo);
    await userInfoChar.writeValue(encoder.encode(userInfoStr));
    console.log('[BLE] User info written');
  }

  async subscribeToStatus(): Promise<void> {
    if (!this.service) {
      throw new Error('Not connected to device');
    }

    console.log('[BLE] Subscribing to status notifications');
    this.statusChar = await this.service.getCharacteristic(STATUS_UUID);
    await this.statusChar.startNotifications();
    console.log('[BLE] Status notifications started');

    this.statusChar.addEventListener('characteristicvaluechanged', (event) => {
      const value = (event.target as BluetoothRemoteGATTCharacteristic).value;
      if (value && value.byteLength > 0) {
        const rawBytes = new Uint8Array(value.buffer);
        const status = value.getUint8(0) as StatusCode;
        console.log('[BLE] << Status received from Pi:', {
          rawBytes: Array.from(rawBytes),
          statusCode: status,
          byteLength: value.byteLength,
        });
        this.events.onStatusChange?.(status);
      }
    });
  }
}
