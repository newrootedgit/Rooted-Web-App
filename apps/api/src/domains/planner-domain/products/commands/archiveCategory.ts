import { TRPCError } from '@trpc/server';
import type { PrismaClient } from '../../../../generated/prisma/client.js';
import type { ProductCategory } from '../types.js';
import { mapDbCategory } from '../queries/getCategoryById.js';
import { logger as rootLogger } from '../../../../lib/logger/index.js';

const domainLogger = rootLogger.child({ component: 'planner-products' });

export async function archiveCategory(
  prisma: PrismaClient,
  farmId: string,
  id: string
): Promise<ProductCategory> {
  const logger = domainLogger.child({ farmId });
  logger.debug('Archiving category', { categoryId: id });

  const existing = await prisma.product_categories.findFirst({
    where: { id, farm_id: farmId },
  });

  if (!existing) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Category not found',
    });
  }

  const productsInCategory = await prisma.products.findFirst({
    where: { category_id: id, is_active: true },
  });

  if (productsInCategory) {
    logger.warn('Cannot archive category with active products', { categoryId: id });
    throw new TRPCError({
      code: 'PRECONDITION_FAILED',
      message: 'Cannot archive category that has active products. Reassign or archive products first.',
    });
  }

  await prisma.product_categories.delete({
    where: { id },
  });

  logger.info('Category archived', { categoryId: id });
  return mapDbCategory(existing);
}