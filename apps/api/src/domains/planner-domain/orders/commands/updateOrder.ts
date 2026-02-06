import { TRPCError } from '@trpc/server';
import type { PrismaClient } from '../../../../generated/prisma/client.js';
import type { Order, UpdateOrderInput } from '../types.js';
import { mapDbOrder } from '../queries/getOrderById.js';
import { logger as rootLogger } from '../../../../lib/logger/index.js';

const domainLogger = rootLogger.child({ component: 'planner-orders' });

export async function updateOrder(
  prisma: PrismaClient,
  farmId: string,
  input: UpdateOrderInput
): Promise<Order> {
  const logger = domainLogger.child({ farmId });
  logger.debug('Updating order', { orderId: input.id });

  const existing = await prisma.orders.findFirst({
    where: { id: input.id, farm_id: farmId },
  });

  if (!existing) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Order not found',
    });
  }

  if (existing.status !== 'Pending') {
    throw new TRPCError({
      code: 'CONFLICT',
      message: 'Can only edit orders with Pending status',
    });
  }

  if (input.customerId !== undefined && input.customerId !== null) {
    const customer = await prisma.customers.findFirst({
      where: { id: input.customerId, farm_id: farmId },
    });
    if (!customer) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Customer not found',
      });
    }
  }

  const updated = await prisma.orders.update({
    where: { id: input.id },
    data: {
      ...(input.notes !== undefined && { notes: input.notes }),
      ...(input.customerId !== undefined && { customer_id: input.customerId }),
    },
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

  logger.info('Order updated', { orderId: input.id });
  return mapDbOrder(updated);
}