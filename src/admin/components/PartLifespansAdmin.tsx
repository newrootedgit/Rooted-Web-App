import { useMemo, useState } from 'react';
import { Loader2, Plus, Save, Trash2, X } from 'lucide-react';
import { trpc } from '../lib/trpc';

type MachineType = 'SEEDER' | 'HARVESTER' | 'OTHER';
type Metric = 'HOURS' | 'CYCLES';
type UsageSource = 'belt_motor_runtime' | 'blade_motor_runtime' | 'roller_motor_runtime' | 'trays_processed';

interface DraftRow {
  id: string | null;
  machineType: MachineType;
  name: string;
  metric: Metric;
  usageSource: UsageSource;
  defaultLifespan: number;
  warningPct: number;
  criticalPct: number;
}

const MACHINE_TYPES: MachineType[] = ['SEEDER', 'HARVESTER', 'OTHER'];
const METRICS: Metric[] = ['HOURS', 'CYCLES'];
const USAGE_SOURCES: Array<{ value: UsageSource; label: string }> = [
  { value: 'belt_motor_runtime', label: 'Belt motor runtime (hours)' },
  { value: 'blade_motor_runtime', label: 'Blade motor runtime (hours)' },
  { value: 'roller_motor_runtime', label: 'Roller motor runtime (hours)' },
  { value: 'trays_processed', label: 'Trays processed (cycles)' },
];

