import { describe, it, expect, beforeEach } from 'vitest';
import { listMachines } from '../listMachines.js';
import { createMockPrisma, createMockDbMachine, type MockPrismaClient } from '../../../test/mockPrisma.js';
import type { PrismaClient } from '../../../generated/prisma/client.js';

describe('listMachines', () => {
  let mockPrisma: MockPrismaClient;

  beforeEach(() => {
    mockPrisma = createMockPrisma();
  });

  it('should return empty array when no machines exist', async () => {
    mockPrisma.machines.findMany.mockResolvedValue([]);

    const result = await listMachines(
      mockPrisma as unknown as PrismaClient,
      'tenant-1',
      'farm-1'
    );

    expect(result).toEqual([]);
    expect(mockPrisma.machines.findMany).toHaveBeenCalledWith({
      where: {
        tenant_id: 'tenant-1',
        farm_id: 'farm-1',
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  });

  it('should return machines filtered by tenant and farm', async () => {
    const dbMachine = createMockDbMachine({
      id: 'machine-1',
      tenant_id: 'tenant-1',
      farm_id: 'farm-1',
      name: 'Harvester',
      device_id: 'dev-001',
    });
    mockPrisma.machines.findMany.mockResolvedValue([dbMachine]);

    const result = await listMachines(
      mockPrisma as unknown as PrismaClient,
      'tenant-1',
      'farm-1'
    );

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      id: 'machine-1',
      tenantId: 'tenant-1',
      farmId: 'farm-1',
      name: 'Harvester',
      deviceId: 'dev-001',
      createdAt: dbMachine.created_at,
    });
  });

  it('should return multiple machines in order', async () => {
    const machines = [
      createMockDbMachine({ id: 'machine-1', name: 'Machine 1' }),
      createMockDbMachine({ id: 'machine-2', name: 'Machine 2' }),
    ];
    mockPrisma.machines.findMany.mockResolvedValue(machines);

    const result = await listMachines(
      mockPrisma as unknown as PrismaClient,
      'tenant-uuid-1',
      'farm-uuid-1'
    );

    expect(result).toHaveLength(2);
    expect(result[0].name).toBe('Machine 1');
    expect(result[1].name).toBe('Machine 2');
  });
});
