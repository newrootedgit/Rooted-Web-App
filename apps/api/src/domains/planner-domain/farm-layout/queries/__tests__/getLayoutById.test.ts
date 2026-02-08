import { describe, it, expect, beforeEach } from 'vitest';
import { getLayoutById } from '../getLayoutById.js';
import { createMockPrisma, createMockDbFarmLayout, type MockPrismaClient } from '../../../../../test/mockPrisma.js';
import type { PrismaClient } from '../../../../../generated/prisma/client.js';

describe('getLayoutById', () => {
  let mockPrisma: MockPrismaClient;
  const farmId = 'farm-uuid-1';

  beforeEach(() => {
    mockPrisma = createMockPrisma();
  });

  it('should return a layout by id', async () => {
    const dbLayout = createMockDbFarmLayout({ id: 'layout-1', name: 'My Layout' });
    mockPrisma.farm_layouts.findFirst.mockResolvedValue(dbLayout);

    const result = await getLayoutById(
      mockPrisma as unknown as PrismaClient,
      farmId,
      'layout-1'
    );

    expect(result.id).toBe('layout-1');
    expect(result.name).toBe('My Layout');
    expect(result.farmId).toBe('farm-uuid-1');
    expect(mockPrisma.farm_layouts.findFirst).toHaveBeenCalledWith({
      where: { id: 'layout-1', farm_id: farmId },
    });
  });

  it('should throw NOT_FOUND when layout does not exist', async () => {
    mockPrisma.farm_layouts.findFirst.mockResolvedValue(null);

    await expect(
      getLayoutById(mockPrisma as unknown as PrismaClient, farmId, 'nonexistent')
    ).rejects.toThrow('Layout not found');
  });

  it('should map canvas_data to canvasData', async () => {
    const elements = [{ id: 'e1', type: 'rack' }];
    const dbLayout = createMockDbFarmLayout({ canvas_data: { elements } });
    mockPrisma.farm_layouts.findFirst.mockResolvedValue(dbLayout);

    const result = await getLayoutById(
      mockPrisma as unknown as PrismaClient,
      farmId,
      'layout-uuid-1'
    );

    expect(result.canvasData).toEqual({ elements });
  });

  it('should default canvasData to empty elements when null', async () => {
    const dbLayout = createMockDbFarmLayout({ canvas_data: null });
    mockPrisma.farm_layouts.findFirst.mockResolvedValue(dbLayout);

    const result = await getLayoutById(
      mockPrisma as unknown as PrismaClient,
      farmId,
      'layout-uuid-1'
    );

    expect(result.canvasData).toEqual({ elements: [] });
  });
});
