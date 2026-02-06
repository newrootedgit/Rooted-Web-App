import { router, farmProcedure } from '../../../lib/trpc/trpc.js';
import {
  listCustomersInputSchema,
  getByIdSchema,
  createCustomerSchema,
  updateCustomerSchema,
} from './types.js';
import { listCustomers, getCustomerById } from './queries/index.js';
import { createCustomer, updateCustomer, deactivateCustomer } from './commands/index.js';

export const customerRouter = router({
  list: farmProcedure
    .input(listCustomersInputSchema)
    .query(({ ctx, input }) => listCustomers(ctx.prisma, ctx.farmId, input)),

  byId: farmProcedure
    .input(getByIdSchema)
    .query(({ ctx, input }) => getCustomerById(ctx.prisma, ctx.farmId, input.id)),

  create: farmProcedure
    .input(createCustomerSchema)
    .mutation(({ ctx, input }) => createCustomer(ctx.prisma, ctx.farmId, input)),

  update: farmProcedure
    .input(updateCustomerSchema)
    .mutation(({ ctx, input }) => updateCustomer(ctx.prisma, ctx.farmId, input)),

  deactivate: farmProcedure
    .input(getByIdSchema)
    .mutation(({ ctx, input }) => deactivateCustomer(ctx.prisma, ctx.farmId, input.id)),
});
