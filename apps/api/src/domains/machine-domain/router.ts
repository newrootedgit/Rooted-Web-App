import { TRPCError } from '@trpc/server';
import { router, authedProcedure, farmProcedure, tenantProcedure } from '../../lib/trpc/trpc.js';
import { paginationInputSchema } from '../../lib/trpc/pagination/index.js';
import { z } from 'zod';
import { isAdmin } from '../../lib/auth/admin.js';
import { addMachineSchema, getMachineParamsSchema, getByDeviceIdSchema, deleteMachineSchema, machineAnalyticsSchema } from './types.js';
import { listMachines, getMachine, findMachineByDeviceId, listFaults, listMachineOptions, getMachineAnalytics, getMachineVarietyOutput, listMachineVarieties } from './queries/index.js';
import { createOrUpdateMachine, deleteMachine, ensureSalesDemoMachines, updateMachineLaborSavings, updateVarietyGramsPerTray } from './commands/index.js';
import { requestConfigSchema, getConfigResponseSchema, updateConfigSchema } from './types.js';
import { requestMachineConfig, updateMachineConfig, getConfigResponse } from './mqtt/index.js';

export const machineRouter = router({
  list: tenantProcedure
    .input(paginationInputSchema)
    .query(({ ctx, input }) =>
      listMachines(ctx.prisma, ctx.tenantId, ctx.farmId, input)
    ),

  options: authedProcedure.query(async ({ ctx }) => {
    if (await isAdmin(ctx.userId)) {
      return listMachineOptions(ctx.prisma, null, null);
    }
    if (!ctx.auth?.tenantId) {
      throw new TRPCError({ code: 'FORBIDDEN', message: 'Tenant context required' });
    }
    return listMachineOptions(ctx.prisma, ctx.auth.tenantId, ctx.auth.farmId || null);
  }),

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

  ensureSalesDemoMachines: farmProcedure.mutation(({ ctx }) =>
    ensureSalesDemoMachines(ctx.prisma, ctx.userId, ctx.tenantId, ctx.farmId)
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

  analytics: authedProcedure.input(machineAnalyticsSchema).query(async ({ ctx, input }) => {
    if (await isAdmin(ctx.userId)) {
      return getMachineAnalytics(ctx.prisma, input.machineId, null, null, input.range);
    }
    if (!ctx.auth?.tenantId || !ctx.auth?.farmId) {
      throw new TRPCError({ code: 'FORBIDDEN', message: 'Farm context required' });
    }
    return getMachineAnalytics(ctx.prisma, input.machineId, ctx.auth.tenantId, ctx.auth.farmId, input.range);
  }),

  varietyOutput: farmProcedure.input(machineAnalyticsSchema).query(({ ctx, input }) =>
    getMachineVarietyOutput(ctx.prisma, input.machineId, ctx.tenantId, ctx.farmId, input.range)
  ),

  listVarieties: farmProcedure
    .input(z.object({ machineId: z.string().uuid() }))
    .query(({ ctx, input }) =>
      listMachineVarieties(ctx.prisma, input.machineId, ctx.tenantId, ctx.farmId)
    ),

  updateVarietyGramsPerTray: farmProcedure
    .input(
      z.object({
        historyId: z.string().uuid(),
        gramsPerTray: z.number().int().min(0).max(10000).nullable(),
      })
    )
    .mutation(({ ctx, input }) =>
      updateVarietyGramsPerTray(ctx.prisma, input.historyId, ctx.tenantId, ctx.farmId, input.gramsPerTray)
    ),

  updateLaborSavings: farmProcedure
    .input(
      z.object({
        machineId: z.string().uuid(),
        laborMinutesSavedPerHour: z.number().int().min(0).max(600).nullable(),
      })
    )
    .mutation(({ ctx, input }) =>
      updateMachineLaborSavings(
        ctx.prisma,
        input.machineId,
        ctx.tenantId,
        ctx.farmId,
        input.laborMinutesSavedPerHour
      )
    ),
});
