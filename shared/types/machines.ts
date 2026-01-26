// Machine domain types

export interface Machine {
  id: string;
  name: string;
  displayName?: string | null;
  deviceId: string;
  createdAt: string | Date | null;
  awsIotThingName?: string | null;
  status?: 'online' | 'offline';
  lastSeenAt?: string | Date | null;
  currentWifiSsid?: string | null;
}
