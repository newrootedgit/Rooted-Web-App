import { TRPCError } from '@trpc/server';
import type { PrismaClient } from '../../../../generated/prisma/client.js';
import type { CloneOrderInput, Order } from '../types.js';
import { logger as rootLogger } from '../../../../lib/logger/index.js';
import { createOrder } from './createOrder.js';

const domainLogger = rootLogger.child({ component: 'planner-orders' });

function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export async function cloneOrder(
  prisma: PrismaClient,
  farmId: string,
  input: CloneOrderInput
): Promise<Order> {
  const logger = domainLogger.child({ farmId });
  logger.debug('Cloning order', input);

  const source = await prisma.orders.findFirst({
    where: { id: input.orderId, farm_id: farmId },
    include: {
      order_items: true,
    },
  });

  if (!source) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Order not found',
    });
  }

  if (!source.order_items.length) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Cannot clone an order with no items',
    });
  }

  const cloned = await createOrder(prisma, farmId, {
    customerId: source.customer_id ?? undefined,
    notes: source.notes ?? undefined,
    items: source.order_items.map((item) => ({
      productId: item.product_id ?? undefined,
      blendId: item.blend_id ?? undefined,
      skuId: item.sku_id ?? undefined,
      quantityUnits: item.quantity_units ?? undefined,
      quantityOz: item.quantity_oz != null ? Number(item.quantity_oz) : undefined,
      harvestDate: addDays(item.harvest_date, input.dayOffset),
      overagePercent: item.overage_percent ? Number(item.overage_percent) : undefined,
    })),
  });

  logger.info('Order cloned', { sourceOrderId: source.id, clonedOrderId: cloned.id });
  return cloned;
}
