import { describe, it, expect, beforeEach } from 'vitest';
import { completeMachineTutorial } from '../completeMachineTutorial.js';
import { createMockPrisma, createMockDbFarmUser, type MockPrismaClient } from '../../../../test/mockPrisma.js';
import type { PrismaClient } from '../../../../generated/prisma/client.js';

describe('completeMachineTutorial', () => {
  let mockPrisma: MockPrismaClient;

  beforeEach(() => {
    mockPrisma = createMockPrisma();
  });

  it('marks the machine tutorial completed for the active user', async () => {
    const farmUser = createMockDbFarmUser({ id: 'fu-1', clerk_user_id: 'user-123' });
    mockPrisma.farm_users.findFirst.mockResolvedValue(farmUser);

    const result = await completeMachineTutorial(
      mockPrisma as unknown as PrismaClient,
      'user-123',
      { outcome: 'completed' }
    );

    expect(result).toEqual({ success: true });
    expect(mockPrisma.farm_users.update).toHaveBeenCalledWith({
      where: { id: 'fu-1' },
      data: { machine_tutorial_completed_at: expect.any(Date) },
    });
  });

  it('marks the machine tutorial dismissed for the active user', async () => {
    const farmUser = createMockDbFarmUser({ id: 'fu-1', clerk_user_id: 'user-123' });
    mockPrisma.farm_users.findFirst.mockResolvedValue(farmUser);

    await completeMachineTutorial(
      mockPrisma as unknown as PrismaClient,
      'user-123',
      { outcome: 'dismissed' }
    );

    expect(mockPrisma.farm_users.update).toHaveBeenCalledWith({
      where: { id: 'fu-1' },
      data: { machine_tutorial_dismissed_at: expect.any(Date) },
    });
  });

  it('throws when the user is missing', async () => {
    mockPrisma.farm_users.findFirst.mockResolvedValue(null);

    await expect(
      completeMachineTutorial(
        mockPrisma as unknown as PrismaClient,
        'user-123',
        { outcome: 'completed' }
      )
    ).rejects.toThrow('User not found');
  });
});
