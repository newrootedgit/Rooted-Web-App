import { describe, it, expect, beforeEach } from 'vitest';
import { updateOrderStatus } from '../updateOrderStatus.js';
import {
  createMockPrisma,
  createMockDbOrder,
  type MockPrismaClient,
} from '../../../../../test/mockPrisma.js';
import type { PrismaClient } from '../../../../../generated/prisma/client.js';

describe('updateOrderStatus', () => {
  let mockPrisma: MockPrismaClient;
  const farmId = 'farm-uuid-1';

  beforeEach(() => {
    mockPrisma = createMockPrisma();
  });

  it('should transition Pending → In Progress', async () => {
    mockPrisma.orders.findFirst.mockResolvedValue(createMockDbOrder({ status: 'Pending' }));
    const updated = createMockDbOrder({ status: 'In Progress', order_items: [] });
    mockPrisma.orders.update.mockResolvedValue(updated);

    const result = await updateOrderStatus(mockPrisma as unknown as PrismaClient, farmId, {
      id: 'order-uuid-1',
      status: 'In Progress',
    });

    expect(result.status).toBe('In Progress');
  });

  it('should transition In Progress → Ready', async () => {
    mockPrisma.orders.findFirst.mockResolvedValue(createMockDbOrder({ status: 'In Progress' }));
    const updated = createMockDbOrder({ status: 'Ready', order_items: [] });
    mockPrisma.orders.update.mockResolvedValue(updated);

    const result = await updateOrderStatus(mockPrisma as unknown as PrismaClient, farmId, {
      id: 'order-uuid-1',
      status: 'Ready',
    });

    expect(result.status).toBe('Ready');
  });

  it('should transition Ready → Delivered', async () => {
    mockPrisma.orders.findFirst.mockResolvedValue(createMockDbOrder({ status: 'Ready' }));
    const updated = createMockDbOrder({ status: 'Delivered', order_items: [] });
    mockPrisma.orders.update.mockResolvedValue(updated);

    const result = await updateOrderStatus(mockPrisma as unknown as PrismaClient, farmId, {
      id: 'order-uuid-1',
      status: 'Delivered',
    });

    expect(result.status).toBe('Delivered');
  });

  it('should allow cancellation from any active status', async () => {
    mockPrisma.orders.findFirst.mockResolvedValue(createMockDbOrder({ status: 'In Progress' }));
    const updated = createMockDbOrder({ status: 'Cancelled', order_items: [] });
    mockPrisma.orders.update.mockResolvedValue(updated);

    const result = await updateOrderStatus(mockPrisma as unknown as PrismaClient, farmId, {
      id: 'order-uuid-1',
      status: 'Cancelled',
    });

    expect(result.status).toBe('Cancelled');
  });

  it('should reject invalid backward transitions', async () => {
    mockPrisma.orders.findFirst.mockResolvedValue(createMockDbOrder({ status: 'Ready' }));

    await expect(
      updateOrderStatus(mockPrisma as unknown as PrismaClient, farmId, {
        id: 'order-uuid-1',
        status: 'Pending',
      })
    ).rejects.toThrow('Cannot transition');
  });

  it('should reject transitions from terminal states', async () => {
    mockPrisma.orders.findFirst.mockResolvedValue(createMockDbOrder({ status: 'Delivered' }));

    await expect(
      updateOrderStatus(mockPrisma as unknown as PrismaClient, farmId, {
        id: 'order-uuid-1',
        status: 'In Progress',
      })
    ).rejects.toThrow('Cannot transition');
  });

  it('should throw NOT_FOUND for nonexistent order', async () => {
    mockPrisma.orders.findFirst.mockResolvedValue(null);

    await expect(
      updateOrderStatus(mockPrisma as unknown as PrismaClient, farmId, {
        id: 'nonexistent',
        status: 'In Progress',
      })
    ).rejects.toThrow('Order not found');
  });
});
