import { TRPCError } from '@trpc/server';
import { router, authedProcedure } from '../../lib/trpc/trpc.js';
import { isAdmin } from '../../lib/auth/admin.js';
import { listMachinePartsSchema, replacePartSchema } from './types.js';
import { listMachineParts } from './queries/listMachineParts.js';
import { replacePart } from './commands/replacePart.js';

export const machinePartsRouter = router({
  list: authedProcedure.input(listMachinePartsSchema).query(async ({ ctx, input }) => {
    if (await isAdmin(ctx.userId)) {
      return listMachineParts(ctx.prisma, input.machineId, null, null);
    }
    if (!ctx.auth?.tenantId || !ctx.auth?.farmId) {
      throw new TRPCError({ code: 'FORBIDDEN', message: 'Farm context required' });
    }
    return listMachineParts(ctx.prisma, input.machineId, ctx.auth.tenantId, ctx.auth.farmId);
  }),

  replace: authedProcedure.input(replacePartSchema).mutation(async ({ ctx, input }) => {
    if (await isAdmin(ctx.userId)) {
      return replacePart(ctx.prisma, input.machinePartId, null, null, input.notes);
    }
    if (!ctx.auth?.tenantId || !ctx.auth?.farmId) {
      throw new TRPCError({ code: 'FORBIDDEN', message: 'Farm context required' });
    }
    return replacePart(ctx.prisma, input.machinePartId, ctx.auth.tenantId, ctx.auth.farmId, input.notes);
  }),
});
