import { TRPCError } from '@trpc/server';
import type { PrismaClient } from '../../../../generated/prisma/client.js';
import type { Blend, UpdateBlendInput } from '../types.js';
import { mapDbBlend } from '../queries/getBlendById.js';
import { logger as rootLogger } from '../../../../lib/logger/index.js';

const domainLogger = rootLogger.child({ component: 'planner-products' });

export async function updateBlend(
  prisma: PrismaClient,
  farmId: string,
  input: UpdateBlendInput
): Promise<Blend> {
  const logger = domainLogger.child({ farmId });
  logger.debug('Updating blend', { blendId: input.id });

  const existing = await prisma.blends.findFirst({
    where: { id: input.id, farm_id: farmId },
  });

  if (!existing) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Blend not found',
    });
  }

  if (input.name && input.name !== existing.name) {
    const duplicate = await prisma.blends.findFirst({
      where: { farm_id: farmId, name: input.name, id: { not: input.id } },
    });
    if (duplicate) {
      logger.warn('Duplicate blend name on rename', { name: input.name });
      throw new TRPCError({
        code: 'CONFLICT',
        message: `A blend named "${input.name}" already exists`,
      });
    }
  }

  if (input.ingredients) {
    const totalPercentage = input.ingredients.reduce((sum, i) => sum + i.percentage, 0);
    if (Math.abs(totalPercentage - 100) > 0.01) {
      logger.warn('Blend ingredients must total 100%', { total: totalPercentage });
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: `Blend ingredient percentages must total 100% (got ${totalPercentage}%)`,
      });
    }
  }

  const blend = await prisma.$transaction(async (tx: any) => {
    await tx.blends.update({
      where: { id: input.id },
      data: {
        ...(input.name !== undefined && { name: input.name }),
        ...(input.description !== undefined && { description: input.description }),
      },
    });

    if (input.ingredients) {
      await tx.blend_ingredients.deleteMany({
        where: { blend_id: input.id },
      });

      await Promise.all(
        input.ingredients.map((ingredient) =>
          tx.blend_ingredients.create({
            data: {
              blend_id: input.id,
              product_id: ingredient.productId,
              percentage: ingredient.percentage,
              timing_override: ingredient.timingOverride ?? null,
            },
          })
        )
      );
    }

    return tx.blends.findFirst({
      where: { id: input.id },
      include: {
        blend_ingredients: {
          include: { products: true },
        },
      },
    });
  });

  logger.info('Blend updated', { blendId: input.id });
  return mapDbBlend(blend);
}