import { prisma } from '../../../lib/db/index.js';
export async function getTenantMachines(tenantId) {
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
//# sourceMappingURL=getTenantMachines.js.map