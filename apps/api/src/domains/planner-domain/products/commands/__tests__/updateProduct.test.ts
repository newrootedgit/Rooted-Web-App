import { describe, it, expect, beforeEach } from 'vitest';
import { updateProduct } from '../updateProduct.js';
import { createMockPrisma, createMockDbProduct, type MockPrismaClient } from '../../../../../test/mockPrisma.js';
import type { PrismaClient } from '../../../../../generated/prisma/client.js';

describe('updateProduct', () => {
  let mockPrisma: MockPrismaClient;
  const farmId = 'farm-uuid-1';

  beforeEach(() => {
    mockPrisma = createMockPrisma();
  });

  it('should update a product successfully', async () => {
    const existing = createMockDbProduct({ id: 'prod-1', name: 'Sunflower' });
    mockPrisma.products.findFirst
      .mockResolvedValueOnce(existing)
      .mockResolvedValueOnce(null);

    const updated = createMockDbProduct({ id: 'prod-1', name: 'Radish' });
    mockPrisma.products.update.mockResolvedValue(updated);

    const result = await updateProduct(
      mockPrisma as unknown as PrismaClient,
      farmId,
      { id: 'prod-1', name: 'Radish' }
    );

    expect(result.name).toBe('Radish');
    expect(mockPrisma.products.update).toHaveBeenCalledWith({
      where: { id: 'prod-1' },
      data: expect.objectContaining({ name: 'Radish' }),
    });
  });

  it('should throw NOT_FOUND for missing product', async () => {
    mockPrisma.products.findFirst.mockResolvedValue(null);

    await expect(
      updateProduct(
        mockPrisma as unknown as PrismaClient,
        farmId,
        { id: 'missing-id', name: 'Nope' }
      )
    ).rejects.toThrow('Product not found');
  });

  it('should reject duplicate name on rename', async () => {
    const existing = createMockDbProduct({ id: 'prod-1', name: 'Sunflower' });
    mockPrisma.products.findFirst
      .mockResolvedValueOnce(existing)
      .mockResolvedValueOnce(createMockDbProduct({ id: 'prod-2', name: 'Radish' }));

    await expect(
      updateProduct(
        mockPrisma as unknown as PrismaClient,
        farmId,
        { id: 'prod-1', name: 'Radish' }
      )
    ).rejects.toThrow('already exists');
  });
});
