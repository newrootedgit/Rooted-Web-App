import { router, farmProcedure } from '../../../lib/trpc/trpc.js';
import { paginationInputSchema } from '../../../lib/trpc/pagination/index.js';
import {
  listProductsInputSchema,
  getByIdSchema,
  createProductSchema,
  updateProductSchema,
  createCategorySchema,
  updateCategorySchema,
  createBlendSchema,
  updateBlendSchema,
} from './types.js';
import { listProducts, getProductById, listCategories, getCategoryById, listBlends, getBlendById } from './queries/index.js';
import {
  createProduct,
  updateProduct,
  archiveProduct,
  createCategory,
  updateCategory,
  archiveCategory,
  createBlend,
  updateBlend,
  archiveBlend,
} from './commands/index.js';

export const productRouter = router({
  list: farmProcedure
    .input(listProductsInputSchema)
    .query(({ ctx, input }) => listProducts(ctx.prisma, ctx.farmId, input)),

  byId: farmProcedure
    .input(getByIdSchema)
    .query(({ ctx, input }) => getProductById(ctx.prisma, ctx.farmId, input.id)),

  create: farmProcedure
    .input(createProductSchema)
    .mutation(({ ctx, input }) => createProduct(ctx.prisma, ctx.farmId, input)),

  update: farmProcedure
    .input(updateProductSchema)
    .mutation(({ ctx, input }) => updateProduct(ctx.prisma, ctx.farmId, input)),

  archive: farmProcedure
    .input(getByIdSchema)
    .mutation(({ ctx, input }) => archiveProduct(ctx.prisma, ctx.farmId, input.id)),

  categories: router({
    list: farmProcedure
      .query(({ ctx }) => listCategories(ctx.prisma, ctx.farmId)),

    byId: farmProcedure
      .input(getByIdSchema)
      .query(({ ctx, input }) => getCategoryById(ctx.prisma, ctx.farmId, input.id)),

    create: farmProcedure
      .input(createCategorySchema)
      .mutation(({ ctx, input }) => createCategory(ctx.prisma, ctx.farmId, input)),

    update: farmProcedure
      .input(updateCategorySchema)
      .mutation(({ ctx, input }) => updateCategory(ctx.prisma, ctx.farmId, input)),

    archive: farmProcedure
      .input(getByIdSchema)
      .mutation(({ ctx, input }) => archiveCategory(ctx.prisma, ctx.farmId, input.id)),
  }),

  blends: router({
    list: farmProcedure
      .input(paginationInputSchema)
      .query(({ ctx, input }) => listBlends(ctx.prisma, ctx.farmId, input)),

    byId: farmProcedure
      .input(getByIdSchema)
      .query(({ ctx, input }) => getBlendById(ctx.prisma, ctx.farmId, input.id)),

    create: farmProcedure
      .input(createBlendSchema)
      .mutation(({ ctx, input }) => createBlend(ctx.prisma, ctx.farmId, input)),

    update: farmProcedure
      .input(updateBlendSchema)
      .mutation(({ ctx, input }) => updateBlend(ctx.prisma, ctx.farmId, input)),

    archive: farmProcedure
      .input(getByIdSchema)
      .mutation(({ ctx, input }) => archiveBlend(ctx.prisma, ctx.farmId, input.id)),
  }),
});
