import type { PrismaClient } from '../../generated/prisma/client.js';
import type { AddMachineInput, Machine } from '../types.js';
export declare function createOrUpdateMachine(prisma: PrismaClient, input: AddMachineInput, tenantId: string, farmId: string | null): Promise<Machine>;
//# sourceMappingURL=createOrUpdateMachine.d.ts.map