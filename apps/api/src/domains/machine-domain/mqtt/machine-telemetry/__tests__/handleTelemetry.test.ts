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

  it('should insert a telemetry row and update last_seen_at', async () => {
    const machine = createMockDbMachine({ device_id: 'dev-1' });
    mockPrisma.machines.findFirst.mockResolvedValue(machine);
    mockPrisma.machine_telemetry.create.mockResolvedValue({});
    mockPrisma.machines.update.mockResolvedValue(machine);

    await handleTelemetry('dev-1', {
      session_id: 'session-uuid-1',
      uptime_s: 300,
      delta_steps: 50,
    });

    expect(mockPrisma.machine_telemetry.create).toHaveBeenCalledWith({
      data: {
        machine_id: machine.id,
        session_id: 'session-uuid-1',
        received_at: expect.any(Date),
        uptime_s: 300,
        delta_steps: 50,
      },
    });

    expect(mockPrisma.machines.update).toHaveBeenCalledWith({
      where: { id: machine.id },
      data: { last_seen_at: expect.any(Date) },
    });
  });

  it('should warn and return when machine is not found', async () => {
    mockPrisma.machines.findFirst.mockResolvedValue(null);
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    await handleTelemetry('nonexistent', {
      session_id: 'session-uuid-1',
      uptime_s: 100,
      delta_steps: 10,
    });

    expect(mockPrisma.machine_telemetry.create).not.toHaveBeenCalled();
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('nonexistent'));
    warnSpy.mockRestore();
  });
});
