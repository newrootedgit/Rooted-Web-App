import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createMockPrisma, createMockDbMachine, type MockPrismaClient } from '../../../../test/mockPrisma.js';
import type { PrismaClient } from '../../../../generated/prisma/client.js';

vi.mock('../../../../lib/aws/iot-client.js', () => ({
  publishToDevice: vi.fn().mockResolvedValue(undefined),
}));

const { publishToDevice } = await import('../../../../lib/aws/iot-client.js');
const { updateMachineConfig } = await import('../updateMachineConfig.js');

describe('updateMachineConfig', () => {
  let mockPrisma: MockPrismaClient;

  beforeEach(() => {
    mockPrisma = createMockPrisma();
    vi.clearAllMocks();
  });

  it('should publish update_presets with presets payload', async () => {
    const machine = createMockDbMachine({ id: 'machine-1', tenant_id: 'tenant-1', device_id: 'dev-1', status: 'online' });
    mockPrisma.machines.findFirst.mockResolvedValue(machine);

    const presets = { '1': { speed: 100 } };
    const result = await updateMachineConfig(
      mockPrisma as unknown as PrismaClient,
      'machine-1',
      'tenant-1',
      { presets }
    );

    expect(result.requestId).toMatch(/^[0-9a-f-]{36}$/);
    expect(publishToDevice).toHaveBeenCalledWith('dev-1', expect.objectContaining({
      action: 'update_presets',
      requestId: result.requestId,
      presets,
    }));
  });

  it('should publish update_presets with variety_names payload', async () => {
    const machine = createMockDbMachine({ id: 'machine-1', tenant_id: 'tenant-1', device_id: 'dev-1', status: 'online' });
    mockPrisma.machines.findFirst.mockResolvedValue(machine);

    const variety_names = { '1': 'Sunflower', '2': 'Radish' };
    const result = await updateMachineConfig(
      mockPrisma as unknown as PrismaClient,
      'machine-1',
      'tenant-1',
      { variety_names }
    );

    expect(publishToDevice).toHaveBeenCalledWith('dev-1', expect.objectContaining({
      action: 'update_presets',
      variety_names,
    }));
    expect(result.requestId).toBeDefined();
  });

  it('should not include presets key when not provided', async () => {
    const machine = createMockDbMachine({ id: 'machine-1', tenant_id: 'tenant-1', device_id: 'dev-1', status: 'online' });
    mockPrisma.machines.findFirst.mockResolvedValue(machine);

    await updateMachineConfig(mockPrisma as unknown as PrismaClient, 'machine-1', 'tenant-1', {});

    const payload = (publishToDevice as ReturnType<typeof vi.fn>).mock.calls[0][1];
    expect(payload).not.toHaveProperty('presets');
    expect(payload).not.toHaveProperty('variety_names');
  });

  it('should throw NOT_FOUND when machine does not exist', async () => {
    mockPrisma.machines.findFirst.mockResolvedValue(null);

    await expect(
      updateMachineConfig(mockPrisma as unknown as PrismaClient, 'nonexistent', 'tenant-1', {})
    ).rejects.toThrow('Machine not found');

    expect(publishToDevice).not.toHaveBeenCalled();
  });

  it('should not check online status in dev/test environment', async () => {
    const offlineMachine = createMockDbMachine({ id: 'machine-1', tenant_id: 'tenant-1', device_id: 'dev-1', status: 'offline' });
    mockPrisma.machines.findFirst.mockResolvedValue(offlineMachine);

    await expect(
      updateMachineConfig(mockPrisma as unknown as PrismaClient, 'machine-1', 'tenant-1', {})
    ).resolves.toHaveProperty('requestId');
  });
});
