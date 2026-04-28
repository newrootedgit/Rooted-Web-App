import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createMockPrisma, createMockDbMachine, type MockPrismaClient } from '../../../../test/mockPrisma.js';
import type { PrismaClient } from '../../../../generated/prisma/client.js';

vi.mock('../../../../lib/aws/iot-client.js', () => ({
  publishToDevice: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('../../../../lib/aws/variable-ranges-cache.js', () => ({
  getVariableRanges: vi.fn().mockReturnValue(null),
  storeVariableRanges: vi.fn(),
}));

const { publishToDevice } = await import('../../../../lib/aws/iot-client.js');
const { getVariableRanges } = await import('../../../../lib/aws/variable-ranges-cache.js');
const { getConfigResponse } = await import('../machine-presets/getConfigResponse.js');
const { updateMachineConfig } = await import('../machine-presets/updateMachineConfig.js');

const mockGetVariableRanges = getVariableRanges as ReturnType<typeof vi.fn>;

const SAMPLE_RANGES = {
  speed: { min: 0, max: 500 },
  blade_height: { min: 1, max: 100 },
};

describe('updateMachineConfig', () => {
  let mockPrisma: MockPrismaClient;

  beforeEach(() => {
    mockPrisma = createMockPrisma();
    vi.clearAllMocks();
  });

  it('should publish update_presets with presets payload when ranges are cached', async () => {
    const machine = createMockDbMachine({ id: 'machine-1', tenant_id: 'tenant-1', device_id: 'dev-1', status: 'online' });
    mockPrisma.machines.findFirst.mockResolvedValue(machine);
    mockGetVariableRanges.mockReturnValue(SAMPLE_RANGES);

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

  // --- Range validation tests ---

  it('should throw PRECONDITION_FAILED when ranges cache is cold and presets are provided', async () => {
    const machine = createMockDbMachine({ id: 'machine-1', tenant_id: 'tenant-1', device_id: 'dev-1', status: 'online' });
    mockPrisma.machines.findFirst.mockResolvedValue(machine);
    mockGetVariableRanges.mockReturnValue(null);

    await expect(
      updateMachineConfig(mockPrisma as unknown as PrismaClient, 'machine-1', 'tenant-1', {
        presets: { '1': { speed: 100 } },
      })
    ).rejects.toThrow('Variable ranges not loaded');

    expect(publishToDevice).not.toHaveBeenCalled();
  });

  it('should reject preset values outside allowed range', async () => {
    const machine = createMockDbMachine({ id: 'machine-1', tenant_id: 'tenant-1', device_id: 'dev-1', status: 'online' });
    mockPrisma.machines.findFirst.mockResolvedValue(machine);
    mockGetVariableRanges.mockReturnValue(SAMPLE_RANGES);

    await expect(
      updateMachineConfig(mockPrisma as unknown as PrismaClient, 'machine-1', 'tenant-1', {
        presets: { '1': { speed: 9999 } },
      })
    ).rejects.toThrow('out of range');

    expect(publishToDevice).not.toHaveBeenCalled();
  });

  it('should allow variety_names-only updates without range check', async () => {
    const machine = createMockDbMachine({ id: 'machine-1', tenant_id: 'tenant-1', device_id: 'dev-1', status: 'online' });
    mockPrisma.machines.findFirst.mockResolvedValue(machine);
    mockGetVariableRanges.mockReturnValue(null); // no cached ranges

    const result = await updateMachineConfig(
      mockPrisma as unknown as PrismaClient,
      'machine-1',
      'tenant-1',
      { variety_names: { '1': 'Basil' } }
    );

    expect(result.requestId).toBeDefined();
    expect(publishToDevice).toHaveBeenCalled();
  });

  it('should accept preset values within allowed range', async () => {
    const machine = createMockDbMachine({ id: 'machine-1', tenant_id: 'tenant-1', device_id: 'dev-1', status: 'online' });
    mockPrisma.machines.findFirst.mockResolvedValue(machine);
    mockGetVariableRanges.mockReturnValue(SAMPLE_RANGES);

    const result = await updateMachineConfig(
      mockPrisma as unknown as PrismaClient,
      'machine-1',
      'tenant-1',
      { presets: { '1': { speed: 250, blade_height: 50 } } }
    );

    expect(result.requestId).toBeDefined();
    expect(publishToDevice).toHaveBeenCalled();
  });

  it('should update demo config without publishing for demo machines', async () => {
    const demoMachine = createMockDbMachine({
      id: 'machine-1',
      tenant_id: 'tenant-1',
      device_id: 'demo-machine-1',
      status: 'online',
      is_demo: true,
      demo_config: {
        ready_to_run: true,
        active_variety: 1,
        variable_ranges: SAMPLE_RANGES,
        variety_names: { '1': 'Sunflower' },
        '1': { speed: 100 },
      },
    });
    mockPrisma.machines.findFirst.mockResolvedValue(demoMachine);

    const result = await updateMachineConfig(
      mockPrisma as unknown as PrismaClient,
      'machine-1',
      'tenant-1',
      {
        presets: { '1': { speed: 250 } },
        variety_names: { '1': 'Radish' },
      }
    );

    expect(publishToDevice).not.toHaveBeenCalled();
    expect(mockPrisma.machines.update).toHaveBeenCalledWith({
      where: { id: 'machine-1' },
      data: {
        demo_config: expect.objectContaining({
          variety_names: { '1': 'Radish' },
          '1': { speed: 250 },
        }),
      },
    });
    expect(getConfigResponse(result.requestId)).toEqual({
      status: 'received',
      success: true,
      config: undefined,
    });
  });
});
