import { TRPCError } from '@trpc/server';
import type { PrismaClient } from '../../../generated/prisma/client.js';

export interface UpsertPartTypeInput {
  id: string | null;
  machineType: 'SEEDER' | 'HARVESTER' | 'OTHER';
  name: string;
  metric: 'HOURS' | 'CYCLES';
  usageSource: 'belt_motor_runtime' | 'blade_motor_runtime' | 'roller_motor_runtime' | 'trays_processed';
  defaultLifespan: number;
  warningPct: number;
  criticalPct: number;
}

export async function upsertPartType(prisma: PrismaClient, input: UpsertPartTypeInput) {
  if (input.id) {
    const existing = await prisma.machine_part_types.findFirst({
      where: { id: input.id, farm_id: null },
    });
    if (!existing) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Part type not found' });
    }
    const updated = await prisma.machine_part_types.update({
      where: { id: input.id },
      data: {
        machine_type: input.machineType,
        name: input.name,
        metric: input.metric,
        usage_source: input.usageSource,
        default_lifespan: input.defaultLifespan,
        warning_pct: input.warningPct,
        critical_pct: input.criticalPct,
        updated_at: new Date(),
      },
    });
    return { id: updated.id };
  }

  const created = await prisma.machine_part_types.create({
    data: {
      farm_id: null,
      machine_type: input.machineType,
      name: input.name,
      metric: input.metric,
      usage_source: input.usageSource,
      default_lifespan: input.defaultLifespan,
      warning_pct: input.warningPct,
      critical_pct: input.criticalPct,
    },
  });
  return { id: created.id };
}

export async function deletePartType(prisma: PrismaClient, id: string) {
  const existing = await prisma.machine_part_types.findFirst({
    where: { id, farm_id: null },
  });
  if (!existing) {
    throw new TRPCError({ code: 'NOT_FOUND', message: 'Part type not found' });
  }

  // Refuse to delete if any machine_parts still reference it.
  const refCount = await prisma.machine_parts.count({ where: { part_type_id: id } });
  if (refCount > 0) {
    throw new TRPCError({
      code: 'CONFLICT',
      message: `${refCount} installed part(s) still reference this part type; replace or remove them first.`,
    });
  }

  await prisma.machine_part_types.delete({ where: { id } });
  return { ok: true as const };
}
