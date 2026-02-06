import { TRPCError } from '@trpc/server';
import type { PrismaClient } from '../../../../generated/prisma/client.js';
import type { Product, UpdateProductInput } from '../types.js';
import { mapDbProduct } from '../queries/getProductById.js';
import { logger as rootLogger } from '../../../../lib/logger/index.js';

const domainLogger = rootLogger.child({ component: 'planner-products' });

export async function updateProduct(
  prisma: PrismaClient,
  farmId: string,
  input: UpdateProductInput
): Promise<Product> {
  const logger = domainLogger.child({ farmId });
  logger.debug('Updating product', { productId: input.id });

  const existing = await prisma.products.findFirst({
    where: { id: input.id, farm_id: farmId },
  });

  if (!existing) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Product not found',
    });
  }

  if (input.name && input.name !== existing.name) {
    const duplicate = await prisma.products.findFirst({
      where: { farm_id: farmId, name: input.name, id: { not: input.id } },
    });
    if (duplicate) {
      logger.warn('Duplicate product name on rename', { name: input.name });
      throw new TRPCError({
        code: 'CONFLICT',
        message: `A product named "${input.name}" already exists`,
      });
    }
  }

  const product = await prisma.products.update({
    where: { id: input.id },
    data: {
      ...(input.name !== undefined && { name: input.name }),
      ...(input.categoryId !== undefined && { category_id: input.categoryId }),
      ...(input.sku !== undefined && { sku: input.sku }),
      ...(input.daysSoaking !== undefined && { days_soaking: input.daysSoaking }),
      ...(input.daysGermination !== undefined && { days_germination: input.daysGermination }),
      ...(input.daysLight !== undefined && { days_light: input.daysLight }),
      ...(input.avgYieldPerTray !== undefined && { avg_yield_per_tray: input.avgYieldPerTray }),
      ...(input.seedWeight !== undefined && { seed_weight: input.seedWeight }),
      ...(input.seedUnit !== undefined && { seed_unit: input.seedUnit }),
      ...(input.unitCost !== undefined && { unit_cost: input.unitCost }),
      ...(input.unitPrice !== undefined && { unit_price: input.unitPrice }),
    },
  });

  logger.info('Product updated', { productId: product.id });
  return mapDbProduct(product);
}