// BLE GATT UUIDs for Machine IoT provisioning
// Must match the UUIDs in the Raspberry Pi provisioner.py

export const SERVICE_UUID = '322486ee-3b18-476d-86ae-2481eafaea9a';
export const SSID_UUID = '322486ee-3b18-476d-86ae-2481eafaea9b';
export const PASS_UUID = '322486ee-3b18-476d-86ae-2481eafaea9c';
export const STATUS_UUID = '322486ee-3b18-476d-86ae-2481eafaea9d';
export const ONBOARD_UUID = '322486ee-3b18-476d-86ae-2481eafaea9e';
export const USER_INFO_UUID = '322486ee-3b18-476d-86ae-2481eafaea9f';
// Hardcoded onboarding code - must match Pi
export const ONBOARDING_CODE = 'RootedRobotics123';

// Status codes from device
export const STATUS_CODES = {
  IDLE: 0x00,
  CONNECTING: 0x01,
  CONNECTED: 0x02,
  FAILED: 0x03,
  ONBOARDED: 0x04,
} as const;

export type StatusCode = (typeof STATUS_CODES)[keyof typeof STATUS_CODES];
