import { describe, it, expect, beforeEach } from 'vitest';
import { createTenantAndFarm } from '../createTenantAndFarm.js';
import { createMockPrisma, createMockDbFarmUser, createMockDbTenant, createMockDbFarm, type MockPrismaClient } from '../../../../test/mockPrisma.js';
import type { PrismaClient } from '../../../../generated/prisma/client.js';

describe('createTenantAndFarm', () => {
  let mockPrisma: MockPrismaClient;

  beforeEach(() => {
    mockPrisma = createMockPrisma();
  });

  it('should create tenant and farm and link to user', async () => {
    const dbFarmUser = createMockDbFarmUser({ id: 'fu-1', clerk_user_id: 'user-123', farm_id: null });
    mockPrisma.farm_users.findFirst.mockResolvedValue(dbFarmUser);

    // Slugs are unique
    mockPrisma.farms.findUnique.mockResolvedValue(null);
    mockPrisma.tenants.findUnique.mockResolvedValue(null);

    const dbTenant = createMockDbTenant({ id: 'tenant-1', name: 'New Farm', slug: 'new-farm' });
    mockPrisma.tenants.create.mockResolvedValue(dbTenant);

    const dbFarm = createMockDbFarm({ id: 'farm-1', name: 'New Farm', slug: 'new-farm', tenant_id: 'tenant-1' });
    mockPrisma.farms.create.mockResolvedValue(dbFarm);

    const result = await createTenantAndFarm(
      mockPrisma as unknown as PrismaClient,
      'user-123',
      { farmName: 'New Farm', userEmail: 'test@example.com' }
    );

    expect(result).toEqual({
      tenantId: 'tenant-1',
      farmId: 'farm-1',
      farmSlug: 'new-farm',
    });

    expect(mockPrisma.tenants.create).toHaveBeenCalledWith({
      data: { name: 'New Farm', slug: 'new-farm' },
    });
    expect(mockPrisma.farms.create).toHaveBeenCalledWith({
      data: {
        tenants: { connect: { id: 'tenant-1' } },
        name: 'New Farm',
        slug: 'new-farm',
      },
    });
    expect(mockPrisma.farm_users.update).toHaveBeenCalledWith({
      where: { id: 'fu-1' },
      data: { tenant_id: 'tenant-1', farm_id: 'farm-1' },
    });
    expect(mockPrisma.machines.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        tenant_id: 'tenant-1',
        farm_id: 'farm-1',
        name: 'HARVESTER',
        display_name: 'Demo Harvester',
        device_id: 'demo-farm-1',
        status: 'online',
        current_wifi_ssid: 'DEMO_NETWORK',
        is_demo: true,
      }),
    });
  });

  it('should throw error if user not found', async () => {
    mockPrisma.farm_users.findFirst.mockResolvedValue(null);

    await expect(
      createTenantAndFarm(mockPrisma as unknown as PrismaClient, 'user-123', { farmName: 'New Farm', userEmail: 'test@example.com' })
    ).rejects.toThrow('User not found');
  });

  it('should throw error if user already has a farm', async () => {
    const dbFarmUser = createMockDbFarmUser({ id: 'fu-1', clerk_user_id: 'user-123', farm_id: 'existing-farm' });
    mockPrisma.farm_users.findFirst.mockResolvedValue(dbFarmUser);

    await expect(
      createTenantAndFarm(mockPrisma as unknown as PrismaClient, 'user-123', { farmName: 'New Farm', userEmail: 'test@example.com' })
    ).rejects.toThrow('User already has a farm');
  });

  it('should handle slug collisions', async () => {
    const dbFarmUser = createMockDbFarmUser({ id: 'fu-1', clerk_user_id: 'user-123', farm_id: null });
    mockPrisma.farm_users.findFirst.mockResolvedValue(dbFarmUser);

    // First slug exists
    mockPrisma.farms.findUnique.mockResolvedValueOnce({ id: 'other' });
    // Second slug is unique
    mockPrisma.farms.findUnique.mockResolvedValueOnce(null);
    mockPrisma.tenants.findUnique.mockResolvedValue(null);

    mockPrisma.tenants.create.mockResolvedValue({ id: 't1' });
    mockPrisma.farms.create.mockResolvedValue({ id: 'f1' });

    const result = await createTenantAndFarm(
      mockPrisma as unknown as PrismaClient,
      'user-123',
      { farmName: 'New Farm', userEmail: 'test@example.com' }
    );

    expect(result.farmSlug).toBe('new-farm-1');
  });
});
