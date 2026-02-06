import { describe, it, expect, beforeEach } from 'vitest';
import { getProductById } from '../getProductById.js';
import { createMockPrisma, createMockDbProduct, type MockPrismaClient } from '../../../../../test/mockPrisma.js';
import type { PrismaClient } from '../../../../../generated/prisma/client.js';

describe('getProductById', () => {
  let mockPrisma: MockPrismaClient;
  const farmId = 'farm-uuid-1';

  beforeEach(() => {
    mockPrisma = createMockPrisma();
  });

  it('should return product when found', async () => {
    const dbProduct = createMockDbProduct({ id: 'prod-1', name: 'Sunflower' });
    mockPrisma.products.findFirst.mockResolvedValue(dbProduct);

    const result = await getProductById(
      mockPrisma as unknown as PrismaClient,
      farmId,
      'prod-1'
    );

    expect(result.id).toBe('prod-1');
    expect(result.name).toBe('Sunflower');
    expect(result.farmId).toBe('farm-uuid-1');
    expect(mockPrisma.products.findFirst).toHaveBeenCalledWith({
      where: { id: 'prod-1', farm_id: farmId },
    });
  });

  it('should throw NOT_FOUND when product does not exist', async () => {
    mockPrisma.products.findFirst.mockResolvedValue(null);

    await expect(
      getProductById(mockPrisma as unknown as PrismaClient, farmId, 'missing-id')
    ).rejects.toThrow('Product not found');
  });

  it('should correctly map Decimal fields to numbers', async () => {
    const dbProduct = createMockDbProduct({
      avg_yield_per_tray: 12.5,
      seed_weight: 30,
      unit_cost: 5.99,
      unit_price: 12.99,
    });
    mockPrisma.products.findFirst.mockResolvedValue(dbProduct);

    const result = await getProductById(
      mockPrisma as unknown as PrismaClient,
      farmId,
      'product-uuid-1'
    );

    expect(typeof result.avgYieldPerTray).toBe('number');
    expect(typeof result.seedWeight).toBe('number');
    expect(typeof result.unitCost).toBe('number');
    expect(typeof result.unitPrice).toBe('number');
  });
});
