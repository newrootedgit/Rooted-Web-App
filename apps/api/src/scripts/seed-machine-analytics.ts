import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { config } from 'dotenv';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const apiRoot = path.resolve(scriptDir, '../..');
const repoRoot = path.resolve(apiRoot, '../..');

config({ path: path.join(repoRoot, '.env') });
config({ path: path.join(apiRoot, '.env'), override: true });

const { prisma } = await import('../lib/db/index.js');
const { timescale } = await import('../lib/db/timescale.js');

type Args = {
  all: boolean;
  append: boolean;
  createMachines: boolean;
  days: number;
  intervalMinutes: number;
  machineId?: string;
  farmId?: string;
  tenantId?: string;
};

type MachineTarget = {
  id: string;
  tenant_id: string | null;
  farm_id: string | null;
  name: string;
  display_name: string | null;
  device_id: string;
};

type TelemetryRow = {
  machineId: string;
  sessionId: string;
  receivedAt: Date;
  type: 'status_update' | 'event';
  schemaVer: number;
  bootId: number;
  seq: number;
  uptimeMs: number | null;
  uptimeS: number | null;
  deltaSteps: number | null;
  torquePct: number | null;
  beltFault: number | null;
  bladeFault: number | null;
  alertBits: number | null;
  killSwitch: number | null;
  cmdAgeMs: number | null;
  udpFailCount: number | null;
  beltMotorUptimeMs: number | null;
  bladeMotorUptimeMs: number | null;
  rollerMotorUptimeMs: number | null;
  eventCode: string | null;
  eventValue: number | null;
  traysProcessed: number | null;
  faultType: string | null;
  motor: string | null;
};

type FaultRow = {
  machine_id: string;
  fault_type: string;
  fault_value: number;
  event_code: string;
  motor: string;
  torque_pct: number;
  created_at: Date;
};

const SESSION_PREFIX = 'analytics-demo';
const EVENT_PREFIX = 'ANALYTICS_DEMO';
const FIVE_DAYS_MS = 5 * 24 * 60 * 60 * 1000;
const DEFAULT_DAYS = 90;
const DEFAULT_INTERVAL_MINUTES = 5;

function parseArgs(argv: string[]): Args {
  const args: Args = {
    all: false,
    append: false,
    createMachines: false,
    days: DEFAULT_DAYS,
    intervalMinutes: DEFAULT_INTERVAL_MINUTES,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    const next = argv[i + 1];

    if (arg === '--all') args.all = true;
    if (arg === '--append') args.append = true;
    if (arg === '--create-machines') args.createMachines = true;
    if (arg === '--machine-id' && next) {
      args.machineId = next;
      i += 1;
    }
    if (arg === '--farm-id' && next) {
      args.farmId = next;
      i += 1;
    }
    if (arg === '--tenant-id' && next) {
      args.tenantId = next;
      i += 1;
    }
    if (arg === '--days' && next) {
      args.days = Math.max(1, Number(next));
      i += 1;
    }
    if (arg === '--interval-minutes' && next) {
      args.intervalMinutes = Math.max(5, Number(next));
      i += 1;
    }
  }

  if (!Number.isFinite(args.days)) args.days = DEFAULT_DAYS;
  if (!Number.isFinite(args.intervalMinutes)) args.intervalMinutes = DEFAULT_INTERVAL_MINUTES;

  return args;
}

function machineWhere(args: Args) {
  return {
    ...(args.machineId ? { id: args.machineId } : {}),
    ...(args.farmId ? { farm_id: args.farmId } : {}),
    ...(args.tenantId ? { tenant_id: args.tenantId } : {}),
  };
}

async function resolveFarm(args: Args) {
  const farm = args.farmId
    ? await prisma.farms.findFirst({
        where: { id: args.farmId, ...(args.tenantId ? { tenant_id: args.tenantId } : {}) },
        select: { id: true, tenant_id: true },
      })
    : await prisma.farms.findFirst({
        where: args.tenantId ? { tenant_id: args.tenantId } : {},
        select: { id: true, tenant_id: true },
        orderBy: { created_at: 'desc' },
      });

  if (!farm?.tenant_id) {
    throw new Error('No farm was found. Pass --farm-id and --tenant-id for the account you want to seed.');
  }

  return { id: farm.id, tenant_id: farm.tenant_id };
}

