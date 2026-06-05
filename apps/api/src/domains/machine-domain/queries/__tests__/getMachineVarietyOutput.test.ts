import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { TRPCError } from '@trpc/server';
import { createMockDbMachine, createMockPrisma, type MockPrismaClient } from '../../../../test/mockPrisma.js';
import { mockTimescale } from '../../../../test/mockTimescale.js';
import type { PrismaClient } from '../../../../generated/prisma/client.js';

vi.mock('../../../../lib/db/timescale.js', () => ({
  timescale: mockTimescale,
}));

const { getMachineVarietyOutput } = await import('../getMachineVarietyOutput.js');

const MACHINE_ID = '11111111-1111-1111-1111-111111111111';

describe('getMachineVarietyOutput', () => {
  let mockPrisma: MockPrismaClient;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-04-28T12:00:00.000Z'));
    vi.clearAllMocks();
    mockPrisma = createMockPrisma();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('throws NOT_FOUND when the machine is out of scope', async () => {
    mockPrisma.machines.findFirst.mockResolvedValue(null);

    await expect(getMachineVarietyOutput(
      mockPrisma as unknown as PrismaClient,
      MACHINE_ID,
      'tenant-1',
      'farm-1',
      '7d'
    )).rejects.toBeInstanceOf(TRPCError);
  });

  it('omits tenant/farm filters when scope is null (admin / cross-farm)', async () => {
    mockPrisma.machines.findFirst.mockResolvedValue(createMockDbMachine({
      id: MACHINE_ID,
      tenant_id: 'tenant-1',
      farm_id: 'farm-1',
      is_demo: false,
    }));
    mockTimescale.query.mockResolvedValue({ rows: [] });
    mockPrisma.machine_variety_history.findMany.mockResolvedValue([]);

    const result = await getMachineVarietyOutput(
      mockPrisma as unknown as PrismaClient,
      MACHINE_ID,
      null,
      null,
      '7d'
    );

    // The lookup must not be farm/tenant scoped — a machine in a different farm
    // (or any machine for an admin) still resolves instead of throwing.
    expect(mockPrisma.machines.findFirst).toHaveBeenCalledWith(expect.objectContaining({
      where: { id: MACHINE_ID },
    }));
    expect(result.source).toBe('aggregate');
    expect(result.seedByVariety).toEqual([]);
  });
});
