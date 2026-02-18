import { describe, it, expect, beforeEach } from 'vitest';
import { handleLifecycleEvent } from '../handleLifecycleEvent.js';
import { createMockPrisma, createMockDbMachine, type MockPrismaClient } from '../../../../test/mockPrisma.js';
import type { PrismaClient } from '../../../../generated/prisma/client.js';

describe('handleLifecycleEvent', () => {
  let mockPrisma: MockPrismaClient;
  const timestamp = '2024-06-01T10:00:00.000Z';

  beforeEach(() => {
    mockPrisma = createMockPrisma();
  });

  it('should set status to online on connected event', async () => {
    const machine = createMockDbMachine({ device_id: 'dev-1' });
    mockPrisma.machines.findFirst.mockResolvedValue(machine);
    mockPrisma.machines.update.mockResolvedValue({ ...machine, status: 'online' });

    await handleLifecycleEvent(mockPrisma as unknown as PrismaClient, {
      deviceId: 'dev-1',
      eventType: 'connected',
      timestamp,
    });

    expect(mockPrisma.machines.update).toHaveBeenCalledWith({
      where: { id: machine.id },
      data: { status: 'online', last_seen_at: new Date(timestamp) },
    });
  });

  it('should set status to offline on disconnected event', async () => {
    const machine = createMockDbMachine({ device_id: 'dev-1' });
    mockPrisma.machines.findFirst.mockResolvedValue(machine);
    mockPrisma.machines.update.mockResolvedValue({ ...machine, status: 'offline' });

    await handleLifecycleEvent(mockPrisma as unknown as PrismaClient, {
      deviceId: 'dev-1',
      eventType: 'disconnected',
      timestamp,
    });

    expect(mockPrisma.machines.update).toHaveBeenCalledWith({
      where: { id: machine.id },
      data: { status: 'offline', last_seen_at: new Date(timestamp) },
    });
  });

  it('should throw when machine not found', async () => {
    mockPrisma.machines.findFirst.mockResolvedValue(null);

    await expect(
      handleLifecycleEvent(mockPrisma as unknown as PrismaClient, {
        deviceId: 'nonexistent',
        eventType: 'connected',
        timestamp,
      })
    ).rejects.toThrow('Machine not found: nonexistent');
  });
});
