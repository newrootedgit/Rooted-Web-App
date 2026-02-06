import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createBlend } from '../createBlend.js';
import { createMockPrisma, createMockDbBlend, createMockDbProduct, type MockPrismaClient } from '../../../../../test/mockPrisma.js';
import type { PrismaClient } from '../../../../../generated/prisma/client.js';

describe('createBlend', () => {
  let mockPrisma: MockPrismaClient;
  const farmId = 'farm-uuid-1';

  beforeEach(() => {
    mockPrisma = createMockPrisma();
  });

  it('should create a blend with ingredients totaling 100%', async () => {
    mockPrisma.blends.findFirst.mockResolvedValue(null);

    const blendWithIngredients = createMockDbBlend({
      id: 'blend-1',
      name: 'Spicy Mix',
      blend_ingredients: [
        {
          id: 'ing-1',
          blend_id: 'blend-1',
          product_id: 'prod-1',
          percentage: 60,
          timing_override: null,
          products: createMockDbProduct({ id: 'prod-1', name: 'Radish' }),
        },
        {
          id: 'ing-2',
          blend_id: 'blend-1',
          product_id: 'prod-2',
          percentage: 40,
          timing_override: null,
          products: createMockDbProduct({ id: 'prod-2', name: 'Mustard' }),
        },
      ],
    });

    const txMock = {
      blends: {
        create: vi.fn().mockResolvedValue({ id: 'blend-1', name: 'Spicy Mix', farm_id: farmId }),
        findFirst: vi.fn().mockResolvedValue(blendWithIngredients),
      },
      blend_ingredients: {
        create: vi.fn().mockResolvedValue({}),
      },
    };
    mockPrisma.$transaction.mockImplementation((cb: any) => cb(txMock));

    const result = await createBlend(
      mockPrisma as unknown as PrismaClient,
      farmId,
      {
        name: 'Spicy Mix',
        ingredients: [
          { productId: 'prod-1', percentage: 60 },
          { productId: 'prod-2', percentage: 40 },
        ],
      }
    );

    expect(result.name).toBe('Spicy Mix');
    expect(result.ingredients).toHaveLength(2);
    expect(result.ingredients![0].percentage).toBe(60);
    expect(result.ingredients![1].percentage).toBe(40);
  });

  it('should reject percentages not totaling 100%', async () => {
    await expect(
      createBlend(
        mockPrisma as unknown as PrismaClient,
        farmId,
        {
          name: 'Bad Mix',
          ingredients: [
            { productId: 'prod-1', percentage: 60 },
            { productId: 'prod-2', percentage: 30 },
          ],
        }
      )
    ).rejects.toThrow('must total 100%');
  });

  it('should reject duplicate blend name', async () => {
    mockPrisma.blends.findFirst.mockResolvedValue(createMockDbBlend({ name: 'Spicy Mix' }));

    await expect(
      createBlend(
        mockPrisma as unknown as PrismaClient,
        farmId,
        {
          name: 'Spicy Mix',
          ingredients: [{ productId: 'prod-1', percentage: 100 }],
        }
      )
    ).rejects.toThrow('already exists');
  });
});
