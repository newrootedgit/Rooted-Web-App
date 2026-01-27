import type { PrismaClient } from '../../../generated/prisma/client.js';
import type { Machine } from '../types.js';
export declare function getMachineById(prisma: PrismaClient, id: string, tenantId: string, farmId: string): Promise<Machine | null>;
//# sourceMappingURL=getMachineById.d.ts.map