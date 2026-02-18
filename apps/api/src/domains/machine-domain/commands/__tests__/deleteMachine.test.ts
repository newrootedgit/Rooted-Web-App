import { describe, it, expect, beforeEach } from 'vitest';
import { deleteMachine } from '../deleteMachine.js';
import { createMockPrisma, createMockDbMachine, type MockPrismaClient } from '../../../../test/mockPrisma.js';
import type { PrismaClient } from '../../../../generated/prisma/client.js';

describe('deleteMachine', () => {
  let mockPrisma: MockPrismaClient;

  beforeEach(() => {
    mockPrisma = createMockPrisma();
  });

  it('should delete machine and return success', async () => {
    const machine = createMockDbMachine({ device_id: 'dev-1', tenant_id: 'tenant-1' });
    mockPrisma.machines.findFirst.mockResolvedValue(machine);
    mockPrisma.machines.delete.mockResolvedValue(machine);

    const result = await deleteMachine(mockPrisma as unknown as PrismaClient, 'dev-1', 'tenant-1');

    expect(mockPrisma.machines.delete).toHaveBeenCalledWith({ where: { id: machine.id } });
    expect(result).toEqual({ success: true });
  });

  it('should throw NOT_FOUND when machine does not exist', async () => {
    mockPrisma.machines.findFirst.mockResolvedValue(null);

    await expect(
      deleteMachine(mockPrisma as unknown as PrismaClient, 'nonexistent', 'tenant-1')
    ).rejects.toThrow('Machine not found');
  });
});
