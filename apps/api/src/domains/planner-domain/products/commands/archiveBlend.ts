import { TRPCError } from '@trpc/server';
import type { PrismaClient } from '../../../../generated/prisma/client.js';
import type { Blend } from '../types.js';
import { mapDbBlend } from '../queries/getBlendById.js';
import { logger as rootLogger } from '../../../../lib/logger/index.js';

const domainLogger = rootLogger.child({ component: 'planner-products' });

export async function archiveBlend(
  prisma: PrismaClient,
  farmId: string,
  id: string
): Promise<Blend> {
  const logger = domainLogger.child({ farmId });
  logger.debug('Archiving blend', { blendId: id });

  const existing = await prisma.blends.findFirst({
    where: { id, farm_id: farmId },
    include: {
      blend_ingredients: {
        include: { products: true },
      },
    },
  });

  if (!existing) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Blend not found',
    });
  }

  const activeOrders = await prisma.order_items.findFirst({
    where: { blend_id: id },
  });

  if (activeOrders) {
    logger.warn('Cannot archive blend with active orders', { blendId: id });
    throw new TRPCError({
      code: 'PRECONDITION_FAILED',
      message: 'Cannot archive blend that has existing order items',
    });
  }

  await prisma.blends.delete({
    where: { id },
  });

  logger.info('Blend archived', { blendId: id });
  return mapDbBlend(existing);
}