import { TRPCError } from '@trpc/server';
import type { PrismaClient } from '../../../../generated/prisma/client.js';
import type { FarmLayout } from '../types.js';
import { farmLayoutLogger } from '../logger.js';

export function mapDbFarmLayout(db: any): FarmLayout {
  return {
    id: db.id,
    farmId: db.farm_id,
    name: db.name,
    canvasData: db.canvas_data ?? { elements: [] },
    isActive: db.is_active,
    createdAt: db.created_at,
  };
}

export async function getLayoutById(
  prisma: PrismaClient,
  farmId: string,
  id: string
): Promise<FarmLayout> {
  const logger = farmLayoutLogger.child({ farmId });
  logger.debug('Getting layout by ID', { layoutId: id });

  const layout = await prisma.farm_layouts.findFirst({
    where: { id, farm_id: farmId },
  });

  if (!layout) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Layout not found',
    });
  }

  return mapDbFarmLayout(layout);
}
