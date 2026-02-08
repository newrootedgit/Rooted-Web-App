import { describe, it, expect, beforeEach } from 'vitest';
import { listLayouts } from '../listLayouts.js';
import { createMockPrisma, createMockDbFarmLayout, type MockPrismaClient } from '../../../../../test/mockPrisma.js';
import type { PrismaClient } from '../../../../../generated/prisma/client.js';

describe('listLayouts', () => {
  let mockPrisma: MockPrismaClient;
  const farmId = 'farm-uuid-1';

  beforeEach(() => {
    mockPrisma = createMockPrisma();
  });

  it('should return paginated layouts for a farm', async () => {
    const layouts = [
      createMockDbFarmLayout({ id: 'layout-1', name: 'Layout A' }),
      createMockDbFarmLayout({ id: 'layout-2', name: 'Layout B' }),
    ];
    mockPrisma.farm_layouts.findMany.mockResolvedValue(layouts);

    const result = await listLayouts(
      mockPrisma as unknown as PrismaClient,
      farmId,
      { limit: 20 }
    );

    expect(result.items).toHaveLength(2);
    expect(result.items[0].name).toBe('Layout A');
    expect(result.items[1].name).toBe('Layout B');
    expect(mockPrisma.farm_layouts.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { farm_id: farmId },
        orderBy: { created_at: 'desc' },
      })
    );
  });

  it('should return empty list when no layouts exist', async () => {
    mockPrisma.farm_layouts.findMany.mockResolvedValue([]);

    const result = await listLayouts(
      mockPrisma as unknown as PrismaClient,
      farmId,
      { limit: 20 }
    );

    expect(result.items).toHaveLength(0);
  });

  it('should map snake_case fields to camelCase', async () => {
    const layout = createMockDbFarmLayout({
      farm_id: 'farm-uuid-1',
      canvas_data: { elements: [{ id: 'e1' }] },
      is_active: true,
      created_at: new Date('2024-06-01'),
    });
    mockPrisma.farm_layouts.findMany.mockResolvedValue([layout]);

    const result = await listLayouts(
      mockPrisma as unknown as PrismaClient,
      farmId,
      { limit: 20 }
    );

    expect(result.items[0].farmId).toBe('farm-uuid-1');
    expect(result.items[0].canvasData).toEqual({ elements: [{ id: 'e1' }] });
    expect(result.items[0].isActive).toBe(true);
    expect(result.items[0].createdAt).toEqual(new Date('2024-06-01'));
  });
});
