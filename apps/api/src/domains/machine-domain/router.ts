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

/**
 * Resolves tenant scoping for endpoints that take a machineId selected from the
 * tenant-wide machine picker (machines.options), which is NOT farm-scoped.
 * Admins see every machine (tenantId = null); other users are scoped to their
 * tenant. Farm scoping is intentionally dropped so a machine that isn't in the
 * currently-active farm still resolves. Mirrors the machines.analytics endpoint.
 */
async function resolveMachineTenantScope(ctx: {
  userId: string;
  auth?: { tenantId?: string | null } | null;
}): Promise<{ tenantId: string | null }> {
  if (await isAdmin(ctx.userId)) {
    return { tenantId: null };
  }
  if (!ctx.auth?.tenantId) {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Tenant context required' });
  }
  return { tenantId: ctx.auth.tenantId };
}

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
    // Match the original tenantProcedure behavior: list every machine in the
    // tenant regardless of the currently-selected farm.
    return listMachineOptions(ctx.prisma, ctx.auth.tenantId, null);
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
    const { tenantId } = await resolveMachineTenantScope(ctx);
    return getMachineAnalytics(ctx.prisma, input.machineId, tenantId, null, input.range);
  }),

  varietyOutput: authedProcedure.input(machineAnalyticsSchema).query(async ({ ctx, input }) => {
    const { tenantId } = await resolveMachineTenantScope(ctx);
    return getMachineVarietyOutput(ctx.prisma, input.machineId, tenantId, null, input.range);
  }),

  listVarieties: authedProcedure
    .input(z.object({ machineId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const { tenantId } = await resolveMachineTenantScope(ctx);
      return listMachineVarieties(ctx.prisma, input.machineId, tenantId, null);
    }),

  updateVarietyGramsPerTray: authedProcedure
    .input(
      z.object({
        historyId: z.string().uuid(),
        gramsPerTray: z.number().int().min(0).max(10000).nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { tenantId } = await resolveMachineTenantScope(ctx);
      return updateVarietyGramsPerTray(ctx.prisma, input.historyId, tenantId, null, input.gramsPerTray);
    }),

  updateLaborSavings: authedProcedure
    .input(
      z.object({
        machineId: z.string().uuid(),
        laborMinutesSavedPerHour: z.number().int().min(0).max(600).nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { tenantId } = await resolveMachineTenantScope(ctx);
      return updateMachineLaborSavings(
        ctx.prisma,
        input.machineId,
        tenantId,
        null,
        input.laborMinutesSavedPerHour
      );
    }),
});
