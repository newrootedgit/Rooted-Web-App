import { describe, it, expect, beforeEach } from 'vitest';
import { createCustomer } from '../createCustomer.js';
import { createMockPrisma, createMockDbCustomer, type MockPrismaClient } from '../../../../../test/mockPrisma.js';
import type { PrismaClient } from '../../../../../generated/prisma/client.js';

describe('createCustomer', () => {
  let mockPrisma: MockPrismaClient;
  const farmId = 'farm-uuid-1';

  beforeEach(() => {
    mockPrisma = createMockPrisma();
  });

  it('should create a customer successfully', async () => {
    const dbCustomer = createMockDbCustomer({ id: 'new-id', name: 'Fresh Greens Co' });
    mockPrisma.customers.create.mockResolvedValue(dbCustomer);

    const result = await createCustomer(
      mockPrisma as unknown as PrismaClient,
      farmId,
      { name: 'Fresh Greens Co', customerType: 'Wholesale', paymentTerms: 'Net 30' }
    );

    expect(result.id).toBe('new-id');
    expect(result.name).toBe('Fresh Greens Co');
    expect(result.farmId).toBe('farm-uuid-1');
    expect(mockPrisma.customers.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        farm_id: farmId,
        name: 'Fresh Greens Co',
      }),
    });
  });

  it('should map snake_case DB fields to camelCase', async () => {
    const dbCustomer = createMockDbCustomer({
      company_name: 'Greens Inc',
      customer_type: 'Restaurant',
      payment_terms: 'Net 15',
    });
    mockPrisma.customers.create.mockResolvedValue(dbCustomer);

    const result = await createCustomer(
      mockPrisma as unknown as PrismaClient,
      farmId,
      { name: 'Test Customer' }
    );

    expect(result.companyName).toBe('Greens Inc');
    expect(result.customerType).toBe('Restaurant');
    expect(result.paymentTerms).toBe('Net 15');
  });

  it('should handle optional fields as null', async () => {
    const dbCustomer = createMockDbCustomer({
      email: null,
      phone: null,
      company_name: null,
    });
    mockPrisma.customers.create.mockResolvedValue(dbCustomer);

    const result = await createCustomer(
      mockPrisma as unknown as PrismaClient,
      farmId,
      { name: 'Minimal Customer' }
    );

    expect(result.email).toBeNull();
    expect(result.phone).toBeNull();
    expect(result.companyName).toBeNull();
  });
});
