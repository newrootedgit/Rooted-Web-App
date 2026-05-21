import { useEffect, useRef, useState } from 'react';
import { Pencil } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { trpc } from '../../../lib/trpc';
import type { AnalyticsData, AnalyticsRange } from '../shared/types';
import { baseTooltipProps } from '../shared/formatters';
import { ChartPanel, EmptyChart, chartColors } from '../shared/chartHelpers';

export function OutputCharts({ data, range }: { data: AnalyticsData; range: AnalyticsRange }) {
  const machineId = data.machine.id;
  const varietyOutputQuery = trpc.machines.varietyOutput.useQuery(
    { machineId, range },
    { staleTime: 5 * 60 * 1000, refetchOnWindowFocus: false }
  );

  if (varietyOutputQuery.isLoading || !varietyOutputQuery.data) {
    return <EmptyChart message="Loading variety output" />;
  }

  const output = varietyOutputQuery.data;
  const totalTrays = output.seedByVariety.reduce((sum, v) => sum + v.trays, 0);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <ChartPanel
          title="Trays by Variety"
          subtitle={totalTrays > 0 ? `Totals over this range` : 'No trays in this range'}
        >
          {output.seedByVariety.length === 0 ? (
            <EmptyChart message="No variety data in this range" />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={output.seedByVariety.map((v) => ({ name: v.name, trays: v.trays }))}
                layout="vertical"
                margin={{ top: 8, right: 16, left: 16, bottom: 0 }}
              >
                <CartesianGrid stroke="var(--border)" strokeDasharray="2 4" horizontal={false} />
                <XAxis
                  type="number"
                  stroke="var(--muted-foreground)"
                  tickLine={false}
                  axisLine={{ stroke: 'var(--border)' }}
                  allowDecimals={false}
                />
                <YAxis type="category" dataKey="name" stroke="var(--muted-foreground)" tickLine={false} axisLine={false} width={96} />
                <Tooltip
                  {...baseTooltipProps()}
                  formatter={(value) => `${Math.round(Number(value)).toLocaleString('en-US')} trays`}
                  cursor={{ fill: 'var(--muted)', opacity: 0.15 }}
                />
                <Bar dataKey="trays" name="Trays" fill={chartColors.primary} maxBarSize={28} radius={[0, 3, 3, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartPanel>

        <ChartPanel title="Seed Used by Variety" subtitle="Trays × grams per tray over this range">
          {output.seedByVariety.length === 0 ? (
            <EmptyChart message="No seed data in this range" />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={output.seedByVariety.map((v) => ({ name: v.name, grams: v.grams ?? 0, hasRate: v.grams !== null }))}
                layout="vertical"
                margin={{ top: 8, right: 16, left: 16, bottom: 0 }}
              >
                <CartesianGrid stroke="var(--border)" strokeDasharray="2 4" horizontal={false} />
                <XAxis
                  type="number"
                  stroke="var(--muted-foreground)"
                  tickLine={false}
                  axisLine={{ stroke: 'var(--border)' }}
                  tickFormatter={(v) => `${Math.round(Number(v))}g`}
                />
                <YAxis type="category" dataKey="name" stroke="var(--muted-foreground)" tickLine={false} axisLine={false} width={96} />
                <Tooltip
                  {...baseTooltipProps()}
                  formatter={(value, _name, ctx) => {
                    const hasRate = (ctx as { payload?: { hasRate?: boolean } } | undefined)?.payload?.hasRate;
                    return hasRate ? `${Math.round(Number(value)).toLocaleString('en-US')}g` : 'Rate not set';
                  }}
                  cursor={{ fill: 'var(--muted)', opacity: 0.15 }}
                />
                <Bar dataKey="grams" name="Seed used" fill={chartColors.purple} maxBarSize={28} radius={[0, 3, 3, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartPanel>
      </div>

      <div className="flex justify-end">
        <EditGramsPerTrayButton machineId={machineId} />
      </div>
    </div>
  );
}

function EditGramsPerTrayButton({ machineId }: { machineId: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const trpcUtils = trpc.useUtils();

  const listQuery = trpc.machines.listVarieties.useQuery(
    { machineId },
    { enabled: open, staleTime: 60 * 1000, refetchOnWindowFocus: false }
  );
  const updateMutation = trpc.machines.updateVarietyGramsPerTray.useMutation({
    onSuccess: () => {
      trpcUtils.machines.listVarieties.invalidate({ machineId });
      trpcUtils.machines.varietyOutput.invalidate({ machineId });
    },
  });

  const [drafts, setDrafts] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  function commit(historyId: string, raw: string) {
    const trimmed = raw.trim();
    const parsed = trimmed === '' ? null : Number(trimmed);
    if (parsed !== null && (!Number.isFinite(parsed) || parsed < 0 || parsed > 10000)) return;
    updateMutation.mutate({ historyId, gramsPerTray: parsed === null ? null : Math.round(parsed) });
  }

  const rows = listQuery.data ?? [];

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-secondary px-3 text-sm font-medium text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
      >
        <Pencil size={14} />
        Edit g/tray
      </button>
      {open && (
        <div className="absolute right-0 z-20 mt-2 w-80 rounded-md border border-border bg-popover p-3 shadow-lg">
          <div className="mb-2 flex flex-col gap-0.5">
            <div className="text-sm font-semibold text-foreground">Grams per Tray</div>
            <div className="text-xs text-muted-foreground">Used to compute seed-used totals.</div>
          </div>
          {listQuery.isLoading ? (
            <div className="py-3 text-sm text-muted-foreground">Loading…</div>
          ) : rows.length === 0 ? (
            <div className="py-3 text-sm text-muted-foreground">No varieties reported yet.</div>
          ) : (
            <div className="max-h-72 divide-y divide-border overflow-auto">
              {rows.map((row) => {
                const value = drafts[row.id] ?? (row.gramsPerTray === null ? '' : String(row.gramsPerTray));
                return (
                  <div key={row.id} className="flex items-center justify-between gap-3 py-2">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium text-foreground">{row.name}</div>
                      <div className="text-xs text-muted-foreground">Slot {row.activeVariety}</div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min={0}
                        max={10000}
                        step={1}
                        inputMode="numeric"
                        value={value}
                        onChange={(e) => setDrafts((d) => ({ ...d, [row.id]: e.target.value }))}
                        onBlur={(e) => {
                          const raw = e.target.value;
                          const current = row.gramsPerTray === null ? '' : String(row.gramsPerTray);
                          if (raw === current) return;
                          commit(row.id, raw);
                        }}
                        className="h-8 w-20 rounded-md border border-border bg-secondary px-2 text-right text-sm text-foreground outline-none focus:border-primary"
                        placeholder="—"
                      />
                      <span className="text-xs text-muted-foreground">g</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
