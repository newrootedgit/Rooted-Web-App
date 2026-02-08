import type { PrismaClient } from '../../../../generated/prisma/client.js';
import type { FarmLayout, ListLayoutsInput } from '../types.js';
import {
  type PaginatedResponse,
  getPrismaPaginationOptions,
  createPaginatedResponse,
} from '../../../../lib/trpc/pagination/index.js';
import { mapDbFarmLayout } from './getLayoutById.js';
import { farmLayoutLogger } from '../logger.js';

export async function listLayouts(
  prisma: PrismaClient,
  farmId: string,
  input: ListLayoutsInput
): Promise<PaginatedResponse<FarmLayout>> {
  const logger = farmLayoutLogger.child({ farmId });
  logger.debug('Listing layouts');

  const paginationOptions = getPrismaPaginationOptions(input);

  const layouts = await prisma.farm_layouts.findMany({
    where: { farm_id: farmId },
    ...paginationOptions,
    orderBy: { created_at: 'desc' },
  });

  const mapped = layouts.map(mapDbFarmLayout);
  return createPaginatedResponse(mapped, input);
}
