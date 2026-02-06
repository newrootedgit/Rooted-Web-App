import type { PrismaClient, Prisma } from '../../../../generated/prisma/client.js';
import type { Product, ListProductsInput } from '../types.js';
import {
  type PaginatedResponse,
  getPrismaPaginationOptions,
  createPaginatedResponse,
} from '../../../../lib/trpc/pagination/index.js';
import { logger as rootLogger } from '../../../../lib/logger/index.js';
import { mapDbProduct } from './getProductById.js';

const domainLogger = rootLogger.child({ component: 'planner-products' });

export async function listProducts(
  prisma: PrismaClient,
  farmId: string,
  input: ListProductsInput
): Promise<PaginatedResponse<Product>> {
  const logger = domainLogger.child({ farmId });
  logger.debug('Listing products', { categoryId: input.categoryId, search: input.search, isActive: input.isActive });

  const where: Prisma.productsWhereInput = {
    farm_id: farmId,
  };

  if (input.categoryId) {
    where.category_id = input.categoryId;
  }

  if (input.isActive !== undefined) {
    where.is_active = input.isActive;
  }

  if (input.search) {
    where.OR = [
      { name: { contains: input.search, mode: 'insensitive' } },
      { sku: { contains: input.search, mode: 'insensitive' } },
    ];
  }

  const paginationOptions = getPrismaPaginationOptions(input);

  const products = await prisma.products.findMany({
    where,
    ...paginationOptions,
    orderBy: { created_at: 'desc' },
  });

  const mapped = products.map(mapDbProduct);
  return createPaginatedResponse(mapped, input);
}