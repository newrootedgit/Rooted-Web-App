import { SERVICE_UUID } from './constants';
import type { ScanError } from '../../../shared';

// Re-export type from shared
export type { ScanError } from '../../../shared';

/**
 * Request a BLE device using Web Bluetooth API.
 * Opens the browser's native device picker filtered to devices
 * advertising our service UUID.
 */
export async function scanForDevice(): Promise<BluetoothDevice> {
  if (!navigator.bluetooth) {
    throw {
      type: 'not_supported',
      message: 'Web Bluetooth is not supported in this browser',
    } as ScanError;
  }

  try {
    const device = await navigator.bluetooth.requestDevice({
      filters: [{ services: [SERVICE_UUID] }],
    });
    console.log('[BLE] Device selected:', {
      name: device.name,
      id: device.id,
    });
    console.log(device);
    return device;
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'NotFoundError') {
        throw {
          type: 'user_cancelled',
          message: 'Device selection was cancelled',
        } as ScanError;
      }
    }
    throw {
      type: 'unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
    } as ScanError;
  }
}
