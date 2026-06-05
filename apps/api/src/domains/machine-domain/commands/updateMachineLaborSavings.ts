import { TRPCError } from '@trpc/server';
import type { PrismaClient } from '../../../generated/prisma/client.js';

export async function updateMachineLaborSavings(
  prisma: PrismaClient,
  machineId: string,
  tenantId: string | null,
  farmId: string | null,
  laborMinutesSavedPerHour: number | null
) {
  const machine = await prisma.machines.findFirst({
    where: {
      id: machineId,
      ...(tenantId ? { tenant_id: tenantId } : {}),
      ...(farmId ? { farm_id: farmId } : {}),
    },
    select: { id: true },
  });

  if (!machine) {
    throw new TRPCError({ code: 'NOT_FOUND', message: 'Machine not found' });
  }

  return prisma.machines.update({
    where: { id: machineId },
    data: { labor_minutes_saved_per_hour: laborMinutesSavedPerHour },
    select: { id: true, labor_minutes_saved_per_hour: true },
  });
}
