import type { PrismaClient, Prisma } from '../../generated/prisma/client.js';
import type { Machine } from '../types.js';
import type { PrismaPaginationOptions } from '../../lib/trpc/pagination/index.js';
export interface GetMachinesByTenantOptions extends PrismaPaginationOptions {
    orderBy: Prisma.machinesOrderByWithRelationInput;
}
/**
 * Fetches machines for a tenant with optional farm filtering and pagination
 *
 * @param prisma - Prisma client
 * @param tenantId - Tenant ID (required)
 * @param farmId - Farm ID (optional, null = don't filter by farm)
 * @param options - Pagination and ordering options
 */
export declare function getMachinesByTenant(prisma: PrismaClient, tenantId: string, farmId: string | null, options: GetMachinesByTenantOptions): Promise<Machine[]>;
//# sourceMappingURL=getMachinesByTenant.d.ts.map