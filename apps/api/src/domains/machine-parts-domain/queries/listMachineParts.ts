import { TRPCError } from '@trpc/server';
import type { PrismaClient } from '../../../generated/prisma/client.js';
import { getMachineType } from '../../machine-domain/machineType.js';
import type {
  MachinePart,
  MachinePartsResponse,
  PartMetric,
  PartStatus,
  PartUsageSource,
} from '../types.js';
import { getMachineUsageTotals, readUsage, type MachineUsageTotals } from './getMachineUsage.js';

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function computeStatus(wearPct: number, warningPct: number, criticalPct: number): PartStatus {
  if (wearPct >= criticalPct) return 'CRITICAL';
  if (wearPct >= warningPct) return 'WARNING';
  return 'OK';
}

function computeDaysRemaining(
  installedAt: Date,
  usageSoFar: number,
  lifespan: number
): number | null {
  const now = Date.now();
  const daysInstalled = (now - installedAt.getTime()) / MS_PER_DAY;
  if (daysInstalled < 1 || usageSoFar <= 0) return null;
  const ratePerDay = usageSoFar / daysInstalled;
  if (ratePerDay <= 0) return null;
  const remaining = lifespan - usageSoFar;
  if (remaining <= 0) return 0;
  return Math.max(0, Math.round(remaining / ratePerDay));
}

interface PartTypeRow {
  id: string;
  farm_id: string | null;
  machine_type: string;
  name: string;
  metric: string;
  usage_source: string;
  default_lifespan: number;
  warning_pct: number;
  critical_pct: number;
}

/**
 * Returns the effective catalog for a given machine type and farm:
 * per-farm overrides take precedence over global defaults sharing the same
 * (machine_type, name).
 */
function mergeCatalog(rows: PartTypeRow[], farmId: string | null): PartTypeRow[] {
  const byName = new Map<string, PartTypeRow>();
  // Insert globals first, then farm overrides overwrite.
  for (const row of rows.filter((r) => r.farm_id === null)) {
    byName.set(row.name, row);
  }
  if (farmId) {
    for (const row of rows.filter((r) => r.farm_id === farmId)) {
      byName.set(row.name, row);
    }
  }
  return Array.from(byName.values()).sort((a, b) => a.name.localeCompare(b.name));
}

export async function listMachineParts(
  prisma: PrismaClient,
  machineId: string,
  tenantId: string | null,
  farmId: string | null
): Promise<MachinePartsResponse> {
  const machine = await prisma.machines.findFirst({
    where: {
      id: machineId,
      ...(tenantId ? { tenant_id: tenantId } : {}),
      ...(farmId ? { farm_id: farmId } : {}),
    },
    select: { id: true, name: true, farm_id: true, is_demo: true },
  });

  if (!machine) {
    throw new TRPCError({ code: 'NOT_FOUND', message: 'Machine not found' });
  }

  const machineType = getMachineType(machine.name);
  if (machineType === 'OTHER') {
    return { machineId: machine.id, machineType, parts: [] };
  }

  const catalogRows = await prisma.machine_part_types.findMany({
    where: {
      machine_type: machineType,
      OR: [
        { farm_id: null },
        ...(machine.farm_id ? [{ farm_id: machine.farm_id }] : []),
      ],
    },
  });

  const effectiveCatalog = mergeCatalog(catalogRows as PartTypeRow[], machine.farm_id);
  if (effectiveCatalog.length === 0) {
    return { machineId: machine.id, machineType, parts: [] };
  }

  const totals = await getMachineUsageTotals(machine.id, {
    demoMachineType: machine.is_demo ? machineType : undefined,
  });

  const existingActive = await prisma.machine_parts.findMany({
    where: { machine_id: machine.id, replaced_at: null },
    include: { part_type: true },
  });

  const activeByPartTypeId = new Map<string, (typeof existingActive)[number]>();
  for (const row of existingActive) {
    activeByPartTypeId.set(row.part_type_id, row);
  }

  // Auto-seed: create an active row for any catalog part with none.
  const toSeed = effectiveCatalog.filter((c) => !activeByPartTypeId.has(c.id));
  if (toSeed.length > 0) {
    // For demo machines, backdate install by 30 days and start usage at 0 so
    // the synthetic totals translate directly into a comfortable wear spread.
    const demoInstalledAt = machine.is_demo
      ? new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      : null;

    const created = await prisma.$transaction(
      toSeed.map((catalog) =>
        prisma.machine_parts.create({
          data: {
            machine_id: machine.id,
            part_type_id: catalog.id,
            ...(demoInstalledAt
              ? { installed_at: demoInstalledAt, usage_at_install: 0 }
              : { usage_at_install: readUsage(totals, catalog.usage_source as PartUsageSource) }),
          },
          include: { part_type: true },
        })
      )
    );
    for (const row of created) {
      activeByPartTypeId.set(row.part_type_id, row);
    }
  }

  // For "last replaced" timestamp, look at the most recent replaced_at per part_type.
  const lastReplacements = await prisma.machine_parts.groupBy({
    by: ['part_type_id'],
    where: { machine_id: machine.id, replaced_at: { not: null } },
    _max: { replaced_at: true },
  });
  const lastReplacedByPartType = new Map<string, Date>();
  for (const row of lastReplacements) {
    if (row._max.replaced_at) {
      lastReplacedByPartType.set(row.part_type_id, row._max.replaced_at);
    }
  }

  const parts: MachinePart[] = effectiveCatalog.map((catalog) => {
    const active = activeByPartTypeId.get(catalog.id)!;
    const lifespan = active.lifespan_override ?? catalog.default_lifespan;
    const usageAtInstall = Number(active.usage_at_install);
    const currentUsage = readUsage(totals, catalog.usage_source as PartUsageSource);
    const usageSoFar = Math.max(0, currentUsage - usageAtInstall);
    const wearPct = lifespan > 0 ? Math.min(999, Math.round((usageSoFar / lifespan) * 1000) / 10) : 0;
    const status = computeStatus(wearPct, catalog.warning_pct, catalog.critical_pct);
    const lastReplacedAt = lastReplacedByPartType.get(catalog.id) ?? null;

    return {
      id: active.id,
      partTypeId: catalog.id,
      name: catalog.name,
      metric: catalog.metric as PartMetric,
      usageSource: catalog.usage_source as PartUsageSource,
      lifespan,
      warningPct: catalog.warning_pct,
      criticalPct: catalog.critical_pct,
      installedAt: active.installed_at.toISOString(),
      lastReplacedAt: lastReplacedAt ? lastReplacedAt.toISOString() : null,
      usageSoFar,
      wearPct,
      status,
      estimatedDaysRemaining: computeDaysRemaining(active.installed_at, usageSoFar, lifespan),
    };
  });

  return { machineId: machine.id, machineType, parts };
}

export { type MachineUsageTotals };
