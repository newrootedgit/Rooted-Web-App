import { TRPCError } from '@trpc/server';
import type { PrismaClient } from '../../../generated/prisma/client.js';

export async function updateVarietyGramsPerTray(
  prisma: PrismaClient,
  historyId: string,
  tenantId: string,
  farmId: string,
  gramsPerTray: number | null
) {
  const row = await prisma.machine_variety_history.findUnique({
    where: { id: historyId },
    select: {
      id: true,
      machines: { select: { tenant_id: true, farm_id: true } },
    },
  });

  if (!row || row.machines?.tenant_id !== tenantId || row.machines?.farm_id !== farmId) {
    throw new TRPCError({ code: 'NOT_FOUND', message: 'Variety record not found' });
  }

  return prisma.machine_variety_history.update({
    where: { id: historyId },
    data: { grams_per_tray: gramsPerTray },
    select: { id: true, grams_per_tray: true },
  });
}