export function PartLifespansAdmin() {
  const utils = trpc.useUtils();
  const listQuery = trpc.admin.listPartTypes.useQuery();
  const upsertMutation = trpc.admin.upsertPartType.useMutation({
    onSuccess: () => utils.admin.listPartTypes.invalidate(),
  });
  const deleteMutation = trpc.admin.deletePartType.useMutation({
    onSuccess: () => utils.admin.listPartTypes.invalidate(),
  });

  const [drafts, setDrafts] = useState<Record<string, DraftRow>>({});
  const [adding, setAdding] = useState<DraftRow | null>(null);

  const rows = listQuery.data ?? [];
  const grouped = useMemo(() => {
    const map: Record<MachineType, typeof rows> = { SEEDER: [], HARVESTER: [], OTHER: [] };
    for (const row of rows) {
      const type = row.machineType as MachineType;
      if (type in map) map[type].push(row);
    }
    return map;
  }, [rows]);

  function startEdit(rowId: string) {
    const row = rows.find((r) => r.id === rowId);
    if (!row) return;
    setDrafts((d) => ({
      ...d,
      [rowId]: {
        id: row.id,
        machineType: row.machineType as MachineType,
        name: row.name,
        metric: row.metric as Metric,
        usageSource: row.usageSource as UsageSource,
        defaultLifespan: row.defaultLifespan,
        warningPct: row.warningPct,
        criticalPct: row.criticalPct,
      },
    }));
  }

  function cancelEdit(rowId: string) {
    setDrafts((d) => {
      const next = { ...d };
      delete next[rowId];
      return next;
    });
  }

  function updateDraft(key: string, patch: Partial<DraftRow>) {
    setDrafts((d) => ({ ...d, [key]: { ...d[key], ...patch } }));
  }

  async function saveDraft(rowId: string) {
    const draft = drafts[rowId];
    if (!draft) return;
    await upsertMutation.mutateAsync(draft);
    cancelEdit(rowId);
  }

  async function saveNew() {
    if (!adding) return;
    await upsertMutation.mutateAsync(adding);
    setAdding(null);
  }

  function handleDelete(rowId: string, name: string) {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    deleteMutation.mutate({ id: rowId });
  }

  if (listQuery.isLoading) {
    return (
      <div className="flex min-h-[240px] items-center justify-center text-muted-foreground">
        <Loader2 size={24} className="mr-2 animate-spin" />
        Loading part catalog
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Part Lifespans</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Global defaults for replaceable parts. Changes apply to every farm.
          </p>
        </div>
        <button
          type="button"
          onClick={() =>
            setAdding({
              id: null,
              machineType: 'SEEDER',
              name: '',
              metric: 'HOURS',
              usageSource: 'belt_motor_runtime',
              defaultLifespan: 200,
              warningPct: 80,
              criticalPct: 100,
            })
          }
          className="inline-flex h-10 items-center gap-2 rounded-md border border-border bg-secondary px-3 text-sm font-medium text-foreground hover:bg-primary hover:text-primary-foreground"
        >
          <Plus size={16} />
          Add part type
        </button>
      </div>

      {(upsertMutation.error || deleteMutation.error) && (
        <div className="rounded-lg border border-destructive bg-card p-3 text-sm text-destructive">
          {upsertMutation.error?.message ?? deleteMutation.error?.message}
        </div>
      )}

      {adding && (
        <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
          <div className="mb-3 text-sm font-medium text-foreground">New part type</div>
          <RowEditor
            draft={adding}
            onChange={(patch) => setAdding((a) => (a ? { ...a, ...patch } : a))}
          />
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={saveNew}
              disabled={upsertMutation.isPending || adding.name.trim() === ''}
              className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60"
            >
              {upsertMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              Save
            </button>
            <button
              type="button"
              onClick={() => setAdding(null)}
              disabled={upsertMutation.isPending}
              className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-secondary px-3 text-sm font-medium text-foreground hover:bg-muted"
            >
              <X size={14} />
              Cancel
            </button>
          </div>
        </div>
      )}

      {MACHINE_TYPES.map((type) => {
        const typeRows = grouped[type];
        if (typeRows.length === 0) return null;
        return (
          <section key={type} className="space-y-2">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{type}</h2>
            <div className="overflow-hidden rounded-lg border border-border bg-card">
              <table className="w-full text-sm">
                <thead className="border-b border-border bg-secondary/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="px-4 py-2">Part</th>
                    <th className="px-4 py-2">Metric</th>
                    <th className="px-4 py-2">Usage source</th>
                    <th className="px-4 py-2 text-right">Lifespan</th>
                    <th className="px-4 py-2 text-right">Warn %</th>
                    <th className="px-4 py-2 text-right">Critical %</th>
                    <th className="px-4 py-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {typeRows.map((row) => {
                    const draft = drafts[row.id];
                    if (draft) {
                      return (
                        <tr key={row.id} className="bg-primary/5">
                          <td colSpan={7} className="px-4 py-3">
                            <RowEditor draft={draft} onChange={(patch) => updateDraft(row.id, patch)} />
                            <div className="mt-2 flex gap-2">
                              <button
                                type="button"
                                onClick={() => saveDraft(row.id)}
                                disabled={upsertMutation.isPending}
                                className="inline-flex h-8 items-center gap-1.5 rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60"
                              >
                                {upsertMutation.isPending ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
                                Save
                              </button>
                              <button
                                type="button"
                                onClick={() => cancelEdit(row.id)}
                                disabled={upsertMutation.isPending}
                                className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-secondary px-3 text-xs font-medium text-foreground hover:bg-muted"
                              >
                                <X size={12} />
                                Cancel
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    }
                    return (
                      <tr key={row.id}>
                        <td className="px-4 py-2 font-medium text-foreground">{row.name}</td>
                        <td className="px-4 py-2 text-muted-foreground">{row.metric}</td>
                        <td className="px-4 py-2 text-muted-foreground">{row.usageSource}</td>
                        <td className="px-4 py-2 text-right text-foreground">
                          {row.defaultLifespan.toLocaleString('en-US')} {row.metric === 'HOURS' ? 'h' : ''}
                        </td>
                        <td className="px-4 py-2 text-right text-foreground">{row.warningPct}%</td>
                        <td className="px-4 py-2 text-right text-muted-foreground">{row.criticalPct}%</td>
                        <td className="px-4 py-2">
                          <div className="flex justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => startEdit(row.id)}
                              className="rounded-md border border-border bg-secondary px-2 py-1 text-xs font-medium text-foreground hover:bg-muted"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(row.id, row.name)}
                              disabled={deleteMutation.isPending}
                              className="inline-flex items-center rounded-md border border-destructive/30 bg-destructive/10 px-2 py-1 text-xs font-medium text-destructive hover:bg-destructive/20 disabled:opacity-60"
                              title="Delete"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        );
      })}
    </div>
  );
}

function RowEditor({
  draft,
  onChange,
}: {
  draft: DraftRow;
  onChange: (patch: Partial<DraftRow>) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-7">
      <Field label="Machine">
        <select
          value={draft.machineType}
          onChange={(e) => onChange({ machineType: e.target.value as MachineType })}
          className="h-9 w-full rounded-md border border-border bg-secondary px-2 text-sm text-foreground"
        >
          {MACHINE_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Name" className="md:col-span-2">
        <input
          type="text"
          value={draft.name}
          onChange={(e) => onChange({ name: e.target.value })}
          placeholder="e.g. Belt"
          className="h-9 w-full rounded-md border border-border bg-secondary px-2 text-sm text-foreground"
        />
      </Field>
      <Field label="Metric">
        <select
          value={draft.metric}
          onChange={(e) => onChange({ metric: e.target.value as Metric })}
          className="h-9 w-full rounded-md border border-border bg-secondary px-2 text-sm text-foreground"
        >
          {METRICS.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Source" className="md:col-span-2">
        <select
          value={draft.usageSource}
          onChange={(e) => onChange({ usageSource: e.target.value as UsageSource })}
          className="h-9 w-full rounded-md border border-border bg-secondary px-2 text-sm text-foreground"
        >
          {USAGE_SOURCES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Lifespan">
        <input
          type="number"
          min={1}
          value={draft.defaultLifespan}
          onChange={(e) => onChange({ defaultLifespan: Math.max(1, Number(e.target.value) || 0) })}
          className="h-9 w-full rounded-md border border-border bg-secondary px-2 text-sm text-foreground"
        />
      </Field>
      <Field label="Warn %">
        <input
          type="number"
          min={1}
          max={200}
          value={draft.warningPct}
          onChange={(e) => onChange({ warningPct: Math.max(1, Number(e.target.value) || 0) })}
          className="h-9 w-full rounded-md border border-border bg-secondary px-2 text-sm text-foreground"
        />
      </Field>
    </div>
  );
}

function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <div className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</div>
      {children}
    </div>
  );
}
