import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createMockPrisma, createMockDbMachine } from '../../../../../test/mockPrisma.js';
import { mockTimescale, mockTimescaleClient } from '../../../../../test/mockTimescale.js';

const mockPrisma = createMockPrisma();

vi.mock('../../../../../lib/db/index.js', () => ({
  prisma: mockPrisma,
}));

vi.mock('../../../../../lib/db/timescale.js', () => ({
  timescale: mockTimescale,
}));

const { handleTelemetry } = await import('../handleTelemetry.js');

describe('handleTelemetry', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockTimescale.connect.mockResolvedValue(mockTimescaleClient);
  });

  describe('status_update schema', () => {
    it('should insert into TimescaleDB and update last_seen_at on RDS', async () => {
      const machine = createMockDbMachine({ device_id: 'dev-1' });
      mockPrisma.machines.findFirst.mockResolvedValue(machine);
      mockPrisma.machines.update.mockResolvedValue(machine);
      mockTimescaleClient.query.mockResolvedValue({ rows: [] });

      await handleTelemetry('dev-1', [{
        type:           'status_update',
        schema_ver:     2,
        boot_id:        12345,
        seq:            7,
        uptime_ms:      300000,
        belt_motor_uptime_ms: 150000,
        blade_motor_uptime_ms: 120000,
        delta_steps:    50,
        torque_pct:     40,
        belt_fault:     0,
        blade_fault:    0,
        alert_bits:     0,
        kill_switch:    0,
        cmd_age_ms:     5,
        udp_fail_count: 0,
      }]);

      // TimescaleDB INSERT called
      expect(mockTimescaleClient.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO raw_telemetry'),
        expect.arrayContaining([machine.id, null, expect.any(Date), 'status_update'])
      );

      // Client released
      expect(mockTimescaleClient.release).toHaveBeenCalled();

      // RDS last_seen_at updated
      expect(mockPrisma.machines.update).toHaveBeenCalledWith({
        where: { id: machine.id },
        data: { last_seen_at: expect.any(Date) },
      });
    });
  });

  describe('fault routing', () => {
    it('should insert belt_fault into machine_faults when belt_fault > 0', async () => {
      const machine = createMockDbMachine({ device_id: 'dev-belt' });
      mockPrisma.machines.findFirst.mockResolvedValue(machine);
      mockPrisma.machines.update.mockResolvedValue(machine);
      mockPrisma.machine_faults.createMany.mockResolvedValue({ count: 1 });
      mockTimescaleClient.query.mockResolvedValue({ rows: [] });

      await handleTelemetry('dev-belt', [{
        type: 'status_update',
        belt_fault: 1,
        blade_fault: 0,
      }]);

      expect(mockPrisma.machine_faults.createMany).toHaveBeenCalledWith({
        data: [expect.objectContaining({
          machine_id: machine.id,
          fault_type: 'belt_fault',
          fault_value: 1,
        })],
      });
    });

    it('should insert blade_fault into machine_faults when blade_fault > 0', async () => {
      const machine = createMockDbMachine({ device_id: 'dev-blade' });
      mockPrisma.machines.findFirst.mockResolvedValue(machine);
      mockPrisma.machines.update.mockResolvedValue(machine);
      mockPrisma.machine_faults.createMany.mockResolvedValue({ count: 1 });
      mockTimescaleClient.query.mockResolvedValue({ rows: [] });

      await handleTelemetry('dev-blade', [{
        type: 'status_update',
        belt_fault: 0,
        blade_fault: 2,
      }]);

      expect(mockPrisma.machine_faults.createMany).toHaveBeenCalledWith({
        data: [expect.objectContaining({
          machine_id: machine.id,
          fault_type: 'blade_fault',
          fault_value: 2,
        })],
      });
    });

    it('should not insert faults when both are 0', async () => {
      const machine = createMockDbMachine({ device_id: 'dev-nofault' });
      mockPrisma.machines.findFirst.mockResolvedValue(machine);
      mockPrisma.machines.update.mockResolvedValue(machine);
      mockTimescaleClient.query.mockResolvedValue({ rows: [] });

      await handleTelemetry('dev-nofault', [{
        type: 'status_update',
        belt_fault: 0,
        blade_fault: 0,
      }]);

      expect(mockPrisma.machine_faults.createMany).not.toHaveBeenCalled();
    });
  });

  describe('Pi timestamp (received_at)', () => {
    it('should use Pi-side received_at for TimescaleDB insert', async () => {
      const machine = createMockDbMachine({ device_id: 'dev-ts' });
      mockPrisma.machines.findFirst.mockResolvedValue(machine);
      mockPrisma.machines.update.mockResolvedValue(machine);
      mockTimescaleClient.query.mockResolvedValue({ rows: [] });

      const piTimestamp = 1709900000; // epoch seconds

      await handleTelemetry('dev-ts', [{
        type: 'status_update',
        received_at: piTimestamp,
      }]);

      const insertArgs = mockTimescaleClient.query.mock.calls[0][1];
      // received_at is the 3rd parameter (index 2)
      const receivedAtDate = insertArgs[2] as Date;
      expect(receivedAtDate.getTime()).toBe(piTimestamp * 1000);
    });
  });

  describe('event schema', () => {
    it('should insert an event row into TimescaleDB', async () => {
      const machine = createMockDbMachine({ device_id: 'dev-2' });
      mockPrisma.machines.findFirst.mockResolvedValue(machine);
      mockPrisma.machines.update.mockResolvedValue(machine);
      mockTimescaleClient.query.mockResolvedValue({ rows: [] });

      await handleTelemetry('dev-2', [{
        type:        'event',
        schema_ver:  2,
        boot_id:     12345,
        seq:         8,
        uptime_ms:   310000,
        event_code:  'blade_fault_cleared',
        event_value: 0,
      }]);

      expect(mockTimescaleClient.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO raw_telemetry'),
        expect.arrayContaining([machine.id])
      );
    });
  });

  describe('unknown / legacy types', () => {
    it('should warn and skip for an unknown type', async () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      await handleTelemetry('dev-3', [{
        type: 'heartbeat_legacy',
        uptime_ms: 100,
      }]);

      expect(mockPrisma.machines.findFirst).not.toHaveBeenCalled();
      expect(mockTimescaleClient.query).not.toHaveBeenCalled();
      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('no valid types'));

      warnSpy.mockRestore();
    });
  });

  describe('machine not found', () => {
    it('should warn and return without inserting', async () => {
      mockPrisma.machines.findFirst.mockResolvedValue(null);
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      await handleTelemetry('nonexistent', [{ type: 'status_update' }]);

      expect(mockTimescaleClient.query).not.toHaveBeenCalled();
      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('nonexistent'));

      warnSpy.mockRestore();
    });
  });

  describe('batch processing', () => {
    it('should insert each valid payload into TimescaleDB', async () => {
      const machine = createMockDbMachine({ device_id: 'dev-batch' });
      mockPrisma.machines.findFirst.mockResolvedValue(machine);
      mockPrisma.machines.update.mockResolvedValue(machine);
      mockTimescaleClient.query.mockResolvedValue({ rows: [] });

      await handleTelemetry('dev-batch', [
        { type: 'status_update', delta_steps: 10 },
        { type: 'status_update', delta_steps: 20 },
        { type: 'event', event_code: 'test', event_value: 1 },
      ]);

      // 3 valid payloads = 3 INSERT calls
      expect(mockTimescaleClient.query).toHaveBeenCalledTimes(3);
    });

    it('should handle mixed valid and invalid types', async () => {
      const machine = createMockDbMachine({ device_id: 'dev-mixed' });
      mockPrisma.machines.findFirst.mockResolvedValue(machine);
      mockPrisma.machines.update.mockResolvedValue(machine);
      mockTimescaleClient.query.mockResolvedValue({ rows: [] });

      await handleTelemetry('dev-mixed', [
        { type: 'status_update', delta_steps: 5 },
        { type: 'heartbeat_legacy', uptime_ms: 100 },
        { type: 'event', event_code: 'test', event_value: 1 },
      ]);

      // Only 2 valid payloads inserted
      expect(mockTimescaleClient.query).toHaveBeenCalledTimes(2);
    });
  });

  describe('TimescaleDB failure resilience', () => {
    it('should still update RDS and route faults when TimescaleDB insert fails', async () => {
      const machine = createMockDbMachine({ device_id: 'dev-tsfail' });
      mockPrisma.machines.findFirst.mockResolvedValue(machine);
      mockPrisma.machines.update.mockResolvedValue(machine);
      mockPrisma.machine_faults.createMany.mockResolvedValue({ count: 1 });
      mockTimescaleClient.query.mockRejectedValue(new Error('connection refused'));

      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      await handleTelemetry('dev-tsfail', [{
        type: 'status_update',
        belt_fault: 1,
      }]);

      // RDS still updated
      expect(mockPrisma.machines.update).toHaveBeenCalled();
      // Faults still routed
      expect(mockPrisma.machine_faults.createMany).toHaveBeenCalled();
      // Client released even on error
      expect(mockTimescaleClient.release).toHaveBeenCalled();

      errorSpy.mockRestore();
    });
  });
});
