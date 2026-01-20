import { initTRPC, TRPCError } from '@trpc/server';
import { z } from 'zod';
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

/**
 * Optional farm filter input schema
 */
export const farmFilterInputSchema = z.object({
  farmId: z.string().uuid().optional(),
});

export type FarmFilterInput = z.infer<typeof farmFilterInputSchema>;

/**
 * Requires tenant context, optional farm filter
 *
 * - Requires tenantId (throws FORBIDDEN if missing)
 * - Accepts optional farmId input for filtering
 * - farmId: null means "don't filter by farm" (query all tenant data)
 * - farmId: 'uuid' means filter by both tenantId and farmId
 */
export const tenantProcedure = authedProcedure
  .input(farmFilterInputSchema)
  .use(async ({ ctx, input, next }) => {
    if (!ctx.auth?.tenantId) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Tenant context required',
      });
    }

    return next({
      ctx: {
        ...ctx,
        tenantId: ctx.auth.tenantId,
        farmId: input.farmId ?? null,
      },
    });
  });
