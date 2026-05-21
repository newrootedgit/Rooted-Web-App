import { TRPCError } from '@trpc/server';
import type { PrismaClient } from '../../../generated/prisma/client.js';
import { getMachineType } from '../../machine-domain/machineType.js';
import { getMachineUsageTotals, readUsage } from '../queries/getMachineUsage.js';
import type { PartUsageSource } from '../types.js';

export async function replacePart(
  prisma: PrismaClient,
  machinePartId: string,
  tenantId: string | null,
  farmId: string | null,
  notes: string | undefined
): Promise<{ id: string }> {
  const active = await prisma.machine_parts.findFirst({
    where: {
      id: machinePartId,
      replaced_at: null,
      machines: {
        ...(tenantId ? { tenant_id: tenantId } : {}),
        ...(farmId ? { farm_id: farmId } : {}),
      },
    },
    include: {
      part_type: true,
      machines: { select: { id: true, name: true, is_demo: true } },
    },
  });

  if (!active) {
    throw new TRPCError({ code: 'NOT_FOUND', message: 'Active part not found' });
  }

  const totals = await getMachineUsageTotals(active.machines.id, {
    demoMachineType: active.machines.is_demo ? getMachineType(active.machines.name) : undefined,
  });
  const usageAtInstall = readUsage(totals, active.part_type.usage_source as PartUsageSource);

  const now = new Date();
  const created = await prisma.$transaction(async (tx) => {
    await tx.machine_parts.update({
      where: { id: active.id },
      data: { replaced_at: now },
    });
    return tx.machine_parts.create({
      data: {
        machine_id: active.machines.id,
        part_type_id: active.part_type_id,
        installed_at: now,
        usage_at_install: usageAtInstall,
        notes: notes ?? null,
      },
      select: { id: true },
    });
  });

  return created;
}
