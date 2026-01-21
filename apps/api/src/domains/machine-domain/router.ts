import { router, authedProcedure, farmProcedure, tenantProcedure } from '../../lib/trpc/trpc.js';
import { paginationInputSchema } from '../../lib/trpc/pagination/index.js';
import { addMachineSchema, getMachineParamsSchema, getByDeviceIdSchema, deleteMachineSchema } from './types.js';
import { listMachines } from './service/listMachines.js';
import { getMachine } from './service/getMachine.js';
import { getMachineByDeviceId } from './service/getMachineByDeviceId.js';
import { createOrUpdateMachine } from './service/createOrUpdateMachine.js';
import { deleteMachine } from './service/deleteMachine.js';

export const machineRouter = router({
  list: tenantProcedure
    .input(paginationInputSchema)
    .query(({ ctx, input }) =>
      listMachines(ctx.prisma, ctx.tenantId, ctx.farmId, input)
    ),

  byId: farmProcedure.input(getMachineParamsSchema).query(({ ctx, input }) =>
    getMachine(ctx.prisma, input.id, ctx.tenantId, ctx.farmId)
  ),

  byDeviceId: authedProcedure.input(getByDeviceIdSchema).query(({ ctx, input }) =>
    getMachineByDeviceId(ctx.prisma, input.deviceId)
  ),

  create: tenantProcedure.input(addMachineSchema).mutation(({ ctx, input }) =>
    createOrUpdateMachine(ctx.prisma, input, ctx.tenantId, ctx.farmId)
  ),

  delete: tenantProcedure.input(deleteMachineSchema).mutation(({ ctx, input }) =>
    deleteMachine(ctx.prisma, input.deviceId, ctx.tenantId)
  ),
});
