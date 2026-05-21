import { TRPCError } from '@trpc/server';
import type { PrismaClient } from '../../../generated/prisma/client.js';
import { timescale } from '../../../lib/db/timescale.js';
import type { MachineAnalyticsRange } from '../types.js';
import { getMachineType, type MachineType } from '../machineType.js';

type TelemetrySource = 'aggregate' | 'raw' | 'demo' | 'unavailable';

interface MachineAnalyticsRow {
  bucket: Date;
  steps: string | number | null;
  trays: string | number | null;
  avg_torque_pct: string | number | null;
  max_torque_pct: string | number | null;
  avg_cmd_age_ms: string | number | null;
  max_udp_fail_count: string | number | null;
  kill_switch_count: string | number | null;
  alert_count: string | number | null;
  belt_fault_count: string | number | null;
  blade_fault_count: string | number | null;
  belt_motor_delta_ms: string | number | null;
  blade_motor_delta_ms: string | number | null;
  roller_motor_delta_ms: string | number | null;
}

interface MachineEventRow {
  received_at: Date;
  type: string | null;
  event_code: string | null;
  event_value: number | null;
  motor: string | null;
  torque_pct: number | null;
  alert_bits: number | null;
  kill_switch: number | null;
}

export interface MachineAnalyticsPoint {
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

export interface MachineAnalyticsEvent {
  id: string;
  occurredAt: string;
  label: string;
  type: 'event' | 'fault' | 'alert' | 'kill_switch';
  motor: string | null;
  value: number | null;
  torquePct: number | null;
}

export interface MachineAnalyticsSummary {
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
}

export interface MachineAnalytics {
  machine: {
    id: string;
    name: string;
    displayName: string | null;
    deviceId: string;
    status: string | null;
    lastSeenAt: Date | null;
    isDemo: boolean;
    type: MachineType;
  };
  range: MachineAnalyticsRange;
  bucket: '5 minutes' | '1 hour' | '1 day';
  start: string;
  end: string;
  source: TelemetrySource;
  summary: MachineAnalyticsSummary;
  series: MachineAnalyticsPoint[];
  events: MachineAnalyticsEvent[];
}

const RANGE_CONFIG: Record<MachineAnalyticsRange, { durationMs: number; bucket: MachineAnalytics['bucket'] }> = {
  '24h': { durationMs: 24 * 60 * 60 * 1000, bucket: '5 minutes' },
  '7d': { durationMs: 7 * 24 * 60 * 60 * 1000, bucket: '1 hour' },
  '30d': { durationMs: 30 * 24 * 60 * 60 * 1000, bucket: '1 day' },
  '90d': { durationMs: 90 * 24 * 60 * 60 * 1000, bucket: '1 day' },
};

function toNumber(value: string | number | null | undefined): number {
  if (value === null || value === undefined) return 0;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function toNullableNumber(value: string | number | null | undefined): number | null {
  if (value === null || value === undefined) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function mapRows(rows: MachineAnalyticsRow[]): MachineAnalyticsPoint[] {
  return rows.map((row) => ({
    bucket: row.bucket.toISOString(),
    steps: toNumber(row.steps),
    trays: toNumber(row.trays),
    avgTorquePct: toNullableNumber(row.avg_torque_pct),
    maxTorquePct: toNullableNumber(row.max_torque_pct),
    avgCmdAgeMs: toNullableNumber(row.avg_cmd_age_ms),
    maxUdpFailCount: toNullableNumber(row.max_udp_fail_count),
    killSwitchCount: toNumber(row.kill_switch_count),
    alertCount: toNumber(row.alert_count),
    beltFaultCount: toNumber(row.belt_fault_count),
    bladeFaultCount: toNumber(row.blade_fault_count),
    beltMotorDeltaMs: toNumber(row.belt_motor_delta_ms),
    bladeMotorDeltaMs: toNumber(row.blade_motor_delta_ms),
    rollerMotorDeltaMs: toNumber(row.roller_motor_delta_ms),
  }));
}

function buildSummary(
  series: MachineAnalyticsPoint[],
  events: MachineAnalyticsEvent[],
  laborMinutesPerHour: number | null
): MachineAnalyticsSummary {
  const totalSteps = series.reduce((sum, point) => sum + point.steps, 0);
  const totalTrays = series.reduce((sum, point) => sum + point.trays, 0);
  const beltFaults = events.filter((event) => event.type === 'fault' && event.motor === 'belt').length;
  const bladeFaults = events.filter((event) => event.type === 'fault' && event.motor === 'blade').length;
  const totalFaults = events.filter((event) => event.type === 'fault').length;
  const killSwitchEvents = events.filter((event) => event.type === 'kill_switch').length
    + series.reduce((sum, point) => sum + point.killSwitchCount, 0);
  const alertEvents = events.filter((event) => event.type === 'alert').length
    + series.reduce((sum, point) => sum + point.alertCount, 0);
  const torqueValues = series
    .map((point) => point.avgTorquePct)
    .filter((value): value is number => value !== null);
  const maxTorqueValues = series
    .map((point) => point.maxTorquePct)
    .filter((value): value is number => value !== null);
  const beltMotorUptimeMs = series.reduce((sum, point) => sum + point.beltMotorDeltaMs, 0);
  const bladeMotorUptimeMs = series.reduce((sum, point) => sum + point.bladeMotorDeltaMs, 0);
  const rollerMotorUptimeMs = series.reduce((sum, point) => sum + point.rollerMotorDeltaMs, 0);
  const motorHours = (beltMotorUptimeMs + bladeMotorUptimeMs + rollerMotorUptimeMs) / 3600000;
  const laborMinutesSaved = laborMinutesPerHour !== null ? motorHours * laborMinutesPerHour : 0;

  return {
    totalSteps,
    totalTrays,
    totalFaults,
    beltFaults,
    bladeFaults,
    killSwitchEvents,
    alertEvents,
    avgTorquePct: torqueValues.length
      ? torqueValues.reduce((sum, value) => sum + value, 0) / torqueValues.length
      : null,
    maxTorquePct: maxTorqueValues.length ? Math.max(...maxTorqueValues) : null,
    beltMotorUptimeMs,
    bladeMotorUptimeMs,
    rollerMotorUptimeMs,
    traysPerMotorHour: motorHours > 0 ? totalTrays / motorHours : null,
    laborMinutesSaved,
  };
}

function mapTelemetryEvents(rows: MachineEventRow[]): MachineAnalyticsEvent[] {
  return rows.map((row, index) => {
    const isFault = row.event_code?.startsWith('FAULT_') ?? false;
    const isKillSwitch = row.kill_switch === 1;
    const isAlert = !isFault && !isKillSwitch && (row.alert_bits ?? 0) > 0;

    return {
      id: `telemetry-${row.received_at.toISOString()}-${index}`,
      occurredAt: row.received_at.toISOString(),
      label: row.event_code ?? (isKillSwitch ? 'Kill switch active' : isAlert ? 'Alert bits active' : 'Telemetry event'),
      type: isFault ? 'fault' : isKillSwitch ? 'kill_switch' : isAlert ? 'alert' : 'event',
      motor: row.motor,
      value: row.event_value,
      torquePct: row.torque_pct,
    };
  });
}

function buildDemoAnalytics(
  machine: MachineAnalytics['machine'],
  range: MachineAnalyticsRange,
  start: Date,
  end: Date,
  bucket: MachineAnalytics['bucket'],
  laborMinutesPerHour: number | null
): MachineAnalytics {
  const pointCount = range === '24h' ? 24 : range === '7d' ? 7 : range === '30d' ? 30 : 90;
  const stepMs = (end.getTime() - start.getTime()) / pointCount;
  const isSeeder = machine.type === 'SEEDER';

  const series = Array.from({ length: pointCount }, (_, index) => {
    const wave = 0.75 + Math.sin(index / 2) * 0.2;
    const trays = Math.max(0, Math.round((isSeeder ? 42 : 58) * wave));
    return {
      bucket: new Date(start.getTime() + stepMs * index).toISOString(),
      steps: Math.round((isSeeder ? 1200 : 1800) * wave),
      trays,
      avgTorquePct: Math.round((isSeeder ? 44 : 61) + Math.sin(index / 3) * 8),
      maxTorquePct: Math.round((isSeeder ? 68 : 84) + Math.sin(index / 3) * 5),
      avgCmdAgeMs: Math.round(85 + Math.abs(Math.sin(index)) * 70),
      maxUdpFailCount: index % 9 === 0 ? 2 : index % 5 === 0 ? 1 : 0,
      killSwitchCount: index === pointCount - 4 ? 1 : 0,
      alertCount: index % 11 === 0 ? 1 : 0,
      beltFaultCount: index === pointCount - 3 ? 1 : 0,
      bladeFaultCount: !isSeeder && index === Math.floor(pointCount / 2) ? 1 : 0,
      beltMotorDeltaMs: Math.round(40 * 60 * 1000 * wave),
      bladeMotorDeltaMs: isSeeder ? 0 : Math.round(28 * 60 * 1000 * wave),
      rollerMotorDeltaMs: isSeeder ? Math.round(18 * 60 * 1000 * wave) : 0,
    };
  });

  const events: MachineAnalyticsEvent[] = [
    {
      id: `${machine.id}-demo-event-1`,
      occurredAt: new Date(end.getTime() - 2 * 60 * 60 * 1000).toISOString(),
      label: 'FAULT_BELT_TORQUE',
      type: 'fault',
      motor: 'belt',
      value: 1,
      torquePct: isSeeder ? 74 : 86,
    },
    {
      id: `${machine.id}-demo-event-2`,
      occurredAt: new Date(end.getTime() - 6 * 60 * 60 * 1000).toISOString(),
      label: 'Alert bits active',
      type: 'alert',
      motor: null,
      value: 1,
      torquePct: null,
    },
  ];

  return {
    machine,
    range,
    bucket,
    start: start.toISOString(),
    end: end.toISOString(),
    source: 'demo',
    summary: buildSummary(series, events, laborMinutesPerHour),
    series,
    events,
  };
}

async function queryAggregate(machineId: string, start: Date, end: Date, bucket: MachineAnalytics['bucket']) {
  if (!timescale) return null;

  return timescale.query<MachineAnalyticsRow>(
    `SELECT
       time_bucket($3::interval, bucket) AS bucket,
       COALESCE(SUM(steps), 0)::text AS steps,
       COALESCE(SUM(trays), 0)::text AS trays,
       AVG(avg_torque_pct)::text AS avg_torque_pct,
       MAX(max_torque_pct)::text AS max_torque_pct,
       AVG(avg_cmd_age_ms)::text AS avg_cmd_age_ms,
       MAX(max_udp_fail_count)::text AS max_udp_fail_count,
       COALESCE(SUM(kill_switch_count), 0)::text AS kill_switch_count,
       COALESCE(SUM(alert_count), 0)::text AS alert_count,
       COALESCE(SUM(belt_fault_count), 0)::text AS belt_fault_count,
       COALESCE(SUM(blade_fault_count), 0)::text AS blade_fault_count,
       COALESCE(SUM(belt_motor_delta_ms), 0)::text AS belt_motor_delta_ms,
       COALESCE(SUM(blade_motor_delta_ms), 0)::text AS blade_motor_delta_ms,
       COALESCE(SUM(roller_motor_delta_ms), 0)::text AS roller_motor_delta_ms
     FROM machine_analytics_5m
     WHERE machine_id = $1::uuid
       AND bucket >= $2::timestamptz
       AND bucket < $4::timestamptz
     GROUP BY time_bucket($3::interval, bucket)
     ORDER BY bucket ASC
     LIMIT 500`,
    [machineId, start, bucket, end]
  );
}

async function queryRaw(machineId: string, start: Date, end: Date, bucket: MachineAnalytics['bucket']) {
  if (!timescale) return null;

  return timescale.query<MachineAnalyticsRow>(
    `WITH bucketed AS (
       SELECT
         time_bucket($3::interval, received_at) AS bucket,
         COALESCE(SUM(delta_steps), 0) AS steps,
         GREATEST(COALESCE(MAX(trays_processed) - MIN(trays_processed), 0), 0) AS trays,
         AVG(torque_pct) AS avg_torque_pct,
         MAX(torque_pct) AS max_torque_pct,
         AVG(cmd_age_ms) AS avg_cmd_age_ms,
         MAX(udp_fail_count) AS max_udp_fail_count,
         COUNT(*) FILTER (WHERE kill_switch = 1) AS kill_switch_count,
         COUNT(*) FILTER (WHERE COALESCE(alert_bits, 0) > 0) AS alert_count,
         COUNT(*) FILTER (WHERE belt_fault = 1) AS belt_fault_count,
         COUNT(*) FILTER (WHERE blade_fault = 1) AS blade_fault_count,
         GREATEST(COALESCE(MAX(belt_motor_uptime_ms) - MIN(belt_motor_uptime_ms), 0), 0) AS belt_motor_delta_ms,
         GREATEST(COALESCE(MAX(blade_motor_uptime_ms) - MIN(blade_motor_uptime_ms), 0), 0) AS blade_motor_delta_ms,
         GREATEST(COALESCE(MAX(roller_motor_uptime_ms) - MIN(roller_motor_uptime_ms), 0), 0) AS roller_motor_delta_ms
       FROM raw_telemetry
       WHERE machine_id = $1::uuid
         AND received_at >= $2::timestamptz
         AND received_at < $4::timestamptz
         AND type = 'status_update'
       GROUP BY time_bucket($3::interval, received_at)
     )
     SELECT
       bucket,
       steps::text,
       trays::text,
       avg_torque_pct::text,
       max_torque_pct::text,
       avg_cmd_age_ms::text,
       max_udp_fail_count::text,
       kill_switch_count::text,
       alert_count::text,
       belt_fault_count::text,
       blade_fault_count::text,
       belt_motor_delta_ms::text,
       blade_motor_delta_ms::text,
       roller_motor_delta_ms::text
     FROM bucketed
     ORDER BY bucket ASC
     LIMIT 500`,
    [machineId, start, bucket, end]
  );
}

async function queryEvents(machineId: string, start: Date, end: Date): Promise<MachineAnalyticsEvent[]> {
  if (!timescale) return [];

  const result = await timescale.query<MachineEventRow>(
    `SELECT
       received_at,
       type,
       event_code,
       event_value,
       motor,
       torque_pct,
       alert_bits,
       kill_switch
     FROM raw_telemetry
     WHERE machine_id = $1::uuid
       AND received_at >= $2::timestamptz
       AND received_at < $3::timestamptz
       AND (
         type = 'event'
         OR COALESCE(alert_bits, 0) > 0
         OR kill_switch = 1
       )
     ORDER BY received_at DESC
     LIMIT 100`,
    [machineId, start, end]
  );

  return mapTelemetryEvents(result.rows);
}

export async function getMachineAnalytics(
  prisma: PrismaClient,
  machineId: string,
  tenantId: string | null,
  farmId: string | null,
  range: MachineAnalyticsRange
): Promise<MachineAnalytics> {
  const machine = await prisma.machines.findFirst({
    where: {
      id: machineId,
      ...(tenantId ? { tenant_id: tenantId } : {}),
      ...(farmId ? { farm_id: farmId } : {}),
    },
    select: {
      id: true,
      name: true,
      display_name: true,
      device_id: true,
      status: true,
      last_seen_at: true,
      is_demo: true,
      labor_minutes_saved_per_hour: true,
    },
  });

  if (!machine) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Machine not found',
    });
  }

