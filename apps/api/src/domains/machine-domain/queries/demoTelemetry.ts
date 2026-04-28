import type { Machine } from '../types.js';
import type { MachineFault } from './listFaults.js';

interface DemoTelemetryProfile {
  totalSteps: string;
  totalUptimeMs: string;
  currentBootUptimeMs: string;
  rebootCount: number;
  beltFaultCount: number;
  bladeFaultCount: number;
  trayCount: number;
  lastBeltFault: number;
  lastBladeFault: number;
  beltMotorUptimeMs: string;
  bladeMotorUptimeMs: string;
  lastEventCode: string;
  lastEventValue: number;
  lastEventAgeMinutes: number;
  faults: Array<{
    faultType: string;
    motor: string | null;
    torquePct: number | null;
    eventCode: string | null;
    ageMinutes: number;
  }>;
}

const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;

const DEMO_TELEMETRY_PROFILES: Record<string, DemoTelemetryProfile> = {
  HARVESTER: {
    totalSteps: '186420',
    totalUptimeMs: String(14 * DAY_MS + 6 * HOUR_MS),
    currentBootUptimeMs: String(3 * DAY_MS + 4 * HOUR_MS),
    rebootCount: 3,
    beltFaultCount: 2,
    bladeFaultCount: 1,
    trayCount: 12480,
    lastBeltFault: 1,
    lastBladeFault: 1,
    beltMotorUptimeMs: String(11 * DAY_MS + 9 * HOUR_MS),
    bladeMotorUptimeMs: String(8 * DAY_MS + 6 * HOUR_MS),
    lastEventCode: 'belt_fault_cleared',
    lastEventValue: 0,
    lastEventAgeMinutes: 52,
    faults: [
      {
        faultType: 'belt_fault',
        motor: 'belt',
        torquePct: 86,
        eventCode: 'belt_fault_cleared',
        ageMinutes: 52,
      },
      {
        faultType: 'blade_fault',
        motor: 'blade',
        torquePct: 78,
        eventCode: 'blade_fault_cleared',
        ageMinutes: 1640,
      },
      {
        faultType: 'belt_fault',
        motor: 'belt',
        torquePct: 82,
        eventCode: 'belt_fault_cleared',
        ageMinutes: 4310,
      },
    ],
  },
  SEEDER: {
    totalSteps: '74520',
    totalUptimeMs: String(8 * DAY_MS + 3 * HOUR_MS),
    currentBootUptimeMs: String(2 * DAY_MS + 5 * HOUR_MS),
    rebootCount: 1,
    beltFaultCount: 1,
    bladeFaultCount: 0,
    trayCount: 9100,
    lastBeltFault: 1,
    lastBladeFault: 0,
    beltMotorUptimeMs: String(6 * DAY_MS + 22 * HOUR_MS),
    bladeMotorUptimeMs: '0',
    lastEventCode: 'belt_fault_cleared',
    lastEventValue: 0,
    lastEventAgeMinutes: 118,
    faults: [
      {
        faultType: 'belt_fault',
        motor: 'belt',
        torquePct: 74,
        eventCode: 'belt_fault_cleared',
        ageMinutes: 118,
      },
    ],
  },
};

function getDemoProfile(machineName: string): DemoTelemetryProfile {
  const normalizedName = machineName.toUpperCase();
  if (normalizedName.startsWith('SEEDER')) return DEMO_TELEMETRY_PROFILES.SEEDER;
  return DEMO_TELEMETRY_PROFILES.HARVESTER;
}

function minutesAgo(minutes: number): Date {
  return new Date(Date.now() - minutes * 60 * 1000);
}

export function applyDemoTelemetry(machine: Machine): Machine {
  if (!machine.isDemo) return machine;

  const profile = getDemoProfile(machine.name);

  return {
    ...machine,
    status: 'online',
    lastSeenAt: machine.lastSeenAt ?? minutesAgo(3),
    currentWifiSsid: machine.currentWifiSsid ?? 'DEMO_NETWORK',
    totalSteps: profile.totalSteps,
    totalUptimeMs: profile.totalUptimeMs,
    currentBootUptimeMs: profile.currentBootUptimeMs,
    rebootCount: profile.rebootCount,
    beltFaultCount: profile.beltFaultCount,
    bladeFaultCount: profile.bladeFaultCount,
    trayCount: profile.trayCount,
    lastBeltFault: profile.lastBeltFault,
    lastBladeFault: profile.lastBladeFault,
    beltMotorUptimeMs: profile.beltMotorUptimeMs,
    bladeMotorUptimeMs: profile.bladeMotorUptimeMs,
    lastEventCode: profile.lastEventCode,
    lastEventValue: profile.lastEventValue,
    lastEventAt: minutesAgo(profile.lastEventAgeMinutes),
  };
}

export function getDemoMachineFaults(machine: { id: string; name: string; is_demo?: boolean | null }): MachineFault[] {
  if (!machine.is_demo) return [];

  const profile = getDemoProfile(machine.name);

  return profile.faults.map((fault, index) => ({
    id: `${machine.id}-demo-fault-${index + 1}`,
    faultType: fault.faultType,
    motor: fault.motor,
    torquePct: fault.torquePct,
    eventCode: fault.eventCode,
    createdAt: minutesAgo(fault.ageMinutes),
  }));
}
