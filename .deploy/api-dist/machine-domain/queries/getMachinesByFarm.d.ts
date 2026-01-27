import type { PrismaClient } from '../../generated/prisma/client.js';
import type { Machine } from '../types.js';
export declare function getMachinesByFarm(prisma: PrismaClient, tenantId: string, farmId: string): Promise<Machine[]>;
//# sourceMappingURL=getMachinesByFarm.d.ts.map