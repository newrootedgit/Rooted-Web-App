import type { PrismaClient } from '../../../generated/prisma/client.js';

export async function getAllTenants(prisma: PrismaClient) {
  return prisma.tenants.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      contact_email: true,
      created_at: true,
      _count: {
        select: {
          farms: true,
          machines: true,
        },
      },
    },
    orderBy: { name: 'asc' },
  });
}
