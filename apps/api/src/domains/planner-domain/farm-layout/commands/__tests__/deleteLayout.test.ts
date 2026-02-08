import { describe, it, expect, beforeEach } from 'vitest';
import { deleteLayout } from '../deleteLayout.js';
import { createMockPrisma, createMockDbFarmLayout, type MockPrismaClient } from '../../../../../test/mockPrisma.js';
import type { PrismaClient } from '../../../../../generated/prisma/client.js';

describe('deleteLayout', () => {
  let mockPrisma: MockPrismaClient;
  const farmId = 'farm-uuid-1';

  beforeEach(() => {
    mockPrisma = createMockPrisma();
  });

  it('should delete a layout', async () => {
    const existing = createMockDbFarmLayout({ id: 'layout-1' });
    mockPrisma.farm_layouts.findFirst.mockResolvedValue(existing);
    mockPrisma.farm_layouts.delete.mockResolvedValue(existing);

    const result = await deleteLayout(
      mockPrisma as unknown as PrismaClient,
      farmId,
      'layout-1'
    );

    expect(result).toEqual({ id: 'layout-1' });
    expect(mockPrisma.farm_layouts.delete).toHaveBeenCalledWith({
      where: { id: 'layout-1' },
    });
  });

  it('should throw NOT_FOUND when layout does not exist', async () => {
    mockPrisma.farm_layouts.findFirst.mockResolvedValue(null);

    await expect(
      deleteLayout(mockPrisma as unknown as PrismaClient, farmId, 'nonexistent')
    ).rejects.toThrow('Layout not found');
  });

  it('should verify farm ownership before deleting', async () => {
    mockPrisma.farm_layouts.findFirst.mockResolvedValue(null);

    try {
      await deleteLayout(mockPrisma as unknown as PrismaClient, farmId, 'layout-1');
    } catch {
      // expected
    }

    expect(mockPrisma.farm_layouts.findFirst).toHaveBeenCalledWith({
      where: { id: 'layout-1', farm_id: farmId },
    });
    expect(mockPrisma.farm_layouts.delete).not.toHaveBeenCalled();
  });
});
