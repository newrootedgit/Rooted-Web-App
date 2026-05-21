export type AnalyticsRange = '24h' | '7d' | '30d' | '90d';
export type AnalyticsSection = 'usage' | 'output' | 'health' | 'lifespan';
export type MachineType = 'SEEDER' | 'HARVESTER' | 'OTHER';

export interface AnalyticsPoint {
  bucket: string;
  steps: number;
  trays: number;
  avgTorquePct: number | null;
  maxTorquePct: number | null;
  avgCmdAgeMs: number | null;
  maxUdpFailCount: number | null;
  killSwitchCount: number;
  alertCount: number;
  beltFaultCount: number;
  bladeFaultCount: number;
  beltMotorDeltaMs: number;
  bladeMotorDeltaMs: number;
  rollerMotorDeltaMs: number;
}

export interface AnalyticsData {
  machine: {
    id: string;
    name: string;
    displayName: string | null;
    deviceId: string;
    status: string | null;
    lastSeenAt: string | Date | null;
    isDemo: boolean;
    type: MachineType;
  };
  range: AnalyticsRange;
  bucket: '5 minutes' | '1 hour' | '1 day';
  start: string;
  end: string;
  source: 'aggregate' | 'raw' | 'demo' | 'unavailable';
  summary: {
    totalSteps: number;
    totalTrays: number;
    totalFaults: number;
    beltFaults: number;
    bladeFaults: number;
    killSwitchEvents: number;
    alertEvents: number;
    avgTorquePct: number | null;
    maxTorquePct: number | null;
    beltMotorUptimeMs: number;
    bladeMotorUptimeMs: number;
    rollerMotorUptimeMs: number;
    traysPerMotorHour: number | null;
    laborMinutesSaved: number;
  };
  series: AnalyticsPoint[];
  events: Array<{
    id: string;
    occurredAt: string;
    label: string;
    type: 'event' | 'fault' | 'alert' | 'kill_switch';
    motor: string | null;
    value: number | null;
    torquePct: number | null;
  }>;
}

export const RANGES: Array<{ id: AnalyticsRange; label: string }> = [
  { id: '24h', label: '24h' },
  { id: '7d', label: '7d' },
  { id: '30d', label: '30d' },
  { id: '90d', label: '90d' },
];
