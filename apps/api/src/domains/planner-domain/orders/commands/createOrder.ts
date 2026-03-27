import { TRPCError } from '@trpc/server';
import type { PrismaClient } from '../../../../generated/prisma/client.js';
import type { Order, CreateOrderInput } from '../types.js';
import { mapDbOrder } from '../queries/getOrderById.js';
import { logger as rootLogger } from '../../../../lib/logger/index.js';
import { generateOrderNumber } from '../../utils/dateCalc.js';
import { createOrderItemWithTasks } from './createOrderItemWithTasks.js';

const domainLogger = rootLogger.child({ component: 'planner-orders' });

export async function createOrder(
  prisma: PrismaClient,
  farmId: string,
  input: CreateOrderInput & { recurringScheduleId?: string | null; recurringGenerationDate?: Date | null }
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
        recurring_schedule_id: input.recurringScheduleId ?? null,
        recurring_generation_date: input.recurringGenerationDate ?? null,
        order_number: orderNumber,
        status: 'Pending',
        notes: input.notes ?? null,
      },
    });

    for (const item of input.items) {
      await createOrderItemWithTasks(tx, {
        farmId,
        orderId: order.id,
        orderNumber,
        spec: {
          productId: item.productId ?? null,
          blendId: item.blendId ?? null,
          skuId: item.skuId,
          quantityUnits: item.quantityUnits,
          quantityOz: item.quantityOz,
          harvestDate: new Date(item.harvestDate),
          overagePercent: item.overagePercent,
        },
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
            skus: {
              include: {
                package_types: true,
              },
            },
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
