import { describe, it, expect, beforeEach } from 'vitest';
import { deactivateCustomer } from '../deactivateCustomer.js';
import { createMockPrisma, createMockDbCustomer, type MockPrismaClient } from '../../../../../test/mockPrisma.js';
import type { PrismaClient } from '../../../../../generated/prisma/client.js';

describe('deactivateCustomer', () => {
  let mockPrisma: MockPrismaClient;
  const farmId = 'farm-uuid-1';

  beforeEach(() => {
    mockPrisma = createMockPrisma();
  });

  it('should deactivate a customer successfully', async () => {
    mockPrisma.customers.findFirst.mockResolvedValue(createMockDbCustomer({ id: 'cust-1' }));
    mockPrisma.orders.findFirst.mockResolvedValue(null);
    mockPrisma.customers.update.mockResolvedValue(createMockDbCustomer({ id: 'cust-1', is_active: false }));

    const result = await deactivateCustomer(
      mockPrisma as unknown as PrismaClient,
      farmId,
      'cust-1'
    );

    expect(result.isActive).toBe(false);
    expect(mockPrisma.customers.update).toHaveBeenCalledWith({
      where: { id: 'cust-1' },
      data: { is_active: false },
    });
  });

  it('should throw NOT_FOUND for missing customer', async () => {
    mockPrisma.customers.findFirst.mockResolvedValue(null);

    await expect(
      deactivateCustomer(mockPrisma as unknown as PrismaClient, farmId, 'missing')
    ).rejects.toThrow('Customer not found');
  });

  it('should reject if customer has orders', async () => {
    mockPrisma.customers.findFirst.mockResolvedValue(createMockDbCustomer({ id: 'cust-1' }));
    mockPrisma.orders.findFirst.mockResolvedValue({ id: 'order-1' });

    await expect(
      deactivateCustomer(mockPrisma as unknown as PrismaClient, farmId, 'cust-1')
    ).rejects.toThrow('existing orders');
  });
});
