// Bluetooth/BLE domain types

// Scanner states
export type ScanState = 'idle' | 'scanning' | 'connecting' | 'connected' | 'error';

// Onboarding flow states
export type OnboardStep = 'scan' | 'onboarding' | 'wifi' | 'connecting' | 'registering' | 'success' | 'failed';

// GATT connection states
export type ConnectionState = 'disconnected' | 'connecting' | 'connected';

// Scan error types
export type ScanErrorType = 'not_supported' | 'user_cancelled' | 'no_devices' | 'unknown';

export interface ScanError {
  type: ScanErrorType;
  message: string;
}

// Status codes from device (must match Pi provisioner.py)
export const STATUS_CODES = {
  IDLE: 0x00,
  CONNECTING: 0x01,
  CONNECTED: 0x02,
  FAILED: 0x03,
  ONBOARDED: 0x04,
} as const;

export type StatusCode = (typeof STATUS_CODES)[keyof typeof STATUS_CODES];

// GATT client event handlers
export interface GATTClientEvents {
  onStatusChange?: (status: StatusCode) => void;
  onDisconnect?: () => void;
}
