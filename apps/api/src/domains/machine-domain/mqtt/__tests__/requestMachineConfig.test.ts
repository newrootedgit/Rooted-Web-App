import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createMockPrisma, createMockDbMachine, type MockPrismaClient } from '../../../../test/mockPrisma.js';
import type { PrismaClient } from '../../../../generated/prisma/client.js';

vi.mock('../../../../lib/aws/iot-client.js', () => ({
  publishToDevice: vi.fn().mockResolvedValue(undefined),
}));

// Import after mock is set up
const { publishToDevice } = await import('../../../../lib/aws/iot-client.js');
const { getConfigResponse } = await import('../machine-presets/getConfigResponse.js');
const { requestMachineConfig } = await import('../machine-presets/requestMachineConfig.js');

describe('requestMachineConfig', () => {
  let mockPrisma: MockPrismaClient;

  beforeEach(() => {
    mockPrisma = createMockPrisma();
    vi.clearAllMocks();
  });

  it('should publish get_presets and return a requestId', async () => {
    const machine = createMockDbMachine({ id: 'machine-1', tenant_id: 'tenant-1', device_id: 'dev-1', status: 'online' });
    mockPrisma.machines.findFirst.mockResolvedValue(machine);

    const result = await requestMachineConfig(mockPrisma as unknown as PrismaClient, 'machine-1', 'tenant-1');

    expect(result.requestId).toMatch(/^[0-9a-f-]{36}$/); // UUID
    expect(publishToDevice).toHaveBeenCalledWith('dev-1', expect.objectContaining({
      action: 'get_presets',
      requestId: result.requestId,
    }));
  });

  it('should throw NOT_FOUND when machine does not exist', async () => {
    mockPrisma.machines.findFirst.mockResolvedValue(null);

    await expect(
      requestMachineConfig(mockPrisma as unknown as PrismaClient, 'nonexistent', 'tenant-1')
    ).rejects.toThrow('Machine not found');

    expect(publishToDevice).not.toHaveBeenCalled();
  });

  it('should not check online status in dev/test environment', async () => {
    const offlineMachine = createMockDbMachine({ id: 'machine-1', tenant_id: 'tenant-1', device_id: 'dev-1', status: 'offline' });
    mockPrisma.machines.findFirst.mockResolvedValue(offlineMachine);

    // Should not throw in non-production
    await expect(
      requestMachineConfig(mockPrisma as unknown as PrismaClient, 'machine-1', 'tenant-1')
    ).resolves.toHaveProperty('requestId');
  });

  it('should return demo config without publishing for demo machines', async () => {
    const demoMachine = createMockDbMachine({
      id: 'machine-1',
      tenant_id: 'tenant-1',
      device_id: 'demo-machine-1',
      status: 'online',
      is_demo: true,
    });
    mockPrisma.machines.findFirst.mockResolvedValue(demoMachine);

    const result = await requestMachineConfig(mockPrisma as unknown as PrismaClient, 'machine-1', 'tenant-1');

    expect(publishToDevice).not.toHaveBeenCalled();
    expect(mockPrisma.machines.update).toHaveBeenCalledWith({
      where: { id: 'machine-1' },
      data: expect.objectContaining({ demo_config: expect.any(Object) }),
    });
    expect(getConfigResponse(result.requestId)).toMatchObject({
      status: 'received',
      config: expect.objectContaining({
        ready_to_run: true,
        active_variety: 1,
      }),
    });
  });
});
