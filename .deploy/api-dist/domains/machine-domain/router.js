import { router, authedProcedure, farmProcedure, tenantProcedure } from '../../lib/trpc/trpc.js';
import { paginationInputSchema } from '../../lib/trpc/pagination/index.js';
import { addMachineSchema, getMachineParamsSchema, getByDeviceIdSchema, deleteMachineSchema } from './types.js';
import { listMachines, getMachine, findMachineByDeviceId } from './queries/index.js';
import { createOrUpdateMachine, deleteMachine } from './commands/index.js';
export const machineRouter = router({
    list: tenantProcedure
        .input(paginationInputSchema)
        .query(({ ctx, input }) => listMachines(ctx.prisma, ctx.tenantId, ctx.farmId, input)),
    byId: farmProcedure.input(getMachineParamsSchema).query(({ ctx, input }) => getMachine(ctx.prisma, input.id, ctx.tenantId, ctx.farmId)),
    byDeviceId: authedProcedure.input(getByDeviceIdSchema).query(({ ctx, input }) => findMachineByDeviceId(ctx.prisma, input.deviceId)),
    create: tenantProcedure.input(addMachineSchema).mutation(({ ctx, input }) => createOrUpdateMachine(ctx.prisma, input, ctx.tenantId, ctx.farmId)),
    delete: tenantProcedure.input(deleteMachineSchema).mutation(({ ctx, input }) => deleteMachine(ctx.prisma, input.deviceId, ctx.tenantId)),
});
//# sourceMappingURL=router.js.map