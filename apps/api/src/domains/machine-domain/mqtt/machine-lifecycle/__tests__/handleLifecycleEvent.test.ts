import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createMockPrisma, createMockDbMachine } from '../../../../../test/mockPrisma.js';

const mockPrisma = createMockPrisma();

vi.mock('../../../../../lib/db/index.js', () => ({
  prisma: mockPrisma,
}));

const { handleLifecycleEvent } = await import('../handleLifecycleEvent.js');

describe('handleLifecycleEvent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should set status to online on connected event', async () => {
    const machine = createMockDbMachine({ device_id: 'dev-1' });
    mockPrisma.machines.findFirst.mockResolvedValue(machine);
    mockPrisma.machines.update.mockResolvedValue({ ...machine, status: 'online' });

    await handleLifecycleEvent({
      clientId: 'dev-1',
      timestamp: 1708473600000,
      eventType: 'connected',
    });

    expect(mockPrisma.machines.update).toHaveBeenCalledWith({
      where: { id: machine.id },
      data: {
        status: 'online',
        last_seen_at: new Date(1708473600000),
        current_wifi_ssid: machine.current_wifi_ssid,
      },
    });
  });

  it('should set status to offline on disconnected event', async () => {
    const machine = createMockDbMachine({ device_id: 'dev-1' });
    mockPrisma.machines.findFirst.mockResolvedValue(machine);
    mockPrisma.machines.update.mockResolvedValue({ ...machine, status: 'offline' });

    await handleLifecycleEvent({
      clientId: 'dev-1',
      timestamp: 1708473600000,
      eventType: 'disconnected',
    });

    expect(mockPrisma.machines.update).toHaveBeenCalledWith({
      where: { id: machine.id },
      data: {
        status: 'offline',
        last_seen_at: new Date(1708473600000),
        current_wifi_ssid: machine.current_wifi_ssid,
      },
    });
  });

  it('should use wifiSsid from payload when provided', async () => {
    const machine = createMockDbMachine({ device_id: 'dev-1', current_wifi_ssid: 'OldSSID' });
    mockPrisma.machines.findFirst.mockResolvedValue(machine);
    mockPrisma.machines.update.mockResolvedValue(machine);

    await handleLifecycleEvent({
      clientId: 'dev-1',
      timestamp: 1708473600000,
      eventType: 'connected',
      wifiSsid: 'NewSSID',
    });

    expect(mockPrisma.machines.update).toHaveBeenCalledWith({
      where: { id: machine.id },
      data: {
        status: 'online',
        last_seen_at: new Date(1708473600000),
        current_wifi_ssid: 'NewSSID',
      },
    });
  });

  it('should silently ignore lifecycle events for unknown devices', async () => {
    mockPrisma.machines.findFirst.mockResolvedValue(null);
    const debugSpy = vi.spyOn(console, 'debug').mockImplementation(() => {});

    await handleLifecycleEvent({
      clientId: 'nonexistent',
      timestamp: 1708473600000,
      eventType: 'connected',
    });

    expect(mockPrisma.machines.update).not.toHaveBeenCalled();
    expect(debugSpy).toHaveBeenCalledWith(expect.stringContaining('nonexistent'));
    debugSpy.mockRestore();
  });
});
