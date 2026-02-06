import { TRPCError } from '@trpc/server';
import type { PrismaClient } from '../../../../generated/prisma/client.js';
import type { ProductCategory } from '../types.js';
import { logger as rootLogger } from '../../../../lib/logger/index.js';

const domainLogger = rootLogger.child({ component: 'planner-products' });

export function mapDbCategory(db: any): ProductCategory {
  return {
    id: db.id,
    farmId: db.farm_id,
    name: db.name,
    description: db.description,
    createdAt: db.created_at,
  };
}

export async function getCategoryById(
  prisma: PrismaClient,
  farmId: string,
  id: string
): Promise<ProductCategory> {
  const logger = domainLogger.child({ farmId });
  logger.debug('Getting category by ID', { categoryId: id });

  const category = await prisma.product_categories.findFirst({
    where: { id, farm_id: farmId },
  });

  if (!category) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Category not found',
    });
  }

  return mapDbCategory(category);
}