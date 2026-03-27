import { TRPCError } from '@trpc/server';
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
  listSkusInputSchema,
  createSkuSchema,
  updateSkuSchema,
  createPackageTypeSchema,
  updatePackageTypeSchema,
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

function mapPackageType(db: any) {
  return {
    id: db.id,
    farmId: db.farm_id,
    name: db.name,
    code: db.code ?? null,
    createdAt: db.created_at,
  };
}

function mapSku(db: any) {
  return {
    id: db.id,
    farmId: db.farm_id,
    productId: db.product_id ?? null,
    blendId: db.blend_id ?? null,
    code: db.code,
    name: db.name,
    weightOz: Number(db.weight_oz),
    price: db.price != null ? Number(db.price) : null,
    packageTypeId: db.package_type_id ?? null,
    salesChannel: db.sales_channel,
    isAvailable: db.is_available ?? true,
    isPublic: db.is_public ?? false,
    stockQuantity: db.stock_quantity ?? 0,
    lowStockThreshold: db.low_stock_threshold ?? 0,
    createdAt: db.created_at,
    product: db.products ?? undefined,
    blend: db.blends ?? undefined,
    packageType: db.package_types ? mapPackageType(db.package_types) : undefined,
  };
}

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

  skus: router({
    list: farmProcedure
      .input(listSkusInputSchema)
      .query(async ({ ctx, input }) => {
        const where: any = {
          farm_id: ctx.farmId,
        };

        if (input.productId) where.product_id = input.productId;
        if (input.blendId) where.blend_id = input.blendId;
        if (input.salesChannel) where.sales_channel = { in: [input.salesChannel, 'BOTH'] };
        if (input.isAvailable !== undefined) where.is_available = input.isAvailable;
        if (input.search) {
          where.OR = [
            { code: { contains: input.search, mode: 'insensitive' } },
            { name: { contains: input.search, mode: 'insensitive' } },
          ];
        }

        const skus = await ctx.prisma.skus.findMany({
          where,
          orderBy: [{ is_available: 'desc' }, { name: 'asc' }],
          take: input.limit,
          include: {
            products: true,
            blends: true,
            package_types: true,
          },
        });

        return {
          items: skus.map(mapSku),
          nextCursor: null,
          hasMore: false,
        };
      }),

    create: farmProcedure
      .input(createSkuSchema)
      .mutation(async ({ ctx, input }) => {
        if (input.packageTypeId) {
          const packageType = await ctx.prisma.package_types.findFirst({
            where: { id: input.packageTypeId, farm_id: ctx.farmId },
          });
          if (!packageType) {
            throw new TRPCError({ code: 'NOT_FOUND', message: 'Package type not found' });
          }
        }

        if (input.productId) {
          const product = await ctx.prisma.products.findFirst({
            where: { id: input.productId, farm_id: ctx.farmId },
          });
          if (!product) {
            throw new TRPCError({ code: 'NOT_FOUND', message: 'Product not found' });
          }
        }

        if (input.blendId) {
          const blend = await ctx.prisma.blends.findFirst({
            where: { id: input.blendId, farm_id: ctx.farmId },
          });
          if (!blend) {
            throw new TRPCError({ code: 'NOT_FOUND', message: 'Blend not found' });
          }
        }

        const sku = await ctx.prisma.skus.create({
          data: {
            farm_id: ctx.farmId,
            product_id: input.productId ?? null,
            blend_id: input.blendId ?? null,
            code: input.code,
            name: input.name,
            weight_oz: input.weightOz,
            price: input.price ?? null,
            package_type_id: input.packageTypeId ?? null,
            sales_channel: input.salesChannel,
            is_available: input.isAvailable ?? true,
            is_public: input.isPublic ?? false,
            stock_quantity: input.stockQuantity ?? 0,
            low_stock_threshold: input.lowStockThreshold ?? 0,
          },
          include: {
            products: true,
            blends: true,
            package_types: true,
          },
        });

        return mapSku(sku);
      }),

    update: farmProcedure
      .input(updateSkuSchema)
      .mutation(async ({ ctx, input }) => {
        const existing = await ctx.prisma.skus.findFirst({
          where: { id: input.id, farm_id: ctx.farmId },
        });
        if (!existing) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'SKU not found' });
        }

        const sku = await ctx.prisma.skus.update({
          where: { id: input.id },
          data: {
            ...(input.productId !== undefined ? { product_id: input.productId } : {}),
            ...(input.blendId !== undefined ? { blend_id: input.blendId } : {}),
            ...(input.code !== undefined ? { code: input.code } : {}),
            ...(input.name !== undefined ? { name: input.name } : {}),
            ...(input.weightOz !== undefined ? { weight_oz: input.weightOz } : {}),
            ...(input.price !== undefined ? { price: input.price } : {}),
            ...(input.packageTypeId !== undefined ? { package_type_id: input.packageTypeId } : {}),
            ...(input.salesChannel !== undefined ? { sales_channel: input.salesChannel } : {}),
            ...(input.isAvailable !== undefined ? { is_available: input.isAvailable } : {}),
            ...(input.isPublic !== undefined ? { is_public: input.isPublic } : {}),
            ...(input.stockQuantity !== undefined ? { stock_quantity: input.stockQuantity } : {}),
            ...(input.lowStockThreshold !== undefined ? { low_stock_threshold: input.lowStockThreshold } : {}),
          },
          include: {
            products: true,
            blends: true,
            package_types: true,
          },
        });

        return mapSku(sku);
      }),

    delete: farmProcedure
      .input(getByIdSchema)
      .mutation(async ({ ctx, input }) => {
        const existing = await ctx.prisma.skus.findFirst({
          where: { id: input.id, farm_id: ctx.farmId },
          select: { id: true },
        });

        if (!existing) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'SKU not found' });
        }

        const inUse = await ctx.prisma.order_items.findFirst({
          where: { sku_id: input.id },
          select: { id: true },
        });

        if (inUse) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'Cannot delete a SKU that is already used in orders',
          });
        }

        await ctx.prisma.skus.delete({
          where: { id: input.id },
        });

        return { success: true };
      }),
  }),

  packageTypes: router({
    list: farmProcedure
      .query(async ({ ctx }) => {
        const items = await ctx.prisma.package_types.findMany({
          where: { farm_id: ctx.farmId },
          orderBy: { name: 'asc' },
        });
        return items.map(mapPackageType);
      }),

    create: farmProcedure
      .input(createPackageTypeSchema)
      .mutation(async ({ ctx, input }) => {
        const created = await ctx.prisma.package_types.create({
          data: {
            farm_id: ctx.farmId,
            name: input.name,
            code: input.code ?? null,
          },
        });
        return mapPackageType(created);
      }),

    update: farmProcedure
      .input(updatePackageTypeSchema)
      .mutation(async ({ ctx, input }) => {
        const existing = await ctx.prisma.package_types.findFirst({
          where: { id: input.id, farm_id: ctx.farmId },
        });
        if (!existing) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Package type not found' });
        }

        const updated = await ctx.prisma.package_types.update({
          where: { id: input.id },
          data: {
            ...(input.name !== undefined ? { name: input.name } : {}),
            ...(input.code !== undefined ? { code: input.code } : {}),
          },
        });
        return mapPackageType(updated);
      }),

    delete: farmProcedure
      .input(getByIdSchema)
      .mutation(async ({ ctx, input }) => {
        const existing = await ctx.prisma.package_types.findFirst({
          where: { id: input.id, farm_id: ctx.farmId },
          select: { id: true },
        });
        if (!existing) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Package type not found' });
        }

        const inUse = await ctx.prisma.skus.findFirst({
          where: { package_type_id: input.id },
          select: { id: true },
        });

        if (inUse) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'Cannot delete a package type that is used by SKUs',
          });
        }

        await ctx.prisma.package_types.delete({
          where: { id: input.id },
        });
        return { success: true };
      }),

    seedDefaults: farmProcedure
      .mutation(async ({ ctx }) => {
        const defaults = [
          { name: 'Clamshell', code: 'CL' },
          { name: 'Bulk Bag', code: 'BG' },
          { name: 'Retail Bag', code: 'RB' },
          { name: 'Tray', code: 'TR' },
        ];

        const existing = await ctx.prisma.package_types.findMany({
          where: { farm_id: ctx.farmId },
          select: { name: true },
        });
        const existingNames = new Set(existing.map((item) => item.name.toLowerCase()));

        const created = [];
        for (const item of defaults) {
          if (existingNames.has(item.name.toLowerCase())) continue;
          created.push(await ctx.prisma.package_types.create({
            data: {
              farm_id: ctx.farmId,
              name: item.name,
              code: item.code,
            },
          }));
        }

        return created.map(mapPackageType);
      }),
  }),
});
