import { initTRPC, TRPCError } from '@trpc/server';
import type { Context } from './context.js';

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

export const farmProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.auth?.tenantId || !ctx.auth?.farmId) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Authentication required',
    });
  }

  return next({
    ctx: {
      ...ctx,
      tenantId: ctx.auth.tenantId,
      farmId: ctx.auth.farmId,
    },
  });
});
