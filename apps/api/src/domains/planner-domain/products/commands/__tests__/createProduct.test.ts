import { describe, it, expect, beforeEach } from 'vitest';
import { createProduct } from '../createProduct.js';
import { createMockPrisma, createMockDbProduct, type MockPrismaClient } from '../../../../../test/mockPrisma.js';
import type { PrismaClient } from '../../../../../generated/prisma/client.js';

describe('createProduct', () => {
  let mockPrisma: MockPrismaClient;
  const farmId = 'farm-uuid-1';

  beforeEach(() => {
    mockPrisma = createMockPrisma();
  });

  it('should create a product successfully', async () => {
    mockPrisma.products.findFirst.mockResolvedValue(null);
    const dbProduct = createMockDbProduct({ id: 'new-id', name: 'Radish' });
    mockPrisma.products.create.mockResolvedValue(dbProduct);

    const result = await createProduct(
      mockPrisma as unknown as PrismaClient,
      farmId,
      { name: 'Radish', daysSoaking: 1, daysGermination: 2, daysLight: 3 }
    );

    expect(result.id).toBe('new-id');
    expect(result.name).toBe('Radish');
    expect(result.farmId).toBe('farm-uuid-1');
    expect(mockPrisma.products.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        farm_id: farmId,
        name: 'Radish',
        days_soaking: 1,
        days_germination: 2,
        days_light: 3,
      }),
    });
  });

  it('should reject duplicate product name', async () => {
    mockPrisma.products.findFirst.mockResolvedValue(createMockDbProduct({ name: 'Radish' }));

    await expect(
      createProduct(
        mockPrisma as unknown as PrismaClient,
        farmId,
        { name: 'Radish', daysSoaking: 1, daysGermination: 2, daysLight: 3 }
      )
    ).rejects.toThrow('already exists');
  });

  it('should map snake_case DB fields to camelCase', async () => {
    mockPrisma.products.findFirst.mockResolvedValue(null);
    const dbProduct = createMockDbProduct({
      avg_yield_per_tray: 12.5,
      seed_weight: 30,
      unit_cost: 5.99,
      unit_price: 12.99,
    });
    mockPrisma.products.create.mockResolvedValue(dbProduct);

    const result = await createProduct(
      mockPrisma as unknown as PrismaClient,
      farmId,
      { name: 'Sunflower', daysSoaking: 1, daysGermination: 3, daysLight: 4, avgYieldPerTray: 12.5 }
    );

    expect(result.avgYieldPerTray).toBe(12.5);
    expect(result.seedWeight).toBe(30);
    expect(result.unitCost).toBe(5.99);
    expect(result.unitPrice).toBe(12.99);
    expect(result.daysSoaking).toBe(1);
    expect(result.daysGermination).toBe(3);
    expect(result.daysLight).toBe(4);
  });
});
