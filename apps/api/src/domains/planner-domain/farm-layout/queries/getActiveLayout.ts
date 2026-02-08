import type { PrismaClient } from '../../../../generated/prisma/client.js';
import type { FarmLayout } from '../types.js';
import { mapDbFarmLayout } from './getLayoutById.js';
import { farmLayoutLogger } from '../logger.js';

export async function getActiveLayout(
  prisma: PrismaClient,
  farmId: string
): Promise<FarmLayout | null> {
  const logger = farmLayoutLogger.child({ farmId });
  logger.debug('Getting active layout');

  const layout = await prisma.farm_layouts.findFirst({
    where: { farm_id: farmId, is_active: true },
  });

  return layout ? mapDbFarmLayout(layout) : null;
}
