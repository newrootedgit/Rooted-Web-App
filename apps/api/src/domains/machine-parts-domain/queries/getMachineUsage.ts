import { timescale } from '../../../lib/db/timescale.js';
import type { MachineType } from '../../machine-domain/machineType.js';
import type { PartUsageSource } from '../types.js';

/**
 * Cumulative usage totals for a machine across its entire history.
 * Values are in the units used by each lifespan metric (hours or cycles).
 */
export interface MachineUsageTotals {
  belt_motor_runtime: number;   // hours
  blade_motor_runtime: number;  // hours
  roller_motor_runtime: number; // hours
  trays_processed: number;      // cycles
}

const ZERO: MachineUsageTotals = {
  belt_motor_runtime: 0,
  blade_motor_runtime: 0,
  roller_motor_runtime: 0,
  trays_processed: 0,
};

interface UsageRow {
  belt_motor_ms: string | number | null;
  blade_motor_ms: string | number | null;
  roller_motor_ms: string | number | null;
  trays: string | number | null;
}

function toNumber(value: string | number | null): number {
  if (value === null) return 0;
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

/**
 * Synthetic totals for demo machines: roughly one month of normal usage,
 * tuned so every part lands at OK status (no WARNING or CRITICAL) — this
 * is sales-demo data and we don't want to scare buyers.
 * Catalog defaults:
 *   SEEDER: Belt 200h, Belt motor 500h, Roller motor 500h
 *   HARVESTER: Belt 200h, Belt motor 500h, Blade 50k cycles, Blade motor 500h
 */
export function demoUsageTotals(machineType: MachineType): MachineUsageTotals {
  if (machineType === 'SEEDER') {
    return {
      belt_motor_runtime: 90,    // Belt 45%, Belt motor 18%
      blade_motor_runtime: 0,
      roller_motor_runtime: 60,  // Roller motor 12%
      trays_processed: 3600,
    };
  }
  if (machineType === 'HARVESTER') {
    return {
      belt_motor_runtime: 60,    // Belt 30%, Belt motor 12%
      blade_motor_runtime: 80,   // Blade motor 16%
      roller_motor_runtime: 0,
      trays_processed: 15000,    // Blade 30%
    };
  }
  return { ...ZERO };
}

export async function getMachineUsageTotals(
  machineId: string,
  options?: { demoMachineType?: MachineType }
): Promise<MachineUsageTotals> {
  if (options?.demoMachineType) {
    return demoUsageTotals(options.demoMachineType);
  }
  if (!timescale) return { ...ZERO };

  try {
    const result = await timescale.query<UsageRow>(
      `SELECT
         COALESCE(SUM(belt_motor_delta_ms), 0)::text AS belt_motor_ms,
         COALESCE(SUM(blade_motor_delta_ms), 0)::text AS blade_motor_ms,
         COALESCE(SUM(roller_motor_delta_ms), 0)::text AS roller_motor_ms,
         COALESCE(SUM(trays), 0)::text AS trays
       FROM machine_analytics_5m
       WHERE machine_id = $1::uuid`,
      [machineId]
    );

    const row = result.rows[0];
    if (!row) return { ...ZERO };

    return {
      belt_motor_runtime: toNumber(row.belt_motor_ms) / 3_600_000,
      blade_motor_runtime: toNumber(row.blade_motor_ms) / 3_600_000,
      roller_motor_runtime: toNumber(row.roller_motor_ms) / 3_600_000,
      trays_processed: toNumber(row.trays),
    };
  } catch {
    return { ...ZERO };
  }
}

export function readUsage(totals: MachineUsageTotals, source: PartUsageSource): number {
  return totals[source];
}
