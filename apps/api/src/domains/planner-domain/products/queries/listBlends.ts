import type { PrismaClient } from '../../../../generated/prisma/client.js';
import type { Blend } from '../types.js';
import {
  type PaginationInput,
  type PaginatedResponse,
  getPrismaPaginationOptions,
  createPaginatedResponse,
} from '../../../../lib/trpc/pagination/index.js';
import { logger as rootLogger } from '../../../../lib/logger/index.js';
import { mapDbBlend } from './getBlendById.js';

const domainLogger = rootLogger.child({ component: 'planner-products' });

export async function listBlends(
  prisma: PrismaClient,
  farmId: string,
  input: PaginationInput
): Promise<PaginatedResponse<Blend>> {
  const logger = domainLogger.child({ farmId });
  logger.debug('Listing blends');

  const paginationOptions = getPrismaPaginationOptions(input);

  const blends = await prisma.blends.findMany({
    where: { farm_id: farmId },
    include: {
      blend_ingredients: {
        include: { products: true },
      },
    },
    ...paginationOptions,
    orderBy: { created_at: 'desc' },
  });

  const mapped = blends.map(mapDbBlend);
  return createPaginatedResponse(mapped, input);
}