async function ensureSeedMachine(
  farm: { id: string; tenant_id: string },
  definition: { name: string; displayName: string; deviceId: string; wifi: string }
): Promise<MachineTarget> {
  const existing = await prisma.machines.findFirst({
    where: {
      tenant_id: farm.tenant_id,
      farm_id: farm.id,
      device_id: definition.deviceId,
    },
    select: {
      id: true,
      tenant_id: true,
      farm_id: true,
      name: true,
      display_name: true,
      device_id: true,
    },
  });

  const data = {
    tenant_id: farm.tenant_id,
    farm_id: farm.id,
    name: definition.name,
    display_name: definition.displayName,
    device_id: definition.deviceId,
    status: 'online',
    last_seen_at: new Date(),
    current_wifi_ssid: definition.wifi,
    is_demo: false,
  };

  if (existing) {
    return prisma.machines.update({
      where: { id: existing.id },
      data,
      select: {
        id: true,
        tenant_id: true,
        farm_id: true,
        name: true,
        display_name: true,
        device_id: true,
      },
    });
  }

  return prisma.machines.create({
    data,
    select: {
      id: true,
      tenant_id: true,
      farm_id: true,
      name: true,
      display_name: true,
      device_id: true,
    },
  });
}

async function ensureSeedMachines(args: Args): Promise<MachineTarget[]> {
  const farm = await resolveFarm(args);
  const definitions = [
    {
      name: 'HARVESTER',
      displayName: 'Analytics Harvester',
      deviceId: `analytics-harvester-${farm.id}`,
      wifi: 'ANALYTICS_LINE_A',
    },
    {
      name: 'SEEDER',
      displayName: 'Analytics Seeder',
      deviceId: `analytics-seeder-${farm.id}`,
      wifi: 'ANALYTICS_LINE_B',
    },
    {
      name: 'WASHER',
      displayName: 'Analytics Washer',
      deviceId: `analytics-washer-${farm.id}`,
      wifi: 'ANALYTICS_LINE_C',
    },
  ];

  const machines: MachineTarget[] = [];
  for (const definition of definitions) {
    machines.push(await ensureSeedMachine(farm, definition));
  }

  return machines;
}

async function resolveTargets(args: Args): Promise<MachineTarget[]> {
  if (args.machineId) {
    const machine = await prisma.machines.findFirst({
      where: machineWhere(args),
      select: {
        id: true,
        tenant_id: true,
        farm_id: true,
        name: true,
        display_name: true,
        device_id: true,
      },
    });

    if (!machine) {
      throw new Error(`No machine found for --machine-id ${args.machineId}`);
    }

    return [machine];
  }

  if (args.createMachines) {
    return ensureSeedMachines(args);
  }

  const machines = await prisma.machines.findMany({
    where: {
      ...machineWhere(args),
      is_demo: false,
    },
    select: {
      id: true,
      tenant_id: true,
      farm_id: true,
      name: true,
      display_name: true,
      device_id: true,
    },
    orderBy: { created_at: 'desc' },
  });

  if (machines.length > 0) {
    return args.all ? machines : [machines[0]];
  }

  return ensureSeedMachines(args);
}

