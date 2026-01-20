import { describe, it, expect, beforeEach } from 'vitest';
import { createOrUpdateMachine } from '../createOrUpdateMachine.js';
import { createMockPrisma, createMockDbMachine, type MockPrismaClient } from '../../../test/mockPrisma.js';
import type { PrismaClient } from '../../../generated/prisma/client.js';

describe('createOrUpdateMachine', () => {
  let mockPrisma: MockPrismaClient;

  beforeEach(() => {
    mockPrisma = createMockPrisma();
  });

  it('should create new machine when deviceId does not exist', async () => {
    // Device not found
    mockPrisma.machines.findFirst.mockResolvedValue(null);

    // Created machine
    const createdMachine = createMockDbMachine({
      id: 'new-machine-id',
      tenant_id: 'tenant-1',
      farm_id: 'farm-1',
      name: 'New Machine',
      device_id: 'new-device',
    });
    mockPrisma.machines.create.mockResolvedValue(createdMachine);

    const result = await createOrUpdateMachine(
      mockPrisma as unknown as PrismaClient,
      { name: 'New Machine', deviceId: 'new-device' },
      'tenant-1',
      'farm-1'
    );

    expect(mockPrisma.machines.create).toHaveBeenCalledWith({
      data: {
        tenant_id: 'tenant-1',
        farm_id: 'farm-1',
        name: 'New Machine',
        device_id: 'new-device',
      },
    });
    expect(mockPrisma.machines.update).not.toHaveBeenCalled();
    expect(result).toEqual({
      id: 'new-machine-id',
      tenantId: 'tenant-1',
      farmId: 'farm-1',
      name: 'New Machine',
      deviceId: 'new-device',
      createdAt: createdMachine.created_at,
    });
  });

  it('should update existing machine when deviceId exists', async () => {
    // Device found
    const existingMachine = createMockDbMachine({
      id: 'existing-id',
      device_id: 'existing-device',
      name: 'Old Name',
    });
    mockPrisma.machines.findFirst.mockResolvedValue(existingMachine);

    // Updated machine
    const updatedMachine = createMockDbMachine({
      id: 'existing-id',
      tenant_id: 'tenant-2',
      farm_id: 'farm-2',
      name: 'Updated Name',
      device_id: 'existing-device',
    });
    mockPrisma.machines.update.mockResolvedValue(updatedMachine);

    const result = await createOrUpdateMachine(
      mockPrisma as unknown as PrismaClient,
      { name: 'Updated Name', deviceId: 'existing-device' },
      'tenant-2',
      'farm-2'
    );

    expect(mockPrisma.machines.update).toHaveBeenCalledWith({
      where: { id: 'existing-id' },
      data: {
        name: 'Updated Name',
        tenant_id: 'tenant-2',
        farm_id: 'farm-2',
      },
    });
    expect(mockPrisma.machines.create).not.toHaveBeenCalled();
    expect(result.name).toBe('Updated Name');
  });

  it('should associate machine with correct tenant and farm', async () => {
    mockPrisma.machines.findFirst.mockResolvedValue(null);
    const createdMachine = createMockDbMachine({
      tenant_id: 'specific-tenant',
      farm_id: 'specific-farm',
    });
    mockPrisma.machines.create.mockResolvedValue(createdMachine);

    const result = await createOrUpdateMachine(
      mockPrisma as unknown as PrismaClient,
      { name: 'Test', deviceId: 'dev-1' },
      'specific-tenant',
      'specific-farm'
    );

    expect(result.tenantId).toBe('specific-tenant');
    expect(result.farmId).toBe('specific-farm');
  });

  it('should create machine with null farmId', async () => {
    mockPrisma.machines.findFirst.mockResolvedValue(null);
    const createdMachine = createMockDbMachine({
      id: 'new-machine-id',
      tenant_id: 'tenant-1',
      farm_id: null,
      name: 'No Farm Machine',
      device_id: 'device-123',
    });
    mockPrisma.machines.create.mockResolvedValue(createdMachine);

    const result = await createOrUpdateMachine(
      mockPrisma as unknown as PrismaClient,
      { name: 'No Farm Machine', deviceId: 'device-123' },
      'tenant-1',
      null
    );

    expect(mockPrisma.machines.create).toHaveBeenCalledWith({
      data: {
        tenant_id: 'tenant-1',
        farm_id: null,
        name: 'No Farm Machine',
        device_id: 'device-123',
      },
    });
    expect(result.farmId).toBeNull();
  });

  it('should return properly formatted Machine object', async () => {
    mockPrisma.machines.findFirst.mockResolvedValue(null);
    const createdAt = new Date('2024-06-15T10:00:00Z');
    const dbMachine = createMockDbMachine({
      id: 'uuid-123',
      tenant_id: 'tenant-abc',
      farm_id: 'farm-xyz',
      name: 'Formatted Machine',
      device_id: 'device-456',
      created_at: createdAt,
    });
    mockPrisma.machines.create.mockResolvedValue(dbMachine);

    const result = await createOrUpdateMachine(
      mockPrisma as unknown as PrismaClient,
      { name: 'Formatted Machine', deviceId: 'device-456' },
      'tenant-abc',
      'farm-xyz'
    );

    // Verify camelCase transformation
    expect(result).toEqual({
      id: 'uuid-123',
      tenantId: 'tenant-abc',
      farmId: 'farm-xyz',
      name: 'Formatted Machine',
      deviceId: 'device-456',
      createdAt: createdAt,
    });
  });
});
