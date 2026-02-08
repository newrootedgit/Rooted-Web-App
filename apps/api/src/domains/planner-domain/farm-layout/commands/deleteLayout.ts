import { TRPCError } from '@trpc/server';
import type { PrismaClient } from '../../../../generated/prisma/client.js';
import { farmLayoutLogger } from '../logger.js';

export async function deleteLayout(
  prisma: PrismaClient,
  farmId: string,
  id: string
): Promise<{ id: string }> {
  const logger = farmLayoutLogger.child({ farmId });
  logger.debug('Deleting layout', { layoutId: id });

  const existing = await prisma.farm_layouts.findFirst({
    where: { id, farm_id: farmId },
  });

  if (!existing) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Layout not found',
    });
  }

  await prisma.farm_layouts.delete({
    where: { id },
  });

  logger.info('Layout deleted', { layoutId: id });
  return { id };
}
