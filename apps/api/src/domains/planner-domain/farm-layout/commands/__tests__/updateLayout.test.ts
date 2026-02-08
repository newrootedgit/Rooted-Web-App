import { describe, it, expect, beforeEach } from 'vitest';
import { updateLayout } from '../updateLayout.js';
import { createMockPrisma, createMockDbFarmLayout, type MockPrismaClient } from '../../../../../test/mockPrisma.js';
import type { PrismaClient } from '../../../../../generated/prisma/client.js';

describe('updateLayout', () => {
  let mockPrisma: MockPrismaClient;
  const farmId = 'farm-uuid-1';

  beforeEach(() => {
    mockPrisma = createMockPrisma();
  });

  it('should update layout name', async () => {
    const existing = createMockDbFarmLayout({ id: 'layout-1' });
    const updated = createMockDbFarmLayout({ id: 'layout-1', name: 'Renamed' });
    mockPrisma.farm_layouts.findFirst.mockResolvedValue(existing);
    mockPrisma.farm_layouts.update.mockResolvedValue(updated);

    const result = await updateLayout(
      mockPrisma as unknown as PrismaClient,
      farmId,
      { id: 'layout-1', name: 'Renamed' }
    );

    expect(result.name).toBe('Renamed');
    expect(mockPrisma.farm_layouts.update).toHaveBeenCalledWith({
      where: { id: 'layout-1' },
      data: { name: 'Renamed' },
    });
  });

  it('should update canvas data', async () => {
    const existing = createMockDbFarmLayout({ id: 'layout-1' });
    const newCanvas = { elements: [{ id: 'rack-1' }] };
    const updated = createMockDbFarmLayout({ id: 'layout-1', canvas_data: newCanvas });
    mockPrisma.farm_layouts.findFirst.mockResolvedValue(existing);
    mockPrisma.farm_layouts.update.mockResolvedValue(updated);

    const result = await updateLayout(
      mockPrisma as unknown as PrismaClient,
      farmId,
      { id: 'layout-1', canvasData: newCanvas as any }
    );

    expect(result.canvasData).toEqual(newCanvas);
  });

  it('should throw NOT_FOUND when layout does not exist', async () => {
    mockPrisma.farm_layouts.findFirst.mockResolvedValue(null);

    await expect(
      updateLayout(
        mockPrisma as unknown as PrismaClient,
        farmId,
        { id: 'nonexistent', name: 'Test' }
      )
    ).rejects.toThrow('Layout not found');
  });

  it('should deactivate others when setting layout as active', async () => {
    const existing = createMockDbFarmLayout({ id: 'layout-1', is_active: false });
    const updated = createMockDbFarmLayout({ id: 'layout-1', is_active: true });

    mockPrisma.farm_layouts.findFirst.mockResolvedValue(existing);
    mockPrisma.$transaction.mockImplementation(async (cb: any) => cb(mockPrisma));
    mockPrisma.farm_layouts.updateMany.mockResolvedValue({ count: 1 });
    mockPrisma.farm_layouts.update.mockResolvedValue(updated);

    const result = await updateLayout(
      mockPrisma as unknown as PrismaClient,
      farmId,
      { id: 'layout-1', isActive: true }
    );

    expect(result.isActive).toBe(true);
    expect(mockPrisma.farm_layouts.updateMany).toHaveBeenCalledWith({
      where: { farm_id: farmId, is_active: true },
      data: { is_active: false },
    });
  });

  it('should not use transaction when not setting active', async () => {
    const existing = createMockDbFarmLayout({ id: 'layout-1' });
    const updated = createMockDbFarmLayout({ id: 'layout-1', name: 'Updated' });
    mockPrisma.farm_layouts.findFirst.mockResolvedValue(existing);
    mockPrisma.farm_layouts.update.mockResolvedValue(updated);

    await updateLayout(
      mockPrisma as unknown as PrismaClient,
      farmId,
      { id: 'layout-1', name: 'Updated' }
    );

    expect(mockPrisma.$transaction).not.toHaveBeenCalled();
  });
});
