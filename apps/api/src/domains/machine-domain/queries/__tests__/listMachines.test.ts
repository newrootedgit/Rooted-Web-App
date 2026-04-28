import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createMockPrisma, createMockDbMachine, type MockPrismaClient } from '../../../../test/mockPrisma.js';
import { mockTimescale } from '../../../../test/mockTimescale.js';
import type { PrismaClient } from '../../../../generated/prisma/client.js';

vi.mock('../../../../lib/db/timescale.js', () => ({
  timescale: mockTimescale,
}));

const { listMachines } = await import('../listMachines.js');

describe('listMachines', () => {
  let mockPrisma: MockPrismaClient;

  beforeEach(() => {
    vi.clearAllMocks();
    mockPrisma = createMockPrisma();
    // Default: TimescaleDB returns empty stats
    mockTimescale.query.mockResolvedValue({ rows: [] });
  });

  it('should return empty paginated result when no machines exist', async () => {
    mockPrisma.machines.findMany.mockResolvedValue([]);

    const result = await listMachines(
      mockPrisma as unknown as PrismaClient,
      'tenant-1',
      'farm-1',
      {}
    );

    expect(result.items).toEqual([]);
    expect(result.hasMore).toBe(false);
    expect(result.nextCursor).toBeNull();
  });

  it('should return empty result when no tenantId', async () => {
    const result = await listMachines(
      mockPrisma as unknown as PrismaClient,
      '',
      'farm-1',
      {}
    );

    expect(result.items).toEqual([]);
    expect(result.hasMore).toBe(false);
    expect(result.nextCursor).toBeNull();
    expect(mockPrisma.machines.findMany).not.toHaveBeenCalled();
  });

  it('should filter by tenant and farm when farmId provided', async () => {
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
      'farm-1',
      {}
    );

    expect(result.items).toHaveLength(1);
    expect(result.items[0]).toEqual(expect.objectContaining({
      id: 'machine-1',
      tenantId: 'tenant-1',
      farmId: 'farm-1',
      name: 'Harvester',
      deviceId: 'dev-001',
      totalSteps: '0',
      totalUptimeMs: '0',
      currentBootUptimeMs: '0',
      rebootCount: 0,
      beltFaultCount: 0,
      bladeFaultCount: 0,
      trayCount: 0,
    }));
    expect(mockPrisma.machines.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          tenant_id: 'tenant-1',
          farm_id: 'farm-1',
        },
      })
    );
  });

  it('should hydrate lifetime telemetry totals from raw telemetry summaries', async () => {
    const dbMachine = createMockDbMachine({
      id: 'machine-1',
      tenant_id: 'tenant-1',
      farm_id: 'farm-1',
      name: 'Harvester',
      device_id: 'dev-001',
    });
    mockPrisma.machines.findMany.mockResolvedValue([dbMachine]);
    mockTimescale.query.mockResolvedValue({
      rows: [{
        machine_id: 'machine-1',
        total_steps: '42',
        total_uptime_ms: '123000',
        reboot_count: '2',
        tray_count: '7',
        belt_motor_uptime_ms: '5000',
        blade_motor_uptime_ms: '3000',
        last_event_code: 'blade_fault_cleared',
        last_event_value: 0,
        last_event_at: new Date('2026-03-11T17:01:33.970Z'),
      }],
    });

    const result = await listMachines(
      mockPrisma as unknown as PrismaClient,
      'tenant-1',
      'farm-1',
      {}
    );

    expect(result.items).toHaveLength(1);
    expect(result.items[0]).toEqual(expect.objectContaining({
      id: 'machine-1',
      totalSteps: '42',
      totalUptimeMs: '123000',
      currentBootUptimeMs: '0',
      rebootCount: 2,
      trayCount: 7,
      beltMotorUptimeMs: '5000',
      bladeMotorUptimeMs: '3000',
      lastEventCode: 'blade_fault_cleared',
      lastEventValue: 0,
      lastEventAt: new Date('2026-03-11T17:01:33.970Z'),
    }));
    expect(mockTimescale.query).toHaveBeenCalledWith(
      expect.stringContaining("COALESCE(session_id, CONCAT('boot:', boot_id::text))"),
      [['machine-1']]
    );
  });

  it('should filter by tenant only when farmId is null', async () => {
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
      null,
      {}
    );

    expect(result.items).toHaveLength(1);
    expect(mockPrisma.machines.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          tenant_id: 'tenant-1',
        },
      })
    );
  });

  it('should return multiple machines with pagination info', async () => {
    const machines = [
      createMockDbMachine({ id: 'machine-1', name: 'Machine 1' }),
      createMockDbMachine({ id: 'machine-2', name: 'Machine 2' }),
    ];
    mockPrisma.machines.findMany.mockResolvedValue(machines);

    const result = await listMachines(
      mockPrisma as unknown as PrismaClient,
      'tenant-uuid-1',
      'farm-uuid-1',
      { limit: 10 }
    );

    expect(result.items).toHaveLength(2);
    expect(result.items[0].name).toBe('Machine 1');
    expect(result.items[1].name).toBe('Machine 2');
    expect(result.hasMore).toBe(false);
  });

  it('should indicate hasMore when more results exist', async () => {
    const machines = [
      createMockDbMachine({ id: 'machine-1', name: 'Machine 1' }),
      createMockDbMachine({ id: 'machine-2', name: 'Machine 2' }),
      createMockDbMachine({ id: 'machine-3', name: 'Machine 3' }),
    ];
    mockPrisma.machines.findMany.mockResolvedValue(machines);

    const result = await listMachines(
      mockPrisma as unknown as PrismaClient,
      'tenant-uuid-1',
      'farm-uuid-1',
      { limit: 2 }
    );

    expect(result.items).toHaveLength(2);
    expect(result.hasMore).toBe(true);
    expect(result.nextCursor).toBe('machine-2');
  });

  it('should still return machines with defaults when TimescaleDB is down', async () => {
    mockTimescale.query.mockRejectedValue(new Error('connection refused'));
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const dbMachine = createMockDbMachine({
      id: 'machine-1',
      tenant_id: 'tenant-1',
      farm_id: 'farm-1',
      name: 'Harvester',
    });
    mockPrisma.machines.findMany.mockResolvedValue([dbMachine]);

    const result = await listMachines(
      mockPrisma as unknown as PrismaClient,
      'tenant-1',
      'farm-1',
      {}
    );

    expect(result.items).toHaveLength(1);
    expect(result.items[0].name).toBe('Harvester');
    expect(result.items[0].totalSteps).toBe('0');
    expect(result.items[0].totalUptimeMs).toBe('0');

    warnSpy.mockRestore();
  });

  it('should hydrate demo machines with sales telemetry even without TimescaleDB stats', async () => {
    const dbMachine = createMockDbMachine({
      id: 'machine-1',
      tenant_id: 'tenant-1',
      farm_id: 'farm-1',
      name: 'SEEDER',
      display_name: 'Demo Seeder',
      device_id: 'demo-seeder-farm-1',
      is_demo: true,
      status: 'online',
    });
    mockPrisma.machines.findMany.mockResolvedValue([dbMachine]);

    const result = await listMachines(
      mockPrisma as unknown as PrismaClient,
      'tenant-1',
      'farm-1',
      {}
    );

    expect(result.items[0]).toEqual(expect.objectContaining({
      isDemo: true,
      status: 'online',
      totalSteps: '74520',
      totalUptimeMs: String(8 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000),
      currentBootUptimeMs: String(2 * 24 * 60 * 60 * 1000 + 5 * 60 * 60 * 1000),
      rebootCount: 1,
      beltFaultCount: 1,
      bladeFaultCount: 0,
      trayCount: 9100,
      beltMotorUptimeMs: String(6 * 24 * 60 * 60 * 1000 + 22 * 60 * 60 * 1000),
      bladeMotorUptimeMs: '0',
      lastEventCode: 'belt_fault_cleared',
      lastEventValue: 0,
    }));
    expect(result.items[0].lastEventAt).toBeInstanceOf(Date);
  });
});
