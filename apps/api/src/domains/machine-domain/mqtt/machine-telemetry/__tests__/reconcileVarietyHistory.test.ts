import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createMockPrisma } from '../../../../../test/mockPrisma.js';

const mockPrisma = createMockPrisma();

vi.mock('../../../../../lib/db/index.js', () => ({
  prisma: mockPrisma,
}));

const { reconcileVarietyHistory } = await import('../reconcileVarietyHistory.js');

const MACHINE_ID = '00000000-0000-0000-0000-000000000001';

describe('reconcileVarietyHistory', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockPrisma.machine_variety_history.findFirst.mockResolvedValue(null);
    mockPrisma.machine_variety_history.create.mockImplementation(({ data }: any) =>
      Promise.resolve({ id: 'new-id', name: data.name })
    );
    mockPrisma.machine_variety_history.update.mockResolvedValue({});
  });

  it('skips observations with active_variety = -1', async () => {
    await reconcileVarietyHistory(MACHINE_ID, [
      { activeVariety: -1, name: 'Lettuce', receivedAt: new Date('2026-05-19T10:00:00Z') },
    ]);
    expect(mockPrisma.machine_variety_history.findFirst).not.toHaveBeenCalled();
    expect(mockPrisma.machine_variety_history.create).not.toHaveBeenCalled();
  });

  it('skips observations with blank name', async () => {
    await reconcileVarietyHistory(MACHINE_ID, [
      { activeVariety: 1, name: '', receivedAt: new Date('2026-05-19T10:00:00Z') },
      { activeVariety: 2, name: '   ', receivedAt: new Date('2026-05-19T10:00:00Z') },
    ]);
    expect(mockPrisma.machine_variety_history.create).not.toHaveBeenCalled();
  });

  it('opens a new row when no open row exists for the slot', async () => {
    const receivedAt = new Date('2026-05-19T10:00:00Z');
    mockPrisma.machine_variety_history.findFirst.mockResolvedValue(null);

    await reconcileVarietyHistory(MACHINE_ID, [
      { activeVariety: 3, name: 'Lettuce', receivedAt },
    ]);

    expect(mockPrisma.machine_variety_history.update).not.toHaveBeenCalled();
    expect(mockPrisma.machine_variety_history.create).toHaveBeenCalledWith({
      data: {
        machine_id: MACHINE_ID,
        active_variety: 3,
        name: 'Lettuce',
        grams_per_tray: null,
        started_at: receivedAt,
      },
      select: { id: true, name: true },
    });
  });

  it('is a no-op when the open row already matches the incoming name', async () => {
    mockPrisma.machine_variety_history.findFirst.mockResolvedValue({ id: 'open-1', name: 'Lettuce' });

    await reconcileVarietyHistory(MACHINE_ID, [
      { activeVariety: 3, name: 'Lettuce', receivedAt: new Date('2026-05-19T10:00:00Z') },
    ]);

    expect(mockPrisma.machine_variety_history.update).not.toHaveBeenCalled();
    expect(mockPrisma.machine_variety_history.create).not.toHaveBeenCalled();
  });

  it('closes the open row and opens a new one on a name change', async () => {
    const receivedAt = new Date('2026-05-19T10:00:00Z');
    mockPrisma.machine_variety_history.findFirst.mockResolvedValue({ id: 'open-1', name: 'Lettuce' });

    await reconcileVarietyHistory(MACHINE_ID, [
      { activeVariety: 3, name: 'Romaine', receivedAt },
    ]);

    expect(mockPrisma.machine_variety_history.update).toHaveBeenCalledWith({
      where: { id: 'open-1' },
      data: { ended_at: receivedAt },
    });
    expect(mockPrisma.machine_variety_history.create).toHaveBeenCalledWith({
      data: {
        machine_id: MACHINE_ID,
        active_variety: 3,
        name: 'Romaine',
        grams_per_tray: null,
        started_at: receivedAt,
      },
      select: { id: true, name: true },
    });
  });

  it('carries grams_per_tray forward from the most recent prior row with the same name', async () => {
    const receivedAt = new Date('2026-05-19T10:00:00Z');
    mockPrisma.machine_variety_history.findFirst.mockImplementation((args: any) => {
      // Open-row lookup (filters on ended_at: null) returns no current row.
      if (args.where.ended_at === null) return Promise.resolve(null);
      // Prior-row lookup (filters on name) returns a previous closed row with a saved rate.
      if (args.where.name === 'Lettuce') return Promise.resolve({ grams_per_tray: 12 });
      return Promise.resolve(null);
    });

    await reconcileVarietyHistory(MACHINE_ID, [
      { activeVariety: 3, name: 'Lettuce', receivedAt },
    ]);

    expect(mockPrisma.machine_variety_history.create).toHaveBeenCalledWith({
      data: {
        machine_id: MACHINE_ID,
        active_variety: 3,
        name: 'Lettuce',
        grams_per_tray: 12,
        started_at: receivedAt,
      },
      select: { id: true, name: true },
    });
  });

  it('collapses consecutive identical observations into a single create', async () => {
    mockPrisma.machine_variety_history.findFirst.mockResolvedValue(null);

    await reconcileVarietyHistory(MACHINE_ID, [
      { activeVariety: 1, name: 'Lettuce', receivedAt: new Date('2026-05-19T10:00:00Z') },
      { activeVariety: 1, name: 'Lettuce', receivedAt: new Date('2026-05-19T10:01:00Z') },
      { activeVariety: 1, name: 'Lettuce', receivedAt: new Date('2026-05-19T10:02:00Z') },
    ]);

    expect(mockPrisma.machine_variety_history.create).toHaveBeenCalledTimes(1);
  });

  it('writes two transitions when the name changes within a batch', async () => {
    mockPrisma.machine_variety_history.findFirst.mockResolvedValueOnce(null);

    await reconcileVarietyHistory(MACHINE_ID, [
      { activeVariety: 1, name: 'Lettuce', receivedAt: new Date('2026-05-19T10:00:00Z') },
      { activeVariety: 1, name: 'Romaine', receivedAt: new Date('2026-05-19T10:05:00Z') },
    ]);

    expect(mockPrisma.machine_variety_history.create).toHaveBeenCalledTimes(2);
    expect(mockPrisma.machine_variety_history.update).toHaveBeenCalledTimes(1);
    expect(mockPrisma.machine_variety_history.update).toHaveBeenCalledWith({
      where: { id: 'new-id' },
      data: { ended_at: new Date('2026-05-19T10:05:00Z') },
    });
  });

  it('processes out-of-order observations in time order', async () => {
    mockPrisma.machine_variety_history.findFirst.mockResolvedValue(null);

    await reconcileVarietyHistory(MACHINE_ID, [
      { activeVariety: 1, name: 'Romaine', receivedAt: new Date('2026-05-19T10:05:00Z') },
      { activeVariety: 1, name: 'Lettuce', receivedAt: new Date('2026-05-19T10:00:00Z') },
    ]);

    const createCalls = mockPrisma.machine_variety_history.create.mock.calls;
    expect(createCalls[0][0].data.name).toBe('Lettuce');
    expect(createCalls[1][0].data.name).toBe('Romaine');
  });

  it('tracks open rows independently per slot', async () => {
    mockPrisma.machine_variety_history.findFirst.mockImplementation(({ where }: any) => {
      if (where.active_variety === 1) return Promise.resolve({ id: 'open-1', name: 'Lettuce' });
      if (where.active_variety === 2) return Promise.resolve({ id: 'open-2', name: 'Basil' });
      return Promise.resolve(null);
    });

    await reconcileVarietyHistory(MACHINE_ID, [
      { activeVariety: 1, name: 'Lettuce', receivedAt: new Date('2026-05-19T10:00:00Z') }, // no-op
      { activeVariety: 2, name: 'Mint', receivedAt: new Date('2026-05-19T10:01:00Z') },    // change
    ]);

    expect(mockPrisma.machine_variety_history.update).toHaveBeenCalledTimes(1);
    expect(mockPrisma.machine_variety_history.update).toHaveBeenCalledWith({
      where: { id: 'open-2' },
      data: { ended_at: new Date('2026-05-19T10:01:00Z') },
    });
    expect(mockPrisma.machine_variety_history.create).toHaveBeenCalledTimes(1);
    expect(mockPrisma.machine_variety_history.create.mock.calls[0][0].data.name).toBe('Mint');
  });

  it('caches findFirst per slot within a single batch', async () => {
    mockPrisma.machine_variety_history.findFirst.mockResolvedValue(null);

    await reconcileVarietyHistory(MACHINE_ID, [
      { activeVariety: 1, name: 'Lettuce', receivedAt: new Date('2026-05-19T10:00:00Z') },
      { activeVariety: 1, name: 'Romaine', receivedAt: new Date('2026-05-19T10:01:00Z') },
      { activeVariety: 1, name: 'Spinach', receivedAt: new Date('2026-05-19T10:02:00Z') },
    ]);

    // Only one open-row lookup for slot 1; subsequent changes use the in-memory cache.
    // (Each create also issues a separate grams_per_tray lookup, which is fine — those
    // filter on `name` rather than `ended_at`.)
    const openLookups = mockPrisma.machine_variety_history.findFirst.mock.calls.filter(
      (call: any[]) => call[0]?.where?.ended_at === null
    );
    expect(openLookups).toHaveLength(1);
    expect(mockPrisma.machine_variety_history.create).toHaveBeenCalledTimes(3);
  });
});
