import { TRPCError } from '@trpc/server';
import type { PrismaClient } from '../../../../generated/prisma/client.js';
import type { Order, CreateOrderInput } from '../types.js';
import { mapDbOrder } from '../queries/getOrderById.js';
import { logger as rootLogger } from '../../../../lib/logger/index.js';
import {
  generateOrderNumber,
  calculateDatesFromHarvest,
  calculateTraysNeeded,
  findLongestTimingFromBlend,
  type ProductTiming,
} from '../../utils/dateCalc.js';
import { generateTasksForOrderItem } from '../../tasks/commands/generateTasksForOrderItem.js';

const domainLogger = rootLogger.child({ component: 'planner-orders' });

export async function createOrder(
  prisma: PrismaClient,
  farmId: string,
  input: CreateOrderInput
): Promise<Order> {
  const logger = domainLogger.child({ farmId });
  logger.debug('Creating order', { customerId: input.customerId, itemCount: input.items.length });

  const result = await prisma.$transaction(async (tx: any) => {
    const orderNumber = await generateOrderNumber(tx, farmId);

    if (input.customerId) {
      const customer = await tx.customers.findFirst({
        where: { id: input.customerId, farm_id: farmId },
      });
      if (!customer) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Customer not found',
        });
      }
    }

    const order = await tx.orders.create({
      data: {
        farm_id: farmId,
        customer_id: input.customerId ?? null,
        order_number: orderNumber,
        status: 'Pending',
        notes: input.notes ?? null,
      },
    });

    for (const item of input.items) {
      let timing: ProductTiming;

      if (item.productId) {
        const product = await tx.products.findFirst({
          where: { id: item.productId, farm_id: farmId },
        });
        if (!product) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: `Product not found: ${item.productId}`,
          });
        }
        timing = {
          daysSoaking: product.days_soaking,
          daysGermination: product.days_germination,
          daysLight: product.days_light,
          avgYieldPerTray: product.avg_yield_per_tray ? Number(product.avg_yield_per_tray) : null,
          name: product.name,
        };
      } else {
        const blend = await tx.blends.findFirst({
          where: { id: item.blendId, farm_id: farmId },
          include: {
            blend_ingredients: {
              include: { products: true },
            },
          },
        });
        if (!blend) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: `Blend not found: ${item.blendId}`,
          });
        }
        timing = findLongestTimingFromBlend(blend.blend_ingredients);
        timing.name = blend.name;
      }

      const harvestDate = new Date(item.harvestDate);
      const dates = calculateDatesFromHarvest(harvestDate, timing);
      const overagePercent = item.overagePercent ?? 10;
      const traysNeeded = timing.avgYieldPerTray
        ? calculateTraysNeeded(item.quantityOz, overagePercent, timing.avgYieldPerTray)
        : null;

      const orderItem = await tx.order_items.create({
        data: {
          order_id: order.id,
          product_id: item.productId ?? null,
          blend_id: item.blendId ?? null,
          quantity_oz: item.quantityOz,
          harvest_date: harvestDate,
          overage_percent: overagePercent,
          trays_needed: traysNeeded,
          soak_date: dates.soakDate,
          seed_date: dates.seedDate,
          move_to_light_date: dates.moveToLightDate,
        },
      });

      await generateTasksForOrderItem(tx, {
        farmId,
        orderItemId: orderItem.id,
        orderNumber,
        productName: timing.name,
        soakDate: dates.soakDate,
        seedDate: dates.seedDate,
        moveToLightDate: dates.moveToLightDate,
        harvestDate,
      });
    }

    // Re-fetch order with all relations
    const fullOrder = await tx.orders.findFirst({
      where: { id: order.id },
      include: {
        customers: true,
        order_items: {
          include: {
            products: true,
            blends: true,
            tasks: true,
          },
        },
      },
    });

    return fullOrder;
  });

  logger.info('Order created', { orderId: result.id, orderNumber: result.order_number });
  return mapDbOrder(result);
}