import { describe, it, expect, beforeEach } from 'vitest';
import { listOrders } from '../listOrders.js';
import {
  createMockPrisma,
  createMockDbOrder,
  type MockPrismaClient,
} from '../../../../../test/mockPrisma.js';
import type { PrismaClient } from '../../../../../generated/prisma/client.js';

describe('listOrders', () => {
  let mockPrisma: MockPrismaClient;
  const farmId = 'farm-uuid-1';

  beforeEach(() => {
    mockPrisma = createMockPrisma();
  });

  it('should return paginated orders', async () => {
    const orders = [
      createMockDbOrder({ id: 'order-1', order_number: 'ORD-000001', order_items: [] }),
      createMockDbOrder({ id: 'order-2', order_number: 'ORD-000002', order_items: [] }),
    ];
    mockPrisma.orders.findMany.mockResolvedValue(orders);

    const result = await listOrders(mockPrisma as unknown as PrismaClient, farmId, {});

    expect(result.items).toHaveLength(2);
    expect(result.items[0].orderNumber).toBe('ORD-000001');
    expect(result.hasMore).toBe(false);
  });

  it('should filter by status', async () => {
    mockPrisma.orders.findMany.mockResolvedValue([]);

    await listOrders(mockPrisma as unknown as PrismaClient, farmId, { status: 'Pending' });

    expect(mockPrisma.orders.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ status: 'Pending' }),
      })
    );
  });

  it('should filter by customerId', async () => {
    mockPrisma.orders.findMany.mockResolvedValue([]);

    await listOrders(mockPrisma as unknown as PrismaClient, farmId, { customerId: 'cust-1' });

    expect(mockPrisma.orders.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ customer_id: 'cust-1' }),
      })
    );
  });

  it('should search by order number or customer name', async () => {
    mockPrisma.orders.findMany.mockResolvedValue([]);

    await listOrders(mockPrisma as unknown as PrismaClient, farmId, { search: 'ORD' });

    expect(mockPrisma.orders.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          OR: expect.arrayContaining([
            expect.objectContaining({ order_number: expect.any(Object) }),
          ]),
        }),
      })
    );
  });
});
