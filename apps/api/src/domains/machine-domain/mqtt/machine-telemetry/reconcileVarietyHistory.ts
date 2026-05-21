import { prisma } from '../../../../lib/db/index.js';

interface VarietyObservation {
    activeVariety: number;
    name: string;
    receivedAt: Date;
}

/**
 * Walks observations in time order and writes one row to machine_variety_history
 * per *change* in (slot -> name). Skips slot = -1 (unset) and missing/blank names.
 *
 * The DB has a partial unique index (machine_id, active_variety) WHERE ended_at IS NULL,
 * so only one open row can exist per slot at a time.
 */
export async function reconcileVarietyHistory(
    machineId: string,
    observations: VarietyObservation[]
): Promise<void> {
    const filtered = observations
        .filter((o) => Number.isInteger(o.activeVariety) && o.activeVariety >= 0 && o.name && o.name.trim().length > 0)
        .sort((a, b) => a.receivedAt.getTime() - b.receivedAt.getTime());

    if (filtered.length === 0) return;

    // Collapse consecutive identical (slot, name) entries within this batch — only the first matters.
    const collapsed: VarietyObservation[] = [];
    for (const obs of filtered) {
        const prev = collapsed[collapsed.length - 1];
        if (prev && prev.activeVariety === obs.activeVariety && prev.name === obs.name) continue;
        collapsed.push(obs);
    }

    // Cache of the latest open row per slot for this machine. We populate on demand.
    const openBySlot = new Map<number, { id: string; name: string } | null>();

    async function loadOpen(slot: number): Promise<{ id: string; name: string } | null> {
        if (openBySlot.has(slot)) return openBySlot.get(slot) ?? null;
        const row = await prisma.machine_variety_history.findFirst({
            where: { machine_id: machineId, active_variety: slot, ended_at: null },
            select: { id: true, name: true },
        });
        openBySlot.set(slot, row ?? null);
        return row ?? null;
    }

    // Carry grams_per_tray forward: when opening a new row, reuse the most recent prior
    // value seen on this machine for the same variety name (any slot).
    async function lookupGramsPerTray(name: string): Promise<number | null> {
        const prior = await prisma.machine_variety_history.findFirst({
            where: { machine_id: machineId, name },
            orderBy: { started_at: 'desc' },
            select: { grams_per_tray: true },
        });
        return prior?.grams_per_tray ?? null;
    }

    for (const obs of collapsed) {
        const open = await loadOpen(obs.activeVariety);
        if (open && open.name === obs.name) continue;

        if (open) {
            await prisma.machine_variety_history.update({
                where: { id: open.id },
                data: { ended_at: obs.receivedAt },
            });
        }

        const carriedGrams = await lookupGramsPerTray(obs.name);

        const created = await prisma.machine_variety_history.create({
            data: {
                machine_id: machineId,
                active_variety: obs.activeVariety,
                name: obs.name,
                grams_per_tray: carriedGrams,
                started_at: obs.receivedAt,
            },
            select: { id: true, name: true },
        });
        openBySlot.set(obs.activeVariety, created);
    }
}
