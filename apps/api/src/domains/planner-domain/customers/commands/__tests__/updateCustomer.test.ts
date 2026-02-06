import { describe, it, expect, beforeEach } from 'vitest';
import { updateCustomer } from '../updateCustomer.js';
import { createMockPrisma, createMockDbCustomer, type MockPrismaClient } from '../../../../../test/mockPrisma.js';
import type { PrismaClient } from '../../../../../generated/prisma/client.js';

describe('updateCustomer', () => {
  let mockPrisma: MockPrismaClient;
  const farmId = 'farm-uuid-1';

  beforeEach(() => {
    mockPrisma = createMockPrisma();
  });

  it('should update a customer successfully', async () => {
    const existing = createMockDbCustomer({ id: 'cust-1', name: 'Old Name' });
    mockPrisma.customers.findFirst.mockResolvedValue(existing);

    const updated = createMockDbCustomer({ id: 'cust-1', name: 'New Name' });
    mockPrisma.customers.update.mockResolvedValue(updated);

    const result = await updateCustomer(
      mockPrisma as unknown as PrismaClient,
      farmId,
      { id: 'cust-1', name: 'New Name' }
    );

    expect(result.name).toBe('New Name');
    expect(mockPrisma.customers.update).toHaveBeenCalledWith({
      where: { id: 'cust-1' },
      data: expect.objectContaining({ name: 'New Name' }),
    });
  });

  it('should throw NOT_FOUND for missing customer', async () => {
    mockPrisma.customers.findFirst.mockResolvedValue(null);

    await expect(
      updateCustomer(
        mockPrisma as unknown as PrismaClient,
        farmId,
        { id: 'missing', name: 'Nope' }
      )
    ).rejects.toThrow('Customer not found');
  });
});