function createTelemetry(machine: MachineTarget, args: Args): { telemetry: TelemetryRow[]; faults: FaultRow[] } {
  const telemetry: TelemetryRow[] = [];
  const faults: FaultRow[] = [];
  const now = new Date();
  const start = new Date(now.getTime() - args.days * 24 * 60 * 60 * 1000);
  const intervalMs = args.intervalMinutes * 60 * 1000;
  const sampleOffsetMs = Math.min(4 * 60 * 1000, intervalMs - 60 * 1000);
  let bootStart = start.getTime();
  let bootId = 900000;
  let seq = 1;
  let trays = 0;
  let beltMotor = 0;
  let bladeMotor = 0;
  let rollerMotor = 0;
  const isSeeder = machine.name.toUpperCase().includes('SEEDER');

  for (let time = start.getTime(); time < now.getTime(); time += intervalMs) {
    if (time - bootStart >= FIVE_DAYS_MS) {
      bootId += 1;
      bootStart = time;
      trays = 0;
      beltMotor = 0;
      bladeMotor = 0;
      rollerMotor = 0;
    }

    const index = Math.floor((time - start.getTime()) / intervalMs);
    const dayPhase = Math.sin((index / Math.max(1, 24 * 60 / args.intervalMinutes)) * Math.PI * 2);
    const workFactor = Math.max(0, 0.65 + dayPhase * 0.35 + Math.sin(index / 17) * 0.12);
    const traysDelta = Math.round((isSeeder ? 3 : 5) * workFactor);
    const beltDelta = Math.round(intervalMs * (0.52 + workFactor * 0.28));
    const bladeDelta = isSeeder ? 0 : Math.round(intervalMs * (0.34 + workFactor * 0.18));
    const rollerDelta = isSeeder ? Math.round(intervalMs * (0.25 + workFactor * 0.2)) : 0;
    const stepsDelta = Math.round((isSeeder ? 95 : 140) * workFactor);
    const avgTorque = Math.round((isSeeder ? 40 : 58) + workFactor * 25 + Math.sin(index / 11) * 7);
    const hasBeltFault = index % 157 === 42;
    const hasBladeFault = !isSeeder && index % 211 === 88;
    const hasAlert = index % 97 === 12;
    const hasKillSwitch = index % 389 === 24;
    const firstSampleAt = new Date(time);
    const secondSampleAt = new Date(time + sampleOffsetMs);
    const sessionId = `${SESSION_PREFIX}:${machine.id}`;
    const uptimeMs = time - bootStart;

    telemetry.push({
      machineId: machine.id,
      sessionId,
      receivedAt: firstSampleAt,
      type: 'status_update',
      schemaVer: 1,
      bootId,
      seq: seq,
      uptimeMs,
      uptimeS: Math.floor(uptimeMs / 1000),
      deltaSteps: 0,
      torquePct: Math.max(0, avgTorque - 4),
      beltFault: 0,
      bladeFault: 0,
      alertBits: 0,
      killSwitch: 0,
      cmdAgeMs: Math.round(55 + Math.abs(Math.sin(index / 9)) * 90),
      udpFailCount: index % 31 === 0 ? 1 : 0,
      beltMotorUptimeMs: beltMotor,
      bladeMotorUptimeMs: bladeMotor,
      rollerMotorUptimeMs: rollerMotor,
      eventCode: null,
      eventValue: null,
      traysProcessed: trays,
      faultType: null,
      motor: null,
    });
    seq += 1;

    trays += traysDelta;
    beltMotor += beltDelta;
    bladeMotor += bladeDelta;
    rollerMotor += rollerDelta;

    telemetry.push({
      machineId: machine.id,
      sessionId,
      receivedAt: secondSampleAt,
      type: 'status_update',
      schemaVer: 1,
      bootId,
      seq,
      uptimeMs: uptimeMs + sampleOffsetMs,
      uptimeS: Math.floor((uptimeMs + sampleOffsetMs) / 1000),
      deltaSteps: stepsDelta,
      torquePct: avgTorque,
      beltFault: hasBeltFault ? 1 : 0,
      bladeFault: hasBladeFault ? 1 : 0,
      alertBits: hasAlert ? 4 : 0,
      killSwitch: hasKillSwitch ? 1 : 0,
      cmdAgeMs: Math.round(65 + Math.abs(Math.sin(index / 13)) * 120),
      udpFailCount: index % 43 === 0 ? 2 : index % 19 === 0 ? 1 : 0,
      beltMotorUptimeMs: beltMotor,
      bladeMotorUptimeMs: bladeMotor,
      rollerMotorUptimeMs: rollerMotor,
      eventCode: null,
      eventValue: null,
      traysProcessed: trays,
      faultType: null,
      motor: null,
    });
    seq += 1;

    const eventCode = hasBeltFault
      ? `${EVENT_PREFIX}_FAULT_BELT_TORQUE`
      : hasBladeFault
        ? `${EVENT_PREFIX}_FAULT_BLADE_TORQUE`
        : hasKillSwitch
          ? `${EVENT_PREFIX}_KILL_SWITCH`
          : hasAlert
            ? `${EVENT_PREFIX}_ALERT_BITS`
            : null;

    if (eventCode) {
      const motor = hasBeltFault ? 'belt' : hasBladeFault ? 'blade' : null;
      telemetry.push({
        machineId: machine.id,
        sessionId,
        receivedAt: new Date(time + Math.min(sampleOffsetMs + 1000, intervalMs - 1000)),
        type: 'event',
        schemaVer: 1,
        bootId,
        seq,
        uptimeMs: uptimeMs + sampleOffsetMs + 1000,
        uptimeS: Math.floor((uptimeMs + sampleOffsetMs + 1000) / 1000),
        deltaSteps: null,
        torquePct: avgTorque,
        beltFault: hasBeltFault ? 1 : 0,
        bladeFault: hasBladeFault ? 1 : 0,
        alertBits: hasAlert ? 4 : 0,
        killSwitch: hasKillSwitch ? 1 : 0,
        cmdAgeMs: null,
        udpFailCount: null,
        beltMotorUptimeMs: null,
        bladeMotorUptimeMs: null,
        rollerMotorUptimeMs: null,
        eventCode,
        eventValue: 1,
        traysProcessed: null,
        faultType: hasBeltFault || hasBladeFault ? eventCode : null,
        motor,
      });
      seq += 1;

      if (motor) {
        faults.push({
          machine_id: machine.id,
          fault_type: eventCode,
          fault_value: 1,
          event_code: eventCode,
          motor,
          torque_pct: avgTorque,
          created_at: secondSampleAt,
        });
      }
    }
  }

  return { telemetry, faults };
}

