import { router, authedProcedure, farmProcedure, tenantProcedure } from '../../lib/trpc/trpc.js';
import { paginationInputSchema } from '../../lib/trpc/pagination/index.js';
import { z } from 'zod';
import { addMachineSchema, getMachineParamsSchema, getByDeviceIdSchema, deleteMachineSchema } from './types.js';
import { listMachines, getMachine, findMachineByDeviceId, listFaults } from './queries/index.js';
import { createOrUpdateMachine, deleteMachine } from './commands/index.js';
import { requestConfigSchema, getConfigResponseSchema, updateConfigSchema } from './types.js';
import { requestMachineConfig, updateMachineConfig, getConfigResponse } from './mqtt/index.js';

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
    findMachineByDeviceId(ctx.prisma, input.deviceId)
  ),

  create: tenantProcedure.input(addMachineSchema).mutation(({ ctx, input }) =>
    createOrUpdateMachine(ctx.prisma, input, ctx.tenantId, ctx.farmId)
  ),

  delete: tenantProcedure.input(deleteMachineSchema).mutation(({ ctx, input }) =>
    deleteMachine(ctx.prisma, input.deviceId, ctx.tenantId)
  ),

  requestConfig: farmProcedure.input(requestConfigSchema).mutation(({ ctx, input }) =>
    requestMachineConfig(ctx.prisma, input.machineId, ctx.tenantId)
  ),

  updateConfig: farmProcedure.input(updateConfigSchema).mutation(({ ctx, input }) =>
    updateMachineConfig(ctx.prisma, input.machineId, ctx.tenantId, {
      presets: input.presets,
      variety_names: input.variety_names,
    })
  ),

  getConfigResponse: farmProcedure.input(getConfigResponseSchema).query(({ ctx, input }) =>
    getConfigResponse(input.requestId)
  ),

  faults: tenantProcedure
    .input(z.object({ machineId: z.string().uuid() }))
    .query(({ ctx, input }) =>
      listFaults(ctx.prisma, input.machineId, ctx.tenantId)
    ),
});
