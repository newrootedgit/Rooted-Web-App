import { timescale } from '../../../lib/db/timescale.js';
import type { Machine } from '../types.js';
import { applyDemoTelemetry } from './demoTelemetry.js';

interface DbMachineRow {
  id: string;
  tenant_id: string | null;
  farm_id: string | null;
  name: string;
  display_name: string | null;
  device_id: string;
  created_at: Date | null;
  aws_iot_thing_name: string | null;
  status: string | null;
  last_seen_at: Date | null;
  current_wifi_ssid: string | null;
  is_demo: boolean;
  labor_minutes_saved_per_hour: number | null;
  machine_faults?: Array<{
    fault_type: string;
    motor: string | null;
    created_at: Date;
  }>;
}

interface TimescaleStatsRow {
  machine_id: string;
  total_steps: string;
  total_uptime_ms: string;
  reboot_count: string;
  tray_count: string;
  belt_motor_uptime_ms: string;
  blade_motor_uptime_ms: string;
  roller_motor_uptime_ms: string;
  last_event_code: string | null;
  last_event_value: number | null;
  last_event_at: Date | null;
}

function mapBaseFields(m: DbMachineRow): Machine {
  return {
    id: m.id,
    tenantId: m.tenant_id,
    farmId: m.farm_id,
    name: m.name,
    displayName: m.display_name,
    deviceId: m.device_id,
    createdAt: m.created_at,
    awsIotThingName: m.aws_iot_thing_name,
    status: m.status as 'online' | 'offline' | undefined,
    lastSeenAt: m.last_seen_at,
    currentWifiSsid: m.current_wifi_ssid,
    isDemo: m.is_demo ?? false,
    laborMinutesSavedPerHour: m.labor_minutes_saved_per_hour,
    // Defaults — overridden by TimescaleDB stats when available
    totalSteps: '0',
    totalUptimeMs: '0',
    currentBootUptimeMs: '0',
    rebootCount: 0,
    beltFaultCount: 0,
    bladeFaultCount: 0,
    rollerFaultCount: 0,
    trayCount: 0,
    lastBeltFault: 0,
    lastBladeFault: 0,
    lastRollerFault: 0,
    beltMotorUptimeMs: '0',
    bladeMotorUptimeMs: '0',
    rollerMotorUptimeMs: '0',
    lastEventCode: null,
    lastEventValue: null,
    lastEventAt: null,
  };
}