async function insertTelemetry(rows: TelemetryRow[]) {
  if (!timescale || rows.length === 0) return;

  const columns = [
    'machine_id',
    'session_id',
    'received_at',
    'type',
    'schema_ver',
    'boot_id',
    'seq',
    'uptime_ms',
    'uptime_s',
    'delta_steps',
    'torque_pct',
    'belt_fault',
    'blade_fault',
    'alert_bits',
    'kill_switch',
    'cmd_age_ms',
    'udp_fail_count',
    'belt_motor_uptime_ms',
    'blade_motor_uptime_ms',
    'roller_motor_uptime_ms',
    'event_code',
    'event_value',
    'trays_processed',
    'fault_type',
    'motor',
  ];
  const batchSize = 400;

  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize);
    const values: unknown[] = [];
    const placeholders = batch.map((row, rowIndex) => {
      const offset = rowIndex * columns.length;
      values.push(
        row.machineId,
        row.sessionId,
        row.receivedAt,
        row.type,
        row.schemaVer,
        row.bootId,
        row.seq,
        row.uptimeMs,
        row.uptimeS,
        row.deltaSteps,
        row.torquePct,
        row.beltFault,
        row.bladeFault,
        row.alertBits,
        row.killSwitch,
        row.cmdAgeMs,
        row.udpFailCount,
        row.beltMotorUptimeMs,
        row.bladeMotorUptimeMs,
        row.rollerMotorUptimeMs,
        row.eventCode,
        row.eventValue,
        row.traysProcessed,
        row.faultType,
        row.motor
      );
      return `(${columns.map((_, columnIndex) => `$${offset + columnIndex + 1}`).join(', ')})`;
    });

    await timescale.query(
      `INSERT INTO raw_telemetry (${columns.join(', ')})
       VALUES ${placeholders.join(', ')}
       ON CONFLICT DO NOTHING`,
      values
    );
  }
}

