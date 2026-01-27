import { getMachinesByTenant } from '../queries/getMachinesByTenant.js';
import { getPrismaPaginationOptions, createPaginatedResponse, } from '../../lib/trpc/pagination/index.js';
export async function listMachines(prisma, tenantId, farmId, pagination) {
    // If no tenant context, return empty paginated result
    if (!tenantId) {
        return { items: [], nextCursor: null, hasMore: false };
    }
    const paginationOptions = getPrismaPaginationOptions(pagination);
    const machines = await getMachinesByTenant(prisma, tenantId, farmId, {
        ...paginationOptions,
        orderBy: { created_at: 'desc' },
    });
    return createPaginatedResponse(machines, pagination);
}
//# sourceMappingURL=listMachines.js.map