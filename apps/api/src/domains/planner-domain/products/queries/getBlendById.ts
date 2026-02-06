import { TRPCError } from '@trpc/server';
import type { PrismaClient } from '../../../../generated/prisma/client.js';
import type { Blend, BlendIngredient } from '../types.js';
import { mapDbProduct } from './getProductById.js';
import { logger as rootLogger } from '../../../../lib/logger/index.js';

const domainLogger = rootLogger.child({ component: 'planner-products' });

export function mapDbBlendIngredient(db: any): BlendIngredient {
  return {
    id: db.id,
    blendId: db.blend_id,
    productId: db.product_id,
    percentage: Number(db.percentage),
    timingOverride: db.timing_override,
    ...(db.products ? { product: mapDbProduct(db.products) } : {}),
  };
}

export function mapDbBlend(db: any): Blend {
  return {
    id: db.id,
    farmId: db.farm_id,
    name: db.name,
    description: db.description,
    createdAt: db.created_at,
    ...(db.blend_ingredients
      ? { ingredients: db.blend_ingredients.map(mapDbBlendIngredient) }
      : {}),
  };
}

export async function getBlendById(
  prisma: PrismaClient,
  farmId: string,
  id: string
): Promise<Blend> {
  const logger = domainLogger.child({ farmId });
  logger.debug('Getting blend by ID', { blendId: id });

  const blend = await prisma.blends.findFirst({
    where: { id, farm_id: farmId },
    include: {
      blend_ingredients: {
        include: { products: true },
      },
    },
  });

  if (!blend) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Blend not found',
    });
  }

  return mapDbBlend(blend);
}