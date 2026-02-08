import { TRPCError } from '@trpc/server';
import type { PrismaClient } from '../../../../generated/prisma/client.js';
import type { FarmLayout, UpdateLayoutInput } from '../types.js';
import { mapDbFarmLayout } from '../queries/getLayoutById.js';
import { farmLayoutLogger } from '../logger.js';

export async function updateLayout(
  prisma: PrismaClient,
  farmId: string,
  input: UpdateLayoutInput
): Promise<FarmLayout> {
  const logger = farmLayoutLogger.child({ farmId });
  logger.debug('Updating layout', { layoutId: input.id });

  const existing = await prisma.farm_layouts.findFirst({
    where: { id: input.id, farm_id: farmId },
  });

  if (!existing) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Layout not found',
    });
  }

  const data: any = {};
  if (input.name !== undefined) data.name = input.name;
  if (input.canvasData !== undefined) data.canvas_data = input.canvasData;
  if (input.isActive !== undefined) data.is_active = input.isActive;

  if (input.isActive === true) {
    const layout = await prisma.$transaction(async (tx: any) => {
      await tx.farm_layouts.updateMany({
        where: { farm_id: farmId, is_active: true },
        data: { is_active: false },
      });

      return tx.farm_layouts.update({
        where: { id: input.id },
        data,
      });
    });

    logger.info('Layout updated (set active)', { layoutId: layout.id });
    return mapDbFarmLayout(layout);
  }

  const layout = await prisma.farm_layouts.update({
    where: { id: input.id },
    data,
  });

  logger.info('Layout updated', { layoutId: layout.id });
  return mapDbFarmLayout(layout);
}
