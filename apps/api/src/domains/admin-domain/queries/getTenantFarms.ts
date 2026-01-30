import type { PrismaClient } from '../../../generated/prisma/client.js';

export async function getTenantFarms(prisma: PrismaClient, tenantId: string) {
  return prisma.farms.findMany({
    where: { tenant_id: tenantId },
    select: {
      id: true,
      name: true,
      slug: true,
      contact_email: true,
      created_at: true,
      _count: {
        select: {
          machines: true,
        },
      },
    },
    orderBy: { name: 'asc' },
  });
}
