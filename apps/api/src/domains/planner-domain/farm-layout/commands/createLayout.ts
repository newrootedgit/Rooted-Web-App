import type { PrismaClient } from '../../../../generated/prisma/client.js';
import type { FarmLayout, CreateLayoutInput } from '../types.js';
import { mapDbFarmLayout } from '../queries/getLayoutById.js';
import { farmLayoutLogger } from '../logger.js';

export async function createLayout(
  prisma: PrismaClient,
  farmId: string,
  input: CreateLayoutInput
): Promise<FarmLayout> {
  const logger = farmLayoutLogger.child({ farmId });
  logger.debug('Creating layout', { name: input.name });

  if (input.isActive) {
    const layout = await prisma.$transaction(async (tx: any) => {
      await tx.farm_layouts.updateMany({
        where: { farm_id: farmId, is_active: true },
        data: { is_active: false },
      });

      return tx.farm_layouts.create({
        data: {
          farm_id: farmId,
          name: input.name,
          canvas_data: input.canvasData,
          is_active: true,
        },
      });
    });

    logger.info('Layout created (active)', { layoutId: layout.id });
    return mapDbFarmLayout(layout);
  }

  const layout = await prisma.farm_layouts.create({
    data: {
      farm_id: farmId,
      name: input.name,
      canvas_data: input.canvasData,
      is_active: input.isActive,
    },
  });

  logger.info('Layout created', { layoutId: layout.id });
  return mapDbFarmLayout(layout);
}
