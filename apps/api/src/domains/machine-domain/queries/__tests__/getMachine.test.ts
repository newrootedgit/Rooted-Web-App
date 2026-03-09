import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createMockPrisma, createMockDbMachine, type MockPrismaClient } from '../../../../test/mockPrisma.js';
import { mockTimescale } from '../../../../test/mockTimescale.js';
import type { PrismaClient } from '../../../../generated/prisma/client.js';

vi.mock('../../../../lib/db/timescale.js', () => ({
  timescale: mockTimescale,
}));

const { getMachine } = await import('../getMachine.js');

describe('getMachine', () => {
  let mockPrisma: MockPrismaClient;

  beforeEach(() => {
    vi.clearAllMocks();
    mockPrisma = createMockPrisma();
    mockTimescale.query.mockResolvedValue({ rows: [] });
  });

  it('should return machine with camelCase fields', async () => {
    const machine = createMockDbMachine({ id: 'machine-1', tenant_id: 'tenant-1', farm_id: 'farm-1' });
    mockPrisma.machines.findFirst.mockResolvedValue(machine);

    const result = await getMachine(mockPrisma as unknown as PrismaClient, 'machine-1', 'tenant-1', 'farm-1');

    expect(result.id).toBe('machine-1');
    expect(result.tenantId).toBe('tenant-1');
    expect(result.farmId).toBe('farm-1');
  });

  it('should throw NOT_FOUND when machine does not exist', async () => {
    mockPrisma.machines.findFirst.mockResolvedValue(null);

    await expect(
      getMachine(mockPrisma as unknown as PrismaClient, 'nonexistent', 'tenant-1', 'farm-1')
    ).rejects.toThrow('Machine not found');
  });
});
