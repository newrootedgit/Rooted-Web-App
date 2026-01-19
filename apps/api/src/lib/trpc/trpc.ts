import { initTRPC, TRPCError } from '@trpc/server';
import type { Context } from './context.js';

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

// Requires authenticated user (userId only)
export const authedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.auth?.userId) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Authentication required',
    });
  }

  return next({
    ctx: {
      ...ctx,
      userId: ctx.auth.userId,
    },
  });
});

// Requires authenticated user WITH farm context (tenantId + farmId)
export const farmProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.auth?.userId) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Authentication required',
    });
  }

  if (!ctx.auth?.tenantId || !ctx.auth?.farmId) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Farm context required - set X-Farm-Id header',
    });
  }

  return next({
    ctx: {
      ...ctx,
      userId: ctx.auth.userId,
      tenantId: ctx.auth.tenantId,
      farmId: ctx.auth.farmId,
    },
  });
});
