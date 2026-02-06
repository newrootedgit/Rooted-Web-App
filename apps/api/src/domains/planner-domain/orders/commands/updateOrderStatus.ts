import { TRPCError } from '@trpc/server';
import type { PrismaClient } from '../../../../generated/prisma/client.js';
import type { Order, UpdateOrderStatusInput } from '../types.js';
import { mapDbOrder } from '../queries/getOrderById.js';
import { logger as rootLogger } from '../../../../lib/logger/index.js';

const domainLogger = rootLogger.child({ component: 'planner-orders' });

const VALID_TRANSITIONS: Record<string, string[]> = {
  'Pending': ['In Progress', 'Cancelled'],
  'In Progress': ['Ready', 'Cancelled'],
  'Ready': ['Delivered', 'Cancelled'],
  'Delivered': [],
  'Cancelled': [],
};

export async function updateOrderStatus(
  prisma: PrismaClient,
  farmId: string,
  input: UpdateOrderStatusInput
): Promise<Order> {
  const logger = domainLogger.child({ farmId });
  logger.debug('Updating order status', { orderId: input.id, newStatus: input.status });

  const existing = await prisma.orders.findFirst({
    where: { id: input.id, farm_id: farmId },
  });

  if (!existing) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Order not found',
    });
  }

  const allowed = VALID_TRANSITIONS[existing.status] ?? [];
  if (!allowed.includes(input.status)) {
    throw new TRPCError({
      code: 'CONFLICT',
      message: `Cannot transition from "${existing.status}" to "${input.status}"`,
    });
  }

  const updated = await prisma.orders.update({
    where: { id: input.id },
    data: { status: input.status },
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

  logger.info('Order status updated', { orderId: input.id, from: existing.status, to: input.status });
  return mapDbOrder(updated);
}