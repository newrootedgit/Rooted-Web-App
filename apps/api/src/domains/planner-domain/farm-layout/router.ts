import { router, farmProcedure } from '../../../lib/trpc/trpc.js';
import {
  listLayoutsInputSchema,
  getByIdSchema,
  createLayoutSchema,
  updateLayoutSchema,
} from './types.js';
import { listLayouts, getLayoutById, getActiveLayout } from './queries/index.js';
import { createLayout, updateLayout, deleteLayout } from './commands/index.js';

export const farmLayoutRouter = router({
  list: farmProcedure
    .input(listLayoutsInputSchema)
    .query(({ ctx, input }) => listLayouts(ctx.prisma, ctx.farmId, input)),

  byId: farmProcedure
    .input(getByIdSchema)
    .query(({ ctx, input }) => getLayoutById(ctx.prisma, ctx.farmId, input.id)),

  active: farmProcedure
    .query(({ ctx }) => getActiveLayout(ctx.prisma, ctx.farmId)),

  create: farmProcedure
    .input(createLayoutSchema)
    .mutation(({ ctx, input }) => createLayout(ctx.prisma, ctx.farmId, input)),

  update: farmProcedure
    .input(updateLayoutSchema)
    .mutation(({ ctx, input }) => updateLayout(ctx.prisma, ctx.farmId, input)),

  delete: farmProcedure
    .input(getByIdSchema)
    .mutation(({ ctx, input }) => deleteLayout(ctx.prisma, ctx.farmId, input.id)),
});
