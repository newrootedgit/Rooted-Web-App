import { TRPCError } from '@trpc/server';
import type { PrismaClient } from '../../../../generated/prisma/client.js';
import type { Blend, CreateBlendInput } from '../types.js';
import { mapDbBlend } from '../queries/getBlendById.js';
import { logger as rootLogger } from '../../../../lib/logger/index.js';

const domainLogger = rootLogger.child({ component: 'planner-products' });

export async function createBlend(
  prisma: PrismaClient,
  farmId: string,
  input: CreateBlendInput
): Promise<Blend> {
  const logger = domainLogger.child({ farmId });
  logger.debug('Creating blend', { name: input.name });

  const totalPercentage = input.ingredients.reduce((sum, i) => sum + i.percentage, 0);
  if (Math.abs(totalPercentage - 100) > 0.01) {
    logger.warn('Blend ingredients must total 100%', { total: totalPercentage });
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: `Blend ingredient percentages must total 100% (got ${totalPercentage}%)`,
    });
  }

  const existing = await prisma.blends.findFirst({
    where: { farm_id: farmId, name: input.name },
  });

  if (existing) {
    logger.warn('Duplicate blend name', { name: input.name });
    throw new TRPCError({
      code: 'CONFLICT',
      message: `A blend named "${input.name}" already exists`,
    });
  }

  const blend = await prisma.$transaction(async (tx: any) => {
    const created = await tx.blends.create({
      data: {
        farm_id: farmId,
        name: input.name,
        description: input.description ?? null,
      },
    });

    await Promise.all(
      input.ingredients.map((ingredient) =>
        tx.blend_ingredients.create({
          data: {
            blend_id: created.id,
            product_id: ingredient.productId,
            percentage: ingredient.percentage,
            timing_override: ingredient.timingOverride ?? null,
          },
        })
      )
    );

    return tx.blends.findFirst({
      where: { id: created.id },
      include: {
        blend_ingredients: {
          include: { products: true },
        },
      },
    });
  });

  logger.info('Blend created', { blendId: blend.id, name: blend.name });
  return mapDbBlend(blend);
}