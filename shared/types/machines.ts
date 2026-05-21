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
  isDemo?: boolean;
  laborMinutesSavedPerHour?: number | null;
  totalSteps?: string | number | null;
  totalUptimeMs?: string | number | null;
  currentBootUptimeMs?: string | number | null;
  rebootCount?: number | null;
  beltFaultCount?: number | null;
  bladeFaultCount?: number | null;
  trayCount?: number | null;
  lastBeltFault?: number | null;
  lastBladeFault?: number | null;
  beltMotorUptimeMs?: string | number | null;
  bladeMotorUptimeMs?: string | number | null;
  rollerMotorUptimeMs?: string | number | null;
  lastEventCode?: string | null;
  lastEventValue?: number | null;
  lastEventAt?: string | Date | null;
}
