import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { TRPCError } from '@trpc/server';
import { createMockDbMachine, createMockPrisma, type MockPrismaClient } from '../../../../test/mockPrisma.js';
import { mockTimescale } from '../../../../test/mockTimescale.js';
import type { PrismaClient } from '../../../../generated/prisma/client.js';

vi.mock('../../../../lib/db/timescale.js', () => ({
  timescale: mockTimescale,
}));

const { getMachineAnalytics } = await import('../getMachineAnalytics.js');

describe('getMachineAnalytics', () => {
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

  it('rejects machines outside the current farm and tenant scope', async () => {
    mockPrisma.machines.findFirst.mockResolvedValue(null);

    await expect(getMachineAnalytics(
      mockPrisma as unknown as PrismaClient,
      '11111111-1111-1111-1111-111111111111',
      'tenant-1',
      'farm-1',
      '7d'
    )).rejects.toBeInstanceOf(TRPCError);

    expect(mockPrisma.machines.findFirst).toHaveBeenCalledWith(expect.objectContaining({
      where: {
        id: '11111111-1111-1111-1111-111111111111',
        tenant_id: 'tenant-1',
        farm_id: 'farm-1',
      },
    }));
  });

  it('uses one-hour buckets for the default seven-day range', async () => {
    mockPrisma.machines.findFirst.mockResolvedValue(createMockDbMachine({
      id: '11111111-1111-1111-1111-111111111111',
      tenant_id: 'tenant-1',
      farm_id: 'farm-1',
    }));
    mockTimescale.query
      .mockResolvedValueOnce({
        rows: [{
          bucket: new Date('2026-04-28T11:00:00.000Z'),
          steps: '120',
          trays: '8',
          avg_torque_pct: '55.5',
          max_torque_pct: '70',
          avg_cmd_age_ms: '44',
          max_udp_fail_count: '2',
          kill_switch_count: '0',
          alert_count: '1',
          belt_fault_count: '0',
          blade_fault_count: '1',
          belt_motor_delta_ms: '600000',
          blade_motor_delta_ms: '300000',
          roller_motor_delta_ms: '0',
        }],
      })
      .mockResolvedValueOnce({ rows: [] });

    const result = await getMachineAnalytics(
      mockPrisma as unknown as PrismaClient,
      '11111111-1111-1111-1111-111111111111',
      'tenant-1',
      'farm-1',
      '7d'
    );

    expect(result.bucket).toBe('1 hour');
    expect(result.source).toBe('aggregate');
    expect(result.summary.totalSteps).toBe(120);
    expect(result.summary.totalTrays).toBe(8);
    expect(mockTimescale.query).toHaveBeenNthCalledWith(
      1,
      expect.stringContaining('FROM machine_analytics_5m'),
      [
        '11111111-1111-1111-1111-111111111111',
        new Date('2026-04-21T12:00:00.000Z'),
        '1 hour',
        new Date('2026-04-28T12:00:00.000Z'),
      ]
    );
  });

  it('falls back to bounded raw telemetry when the aggregate is unavailable', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    mockPrisma.machines.findFirst.mockResolvedValue(createMockDbMachine({
      id: '11111111-1111-1111-1111-111111111111',
      tenant_id: 'tenant-1',
      farm_id: 'farm-1',
    }));
    mockTimescale.query
      .mockRejectedValueOnce(new Error('relation "machine_analytics_5m" does not exist'))
      .mockResolvedValueOnce({
        rows: [{
          bucket: new Date('2026-04-28T11:55:00.000Z'),
          steps: '12',
          trays: '1',
          avg_torque_pct: null,
          max_torque_pct: null,
          avg_cmd_age_ms: null,
          max_udp_fail_count: null,
          kill_switch_count: '0',
          alert_count: '0',
          belt_fault_count: '0',
          blade_fault_count: '0',
          belt_motor_delta_ms: '120000',
          blade_motor_delta_ms: '0',
          roller_motor_delta_ms: '0',
        }],
      })
      .mockResolvedValueOnce({ rows: [] });

    const result = await getMachineAnalytics(
      mockPrisma as unknown as PrismaClient,
      '11111111-1111-1111-1111-111111111111',
      'tenant-1',
      'farm-1',
      '24h'
    );

    expect(result.source).toBe('raw');
    expect(result.bucket).toBe('5 minutes');
    expect(result.series).toHaveLength(1);
    expect(mockTimescale.query).toHaveBeenNthCalledWith(
      2,
      expect.stringContaining('FROM raw_telemetry'),
      [
        '11111111-1111-1111-1111-111111111111',
        new Date('2026-04-27T12:00:00.000Z'),
        '5 minutes',
        new Date('2026-04-28T12:00:00.000Z'),
      ]
    );

    warnSpy.mockRestore();
  });
});
