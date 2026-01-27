import { TRPCError } from '@trpc/server';
import { getMachineById } from '../queries/getMachineById.js';
export async function getMachine(prisma, id, tenantId, farmId) {
    const machine = await getMachineById(prisma, id, tenantId, farmId);
    if (!machine) {
        throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Machine not found',
        });
    }
    return machine;
}
//# sourceMappingURL=getMachine.js.map