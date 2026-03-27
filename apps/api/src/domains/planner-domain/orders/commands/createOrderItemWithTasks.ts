import { TRPCError } from '@trpc/server';
import {
  calculateBlendProductionSchedule,
  calculateDatesFromHarvest,
  calculateTraysNeeded,
  findLongestTimingFromBlend,
  type ProductTiming,
} from '../../utils/dateCalc.js';
import { generateTasksForOrderItem } from '../../tasks/commands/generateTasksForOrderItem.js';

interface CreateOrderItemSpec {
  productId?: string | null;
  blendId?: string | null;
  skuId?: string | null;
  quantityUnits?: number | null;
  quantityOz?: number | null;
  harvestDate: Date;
  overagePercent?: number | null;
}

interface CreateOrderItemWithTasksInput {
  farmId: string;
  orderId: string;
  orderNumber: string;
  spec: CreateOrderItemSpec;
}

function normalizeDate(date: Date): Date {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
}

function ensureSelection(spec: CreateOrderItemSpec) {
  const isProduct = !!spec.productId && !spec.blendId;
  const isBlend = !!spec.blendId && !spec.productId;
  if (!isProduct && !isBlend) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Exactly one of productId or blendId must be provided',
    });
  }
}

function toNumber(value: unknown): number | null {
  if (value == null) return null;
  const numeric = Number(value);
  return Number.isNaN(numeric) ? null : numeric;
}

async function resolveQuantityOz(tx: any, farmId: string, spec: CreateOrderItemSpec) {
  if (spec.skuId) {
    const sku = await tx.skus.findFirst({
      where: { id: spec.skuId, farm_id: farmId },
      include: { products: true, blends: true, package_types: true },
    });

    if (!sku) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'SKU not found',
      });
    }

    if (spec.productId && sku.product_id !== spec.productId) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'SKU does not belong to the selected product',
      });
    }

    if (spec.blendId && sku.blend_id !== spec.blendId) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'SKU does not belong to the selected blend',
      });
    }

    const quantityUnits = spec.quantityUnits ?? 0;
    if (quantityUnits <= 0) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Quantity units must be greater than zero',
      });
    }

    return {
      sku,
      quantityUnits,
      quantityOz: Number(sku.weight_oz) * quantityUnits,
    };
  }

  if (!spec.quantityOz || spec.quantityOz <= 0) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Quantity ounces must be provided when no SKU is selected',
    });
  }

  return {
    sku: null,
    quantityUnits: spec.quantityUnits ?? null,
    quantityOz: spec.quantityOz,
  };
}

export async function createOrderItemWithTasks(
  tx: any,
  input: CreateOrderItemWithTasksInput
) {
  ensureSelection(input.spec);

  const overagePercent = input.spec.overagePercent ?? 10;
  const harvestDate = normalizeDate(input.spec.harvestDate);
  const quantity = await resolveQuantityOz(tx, input.farmId, input.spec);

  let timing: ProductTiming;

  if (input.spec.productId) {
    const product = await tx.products.findFirst({
      where: { id: input.spec.productId, farm_id: input.farmId },
    });

    if (!product) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `Product not found: ${input.spec.productId}`,
      });
    }

    timing = {
      daysSoaking: product.days_soaking,
      daysGermination: product.days_germination,
      daysLight: product.days_light,
      avgYieldPerTray: toNumber(product.avg_yield_per_tray),
      name: product.name,
    };

    const dates = calculateDatesFromHarvest(harvestDate, timing);
    const traysNeeded = timing.avgYieldPerTray
      ? calculateTraysNeeded(quantity.quantityOz, overagePercent, timing.avgYieldPerTray)
      : null;

    const orderItem = await tx.order_items.create({
      data: {
        order_id: input.orderId,
        product_id: input.spec.productId,
        blend_id: null,
        sku_id: quantity.sku?.id ?? null,
        quantity_units: quantity.quantityUnits,
        quantity_oz: quantity.quantityOz,
        harvest_date: harvestDate,
        overage_percent: overagePercent,
        trays_needed: traysNeeded,
        soak_date: dates.soakDate,
        seed_date: dates.seedDate,
        move_to_light_date: dates.moveToLightDate,
      },
    });

    await generateTasksForOrderItem(tx, {
      farmId: input.farmId,
      orderItemId: orderItem.id,
      orderNumber: input.orderNumber,
      productName: timing.name,
      soakDate: dates.soakDate,
      seedDate: dates.seedDate,
      moveToLightDate: dates.moveToLightDate,
      harvestDate,
    });

    return orderItem;
  }

  const blend = await tx.blends.findFirst({
    where: { id: input.spec.blendId, farm_id: input.farmId },
    include: {
      blend_ingredients: {
        include: { products: true },
      },
    },
  });

  if (!blend) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: `Blend not found: ${input.spec.blendId}`,
    });
  }

  timing = findLongestTimingFromBlend(blend.blend_ingredients);
  timing.name = blend.name;

  const aggregateDates = calculateDatesFromHarvest(harvestDate, timing);
  const aggregateTrays = timing.avgYieldPerTray
    ? calculateTraysNeeded(quantity.quantityOz, overagePercent, timing.avgYieldPerTray)
    : null;

  const orderItem = await tx.order_items.create({
    data: {
      order_id: input.orderId,
      product_id: null,
      blend_id: input.spec.blendId,
      sku_id: quantity.sku?.id ?? null,
      quantity_units: quantity.quantityUnits,
      quantity_oz: quantity.quantityOz,
      harvest_date: harvestDate,
      overage_percent: overagePercent,
      trays_needed: aggregateTrays,
      soak_date: aggregateDates.soakDate,
      seed_date: aggregateDates.seedDate,
      move_to_light_date: aggregateDates.moveToLightDate,
    },
  });

  const schedule = calculateBlendProductionSchedule({
    quantityOz: quantity.quantityOz,
    overagePercent,
    harvestDate,
    ingredients: blend.blend_ingredients.map((ingredient: any) => ({
      id: ingredient.id,
      productId: ingredient.product_id,
      productName: ingredient.products.name,
      ratioPercent: Number(ingredient.percentage),
      avgYieldPerTray: Number(ingredient.products.avg_yield_per_tray ?? 0),
      daysSoaking: ingredient.products.days_soaking,
      daysGermination: ingredient.products.days_germination,
      daysLight: ingredient.products.days_light,
    })),
  });

  for (const ingredient of schedule.ingredients) {
    await generateTasksForOrderItem(tx, {
      farmId: input.farmId,
      orderItemId: orderItem.id,
      orderNumber: input.orderNumber,
      productName: `${ingredient.productName} (${blend.name})`,
      blendIngredientId: ingredient.blendIngredientId ?? null,
      soakDate: ingredient.soakDate,
      seedDate: ingredient.seedDate,
      moveToLightDate: ingredient.moveToLightDate,
      harvestDate: ingredient.harvestDate,
    });
  }

  return orderItem;
}
