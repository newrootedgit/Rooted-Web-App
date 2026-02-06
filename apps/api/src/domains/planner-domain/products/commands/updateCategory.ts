import { TRPCError } from '@trpc/server';
import type { PrismaClient } from '../../../../generated/prisma/client.js';
import type { ProductCategory, UpdateCategoryInput } from '../types.js';
import { mapDbCategory } from '../queries/getCategoryById.js';
import { logger as rootLogger } from '../../../../lib/logger/index.js';

const domainLogger = rootLogger.child({ component: 'planner-products' });

export async function updateCategory(
  prisma: PrismaClient,
  farmId: string,
  input: UpdateCategoryInput
): Promise<ProductCategory> {
  const logger = domainLogger.child({ farmId });
  logger.debug('Updating category', { categoryId: input.id });

  const existing = await prisma.product_categories.findFirst({
    where: { id: input.id, farm_id: farmId },
  });

  if (!existing) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Category not found',
    });
  }

  if (input.name && input.name !== existing.name) {
    const duplicate = await prisma.product_categories.findFirst({
      where: { farm_id: farmId, name: input.name, id: { not: input.id } },
    });
    if (duplicate) {
      logger.warn('Duplicate category name on rename', { name: input.name });
      throw new TRPCError({
        code: 'CONFLICT',
        message: `A category named "${input.name}" already exists`,
      });
    }
  }

  const category = await prisma.product_categories.update({
    where: { id: input.id },
    data: {
      ...(input.name !== undefined && { name: input.name }),
      ...(input.description !== undefined && { description: input.description }),
    },
  });

  logger.info('Category updated', { categoryId: category.id });
  return mapDbCategory(category);
}