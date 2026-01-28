import { describe, it, expect, beforeEach } from 'vitest';
import { getTenantMachines } from '../getTenantMachines.js';
import { createMockPrisma, createMockDbMachine, type MockPrismaClient } from '../../../../test/mockPrisma.js';
import type { PrismaClient } from '../../../../generated/prisma/client.js';

describe('getTenantMachines', () => {
  let mockPrisma: MockPrismaClient;

  beforeEach(() => {
    mockPrisma = createMockPrisma();
  });

  it('should return machines for a specific tenant', async () => {
    const tenantId = 'tenant-123';
    const dbMachines = [
      {
        ...createMockDbMachine({ id: 'm1', name: 'Machine 1', tenant_id: tenantId }),
        farms: { id: 'f1', name: 'Farm 1', slug: 'farm-1' },
      },
    ];
    mockPrisma.machines.findMany.mockResolvedValue(dbMachines);

    const result = await getTenantMachines(mockPrisma as unknown as PrismaClient, tenantId);

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Machine 1');
    expect(result[0].farms.name).toBe('Farm 1');
    expect(mockPrisma.machines.findMany).toHaveBeenCalledWith({
      where: { tenant_id: tenantId },
      include: {
        farms: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });
  });
});
