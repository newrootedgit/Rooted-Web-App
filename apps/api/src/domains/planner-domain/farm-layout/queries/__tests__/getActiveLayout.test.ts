import { describe, it, expect, beforeEach } from 'vitest';
import { getActiveLayout } from '../getActiveLayout.js';
import { createMockPrisma, createMockDbFarmLayout, type MockPrismaClient } from '../../../../../test/mockPrisma.js';
import type { PrismaClient } from '../../../../../generated/prisma/client.js';

describe('getActiveLayout', () => {
  let mockPrisma: MockPrismaClient;
  const farmId = 'farm-uuid-1';

  beforeEach(() => {
    mockPrisma = createMockPrisma();
  });

  it('should return the active layout', async () => {
    const dbLayout = createMockDbFarmLayout({ is_active: true, name: 'Active Layout' });
    mockPrisma.farm_layouts.findFirst.mockResolvedValue(dbLayout);

    const result = await getActiveLayout(
      mockPrisma as unknown as PrismaClient,
      farmId
    );

    expect(result).not.toBeNull();
    expect(result!.name).toBe('Active Layout');
    expect(result!.isActive).toBe(true);
    expect(mockPrisma.farm_layouts.findFirst).toHaveBeenCalledWith({
      where: { farm_id: farmId, is_active: true },
    });
  });

  it('should return null when no active layout exists', async () => {
    mockPrisma.farm_layouts.findFirst.mockResolvedValue(null);

    const result = await getActiveLayout(
      mockPrisma as unknown as PrismaClient,
      farmId
    );

    expect(result).toBeNull();
  });
});
