import type { PrismaClient, Prisma } from '../../../../generated/prisma/client.js';
import type { Customer, ListCustomersInput } from '../types.js';
import {
  type PaginatedResponse,
  getPrismaPaginationOptions,
  createPaginatedResponse,
} from '../../../../lib/trpc/pagination/index.js';
import { logger as rootLogger } from '../../../../lib/logger/index.js';
import { mapDbCustomer } from './getCustomerById.js';

const domainLogger = rootLogger.child({ component: 'planner-customers' });

export async function listCustomers(
  prisma: PrismaClient,
  farmId: string,
  input: ListCustomersInput
): Promise<PaginatedResponse<Customer>> {
  const logger = domainLogger.child({ farmId });
  logger.debug('Listing customers', { customerType: input.customerType, search: input.search });

  const where: Prisma.customersWhereInput = {
    farm_id: farmId,
  };

  if (input.customerType) {
    where.customer_type = input.customerType;
  }

  if (input.isActive !== undefined) {
    where.is_active = input.isActive;
  }

  if (input.tag) {
    where.tags = { has: input.tag };
  }

  if (input.search) {
    where.OR = [
      { name: { contains: input.search, mode: 'insensitive' } },
      { email: { contains: input.search, mode: 'insensitive' } },
      { company_name: { contains: input.search, mode: 'insensitive' } },
    ];
  }

  const paginationOptions = getPrismaPaginationOptions(input);

  const customers = await prisma.customers.findMany({
    where,
    ...paginationOptions,
    orderBy: { name: 'asc' },
  });

  const mapped = customers.map(mapDbCustomer);
  return createPaginatedResponse(mapped, input);
}