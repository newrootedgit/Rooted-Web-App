import { TRPCError } from '@trpc/server';
import type { PrismaClient } from '../../../../generated/prisma/client.js';
import type { ProductCategory, CreateCategoryInput } from '../types.js';
import { mapDbCategory } from '../queries/getCategoryById.js';
import { logger as rootLogger } from '../../../../lib/logger/index.js';

const domainLogger = rootLogger.child({ component: 'planner-products' });

export async function createCategory(
  prisma: PrismaClient,
  farmId: string,
  input: CreateCategoryInput
): Promise<ProductCategory> {
  const logger = domainLogger.child({ farmId });
  logger.debug('Creating category', { name: input.name });

  const existing = await prisma.product_categories.findFirst({
    where: { farm_id: farmId, name: input.name },
  });

  if (existing) {
    logger.warn('Duplicate category name', { name: input.name });
    throw new TRPCError({
      code: 'CONFLICT',
      message: `A category named "${input.name}" already exists`,
    });
  }

  const category = await prisma.product_categories.create({
    data: {
      farm_id: farmId,
      name: input.name,
      description: input.description ?? null,
    },
  });

  logger.info('Category created', { categoryId: category.id, name: category.name });
  return mapDbCategory(category);
}