import type { PrismaClient } from '../../generated/prisma/client.js';
import type { Machine } from '../types.js';
import { getMachinesByTenant } from '../queries/getMachinesByTenant.js';
import {
  type PaginationInput,
  type PaginatedResponse,
  getPrismaPaginationOptions,
  createPaginatedResponse,
} from '../../lib/trpc/pagination/index.js';

export async function listMachines(
  prisma: PrismaClient,
  tenantId: string,
  farmId: string | null,
  pagination: PaginationInput
): Promise<PaginatedResponse<Machine>> {
  // If no tenant context, return empty paginated result
  if (!tenantId) {
    return { items: [], nextCursor: null, hasMore: false };
  }

  const paginationOptions = getPrismaPaginationOptions(pagination);

  const machines = await getMachinesByTenant(prisma, tenantId, farmId, {
    ...paginationOptions,
    orderBy: { created_at: 'desc' },
  });

  return createPaginatedResponse(machines, pagination);
}
