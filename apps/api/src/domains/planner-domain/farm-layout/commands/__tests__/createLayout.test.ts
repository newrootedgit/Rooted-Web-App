import { describe, it, expect, beforeEach } from 'vitest';
import { createLayout } from '../createLayout.js';
import { createMockPrisma, createMockDbFarmLayout, type MockPrismaClient } from '../../../../../test/mockPrisma.js';
import type { PrismaClient } from '../../../../../generated/prisma/client.js';

describe('createLayout', () => {
  let mockPrisma: MockPrismaClient;
  const farmId = 'farm-uuid-1';

  beforeEach(() => {
    mockPrisma = createMockPrisma();
  });

  it('should create a layout successfully', async () => {
    const dbLayout = createMockDbFarmLayout({ id: 'new-id', name: 'New Layout', is_active: false });
    mockPrisma.farm_layouts.create.mockResolvedValue(dbLayout);

    const result = await createLayout(
      mockPrisma as unknown as PrismaClient,
      farmId,
      { name: 'New Layout', canvasData: { elements: [] }, isActive: false }
    );

    expect(result.id).toBe('new-id');
    expect(result.name).toBe('New Layout');
    expect(mockPrisma.farm_layouts.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        farm_id: farmId,
        name: 'New Layout',
        canvas_data: { elements: [] },
        is_active: false,
      }),
    });
  });

  it('should deactivate other layouts when creating as active', async () => {
    const dbLayout = createMockDbFarmLayout({ id: 'new-active', is_active: true });

    mockPrisma.$transaction.mockImplementation(async (cb: any) => cb(mockPrisma));
    mockPrisma.farm_layouts.updateMany.mockResolvedValue({ count: 1 });
    mockPrisma.farm_layouts.create.mockResolvedValue(dbLayout);

    const result = await createLayout(
      mockPrisma as unknown as PrismaClient,
      farmId,
      { name: 'Main Layout', canvasData: { elements: [] }, isActive: true }
    );

    expect(result.isActive).toBe(true);
    expect(mockPrisma.farm_layouts.updateMany).toHaveBeenCalledWith({
      where: { farm_id: farmId, is_active: true },
      data: { is_active: false },
    });
  });

  it('should not deactivate others when creating inactive layout', async () => {
    const dbLayout = createMockDbFarmLayout({ is_active: false });
    mockPrisma.farm_layouts.create.mockResolvedValue(dbLayout);

    await createLayout(
      mockPrisma as unknown as PrismaClient,
      farmId,
      { name: 'Inactive', canvasData: { elements: [] }, isActive: false }
    );

    expect(mockPrisma.farm_layouts.updateMany).not.toHaveBeenCalled();
  });

  it('should map the response to camelCase', async () => {
    const dbLayout = createMockDbFarmLayout({
      farm_id: 'farm-uuid-1',
      canvas_data: { elements: [{ id: 'e1' }] },
      is_active: false,
      created_at: new Date('2024-03-15'),
    });
    mockPrisma.farm_layouts.create.mockResolvedValue(dbLayout);

    const result = await createLayout(
      mockPrisma as unknown as PrismaClient,
      farmId,
      { name: 'Main Layout', canvasData: { elements: [] }, isActive: false }
    );

    expect(result.farmId).toBe('farm-uuid-1');
    expect(result.canvasData).toEqual({ elements: [{ id: 'e1' }] });
    expect(result.isActive).toBe(false);
    expect(result.createdAt).toEqual(new Date('2024-03-15'));
  });
});
