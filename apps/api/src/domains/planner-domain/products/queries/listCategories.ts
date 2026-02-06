import type { PrismaClient } from '../../../../generated/prisma/client.js';
import type { ProductCategory } from '../types.js';
import { logger as rootLogger } from '../../../../lib/logger/index.js';
import { mapDbCategory } from './getCategoryById.js';

const domainLogger = rootLogger.child({ component: 'planner-products' });

export async function listCategories(
  prisma: PrismaClient,
  farmId: string
): Promise<ProductCategory[]> {
  const logger = domainLogger.child({ farmId });
  logger.debug('Listing categories');

  const categories = await prisma.product_categories.findMany({
    where: { farm_id: farmId },
    orderBy: { name: 'asc' },
  });

  return categories.map(mapDbCategory);
}