import { TRPCError } from '@trpc/server';
import type { PrismaClient } from '../../../generated/prisma/client.js';
import { timescale } from '../../../lib/db/timescale.js';
import type { MachineAnalyticsRange } from '../types.js';

type Source = 'aggregate' | 'demo' | 'unavailable';

interface BucketTraysRow {
  bucket: Date;
  trays: string | number | null;
}

export interface VarietyOutputBucket {
  bucket: string;
  varieties: Record<string, number>;
}

export interface VarietySeedTotal {
  name: string;
  trays: number;
  grams: number | null;
}

export interface MachineVarietyOutput {
  range: MachineAnalyticsRange;
  bucket: '5 minutes' | '1 hour' | '1 day';
  start: string;
  end: string;
  source: Source;
  varieties: string[];
  series: VarietyOutputBucket[];
  seedByVariety: VarietySeedTotal[];
}

const RANGE_CONFIG: Record<MachineAnalyticsRange, { durationMs: number; bucket: MachineVarietyOutput['bucket'] }> = {
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

interface HistoryInterval {
  name: string;
  gramsPerTray: number | null;
  startedAt: Date;
  endedAt: Date | null;
}

function findIntervalForBucket(intervals: HistoryInterval[], bucketTime: number): HistoryInterval | null {
  // Intervals are sorted by startedAt ASC. Linear scan suffices (low N — change events, not telemetry).
  for (let i = intervals.length - 1; i >= 0; i--) {
    const interval = intervals[i];
    const startMs = interval.startedAt.getTime();
    const endMs = interval.endedAt ? interval.endedAt.getTime() : Number.POSITIVE_INFINITY;
    if (bucketTime >= startMs && bucketTime < endMs) return interval;
  }
  return null;
}

function buildDemoVarietyOutput(
  range: MachineAnalyticsRange,
  start: Date,
  end: Date,
  bucket: MachineVarietyOutput['bucket']
): MachineVarietyOutput {
  const pointCount = range === '24h' ? 24 : range === '7d' ? 7 : range === '30d' ? 30 : 90;
  const stepMs = (end.getTime() - start.getTime()) / pointCount;
  const demoVarieties: Array<{ name: string; share: number; grams: number }> = [
    { name: 'Lettuce', share: 0.45, grams: 14 },
    { name: 'Microgreens', share: 0.3, grams: 9 },
    { name: 'Herbs', share: 0.25, grams: 11 },
  ];

  const series: VarietyOutputBucket[] = [];
  const traysByVariety = new Map<string, number>();

  for (let i = 0; i < pointCount; i++) {
    const wave = 0.75 + Math.sin(i / 2) * 0.2;
    const totalTrays = Math.max(0, Math.round(42 * wave));
    const varieties: Record<string, number> = {};
    for (const v of demoVarieties) {
      const trays = Math.round(totalTrays * v.share);
      varieties[v.name] = trays;
      traysByVariety.set(v.name, (traysByVariety.get(v.name) ?? 0) + trays);
    }
    series.push({
      bucket: new Date(start.getTime() + stepMs * i).toISOString(),
      varieties,
    });
  }

  const seedByVariety: VarietySeedTotal[] = demoVarieties.map((v) => ({
    name: v.name,
    trays: traysByVariety.get(v.name) ?? 0,
    grams: (traysByVariety.get(v.name) ?? 0) * v.grams,
  }));

  return {
    range,
    bucket,
    start: start.toISOString(),
    end: end.toISOString(),
    source: 'demo',
    varieties: demoVarieties.map((v) => v.name),
    series,
    seedByVariety,
  };
}

async function queryTraysPerBucket(
  machineId: string,
  start: Date,
  end: Date,
  bucket: MachineVarietyOutput['bucket']
): Promise<BucketTraysRow[]> {
  if (!timescale) return [];
  const result = await timescale.query<BucketTraysRow>(
    `SELECT
       time_bucket($3::interval, bucket) AS bucket,
       COALESCE(SUM(trays), 0)::text AS trays
     FROM machine_analytics_5m
     WHERE machine_id = $1::uuid
       AND bucket >= $2::timestamptz
       AND bucket < $4::timestamptz
     GROUP BY time_bucket($3::interval, bucket)
     ORDER BY bucket ASC
     LIMIT 500`,
    [machineId, start, bucket, end]
  );
  return result.rows;
}

export async function getMachineVarietyOutput(
  prisma: PrismaClient,
  machineId: string,
  tenantId: string | null,
  farmId: string | null,
  range: MachineAnalyticsRange
): Promise<MachineVarietyOutput> {
  const machine = await prisma.machines.findFirst({
    where: {
      id: machineId,
      ...(tenantId ? { tenant_id: tenantId } : {}),
      ...(farmId ? { farm_id: farmId } : {}),
    },
    select: { id: true, is_demo: true },
  });

  if (!machine) {
    throw new TRPCError({ code: 'NOT_FOUND', message: 'Machine not found' });
  }

  const config = RANGE_CONFIG[range];
  const end = new Date();
  const start = new Date(end.getTime() - config.durationMs);

  if (machine.is_demo) {
    return buildDemoVarietyOutput(range, start, end, config.bucket);
  }

  if (!timescale) {
    return {
      range,
      bucket: config.bucket,
      start: start.toISOString(),
      end: end.toISOString(),
      source: 'unavailable',
      varieties: [],
      series: [],
      seedByVariety: [],
    };
  }

  // Pull buckets from the aggregate and all history rows that overlap the range.
  const [traysRows, historyRows] = await Promise.all([
    queryTraysPerBucket(machine.id, start, end, config.bucket).catch((err) => {
      console.warn('[TimescaleDB] variety output bucket query failed:', err);
      return [] as BucketTraysRow[];
    }),
    prisma.machine_variety_history.findMany({
      where: {
        machine_id: machine.id,
        started_at: { lt: end },
        OR: [{ ended_at: null }, { ended_at: { gt: start } }],
      },
      orderBy: { started_at: 'asc' },
      select: { name: true, grams_per_tray: true, started_at: true, ended_at: true },
    }),
  ]);

  const intervals: HistoryInterval[] = historyRows.map((row) => ({
    name: row.name,
    gramsPerTray: row.grams_per_tray,
    startedAt: row.started_at,
    endedAt: row.ended_at,
  }));

  const traysByVariety = new Map<string, number>();
  const gramsByVariety = new Map<string, number>();
  const hasNullGramsForVariety = new Set<string>();

  const series: VarietyOutputBucket[] = traysRows.map((row) => {
    const bucketTime = row.bucket.getTime();
    const trays = toNumber(row.trays);
    const interval = findIntervalForBucket(intervals, bucketTime);
    const varieties: Record<string, number> = {};

    if (interval && trays > 0) {
      varieties[interval.name] = trays;
      traysByVariety.set(interval.name, (traysByVariety.get(interval.name) ?? 0) + trays);
      if (interval.gramsPerTray === null) {
        hasNullGramsForVariety.add(interval.name);
      } else {
        gramsByVariety.set(interval.name, (gramsByVariety.get(interval.name) ?? 0) + trays * interval.gramsPerTray);
      }
    }

    return { bucket: row.bucket.toISOString(), varieties };
  });

  const varieties = Array.from(traysByVariety.keys()).sort(
    (a, b) => (traysByVariety.get(b) ?? 0) - (traysByVariety.get(a) ?? 0)
  );

  const seedByVariety: VarietySeedTotal[] = varieties.map((name) => ({
    name,
    trays: traysByVariety.get(name) ?? 0,
    grams: hasNullGramsForVariety.has(name) ? null : gramsByVariety.get(name) ?? 0,
  }));

  return {
    range,
    bucket: config.bucket,
    start: start.toISOString(),
    end: end.toISOString(),
    source: 'aggregate',
    varieties,
    series,
    seedByVariety,
  };
}
