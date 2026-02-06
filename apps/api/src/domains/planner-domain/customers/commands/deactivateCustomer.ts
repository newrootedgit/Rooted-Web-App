import { TRPCError } from '@trpc/server';
import type { PrismaClient } from '../../../../generated/prisma/client.js';
import type { Customer } from '../types.js';
import { mapDbCustomer } from '../queries/getCustomerById.js';
import { logger as rootLogger } from '../../../../lib/logger/index.js';

const domainLogger = rootLogger.child({ component: 'planner-customers' });

export async function deactivateCustomer(
  prisma: PrismaClient,
  farmId: string,
  id: string
): Promise<Customer> {
  const logger = domainLogger.child({ farmId });
  logger.debug('Deactivating customer', { customerId: id });

  const existing = await prisma.customers.findFirst({
    where: { id, farm_id: farmId },
  });

  if (!existing) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Customer not found',
    });
  }

  const activeOrders = await prisma.orders.findFirst({
    where: { customer_id: id },
  });

  if (activeOrders) {
    logger.warn('Cannot deactivate customer with orders', { customerId: id });
    throw new TRPCError({
      code: 'PRECONDITION_FAILED',
      message: 'Cannot deactivate customer that has existing orders',
    });
  }

  const customer = await prisma.customers.update({
    where: { id },
    data: { is_active: false },
  });

  logger.info('Customer deactivated', { customerId: id });
  return mapDbCustomer(customer);
}