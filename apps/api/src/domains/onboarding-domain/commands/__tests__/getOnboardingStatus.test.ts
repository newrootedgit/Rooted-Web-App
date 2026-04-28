import { describe, it, expect, beforeEach } from 'vitest';
import { getOnboardingStatus } from '../getOnboardingStatus.js';
import { createMockPrisma, createMockDbFarmUser, createMockDbFarm, type MockPrismaClient } from '../../../../test/mockPrisma.js';
import type { PrismaClient } from '../../../../generated/prisma/client.js';

describe('getOnboardingStatus', () => {
  let mockPrisma: MockPrismaClient;

  beforeEach(() => {
    mockPrisma = createMockPrisma();
  });

  it('should return needsOnboarding true if user does not exist and create a new farm user', async () => {
    mockPrisma.farm_users.findFirst.mockResolvedValue(null);
    mockPrisma.farm_users.create.mockResolvedValue({});

    const result = await getOnboardingStatus(mockPrisma as unknown as PrismaClient, 'user-123');

    expect(result).toEqual({
      needsOnboarding: true,
      status: 'no_farm',
      tutorial: {
        machineTutorialCompletedAt: null,
        machineTutorialDismissedAt: null,
      },
    });
    expect(mockPrisma.farm_users.create).toHaveBeenCalledWith({
      data: {
        clerk_user_id: 'user-123',
        email: '',
        first_name: '',
        last_name: '',
        role: 'FARM_OWNER',
        is_active: true,
        farm_id: null,
      },
    });
  });

  it('should return needsOnboarding true if user exists but has no farm_id', async () => {
    const dbFarmUser = createMockDbFarmUser({ clerk_user_id: 'user-123', farm_id: null });
    mockPrisma.farm_users.findFirst.mockResolvedValue(dbFarmUser);

    const result = await getOnboardingStatus(mockPrisma as unknown as PrismaClient, 'user-123');

    expect(result).toEqual({
      needsOnboarding: true,
      status: 'no_farm',
      tutorial: {
        machineTutorialCompletedAt: null,
        machineTutorialDismissedAt: null,
      },
    });
  });

  it('should return needsOnboarding false if user has a farm', async () => {
    const dbFarm = createMockDbFarm({ id: 'farm-1', name: 'Test Farm', slug: 'test-farm', tenant_id: 'tenant-1' });
    const dbFarmUser = {
      ...createMockDbFarmUser({ clerk_user_id: 'user-123', farm_id: 'farm-1' }),
      farms: dbFarm,
    };
    mockPrisma.farm_users.findFirst.mockResolvedValue(dbFarmUser);

    const result = await getOnboardingStatus(mockPrisma as unknown as PrismaClient, 'user-123');

    expect(result).toEqual({
      needsOnboarding: false,
      status: 'has_farm',
      farm: {
        id: 'farm-1',
        name: 'Test Farm',
        slug: 'test-farm',
        tenantId: 'tenant-1',
      },
      tutorial: {
        machineTutorialCompletedAt: null,
        machineTutorialDismissedAt: null,
      },
    });
  });
});
