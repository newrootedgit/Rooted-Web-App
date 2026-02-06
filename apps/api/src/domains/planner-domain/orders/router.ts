import { router, farmProcedure } from '../../../lib/trpc/trpc.js';
import {
  listOrdersInputSchema,
  getByIdSchema,
  createOrderSchema,
  updateOrderStatusSchema,
  updateOrderSchema,
} from './types.js';
import { listOrders, getOrderById } from './queries/index.js';
import { createOrder, updateOrderStatus, updateOrder } from './commands/index.js';

export const orderRouter = router({
  list: farmProcedure
    .input(listOrdersInputSchema)
    .query(({ ctx, input }) => listOrders(ctx.prisma, ctx.farmId, input)),

  byId: farmProcedure
    .input(getByIdSchema)
    .query(({ ctx, input }) => getOrderById(ctx.prisma, ctx.farmId, input.id)),

  create: farmProcedure
    .input(createOrderSchema)
    .mutation(({ ctx, input }) => createOrder(ctx.prisma, ctx.farmId, input)),

  updateStatus: farmProcedure
    .input(updateOrderStatusSchema)
    .mutation(({ ctx, input }) => updateOrderStatus(ctx.prisma, ctx.farmId, input)),

  update: farmProcedure
    .input(updateOrderSchema)
    .mutation(({ ctx, input }) => updateOrder(ctx.prisma, ctx.farmId, input)),
});
