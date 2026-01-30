import type { PrismaClient } from '../../../generated/prisma/client.js';

export async function getTenantMachines(prisma: PrismaClient, tenantId: string) {
  return prisma.machines.findMany({
    where: { tenant_id: tenantId },
    include: {
      farms: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
    orderBy: { name: 'asc' },
  });
}
