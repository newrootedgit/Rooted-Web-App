import { router, authedProcedure, farmProcedure } from '../lib/trpc/trpc.js';
import { addMachineSchema, getMachineParamsSchema, getByDeviceIdSchema } from './types.js';
import { listMachines } from './service/listMachines.js';
import { getMachine } from './service/getMachine.js';
import { getMachineByDeviceId } from './service/getMachineByDeviceId.js';
import { createOrUpdateMachine } from './service/createOrUpdateMachine.js';

export const machineRouter = router({
  // List machines - uses auth context (tenantId/farmId may be empty)
  list: authedProcedure.query(({ ctx }) =>
    listMachines(ctx.prisma, ctx.auth?.tenantId || '', ctx.auth?.farmId || '')
  ),

  // Get by ID - requires farm context for security
  byId: farmProcedure.input(getMachineParamsSchema).query(({ ctx, input }) =>
    getMachine(ctx.prisma, input.id, ctx.tenantId, ctx.farmId)
  ),

  // Get by device ID - only needs auth, no farm context required
  byDeviceId: authedProcedure.input(getByDeviceIdSchema).query(({ ctx, input }) =>
    getMachineByDeviceId(ctx.prisma, input.deviceId)
  ),

  // Create/update - requires farm context to associate machine with farm
  create: farmProcedure.input(addMachineSchema).mutation(({ ctx, input }) =>
    createOrUpdateMachine(ctx.prisma, input, ctx.tenantId, ctx.farmId)
  ),
});
