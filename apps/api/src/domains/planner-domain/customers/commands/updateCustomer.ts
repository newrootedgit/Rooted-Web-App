import { TRPCError } from '@trpc/server';
import { PrismaClient, Prisma } from '../../../../generated/prisma/client.js';
import type { Customer, UpdateCustomerInput } from '../types.js';
import { mapDbCustomer } from '../queries/getCustomerById.js';
import { logger as rootLogger } from '../../../../lib/logger/index.js';

const domainLogger = rootLogger.child({ component: 'planner-customers' });

export async function updateCustomer(
  prisma: PrismaClient,
  farmId: string,
  input: UpdateCustomerInput
): Promise<Customer> {
  const logger = domainLogger.child({ farmId });
  logger.debug('Updating customer', { customerId: input.id });

  const existing = await prisma.customers.findFirst({
    where: { id: input.id, farm_id: farmId },
  });

  if (!existing) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Customer not found',
    });
  }

  const customer = await prisma.customers.update({
    where: { id: input.id },
    data: {
      ...(input.name !== undefined && { name: input.name }),
      ...(input.email !== undefined && { email: input.email }),
      ...(input.phone !== undefined && { phone: input.phone }),
      ...(input.companyName !== undefined && { company_name: input.companyName }),
      ...(input.customerType !== undefined && { customer_type: input.customerType }),
      ...(input.paymentTerms !== undefined && { payment_terms: input.paymentTerms }),
      ...(input.address !== undefined && { address: input.address === null ? Prisma.DbNull : input.address }),
      ...(input.tags !== undefined && { tags: input.tags }),
      ...(input.notes !== undefined && { notes: input.notes }),
    },
  });

  logger.info('Customer updated', { customerId: customer.id });
  return mapDbCustomer(customer);
}