async function refreshAnalyticsAggregate(start: Date, end: Date) {
  if (!timescale) return;

  try {
    await timescale.query(
      "CALL refresh_continuous_aggregate('machine_analytics_5m', $1::timestamptz, $2::timestamptz)",
      [start, end]
    );
  } catch (error) {
    console.warn('[seed] Could not refresh machine_analytics_5m. Analytics will use raw fallback until the view exists/refreshed.', error);
  }
}

async function ensureTimescaleSchema() {
  if (!timescale) return;

  await timescale.query(`
    ALTER TABLE raw_telemetry ADD COLUMN IF NOT EXISTS roller_motor_uptime_ms BIGINT;
    ALTER TABLE raw_telemetry ADD COLUMN IF NOT EXISTS fault_type VARCHAR(50);
    ALTER TABLE raw_telemetry ADD COLUMN IF NOT EXISTS motor VARCHAR(20);
  `);

  await timescale.query(`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT FROM timescaledb_information.continuous_aggregates
        WHERE view_name = 'machine_analytics_5m'
      ) THEN
        EXECUTE '
          CREATE MATERIALIZED VIEW machine_analytics_5m
          WITH (timescaledb.continuous) AS
          SELECT
            machine_id,
            time_bucket(''5 minutes'', received_at) AS bucket,
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
          WHERE type = ''status_update''
          GROUP BY machine_id, time_bucket(''5 minutes'', received_at)
          WITH NO DATA
        ';
      END IF;
    END $$;
  `);

  await timescale.query(`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT FROM timescaledb_information.jobs
        WHERE hypertable_name = 'machine_analytics_5m'
          AND proc_name = 'policy_refresh_continuous_aggregate'
      ) THEN
        PERFORM add_continuous_aggregate_policy('machine_analytics_5m',
          start_offset => INTERVAL '3 hours',
          end_offset => INTERVAL '5 minutes',
          schedule_interval => INTERVAL '5 minutes'
        );
      END IF;
    END $$;
  `);
}

async function seed() {
  const args = parseArgs(process.argv.slice(2));

  if (!timescale) {
    throw new Error('TIMESCALE_DATABASE_URL is required to seed machine analytics telemetry.');
  }

  await ensureTimescaleSchema();

  const targets = await resolveTargets(args);
  const now = new Date();
  const start = new Date(now.getTime() - args.days * 24 * 60 * 60 * 1000);

  console.log(`[seed] Seeding ${targets.length} machine(s), ${args.days} days, ${args.intervalMinutes} minute buckets.`);

  for (const target of targets) {
    const { telemetry, faults } = createTelemetry(target, args);

    if (!args.append) {
      await timescale.query(
        'DELETE FROM raw_telemetry WHERE machine_id = $1::uuid AND session_id = $2',
        [target.id, `${SESSION_PREFIX}:${target.id}`]
      );
      await prisma.machine_faults.deleteMany({
        where: {
          machine_id: target.id,
          event_code: { startsWith: EVENT_PREFIX },
        },
      });
    }

    await insertTelemetry(telemetry);

    if (faults.length > 0) {
      await prisma.machine_faults.createMany({
        data: faults,
        skipDuplicates: true,
      });
    }

    await prisma.machines.update({
      where: { id: target.id },
      data: {
        status: 'online',
        last_seen_at: now,
        current_wifi_ssid: 'ANALYTICS_DEMO',
      },
    });

    console.log(`[seed] ${target.display_name || target.name}: ${telemetry.length} telemetry rows, ${faults.length} fault rows.`);
  }

  await refreshAnalyticsAggregate(start, now);
  await timescale.end();
  await prisma.$disconnect();

  console.log('[seed] Machine analytics demo data complete.');
}

seed().catch(async (error) => {
  console.error('[seed] Failed to seed machine analytics demo data:', error);
  await timescale?.end().catch(() => undefined);
  await prisma.$disconnect().catch(() => undefined);
  process.exit(1);
});
