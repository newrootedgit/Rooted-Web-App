import { router, farmProcedure } from '../lib/trpc/trpc.js';
import { addMachineSchema, getMachineParamsSchema } from './types.js';
import { listMachines } from './service/listMachines.js';
import { getMachine } from './service/getMachine.js';
import { createOrUpdateMachine } from './service/createOrUpdateMachine.js';

export const machineRouter = router({
  list: farmProcedure.query(({ ctx }) =>
    listMachines(ctx.prisma, ctx.tenantId, ctx.farmId)
  ),

  byId: farmProcedure.input(getMachineParamsSchema).query(({ ctx, input }) =>
    getMachine(ctx.prisma, input.id, ctx.tenantId, ctx.farmId)
  ),

  create: farmProcedure.input(addMachineSchema).mutation(({ ctx, input }) =>
    createOrUpdateMachine(ctx.prisma, input, ctx.tenantId, ctx.farmId)
  ),
});
