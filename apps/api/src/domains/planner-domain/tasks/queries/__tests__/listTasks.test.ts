import { describe, it, expect, beforeEach } from 'vitest';
import { listTasks } from '../listTasks.js';
import {
  createMockPrisma,
  createMockDbTask,
  type MockPrismaClient,
} from '../../../../../test/mockPrisma.js';
import type { PrismaClient } from '../../../../../generated/prisma/client.js';

describe('listTasks', () => {
  let mockPrisma: MockPrismaClient;
  const farmId = 'farm-uuid-1';

  beforeEach(() => {
    mockPrisma = createMockPrisma();
  });

  it('should return paginated tasks', async () => {
    const tasks = [
      createMockDbTask({ id: 'task-1', type: 'SOAK', due_date: new Date('2024-02-01') }),
      createMockDbTask({ id: 'task-2', type: 'SEED', due_date: new Date('2024-02-02') }),
    ];
    mockPrisma.tasks.findMany.mockResolvedValue(tasks);

    const result = await listTasks(mockPrisma as unknown as PrismaClient, farmId, {});

    expect(result.items).toHaveLength(2);
    expect(result.items[0].type).toBe('SOAK');
    expect(result.hasMore).toBe(false);
  });

  it('should filter by type', async () => {
    mockPrisma.tasks.findMany.mockResolvedValue([]);

    await listTasks(mockPrisma as unknown as PrismaClient, farmId, { type: 'HARVEST' });

    expect(mockPrisma.tasks.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ type: 'HARVEST' }),
      })
    );
  });

  it('should filter by multiple types', async () => {
    mockPrisma.tasks.findMany.mockResolvedValue([]);

    await listTasks(mockPrisma as unknown as PrismaClient, farmId, { types: ['SEED', 'SOAK'] });

    expect(mockPrisma.tasks.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ type: { in: ['SEED', 'SOAK'] } }),
      })
    );
  });

  it('should filter by status', async () => {
    mockPrisma.tasks.findMany.mockResolvedValue([]);

    await listTasks(mockPrisma as unknown as PrismaClient, farmId, { status: 'TODO' });

    expect(mockPrisma.tasks.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ status: 'TODO' }),
      })
    );
  });

  it('should filter by due date range', async () => {
    mockPrisma.tasks.findMany.mockResolvedValue([]);

    await listTasks(mockPrisma as unknown as PrismaClient, farmId, {
      dueDateStart: '2024-02-01',
      dueDateEnd: '2024-02-28',
    });

    expect(mockPrisma.tasks.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          due_date: expect.objectContaining({
            gte: expect.any(Date),
            lte: expect.any(Date),
          }),
        }),
      })
    );
  });

  it('should order by due_date ascending', async () => {
    mockPrisma.tasks.findMany.mockResolvedValue([]);

    await listTasks(mockPrisma as unknown as PrismaClient, farmId, {});

    expect(mockPrisma.tasks.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        orderBy: [{ due_date: 'asc' }, { id: 'asc' }],
      })
    );
  });

  it('should apply cursor filtering by due_date and id', async () => {
    mockPrisma.tasks.findMany.mockResolvedValue([]);
    const cursorPayload = Buffer.from(JSON.stringify({
      dueDate: new Date('2024-02-02').toISOString(),
      id: 'task-2',
    })).toString('base64');

    await listTasks(mockPrisma as unknown as PrismaClient, farmId, { cursor: cursorPayload });

    expect(mockPrisma.tasks.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          AND: expect.arrayContaining([
            expect.objectContaining({
              OR: expect.any(Array),
            }),
          ]),
        }),
      })
    );
  });
});
