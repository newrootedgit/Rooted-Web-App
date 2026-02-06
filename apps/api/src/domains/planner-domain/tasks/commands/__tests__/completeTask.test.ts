import { describe, it, expect, beforeEach } from 'vitest';
import { completeTask } from '../completeTask.js';
import {
  createMockPrisma,
  createMockDbTask,
  type MockPrismaClient,
} from '../../../../../test/mockPrisma.js';
import type { PrismaClient } from '../../../../../generated/prisma/client.js';

describe('completeTask', () => {
  let mockPrisma: MockPrismaClient;
  const farmId = 'farm-uuid-1';

  beforeEach(() => {
    mockPrisma = createMockPrisma();
  });

  it('should complete a task with optional fields', async () => {
    mockPrisma.tasks.findFirst.mockResolvedValue(createMockDbTask({ status: 'TODO' }));
    const updated = createMockDbTask({ status: 'COMPLETED', actual_trays: 3, seed_lot: 'LOT-A' });
    mockPrisma.tasks.update.mockResolvedValue(updated);

    const result = await completeTask(mockPrisma as unknown as PrismaClient, farmId, {
      id: 'task-uuid-1',
      actualTrays: 3,
      seedLot: 'LOT-A',
      completionNotes: 'Done',
    });

    expect(result.status).toBe('COMPLETED');
    expect(result.actualTrays).toBe(3);
    expect(mockPrisma.tasks.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          status: 'COMPLETED',
          actual_trays: 3,
          seed_lot: 'LOT-A',
          completion_notes: 'Done',
        }),
      })
    );
  });

  it('should throw NOT_FOUND for nonexistent task', async () => {
    mockPrisma.tasks.findFirst.mockResolvedValue(null);

    await expect(
      completeTask(mockPrisma as unknown as PrismaClient, farmId, { id: 'nonexistent' })
    ).rejects.toThrow('Task not found');
  });

  it('should throw CONFLICT if already completed', async () => {
    mockPrisma.tasks.findFirst.mockResolvedValue(createMockDbTask({ status: 'COMPLETED' }));

    await expect(
      completeTask(mockPrisma as unknown as PrismaClient, farmId, { id: 'task-uuid-1' })
    ).rejects.toThrow('already completed');
  });
});
