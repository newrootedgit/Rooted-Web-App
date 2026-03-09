import type { PrismaClient } from '../../../generated/prisma/client.js';
import type { Machine } from '../types.js';
import { enrichMachinesWithTelemetry } from './enrichMachinesWithTelemetry.js';

export async function getMachinesByFarm(
  prisma: PrismaClient,
  tenantId: string,
  farmId: string
): Promise<Machine[]> {
  const machines = await prisma.machines.findMany({
    where: {
      tenant_id: tenantId,
      farm_id: farmId,
    },
    include: {
      machine_faults: true,
    },
    orderBy: {
      created_at: 'desc',
    },
  });

  return enrichMachinesWithTelemetry(machines);
}
