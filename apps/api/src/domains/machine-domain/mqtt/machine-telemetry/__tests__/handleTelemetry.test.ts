import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createMockPrisma, createMockDbMachine } from '../../../../../test/mockPrisma.js';

const mockPrisma = createMockPrisma();

vi.mock('../../../../../lib/db/index.js', () => ({
  prisma: mockPrisma,
}));

const { handleTelemetry } = await import('../handleTelemetry.js');

describe('handleTelemetry', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('status_update schema', () => {
    it('should insert a full status_update row and update last_seen_at', async () => {
      const machine = createMockDbMachine({ device_id: 'dev-1' });
      mockPrisma.machines.findFirst.mockResolvedValue(machine);
      mockPrisma.machine_telemetry.create.mockResolvedValue({});
      mockPrisma.machines.update.mockResolvedValue(machine);

      await handleTelemetry('dev-1', {
        type:           'status_update',
        schema_ver:     2,
        boot_id:        12345,
        seq:            7,
        uptime_ms:      300000,
        delta_steps:    50,
        torque_pct:     40,
        belt_fault:     0,
        blade_fault:    0,
        alert_bits:     0,
        kill_switch:    0,
        cmd_age_ms:     5,
        udp_fail_count: 0,
      });

      expect(mockPrisma.machine_telemetry.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          machine_id:     machine.id,
          received_at:    expect.any(Date),
          type:           'status_update',
          schema_ver:     2,
          boot_id:        BigInt(12345),
          seq:            7,
          uptime_ms:      BigInt(300000),
          delta_steps:    50,
          torque_pct:     40,
          belt_fault:     0,
          blade_fault:    0,
          kill_switch:    0,
          cmd_age_ms:     5,
          udp_fail_count: 0,
          event_code:     null,
          event_value:    null,
        }),
      });

      expect(mockPrisma.machines.update).toHaveBeenCalledWith({
        where: { id: machine.id },
        data: expect.objectContaining({ last_seen_at: expect.any(Date) }),
      });
    });
  });

  describe('event schema', () => {
    it('should insert an event row with event_code and event_value', async () => {
      const machine = createMockDbMachine({ device_id: 'dev-2' });
      mockPrisma.machines.findFirst.mockResolvedValue(machine);
      mockPrisma.machine_telemetry.create.mockResolvedValue({});
      mockPrisma.machines.update.mockResolvedValue(machine);

      await handleTelemetry('dev-2', {
        type:        'event',
        schema_ver:  2,
        boot_id:     12345,
        seq:         8,
        uptime_ms:   310000,
        event_code:  'blade_fault_cleared',
        event_value: 0,
      });

      expect(mockPrisma.machine_telemetry.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          machine_id:  machine.id,
          type:        'event',
          uptime_ms:   BigInt(310000),
          event_code:  'blade_fault_cleared',
          event_value: 0,
        }),
      });

      // Events do not touch aggregate columns
      expect(mockPrisma.machines.update).toHaveBeenCalledWith({
        where: { id: machine.id },
        data: { last_seen_at: expect.any(Date) },
      });
    });
  });

  describe('unknown / legacy types', () => {
    it('should warn and skip insert for an unknown type', async () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      await handleTelemetry('dev-3', {
        type: 'heartbeat_legacy',
        uptime_ms: 100,
      });

      expect(mockPrisma.machines.findFirst).not.toHaveBeenCalled();
      expect(mockPrisma.machine_telemetry.create).not.toHaveBeenCalled();
      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('heartbeat_legacy'));

      warnSpy.mockRestore();
    });

    it('should warn and skip insert when type is missing', async () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      await handleTelemetry('dev-3', {});

      expect(mockPrisma.machine_telemetry.create).not.toHaveBeenCalled();
      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('undefined'));

      warnSpy.mockRestore();
    });
  });

  describe('machine not found', () => {
    it('should warn and return without inserting when machine is not found', async () => {
      mockPrisma.machines.findFirst.mockResolvedValue(null);
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      await handleTelemetry('nonexistent', { type: 'status_update' });

      expect(mockPrisma.machine_telemetry.create).not.toHaveBeenCalled();
      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('nonexistent'));

      warnSpy.mockRestore();
    });
  });

  describe('aggregate: steps', () => {
    it('should accumulate total_steps across readings', async () => {
      const machine = createMockDbMachine({
        device_id: 'dev-steps',
        total_steps: BigInt(100),
      });
      mockPrisma.machines.findFirst.mockResolvedValue(machine);
      mockPrisma.machine_telemetry.create.mockResolvedValue({});
      mockPrisma.machines.update.mockResolvedValue(machine);

      await handleTelemetry('dev-steps', {
        type:        'status_update',
        delta_steps: 50,
      });

      expect(mockPrisma.machines.update).toHaveBeenCalledWith({
        where: { id: machine.id },
        data: expect.objectContaining({
          total_steps: BigInt(150),
        }),
      });
    });

    it('should not include total_steps in update when delta_steps is absent', async () => {
      const machine = createMockDbMachine({ device_id: 'dev-nosteps' });
      mockPrisma.machines.findFirst.mockResolvedValue(machine);
      mockPrisma.machine_telemetry.create.mockResolvedValue({});
      mockPrisma.machines.update.mockResolvedValue(machine);

      await handleTelemetry('dev-nosteps', { type: 'status_update' });

      const updateCall = mockPrisma.machines.update.mock.calls[0][0];
      expect(updateCall.data).not.toHaveProperty('total_steps');
    });
  });

  describe('aggregate: boot / uptime tracking', () => {
    it('first boot: sets current_boot_id and current_boot_uptime_ms, does not increment reboot_count', async () => {
      const machine = createMockDbMachine({
        device_id:      'dev-boot1',
        current_boot_id: null, // no prior boot
      });
      mockPrisma.machines.findFirst.mockResolvedValue(machine);
      mockPrisma.machine_telemetry.create.mockResolvedValue({});
      mockPrisma.machines.update.mockResolvedValue(machine);

      await handleTelemetry('dev-boot1', {
        type:      'status_update',
        boot_id:   100,
        uptime_ms: 5000,
      });

      expect(mockPrisma.machines.update).toHaveBeenCalledWith({
        where: { id: machine.id },
        data: expect.objectContaining({
          current_boot_id:        BigInt(100),
          current_boot_uptime_ms: BigInt(5000),
          total_uptime_ms:        BigInt(0),  // 0 + 0 (no prior session)
          reboot_count:           0,           // current_boot_id was null → don't count
        }),
      });
    });

    it('same boot: advances current_boot_uptime_ms to the higher value', async () => {
      const machine = createMockDbMachine({
        device_id:             'dev-boot-same',
        current_boot_id:       BigInt(100),
        current_boot_uptime_ms: BigInt(3000),
      });
      mockPrisma.machines.findFirst.mockResolvedValue(machine);
      mockPrisma.machine_telemetry.create.mockResolvedValue({});
      mockPrisma.machines.update.mockResolvedValue(machine);

      await handleTelemetry('dev-boot-same', {
        type:      'status_update',
        boot_id:   100,
        uptime_ms: 5000,
      });

      expect(mockPrisma.machines.update).toHaveBeenCalledWith({
        where: { id: machine.id },
        data: expect.objectContaining({
          current_boot_uptime_ms: BigInt(5000),
        }),
      });

      // Should NOT archive total_uptime_ms or bump reboot_count
      const updateData = mockPrisma.machines.update.mock.calls[0][0].data;
      expect(updateData).not.toHaveProperty('total_uptime_ms');
      expect(updateData).not.toHaveProperty('reboot_count');
    });

    it('same boot: does not advance current_boot_uptime_ms when new value is lower', async () => {
      const machine = createMockDbMachine({
        device_id:              'dev-boot-noadvance',
        current_boot_id:        BigInt(100),
        current_boot_uptime_ms: BigInt(8000),
      });
      mockPrisma.machines.findFirst.mockResolvedValue(machine);
      mockPrisma.machine_telemetry.create.mockResolvedValue({});
      mockPrisma.machines.update.mockResolvedValue(machine);

      await handleTelemetry('dev-boot-noadvance', {
        type:      'status_update',
        boot_id:   100,
        uptime_ms: 3000, // lower than current high-water mark
      });

      expect(mockPrisma.machines.update).toHaveBeenCalledWith({
        where: { id: machine.id },
        data: expect.objectContaining({
          current_boot_uptime_ms: BigInt(8000), // unchanged
        }),
      });
    });

    it('reboot detected: archives previous session into total_uptime_ms and increments reboot_count', async () => {
      const machine = createMockDbMachine({
        device_id:              'dev-reboot',
        current_boot_id:        BigInt(100),
        current_boot_uptime_ms: BigInt(5000),
        total_uptime_ms:        BigInt(10000),
        reboot_count:           2,
      });
      mockPrisma.machines.findFirst.mockResolvedValue(machine);
      mockPrisma.machine_telemetry.create.mockResolvedValue({});
      mockPrisma.machines.update.mockResolvedValue(machine);

      await handleTelemetry('dev-reboot', {
        type:      'status_update',
        boot_id:   200, // different from current_boot_id (100)
        uptime_ms: 1000,
      });

      expect(mockPrisma.machines.update).toHaveBeenCalledWith({
        where: { id: machine.id },
        data: expect.objectContaining({
          total_uptime_ms:        BigInt(15000), // 10000 + 5000
          current_boot_id:        BigInt(200),
          current_boot_uptime_ms: BigInt(1000),
          reboot_count:           3,             // was 2, current_boot_id was set → +1
        }),
      });
    });
  });

  describe('aggregate: fault onset detection', () => {
    it('belt fault 0→1: increments belt_fault_count and updates last_belt_fault', async () => {
      const machine = createMockDbMachine({
        device_id:       'dev-belt-onset',
        last_belt_fault: 0,
        belt_fault_count: 3,
      });
      mockPrisma.machines.findFirst.mockResolvedValue(machine);
      mockPrisma.machine_telemetry.create.mockResolvedValue({});
      mockPrisma.machines.update.mockResolvedValue(machine);

      await handleTelemetry('dev-belt-onset', {
        type:       'status_update',
        belt_fault: 1,
      });

      expect(mockPrisma.machines.update).toHaveBeenCalledWith({
        where: { id: machine.id },
        data: expect.objectContaining({
          belt_fault_count: 4,
          last_belt_fault:  1,
        }),
      });
    });

    it('belt fault stays at 1: does not double-count', async () => {
      const machine = createMockDbMachine({
        device_id:        'dev-belt-stay',
        last_belt_fault:  1,
        belt_fault_count: 4,
      });
      mockPrisma.machines.findFirst.mockResolvedValue(machine);
      mockPrisma.machine_telemetry.create.mockResolvedValue({});
      mockPrisma.machines.update.mockResolvedValue(machine);

      await handleTelemetry('dev-belt-stay', {
        type:       'status_update',
        belt_fault: 1,
      });

      const updateData = mockPrisma.machines.update.mock.calls[0][0].data;
      // No onset (1→1), so belt_fault_count is not written into the update
      expect(updateData).not.toHaveProperty('belt_fault_count');
      // last_belt_fault is always updated when the field is present
      expect(updateData).toHaveProperty('last_belt_fault', 1);
    });

    it('blade fault 0→1: increments blade_fault_count', async () => {
      const machine = createMockDbMachine({
        device_id:        'dev-blade-onset',
        last_blade_fault: 0,
        blade_fault_count: 1,
      });
      mockPrisma.machines.findFirst.mockResolvedValue(machine);
      mockPrisma.machine_telemetry.create.mockResolvedValue({});
      mockPrisma.machines.update.mockResolvedValue(machine);

      await handleTelemetry('dev-blade-onset', {
        type:        'status_update',
        blade_fault: 1,
      });

      expect(mockPrisma.machines.update).toHaveBeenCalledWith({
        where: { id: machine.id },
        data: expect.objectContaining({
          blade_fault_count: 2,
          last_blade_fault:  1,
        }),
      });
    });

    it('machines without blade sensor: omitting blade_fault leaves blade_fault_count untouched', async () => {
      const machine = createMockDbMachine({
        device_id:        'dev-no-blade',
        blade_fault_count: 0,
        last_blade_fault: 0,
      });
      mockPrisma.machines.findFirst.mockResolvedValue(machine);
      mockPrisma.machine_telemetry.create.mockResolvedValue({});
      mockPrisma.machines.update.mockResolvedValue(machine);

      await handleTelemetry('dev-no-blade', {
        type:       'status_update',
        belt_fault: 0,
        // blade_fault intentionally absent
      });

      const updateData = mockPrisma.machines.update.mock.calls[0][0].data;
      expect(updateData).not.toHaveProperty('blade_fault_count');
      expect(updateData).not.toHaveProperty('last_blade_fault');
    });
  });

  describe('aggregate: event type does not update aggregates', () => {
    it('event rows only carry last_seen_at in the machines update', async () => {
      const machine = createMockDbMachine({
        device_id:   'dev-event-agg',
        total_steps: BigInt(999),
        reboot_count: 5,
      });
      mockPrisma.machines.findFirst.mockResolvedValue(machine);
      mockPrisma.machine_telemetry.create.mockResolvedValue({});
      mockPrisma.machines.update.mockResolvedValue(machine);

      await handleTelemetry('dev-event-agg', {
        type:        'event',
        boot_id:     42,
        uptime_ms:   1000,
        delta_steps: 10,
        event_code:  'some_event',
        event_value: 1,
      });

      const updateData = mockPrisma.machines.update.mock.calls[0][0].data;
      expect(Object.keys(updateData)).toEqual(['last_seen_at']);
    });
  });
});
