import { prisma } from '../../../lib/db/index.js';
export async function getAllTenants() {
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
//# sourceMappingURL=getAllTenants.js.map