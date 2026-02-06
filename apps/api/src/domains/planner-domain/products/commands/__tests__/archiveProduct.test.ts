import { describe, it, expect, beforeEach } from 'vitest';
import { archiveProduct } from '../archiveProduct.js';
import { createMockPrisma, createMockDbProduct, type MockPrismaClient } from '../../../../../test/mockPrisma.js';
import type { PrismaClient } from '../../../../../generated/prisma/client.js';

describe('archiveProduct', () => {
  let mockPrisma: MockPrismaClient;
  const farmId = 'farm-uuid-1';

  beforeEach(() => {
    mockPrisma = createMockPrisma();
  });

  it('should archive a product successfully', async () => {
    const existing = createMockDbProduct({ id: 'prod-1' });
    mockPrisma.products.findFirst.mockResolvedValue(existing);
    mockPrisma.order_items.findFirst.mockResolvedValue(null);
    const archived = createMockDbProduct({ id: 'prod-1', is_active: false });
    mockPrisma.products.update.mockResolvedValue(archived);

    const result = await archiveProduct(
      mockPrisma as unknown as PrismaClient,
      farmId,
      'prod-1'
    );

    expect(result.isActive).toBe(false);
    expect(mockPrisma.products.update).toHaveBeenCalledWith({
      where: { id: 'prod-1' },
      data: { is_active: false },
    });
  });

  it('should throw NOT_FOUND for missing product', async () => {
    mockPrisma.products.findFirst.mockResolvedValue(null);

    await expect(
      archiveProduct(mockPrisma as unknown as PrismaClient, farmId, 'missing')
    ).rejects.toThrow('Product not found');
  });

  it('should reject if product has active orders', async () => {
    mockPrisma.products.findFirst.mockResolvedValue(createMockDbProduct({ id: 'prod-1' }));
    mockPrisma.order_items.findFirst.mockResolvedValue({ id: 'order-item-1' });

    await expect(
      archiveProduct(mockPrisma as unknown as PrismaClient, farmId, 'prod-1')
    ).rejects.toThrow('existing order items');
  });
});
