import type { PrismaClient, Prisma } from '../../../generated/prisma/client.js';
import type { Machine } from '../types.js';
import type { PrismaPaginationOptions } from '../../../lib/trpc/pagination/index.js';
import { enrichMachinesWithTelemetry } from './enrichMachinesWithTelemetry.js';

export interface GetMachinesByTenantOptions extends PrismaPaginationOptions {
  orderBy: Prisma.machinesOrderByWithRelationInput;
}

export async function getMachinesByTenant(
  prisma: PrismaClient,
  tenantId: string,
  farmId: string | null,
  options: GetMachinesByTenantOptions
): Promise<Machine[]> {
  const where: Prisma.machinesWhereInput = {
    tenant_id: tenantId,
  };

  if (farmId) {
    where.farm_id = farmId;
  }

  const machines = await prisma.machines.findMany({
    where,
    include: {
      machine_faults: true,
    },
    ...options,
  });

  return enrichMachinesWithTelemetry(machines);
}
