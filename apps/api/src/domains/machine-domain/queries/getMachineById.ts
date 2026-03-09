import type { PrismaClient } from '../../../generated/prisma/client.js';
import type { Machine } from '../types.js';
import { enrichMachinesWithTelemetry } from './enrichMachinesWithTelemetry.js';

export async function getMachineById(
  prisma: PrismaClient,
  id: string,
  tenantId: string,
  farmId: string
): Promise<Machine | null> {
  const machine = await prisma.machines.findFirst({
    where: {
      id,
      tenant_id: tenantId,
      farm_id: farmId,
    },
    include: {
      machine_faults: true,
    },
  });

  if (!machine) return null;

  const enriched = await enrichMachinesWithTelemetry([machine]);
  return enriched[0] ?? null;
}
