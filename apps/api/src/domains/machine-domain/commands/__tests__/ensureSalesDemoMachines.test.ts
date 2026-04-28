import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createMockPrisma, createMockDbMachine, type MockPrismaClient } from '../../../../test/mockPrisma.js';
import type { PrismaClient } from '../../../../generated/prisma/client.js';

vi.mock('../../../../lib/auth/admin.js', () => ({
  requireAdmin: vi.fn().mockResolvedValue(undefined),
}));

const { requireAdmin } = await import('../../../../lib/auth/admin.js');
const { ensureSalesDemoMachines } = await import('../ensureSalesDemoMachines.js');

describe('ensureSalesDemoMachines', () => {
  let mockPrisma: MockPrismaClient;

  beforeEach(() => {
    mockPrisma = createMockPrisma();
    vi.clearAllMocks();
  });

  it('creates Demo Harvester and Demo Seeder when they do not exist', async () => {
    mockPrisma.machines.findFirst.mockResolvedValue(null);

    const result = await ensureSalesDemoMachines(
      mockPrisma as unknown as PrismaClient,
      'user-1',
      'tenant-1',
      'farm-1'
    );

    expect(requireAdmin).toHaveBeenCalledWith('user-1');
    expect(mockPrisma.machines.create).toHaveBeenCalledTimes(2);
    expect(mockPrisma.machines.create).toHaveBeenNthCalledWith(1, {
      data: expect.objectContaining({
        tenant_id: 'tenant-1',
        farm_id: 'farm-1',
        name: 'HARVESTER',
        display_name: 'Demo Harvester',
        device_id: 'demo-harvester-farm-1',
        status: 'online',
        current_wifi_ssid: 'DEMO_NETWORK',
        is_demo: true,
      }),
    });
    expect(mockPrisma.machines.create).toHaveBeenNthCalledWith(2, {
      data: expect.objectContaining({
        tenant_id: 'tenant-1',
        farm_id: 'farm-1',
        name: 'SEEDER',
        display_name: 'Demo Seeder',
        device_id: 'demo-seeder-farm-1',
        status: 'online',
        current_wifi_ssid: 'DEMO_NETWORK',
        is_demo: true,
        demo_config: expect.objectContaining({
          variable_ranges: expect.objectContaining({
            seed_rate: { min: 1, max: 50 },
          }),
        }),
      }),
    });
    expect(result).toEqual({ machinesCreated: 2, machinesUpdated: 0 });
  });

  it('repairs existing demo machines instead of creating duplicates', async () => {
    const existingHarvester = createMockDbMachine({
      id: 'harvester-1',
      tenant_id: 'tenant-1',
      farm_id: 'farm-1',
      device_id: 'demo-farm-1',
      name: 'HARVESTER',
      display_name: 'Demo Harvester',
      is_demo: true,
    });
    const existingSeeder = createMockDbMachine({
      id: 'seeder-1',
      tenant_id: 'tenant-1',
      farm_id: 'farm-1',
      device_id: 'demo-seeder-farm-1',
      name: 'SEEDER',
      display_name: 'Demo Seeder',
      is_demo: true,
    });
    mockPrisma.machines.findFirst
      .mockResolvedValueOnce(existingHarvester)
      .mockResolvedValueOnce(existingSeeder);

    const result = await ensureSalesDemoMachines(
      mockPrisma as unknown as PrismaClient,
      'admin-1',
      'tenant-1',
      'farm-1'
    );

    expect(mockPrisma.machines.update).toHaveBeenCalledTimes(2);
    expect(mockPrisma.machines.update).toHaveBeenNthCalledWith(1, {
      where: { id: 'harvester-1' },
      data: expect.objectContaining({
        device_id: 'demo-harvester-farm-1',
        status: 'online',
        is_demo: true,
      }),
    });
    expect(mockPrisma.machines.update).toHaveBeenNthCalledWith(2, {
      where: { id: 'seeder-1' },
      data: expect.objectContaining({
        device_id: 'demo-seeder-farm-1',
        status: 'online',
        is_demo: true,
      }),
    });
    expect(mockPrisma.machines.create).not.toHaveBeenCalled();
    expect(result).toEqual({ machinesCreated: 0, machinesUpdated: 2 });
  });
});
