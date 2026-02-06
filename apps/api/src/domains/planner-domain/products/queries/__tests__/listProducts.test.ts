import { describe, it, expect, beforeEach } from 'vitest';
import { listProducts } from '../listProducts.js';
import { createMockPrisma, createMockDbProduct, type MockPrismaClient } from '../../../../../test/mockPrisma.js';
import type { PrismaClient } from '../../../../../generated/prisma/client.js';

describe('listProducts', () => {
  let mockPrisma: MockPrismaClient;
  const farmId = 'farm-uuid-1';

  beforeEach(() => {
    mockPrisma = createMockPrisma();
  });

  it('should return empty paginated result when no products', async () => {
    mockPrisma.products.findMany.mockResolvedValue([]);

    const result = await listProducts(
      mockPrisma as unknown as PrismaClient,
      farmId,
      {}
    );

    expect(result.items).toEqual([]);
    expect(result.hasMore).toBe(false);
    expect(result.nextCursor).toBeNull();
  });

  it('should return products with pagination', async () => {
    const products = [
      createMockDbProduct({ id: 'prod-1', name: 'Sunflower' }),
      createMockDbProduct({ id: 'prod-2', name: 'Radish' }),
    ];
    mockPrisma.products.findMany.mockResolvedValue(products);

    const result = await listProducts(
      mockPrisma as unknown as PrismaClient,
      farmId,
      { limit: 10 }
    );

    expect(result.items).toHaveLength(2);
    expect(result.items[0].name).toBe('Sunflower');
    expect(result.hasMore).toBe(false);
  });

  it('should indicate hasMore when more results exist', async () => {
    const products = [
      createMockDbProduct({ id: 'prod-1' }),
      createMockDbProduct({ id: 'prod-2' }),
      createMockDbProduct({ id: 'prod-3' }),
    ];
    mockPrisma.products.findMany.mockResolvedValue(products);

    const result = await listProducts(
      mockPrisma as unknown as PrismaClient,
      farmId,
      { limit: 2 }
    );

    expect(result.items).toHaveLength(2);
    expect(result.hasMore).toBe(true);
    expect(result.nextCursor).toBe('prod-2');
  });

  it('should filter by farm_id', async () => {
    mockPrisma.products.findMany.mockResolvedValue([]);

    await listProducts(
      mockPrisma as unknown as PrismaClient,
      farmId,
      {}
    );

    expect(mockPrisma.products.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ farm_id: farmId }),
      })
    );
  });

  it('should apply category filter', async () => {
    mockPrisma.products.findMany.mockResolvedValue([]);

    await listProducts(
      mockPrisma as unknown as PrismaClient,
      farmId,
      { categoryId: 'cat-1' }
    );

    expect(mockPrisma.products.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ category_id: 'cat-1' }),
      })
    );
  });

  it('should apply search filter', async () => {
    mockPrisma.products.findMany.mockResolvedValue([]);

    await listProducts(
      mockPrisma as unknown as PrismaClient,
      farmId,
      { search: 'sun' }
    );

    expect(mockPrisma.products.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          OR: [
            { name: { contains: 'sun', mode: 'insensitive' } },
            { sku: { contains: 'sun', mode: 'insensitive' } },
          ],
        }),
      })
    );
  });
});