  const config = RANGE_CONFIG[range];
  const end = new Date();
  const start = new Date(end.getTime() - config.durationMs);
  const laborMinutesPerHour = machine.labor_minutes_saved_per_hour;
  const mappedMachine = {
    id: machine.id,
    name: machine.name,
    displayName: machine.display_name,
    deviceId: machine.device_id,
    status: machine.status,
    lastSeenAt: machine.last_seen_at,
    isDemo: machine.is_demo,
    type: getMachineType(machine.name),
  };

  if (machine.is_demo) {
    return buildDemoAnalytics(mappedMachine, range, start, end, config.bucket, laborMinutesPerHour);
  }

  if (!timescale) {
    return {
      machine: mappedMachine,
      range,
      bucket: config.bucket,
      start: start.toISOString(),
      end: end.toISOString(),
      source: 'unavailable',
      summary: buildSummary([], [], laborMinutesPerHour),
      series: [],
      events: [],
    };
  }

  let source: TelemetrySource = 'aggregate';
  let rows: MachineAnalyticsRow[] = [];
  let events: MachineAnalyticsEvent[] = [];

  try {
    const aggregateResult = await queryAggregate(machine.id, start, end, config.bucket);
    rows = aggregateResult?.rows ?? [];
  } catch (error) {
    source = 'raw';
    console.warn('[TimescaleDB] machine_analytics_5m unavailable, falling back to raw telemetry:', error);
    try {
      const rawResult = await queryRaw(machine.id, start, end, config.bucket);
      rows = rawResult?.rows ?? [];
    } catch (rawError) {
      source = 'unavailable';
      console.warn('[TimescaleDB] Failed to fetch machine analytics:', rawError);
    }
  }

  if (source !== 'unavailable') {
    try {
      events = await queryEvents(machine.id, start, end);
    } catch (eventError) {
      console.warn('[TimescaleDB] Failed to fetch machine analytics events:', eventError);
    }
  }

  const series = mapRows(rows);

  return {
    machine: mappedMachine,
    range,
    bucket: config.bucket,
    start: start.toISOString(),
    end: end.toISOString(),
    source,
    summary: buildSummary(series, events, laborMinutesPerHour),
    series,
    events,
  };
}
