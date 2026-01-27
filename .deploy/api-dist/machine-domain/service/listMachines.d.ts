import type { PrismaClient } from '../../generated/prisma/client.js';
import type { Machine } from '../types.js';
import { type PaginationInput, type PaginatedResponse } from '../../lib/trpc/pagination/index.js';
export declare function listMachines(prisma: PrismaClient, tenantId: string, farmId: string | null, pagination: PaginationInput): Promise<PaginatedResponse<Machine>>;
//# sourceMappingURL=listMachines.d.ts.map