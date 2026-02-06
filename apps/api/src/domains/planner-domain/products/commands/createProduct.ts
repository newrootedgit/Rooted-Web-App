import { TRPCError } from '@trpc/server';
import type { PrismaClient } from '../../../../generated/prisma/client.js';
import type { Product, CreateProductInput } from '../types.js';
import { mapDbProduct } from '../queries/getProductById.js';
import { logger as rootLogger } from '../../../../lib/logger/index.js';

const domainLogger = rootLogger.child({ component: 'planner-products' });

export async function createProduct(
  prisma: PrismaClient,
  farmId: string,
  input: CreateProductInput
): Promise<Product> {
  const logger = domainLogger.child({ farmId });
  logger.debug('Creating product', { name: input.name });

  const existing = await prisma.products.findFirst({
    where: { farm_id: farmId, name: input.name },
  });

  if (existing) {
    logger.warn('Duplicate product name', { name: input.name });
    throw new TRPCError({
      code: 'CONFLICT',
      message: `A product named "${input.name}" already exists`,
    });
  }

  const product = await prisma.products.create({
    data: {
      farm_id: farmId,
      category_id: input.categoryId ?? null,
      name: input.name,
      sku: input.sku ?? null,
      days_soaking: input.daysSoaking,
      days_germination: input.daysGermination,
      days_light: input.daysLight,
      avg_yield_per_tray: input.avgYieldPerTray ?? null,
      seed_weight: input.seedWeight ?? null,
      seed_unit: input.seedUnit ?? null,
      unit_cost: input.unitCost ?? null,
      unit_price: input.unitPrice ?? null,
    },
  });

  logger.info('Product created', { productId: product.id, name: product.name });
  return mapDbProduct(product);
}