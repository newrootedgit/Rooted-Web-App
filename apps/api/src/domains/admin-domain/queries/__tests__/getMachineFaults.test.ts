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

    mockPrisma.machines.findFirst.mockResolvedValue({ id: machineId, name: 'HARVESTER', is_demo: false });
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
      select: { id: true, name: true, is_demo: true },
    });
    expect(mockPrisma.machine_faults.findMany).toHaveBeenCalledWith({
      where: { machine_id: machineId },
      orderBy: { created_at: 'desc' },
      take: 100,
    });
  });

  it('should return synthetic faults for demo machines', async () => {
    const machineId = 'demo-machine-123';

    mockPrisma.machines.findFirst.mockResolvedValue({
      id: machineId,
      name: 'SEEDER',
      is_demo: true,
    });

    const result = await getMachineFaults(mockPrisma as unknown as PrismaClient, machineId);

    expect(result).toEqual([
      expect.objectContaining({
        id: `${machineId}-demo-fault-1`,
        faultType: 'belt_fault',
        motor: 'belt',
        torquePct: 74,
        eventCode: 'belt_fault_cleared',
      }),
    ]);
    expect(result[0].createdAt).toBeInstanceOf(Date);
    expect(mockPrisma.machine_faults.findMany).not.toHaveBeenCalled();
  });
});
