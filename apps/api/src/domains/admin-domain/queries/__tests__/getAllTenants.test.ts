import { describe, it, expect, beforeEach } from 'vitest';
import { getAllTenants } from '../getAllTenants.js';
import { createMockPrisma, createMockDbTenant, type MockPrismaClient } from '../../../../test/mockPrisma.js';
import type { PrismaClient } from '../../../../generated/prisma/client.js';

describe('getAllTenants', () => {
  let mockPrisma: MockPrismaClient;

  beforeEach(() => {
    mockPrisma = createMockPrisma();
  });

  it('should return all tenants with counts', async () => {
    const dbTenants = [
      {
        ...createMockDbTenant({ id: 'tenant-1', name: 'Alpha Farm', slug: 'alpha-farm' }),
        _count: { farms: 1, machines: 2 },
      },
      {
        ...createMockDbTenant({ id: 'tenant-2', name: 'Beta Farm', slug: 'beta-farm' }),
        _count: { farms: 2, machines: 5 },
      },
    ];
    mockPrisma.tenants.findMany.mockResolvedValue(dbTenants);

    const result = await getAllTenants(mockPrisma as unknown as PrismaClient);

    expect(result).toHaveLength(2);
    expect(result[0].name).toBe('Alpha Farm');
    expect(result[0]._count.machines).toBe(2);
    expect(mockPrisma.tenants.findMany).toHaveBeenCalledWith({
      select: {
        id: true,
        name: true,
        slug: true,
        contact_email: true,
        created_at: true,
        _count: {
          select: {
            farms: true,
            machines: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });
  });
});
