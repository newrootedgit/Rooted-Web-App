import { describe, it, expect, beforeEach } from 'vitest';
import { createOrder } from '../createOrder.js';
import {
  createMockPrisma,
  createMockDbProduct,
  createMockDbCustomer,
  createMockDbOrder,
  createMockDbOrderItem,
  createMockDbBlend,
  type MockPrismaClient,
} from '../../../../../test/mockPrisma.js';
import type { PrismaClient } from '../../../../../generated/prisma/client.js';

describe('createOrder', () => {
  let mockPrisma: MockPrismaClient;
  const farmId = 'farm-uuid-1';

  beforeEach(() => {
    mockPrisma = createMockPrisma();
  });

  it('should create an order with items and auto-generate tasks', async () => {
    // Setup: no previous orders
    mockPrisma.orders.findFirst.mockResolvedValue(null);
    // Customer exists
    mockPrisma.customers.findFirst.mockResolvedValue(createMockDbCustomer());
    // Product exists
    mockPrisma.products.findFirst.mockResolvedValue(
      createMockDbProduct({
        days_soaking: 1,
        days_germination: 3,
        days_light: 4,
        avg_yield_per_tray: 10,
      })
    );

    const createdOrder = createMockDbOrder({ id: 'new-order-id', order_number: 'ORD-000001' });
    mockPrisma.orders.create.mockResolvedValue(createdOrder);

    const createdItem = createMockDbOrderItem({ id: 'new-item-id', order_id: 'new-order-id' });
    mockPrisma.order_items.create.mockResolvedValue(createdItem);

    // Tasks create
    mockPrisma.tasks.create.mockResolvedValue({});

    // Re-fetch full order
    const fullOrder = createMockDbOrder({
      id: 'new-order-id',
      order_number: 'ORD-000001',
      customers: createMockDbCustomer(),
      order_items: [createMockDbOrderItem({
        id: 'new-item-id',
        products: createMockDbProduct(),
        tasks: [],
      })],
    });
    // findFirst is called multiple times, last call is the re-fetch
    mockPrisma.orders.findFirst
      .mockResolvedValueOnce(null) // generateOrderNumber
      .mockResolvedValueOnce(fullOrder); // re-fetch

    const result = await createOrder(mockPrisma as unknown as PrismaClient, farmId, {
      customerId: 'customer-uuid-1',
      items: [{
        productId: 'product-uuid-1',
        quantityOz: 16,
        harvestDate: '2024-02-10',
        overagePercent: 10,
      }],
      notes: 'Test order',
    });

    expect(result.orderNumber).toBe('ORD-000001');
    expect(result.status).toBe('Pending');
    expect(mockPrisma.orders.create).toHaveBeenCalledTimes(1);
    expect(mockPrisma.order_items.create).toHaveBeenCalledTimes(1);
    // 4 tasks created
    expect(mockPrisma.tasks.create).toHaveBeenCalledTimes(4);
  });

  it('should calculate trays needed based on yield and overage', async () => {
    mockPrisma.orders.findFirst.mockResolvedValue(null);
    mockPrisma.products.findFirst.mockResolvedValue(
      createMockDbProduct({ avg_yield_per_tray: 10 })
    );
    mockPrisma.orders.create.mockResolvedValue(createMockDbOrder());
    mockPrisma.order_items.create.mockResolvedValue(createMockDbOrderItem());
    mockPrisma.tasks.create.mockResolvedValue({});
    mockPrisma.orders.findFirst
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(createMockDbOrder({ order_items: [createMockDbOrderItem()] }));

    await createOrder(mockPrisma as unknown as PrismaClient, farmId, {
      items: [{
        productId: 'product-uuid-1',
        quantityOz: 16,
        harvestDate: '2024-02-10',
        overagePercent: 10,
      }],
    });

    // 16 * 1.10 = 17.6 / 10 = ceil(1.76) = 2
    expect(mockPrisma.order_items.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ trays_needed: 2 }),
      })
    );
  });

  it('should throw NOT_FOUND if customer does not exist', async () => {
    mockPrisma.orders.findFirst.mockResolvedValue(null);
    mockPrisma.customers.findFirst.mockResolvedValue(null);

    await expect(
      createOrder(mockPrisma as unknown as PrismaClient, farmId, {
        customerId: 'nonexistent',
        items: [{
          productId: 'product-uuid-1',
          quantityOz: 16,
          harvestDate: '2024-02-10',
        }],
      })
    ).rejects.toThrow('Customer not found');
  });

  it('should support blend items and use longest timing', async () => {
    mockPrisma.orders.findFirst.mockResolvedValue(null);
    mockPrisma.blends.findFirst.mockResolvedValue(
      createMockDbBlend({
        blend_ingredients: [
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
              avg_yield_per_tray: 12,
            },
          },
        ],
      })
    );
    mockPrisma.orders.create.mockResolvedValue(createMockDbOrder());
    mockPrisma.order_items.create.mockResolvedValue(createMockDbOrderItem());
    mockPrisma.tasks.create.mockResolvedValue({});
    mockPrisma.orders.findFirst
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(createMockDbOrder({ order_items: [createMockDbOrderItem()] }));

    await createOrder(mockPrisma as unknown as PrismaClient, farmId, {
      items: [{
        blendId: 'blend-uuid-1',
        quantityOz: 16,
        harvestDate: '2024-02-10',
      }],
    });

    expect(mockPrisma.order_items.create).toHaveBeenCalledTimes(1);
    // Tasks should use longest timing product
    const taskCalls = mockPrisma.tasks.create.mock.calls;
    expect(taskCalls.length).toBe(4);
    // SOAK task title should reference the blend name
    expect(taskCalls[0][0].data.title).toContain('Spicy Mix');
  });
});
