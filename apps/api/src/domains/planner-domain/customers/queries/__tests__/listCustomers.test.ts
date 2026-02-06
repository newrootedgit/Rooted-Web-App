import { describe, it, expect, beforeEach } from 'vitest';
import { listCustomers } from '../listCustomers.js';
import { createMockPrisma, createMockDbCustomer, type MockPrismaClient } from '../../../../../test/mockPrisma.js';
import type { PrismaClient } from '../../../../../generated/prisma/client.js';

describe('listCustomers', () => {
  let mockPrisma: MockPrismaClient;
  const farmId = 'farm-uuid-1';

  beforeEach(() => {
    mockPrisma = createMockPrisma();
  });

  it('should return empty result when no customers', async () => {
    mockPrisma.customers.findMany.mockResolvedValue([]);

    const result = await listCustomers(
      mockPrisma as unknown as PrismaClient,
      farmId,
      {}
    );

    expect(result.items).toEqual([]);
    expect(result.hasMore).toBe(false);
    expect(result.nextCursor).toBeNull();
  });

  it('should return customers with pagination', async () => {
    const customers = [
      createMockDbCustomer({ id: 'cust-1', name: 'Alice' }),
      createMockDbCustomer({ id: 'cust-2', name: 'Bob' }),
    ];
    mockPrisma.customers.findMany.mockResolvedValue(customers);

    const result = await listCustomers(
      mockPrisma as unknown as PrismaClient,
      farmId,
      { limit: 10 }
    );

    expect(result.items).toHaveLength(2);
    expect(result.items[0].name).toBe('Alice');
    expect(result.hasMore).toBe(false);
  });

  it('should filter by customer type', async () => {
    mockPrisma.customers.findMany.mockResolvedValue([]);

    await listCustomers(
      mockPrisma as unknown as PrismaClient,
      farmId,
      { customerType: 'Wholesale' }
    );

    expect(mockPrisma.customers.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ customer_type: 'Wholesale' }),
      })
    );
  });

  it('should apply search filter', async () => {
    mockPrisma.customers.findMany.mockResolvedValue([]);

    await listCustomers(
      mockPrisma as unknown as PrismaClient,
      farmId,
      { search: 'green' }
    );

    expect(mockPrisma.customers.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          OR: [
            { name: { contains: 'green', mode: 'insensitive' } },
            { email: { contains: 'green', mode: 'insensitive' } },
            { company_name: { contains: 'green', mode: 'insensitive' } },
          ],
        }),
      })
    );
  });

  it('should filter by tag', async () => {
    mockPrisma.customers.findMany.mockResolvedValue([]);

    await listCustomers(
      mockPrisma as unknown as PrismaClient,
      farmId,
      { tag: 'vip' }
    );

    expect(mockPrisma.customers.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ tags: { has: 'vip' } }),
      })
    );
  });
});
