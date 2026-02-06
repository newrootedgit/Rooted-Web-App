import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  subDays,
  calculateTraysNeeded,
  generateOrderNumber,
  calculateDatesFromHarvest,
  findLongestTimingFromBlend,
} from '../dateCalc.js';

describe('subDays', () => {
  it('should subtract days from a date', () => {
    const date = new Date('2024-02-10');
    const result = subDays(date, 3);
    expect(result.toISOString().slice(0, 10)).toBe('2024-02-07');
  });

  it('should handle month boundaries', () => {
    const date = new Date('2024-03-02');
    const result = subDays(date, 5);
    expect(result.toISOString().slice(0, 10)).toBe('2024-02-26');
  });

  it('should not mutate the original date', () => {
    const date = new Date('2024-02-10');
    subDays(date, 3);
    expect(date.toISOString().slice(0, 10)).toBe('2024-02-10');
  });
});

describe('calculateTraysNeeded', () => {
  it('should calculate trays with overage', () => {
    // 16oz * 1.10 = 17.6oz / 10oz per tray = 1.76, ceil = 2
    expect(calculateTraysNeeded(16, 10, 10)).toBe(2);
  });

  it('should round up to whole trays', () => {
    // 10oz * 1.10 = 11oz / 10oz per tray = 1.1, ceil = 2
    expect(calculateTraysNeeded(10, 10, 10)).toBe(2);
  });

  it('should return 0 for zero yield per tray', () => {
    expect(calculateTraysNeeded(16, 10, 0)).toBe(0);
  });

  it('should handle zero overage', () => {
    // 20oz * 1.0 = 20oz / 10oz per tray = 2
    expect(calculateTraysNeeded(20, 0, 10)).toBe(2);
  });
});

describe('generateOrderNumber', () => {
  it('should generate ORD-000001 for first order', async () => {
    const mockPrisma = {
      orders: { findFirst: vi.fn().mockResolvedValue(null) },
    };
    const result = await generateOrderNumber(mockPrisma as any, 'farm-1');
    expect(result).toBe('ORD-000001');
  });

  it('should increment from last order number', async () => {
    const mockPrisma = {
      orders: { findFirst: vi.fn().mockResolvedValue({ order_number: 'ORD-000005' }) },
    };
    const result = await generateOrderNumber(mockPrisma as any, 'farm-1');
    expect(result).toBe('ORD-000006');
  });
});

describe('calculateDatesFromHarvest', () => {
  it('should calculate all dates working backward from harvest', () => {
    const harvestDate = new Date('2024-02-10');
    const timing = {
      daysSoaking: 1,
      daysGermination: 3,
      daysLight: 4,
      avgYieldPerTray: 10,
      name: 'Sunflower',
    };

    const result = calculateDatesFromHarvest(harvestDate, timing);

    // harvest = Feb 10
    // move_to_light = Feb 10 - 4 = Feb 6
    // seed = Feb 6 - 3 = Feb 3
    // soak = Feb 3 - 1 = Feb 2
    expect(result.moveToLightDate.toISOString().slice(0, 10)).toBe('2024-02-06');
    expect(result.seedDate.toISOString().slice(0, 10)).toBe('2024-02-03');
    expect(result.soakDate.toISOString().slice(0, 10)).toBe('2024-02-02');
  });
});

describe('findLongestTimingFromBlend', () => {
  it('should find product with longest total growing time', () => {
    const ingredients = [
      {
        products: {
          name: 'Short',
          days_soaking: 1,
          days_germination: 1,
          days_light: 1,
          avg_yield_per_tray: 8,
        },
      },
      {
        products: {
          name: 'Long',
          days_soaking: 2,
          days_germination: 4,
          days_light: 5,
          avg_yield_per_tray: 10,
        },
      },
    ];

    const result = findLongestTimingFromBlend(ingredients);
    expect(result.name).toBe('Long');
    expect(result.daysSoaking).toBe(2);
    expect(result.daysGermination).toBe(4);
    expect(result.daysLight).toBe(5);
  });
});
