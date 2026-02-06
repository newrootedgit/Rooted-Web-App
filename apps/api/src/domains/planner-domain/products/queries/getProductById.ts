import { TRPCError } from '@trpc/server';
import type { PrismaClient } from '../../../../generated/prisma/client.js';
import type { Product } from '../types.js';
import { logger as rootLogger } from '../../../../lib/logger/index.js';

const domainLogger = rootLogger.child({ component: 'planner-products' });

export function mapDbProduct(db: any): Product {
  return {
    id: db.id,
    farmId: db.farm_id,
    categoryId: db.category_id,
    name: db.name,
    sku: db.sku,
    daysSoaking: db.days_soaking,
    daysGermination: db.days_germination,
    daysLight: db.days_light,
    avgYieldPerTray: db.avg_yield_per_tray ? Number(db.avg_yield_per_tray) : null,
    seedWeight: db.seed_weight ? Number(db.seed_weight) : null,
    seedUnit: db.seed_unit,
    unitCost: db.unit_cost ? Number(db.unit_cost) : null,
    unitPrice: db.unit_price ? Number(db.unit_price) : null,
    isActive: db.is_active,
    createdAt: db.created_at,
  };
}

export async function getProductById(
  prisma: PrismaClient,
  farmId: string,
  id: string
): Promise<Product> {
  const logger = domainLogger.child({ farmId });
  logger.debug('Getting product by ID', { productId: id });

  const product = await prisma.products.findFirst({
    where: { id, farm_id: farmId },
  });

  if (!product) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Product not found',
    });
  }

  return mapDbProduct(product);
}