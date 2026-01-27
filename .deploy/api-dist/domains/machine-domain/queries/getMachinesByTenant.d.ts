import type { PrismaClient, Prisma } from '../../../generated/prisma/client.js';
import type { Machine } from '../types.js';
import type { PrismaPaginationOptions } from '../../../lib/trpc/pagination/index.js';
export interface GetMachinesByTenantOptions extends PrismaPaginationOptions {
    orderBy: Prisma.machinesOrderByWithRelationInput;
}
export declare function getMachinesByTenant(prisma: PrismaClient, tenantId: string, farmId: string | null, options: GetMachinesByTenantOptions): Promise<Machine[]>;
//# sourceMappingURL=getMachinesByTenant.d.ts.map