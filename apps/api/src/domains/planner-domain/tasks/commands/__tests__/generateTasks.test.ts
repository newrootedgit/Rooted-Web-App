import { describe, it, expect, beforeEach, vi } from 'vitest';
import { generateTasksForOrderItem } from '../generateTasksForOrderItem.js';

describe('generateTasksForOrderItem', () => {
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = {
      tasks: { create: vi.fn().mockResolvedValue({}) },
    };
  });

  it('should create 4 tasks with correct types', async () => {
    await generateTasksForOrderItem(mockPrisma, {
      farmId: 'farm-1',
      orderItemId: 'item-1',
      orderNumber: 'ORD-000001',
      productName: 'Sunflower',
      soakDate: new Date('2024-02-02'),
      seedDate: new Date('2024-02-03'),
      moveToLightDate: new Date('2024-02-06'),
      harvestDate: new Date('2024-02-10'),
    });

    expect(mockPrisma.tasks.create).toHaveBeenCalledTimes(4);

    const calls = mockPrisma.tasks.create.mock.calls;
    expect(calls[0][0].data.type).toBe('SOAK');
    expect(calls[1][0].data.type).toBe('SEED');
    expect(calls[2][0].data.type).toBe('MOVE_TO_LIGHT');
    expect(calls[3][0].data.type).toBe('HARVEST');
  });

  it('should set correct titles with product name and order number', async () => {
    await generateTasksForOrderItem(mockPrisma, {
      farmId: 'farm-1',
      orderItemId: 'item-1',
      orderNumber: 'ORD-000005',
      productName: 'Radish',
      soakDate: new Date('2024-02-02'),
      seedDate: new Date('2024-02-03'),
      moveToLightDate: new Date('2024-02-06'),
      harvestDate: new Date('2024-02-10'),
    });

    const calls = mockPrisma.tasks.create.mock.calls;
    expect(calls[0][0].data.title).toBe('Soak - Radish (ORD-000005)');
    expect(calls[1][0].data.title).toBe('Seed - Radish (ORD-000005)');
    expect(calls[2][0].data.title).toBe('Move to Light - Radish (ORD-000005)');
    expect(calls[3][0].data.title).toBe('Harvest - Radish (ORD-000005)');
  });

  it('should set correct due dates', async () => {
    const soakDate = new Date('2024-02-02');
    const seedDate = new Date('2024-02-03');
    const moveToLightDate = new Date('2024-02-06');
    const harvestDate = new Date('2024-02-10');

    await generateTasksForOrderItem(mockPrisma, {
      farmId: 'farm-1',
      orderItemId: 'item-1',
      orderNumber: 'ORD-000001',
      productName: 'Sunflower',
      soakDate,
      seedDate,
      moveToLightDate,
      harvestDate,
    });

    const calls = mockPrisma.tasks.create.mock.calls;
    expect(calls[0][0].data.due_date).toEqual(soakDate);
    expect(calls[1][0].data.due_date).toEqual(seedDate);
    expect(calls[2][0].data.due_date).toEqual(moveToLightDate);
    expect(calls[3][0].data.due_date).toEqual(harvestDate);
  });

  it('should set all tasks with TODO status and MEDIUM priority', async () => {
    await generateTasksForOrderItem(mockPrisma, {
      farmId: 'farm-1',
      orderItemId: 'item-1',
      orderNumber: 'ORD-000001',
      productName: 'Test',
      soakDate: new Date(),
      seedDate: new Date(),
      moveToLightDate: new Date(),
      harvestDate: new Date(),
    });

    const calls = mockPrisma.tasks.create.mock.calls;
    for (const call of calls) {
      expect(call[0].data.status).toBe('TODO');
      expect(call[0].data.priority).toBe('MEDIUM');
    }
  });
});
