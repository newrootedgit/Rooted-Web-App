import { TRPCError } from '@trpc/server';
import { PrismaClient, Prisma } from '../../../../generated/prisma/client.js';
import type { Customer, CreateCustomerInput } from '../types.js';
import { mapDbCustomer } from '../queries/getCustomerById.js';
import { logger as rootLogger } from '../../../../lib/logger/index.js';

const domainLogger = rootLogger.child({ component: 'planner-customers' });

export async function createCustomer(
  prisma: PrismaClient,
  farmId: string,
  input: CreateCustomerInput
): Promise<Customer> {
  const logger = domainLogger.child({ farmId });
  logger.debug('Creating customer', { name: input.name });

  const customer = await prisma.customers.create({
    data: {
      farm_id: farmId,
      name: input.name,
      email: input.email ?? null,
      phone: input.phone ?? null,
      company_name: input.companyName ?? null,
      customer_type: input.customerType ?? null,
      payment_terms: input.paymentTerms ?? null,
      address: input.address ?? Prisma.DbNull,
      tags: input.tags ?? [],
      notes: input.notes ?? null,
    },
  });

  logger.info('Customer created', { customerId: customer.id, name: customer.name });
  return mapDbCustomer(customer);
}