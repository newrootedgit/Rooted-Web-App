import type { PrismaClient, Prisma } from '../../../../generated/prisma/client.js';
import type { Order, ListOrdersInput } from '../types.js';
import {
  type PaginatedResponse,
  getPrismaPaginationOptions,
  createPaginatedResponse,
} from '../../../../lib/trpc/pagination/index.js';
import { logger as rootLogger } from '../../../../lib/logger/index.js';
import { mapDbOrder } from './getOrderById.js';

const domainLogger = rootLogger.child({ component: 'planner-orders' });

export async function listOrders(
  prisma: PrismaClient,
  farmId: string,
  input: ListOrdersInput
): Promise<PaginatedResponse<Order>> {
  const logger = domainLogger.child({ farmId });
  logger.debug('Listing orders', { status: input.status, customerId: input.customerId });

  const where: Prisma.ordersWhereInput = {
    farm_id: farmId,
  };

  if (input.status) {
    where.status = input.status;
  }

  if (input.customerId) {
    where.customer_id = input.customerId;
  }

  if (input.search) {
    where.OR = [
      { order_number: { contains: input.search, mode: 'insensitive' } },
      { customers: { name: { contains: input.search, mode: 'insensitive' } } },
    ];
  }

  const paginationOptions = getPrismaPaginationOptions(input);

  const orders = await prisma.orders.findMany({
    where,
    ...paginationOptions,
    orderBy: { created_at: 'desc' },
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
        },
      },
    },
  });

  const mapped = orders.map(mapDbOrder);
  return createPaginatedResponse(mapped, input);
}
