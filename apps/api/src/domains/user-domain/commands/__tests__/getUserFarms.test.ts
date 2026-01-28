import { describe, it, expect, beforeEach } from 'vitest';
import { getUserFarms } from '../getUserFarms.js';
import { createMockPrisma, createMockDbFarmUser, createMockDbFarm, type MockPrismaClient } from '../../../../test/mockPrisma.js';
import type { PrismaClient } from '../../../../generated/prisma/client.js';

describe('getUserFarms', () => {
  let mockPrisma: MockPrismaClient;

  beforeEach(() => {
    mockPrisma = createMockPrisma();
  });

  it('should return farms associated with the user', async () => {
    const dbFarm1 = createMockDbFarm({ id: 'farm-1', name: 'Farm Alpha', slug: 'alpha' });
    const dbFarm2 = createMockDbFarm({ id: 'farm-2', name: 'Farm Beta', slug: 'beta' });

    const dbFarmUsers = [
      { ...createMockDbFarmUser({ clerk_user_id: 'user-1', farm_id: 'farm-1', role: 'OWNER' }), farms: dbFarm1 },
      { ...createMockDbFarmUser({ clerk_user_id: 'user-1', farm_id: 'farm-2', role: 'MEMBER' }), farms: dbFarm2 },
    ];

    mockPrisma.farm_users.findMany.mockResolvedValue(dbFarmUsers);

    const result = await getUserFarms(mockPrisma as unknown as PrismaClient, 'user-1');

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      farmId: 'farm-1',
      name: 'Farm Alpha',
      slug: 'alpha',
      role: 'OWNER',
    });
    expect(result[1].name).toBe('Farm Beta');
    expect(mockPrisma.farm_users.findMany).toHaveBeenCalledWith({
      where: { clerk_user_id: 'user-1', is_active: true },
      include: { farms: true },
    });
  });

  it('should filter out users without farms', async () => {
    const dbFarmUsers = [
      { ...createMockDbFarmUser({ clerk_user_id: 'user-1', farm_id: null }), farms: null },
    ];
    mockPrisma.farm_users.findMany.mockResolvedValue(dbFarmUsers);

    const result = await getUserFarms(mockPrisma as unknown as PrismaClient, 'user-1');

    expect(result).toHaveLength(0);
  });
});