export async function enrichMachinesWithTelemetry(
  machines: DbMachineRow[]
): Promise<Machine[]> {
  if (machines.length === 0) return [];

  const machineIds = machines.map((m) => m.id);

  // Count faults from RDS
  const faultCounts = new Map<string, { belt: number; blade: number; roller: number; lastBelt: number; lastBlade: number; lastRoller: number }>();
  for (const m of machines) {
    const faults = m.machine_faults ?? [];
    const beltFaults = faults.filter((f) => f.motor === 'belt');
    const bladeFaults = faults.filter((f) => f.motor === 'blade');
    const rollerFaults = faults.filter((f) => f.motor === 'roller');
    faultCounts.set(m.id, {
      belt: beltFaults.length,
      blade: bladeFaults.length,
      roller: rollerFaults.length,
      lastBelt: beltFaults.length > 0 ? 1 : 0,
      lastBlade: bladeFaults.length > 0 ? 1 : 0,
      lastRoller: rollerFaults.length > 0 ? 1 : 0,
    });
  }

  // Query TimescaleDB for aggregate stats
  let statsMap = new Map<string, TimescaleStatsRow>();
  if (timescale) {
    try {
      const result = await timescale.query<TimescaleStatsRow>(
        `WITH machine_ids AS (
           SELECT UNNEST($1::uuid[]) AS machine_id
         ),
         filtered AS (
           SELECT
             machine_id,
             type,
             session_id,
             boot_id,
             delta_steps,
             uptime_ms,
             trays_processed,
             belt_motor_uptime_ms,
             blade_motor_uptime_ms,
             CASE
               WHEN to_regclass('raw_telemetry') IS NOT NULL
                AND EXISTS (
                  SELECT 1
                  FROM information_schema.columns
                  WHERE table_name = 'raw_telemetry'
                    AND column_name = 'roller_motor_uptime_ms'
                )
               THEN (to_jsonb(raw_telemetry)->>'roller_motor_uptime_ms')::bigint
               ELSE NULL
             END AS roller_motor_uptime_ms,
             event_code,
             event_value,
             received_at
           FROM raw_telemetry
           WHERE machine_id = ANY($1::uuid[])
         ),
         session_totals AS (
           SELECT
             machine_id,
             COALESCE(session_id, CONCAT('boot:', boot_id::text)) AS session_key,
             MAX(uptime_ms)                 AS session_uptime_ms,
             MAX(trays_processed)           AS session_tray_count,
             MAX(belt_motor_uptime_ms)      AS session_belt_motor_uptime_ms,
             MAX(blade_motor_uptime_ms)     AS session_blade_motor_uptime_ms,
             MAX(roller_motor_uptime_ms)    AS session_roller_motor_uptime_ms
           FROM filtered
           WHERE type = 'status_update'
             AND (session_id IS NOT NULL OR boot_id IS NOT NULL)
           GROUP BY machine_id, COALESCE(session_id, CONCAT('boot:', boot_id::text))
         ),
         lifetime AS (
           SELECT
             machine_id,
             COALESCE(SUM(session_uptime_ms), 0)::text           AS total_uptime_ms,
             GREATEST(COUNT(*) - 1, 0)::text                     AS reboot_count,
             COALESCE(SUM(session_tray_count), 0)::text          AS tray_count,
             COALESCE(SUM(session_belt_motor_uptime_ms), 0)::text AS belt_motor_uptime_ms,
             COALESCE(SUM(session_blade_motor_uptime_ms), 0)::text AS blade_motor_uptime_ms,
             COALESCE(SUM(session_roller_motor_uptime_ms), 0)::text AS roller_motor_uptime_ms
           FROM session_totals
           GROUP BY machine_id
         ),
         steps AS (
           SELECT
             machine_id,
             COALESCE(SUM(delta_steps), 0)::text AS total_steps
           FROM filtered
           WHERE type = 'status_update'
             AND delta_steps IS NOT NULL
           GROUP BY machine_id
         ),
         latest_event AS (
           SELECT DISTINCT ON (machine_id)
             machine_id,
             event_code AS last_event_code,
             event_value AS last_event_value,
             received_at AS last_event_at
           FROM filtered
           WHERE type = 'event'
             AND event_code IS NOT NULL
           ORDER BY machine_id, received_at DESC
         )
         SELECT
           machine_ids.machine_id,
           COALESCE(steps.total_steps, '0')               AS total_steps,
           COALESCE(lifetime.total_uptime_ms, '0')        AS total_uptime_ms,
           COALESCE(lifetime.reboot_count, '0')           AS reboot_count,
           COALESCE(lifetime.tray_count, '0')             AS tray_count,
           COALESCE(lifetime.belt_motor_uptime_ms, '0')   AS belt_motor_uptime_ms,
           COALESCE(lifetime.blade_motor_uptime_ms, '0')  AS blade_motor_uptime_ms,
           COALESCE(lifetime.roller_motor_uptime_ms, '0') AS roller_motor_uptime_ms,
           latest_event.last_event_code,
           latest_event.last_event_value,
           latest_event.last_event_at
         FROM machine_ids
         LEFT JOIN lifetime
           ON lifetime.machine_id = machine_ids.machine_id
         LEFT JOIN steps
           ON steps.machine_id = machine_ids.machine_id
         LEFT JOIN latest_event
           ON latest_event.machine_id = machine_ids.machine_id`,
        [machineIds]
      );
      for (const row of result.rows) {
        statsMap.set(row.machine_id, row);
      }
    } catch (err) {
      console.warn('[TimescaleDB] Failed to fetch stats, returning defaults:', err);
    }
  }

  return machines.map((m) => {
    const base = mapBaseFields(m);
    const stats = statsMap.get(m.id);
    const faults = faultCounts.get(m.id);

    if (stats) {
      base.totalSteps = stats.total_steps;
      base.totalUptimeMs = stats.total_uptime_ms;
      base.rebootCount = parseInt(stats.reboot_count, 10);
      base.trayCount = parseInt(stats.tray_count, 10);
      base.beltMotorUptimeMs = stats.belt_motor_uptime_ms;
      base.bladeMotorUptimeMs = stats.blade_motor_uptime_ms;
      base.rollerMotorUptimeMs = stats.roller_motor_uptime_ms;
      base.lastEventCode = stats.last_event_code;
      base.lastEventValue = stats.last_event_value;
      base.lastEventAt = stats.last_event_at;
    }

    if (faults) {
      base.beltFaultCount = faults.belt;
      base.bladeFaultCount = faults.blade;
      base.rollerFaultCount = faults.roller;
      base.lastBeltFault = faults.lastBelt;
      base.lastBladeFault = faults.lastBlade;
      base.lastRollerFault = faults.lastRoller;
    }

    return applyDemoTelemetry(base);
  });
}
