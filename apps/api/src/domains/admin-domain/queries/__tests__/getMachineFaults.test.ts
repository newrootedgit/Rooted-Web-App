import { describe, it, expect, beforeEach } from 'vitest';
import { getMachineFaults } from '../getMachineFaults.js';
import { createMockPrisma, type MockPrismaClient } from '../../../../test/mockPrisma.js';
import type { PrismaClient } from '../../../../generated/prisma/client.js';

describe('getMachineFaults', () => {
  let mockPrisma: MockPrismaClient;

  beforeEach(() => {
    mockPrisma = createMockPrisma();
  });

  it('should return machine faults without tenant scoping for admins', async () => {
    const machineId = 'machine-123';
    const createdAt = new Date('2026-03-11T10:00:00Z');

    mockPrisma.machines.findFirst.mockResolvedValue({ id: machineId });
    mockPrisma.machine_faults.findMany.mockResolvedValue([
      {
        id: 'fault-1',
        machine_id: machineId,
        fault_type: 'overcurrent',
        motor: 'belt',
        torque_pct: 87,
        event_code: 'BELT_OC',
        created_at: createdAt,
      },
    ]);

    const result = await getMachineFaults(mockPrisma as unknown as PrismaClient, machineId);

    expect(result).toEqual([
      {
        id: 'fault-1',
        faultType: 'overcurrent',
        motor: 'belt',
        torquePct: 87,
        eventCode: 'BELT_OC',
        createdAt,
      },
    ]);
    expect(mockPrisma.machines.findFirst).toHaveBeenCalledWith({
      where: { id: machineId },
      select: { id: true },
    });
    expect(mockPrisma.machine_faults.findMany).toHaveBeenCalledWith({
      where: { machine_id: machineId },
      orderBy: { created_at: 'desc' },
      take: 100,
    });
  });
});
