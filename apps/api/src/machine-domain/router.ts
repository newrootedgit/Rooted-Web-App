import { router, authedProcedure, farmProcedure, tenantProcedure } from '../lib/trpc/trpc.js';
import { paginationInputSchema } from '../lib/trpc/pagination/index.js';
import { addMachineSchema, getMachineParamsSchema, getByDeviceIdSchema } from './types.js';
import { listMachines } from './service/listMachines.js';
import { getMachine } from './service/getMachine.js';
import { getMachineByDeviceId } from './service/getMachineByDeviceId.js';
import { createOrUpdateMachine } from './service/createOrUpdateMachine.js';

export const machineRouter = router({
  /**
   * List machines with optional farm filtering and pagination
   *
   * - No farmId: Returns machines from all tenant data
   * - With farmId: Returns machines from that specific farm only
   * - Supports cursor-based pagination
   */
  list: tenantProcedure
    .input(paginationInputSchema)
    .query(({ ctx, input }) =>
      listMachines(ctx.prisma, ctx.tenantId, ctx.farmId, input)
    ),

  // Get by ID - requires farm context for security
  byId: farmProcedure.input(getMachineParamsSchema).query(({ ctx, input }) =>
    getMachine(ctx.prisma, input.id, ctx.tenantId, ctx.farmId)
  ),

  // Get by device ID - only needs auth, no farm context required
  byDeviceId: authedProcedure.input(getByDeviceIdSchema).query(({ ctx, input }) =>
    getMachineByDeviceId(ctx.prisma, input.deviceId)
  ),

  // Create/update - requires tenant context, farm is optional
  create: tenantProcedure.input(addMachineSchema).mutation(({ ctx, input }) =>
    createOrUpdateMachine(ctx.prisma, input, ctx.tenantId, ctx.farmId)
  ),
});
