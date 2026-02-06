import { TRPCError } from '@trpc/server';
import type { PrismaClient } from '../../../../generated/prisma/client.js';
import type { Product } from '../types.js';
import { mapDbProduct } from '../queries/getProductById.js';
import { logger as rootLogger } from '../../../../lib/logger/index.js';

const domainLogger = rootLogger.child({ component: 'planner-products' });

export async function archiveProduct(
  prisma: PrismaClient,
  farmId: string,
  id: string
): Promise<Product> {
  const logger = domainLogger.child({ farmId });
  logger.debug('Archiving product', { productId: id });

  const existing = await prisma.products.findFirst({
    where: { id, farm_id: farmId },
  });

  if (!existing) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Product not found',
    });
  }

  const activeOrders = await prisma.order_items.findFirst({
    where: { product_id: id },
  });

  if (activeOrders) {
    logger.warn('Cannot archive product with active orders', { productId: id });
    throw new TRPCError({
      code: 'PRECONDITION_FAILED',
      message: 'Cannot archive product that has existing order items',
    });
  }

  const product = await prisma.products.update({
    where: { id },
    data: { is_active: false },
  });

  logger.info('Product archived', { productId: id });
  return mapDbProduct(product);
}