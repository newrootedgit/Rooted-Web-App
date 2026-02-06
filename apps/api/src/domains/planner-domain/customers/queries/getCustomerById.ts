import { TRPCError } from '@trpc/server';
import type { PrismaClient } from '../../../../generated/prisma/client.js';
import type { Customer } from '../types.js';
import { logger as rootLogger } from '../../../../lib/logger/index.js';

const domainLogger = rootLogger.child({ component: 'planner-customers' });

export function mapDbCustomer(db: any): Customer {
  return {
    id: db.id,
    farmId: db.farm_id,
    name: db.name,
    email: db.email,
    phone: db.phone,
    companyName: db.company_name,
    customerType: db.customer_type,
    paymentTerms: db.payment_terms,
    address: db.address,
    tags: db.tags ?? [],
    notes: db.notes,
    isActive: db.is_active,
    createdAt: db.created_at,
  };
}

export async function getCustomerById(
  prisma: PrismaClient,
  farmId: string,
  id: string
): Promise<Customer> {
  const logger = domainLogger.child({ farmId });
  logger.debug('Getting customer by ID', { customerId: id });

  const customer = await prisma.customers.findFirst({
    where: { id, farm_id: farmId },
  });

  if (!customer) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Customer not found',
    });
  }

  return mapDbCustomer(customer);
}