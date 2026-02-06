import { useMemo, useState } from 'react';
import { trpc } from '../../../lib/trpc';
import { DateRangeFilter } from '../components/DateRangeFilter';
import { useSeedingTasks } from '../hooks/useSeedingTasks';
import type { ProductionTask } from '../types';
import { addDays, toDateKey, toInputDate } from '../utils/dates';
import { SeedingSchedule } from './SeedingSchedule';

const STATUS_OPTIONS = ['TODO', 'IN_PROGRESS', 'COMPLETED'];

export function SeedingView() {
  const today = new Date();
  const [startDate, setStartDate] = useState(toInputDate(today));
  const [endDate, setEndDate] = useState(toInputDate(addDays(today, 7)));
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [error, setError] = useState('');

  const utils = trpc.useUtils();
  const completeMutation = trpc.tasks.complete.useMutation({
    onSuccess: () => {
      utils.tasks.list.invalidate();
    },
    onError: (err) => setError(err.message),
  });

  const { tasks, isLoading } = useSeedingTasks({
    status: statusFilter || undefined,
    dueDateStart: startDate,
    dueDateEnd: endDate,
  });

  const groupedTasks = useMemo(() => {
    const grouped: Record<string, ProductionTask[]> = {};
    tasks.forEach((task) => {
      const key = toDateKey(task.dueDate);
      if (!key) return;
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(task);
    });
    return Object.entries(grouped)
      .sort(([a], [b]) => (a < b ? -1 : 1))
      .map(([date, items]) => ({ date, tasks: items }));
  }, [tasks]);

  function toggleSelection(id: string) {
    setSelectedIds((prev) => prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]);
  }

  async function handleBatchComplete() {
    setError('');
    const idsToComplete = selectedIds;
    if (idsToComplete.length === 0) return;
    try {
      await Promise.all(idsToComplete.map((id) => completeMutation.mutateAsync({ id })));
      setSelectedIds([]);
    } catch (err: any) {
      setError(err?.message ?? 'Failed to complete tasks');
    }
  }

  function handleCompleteSingle(id: string) {
    completeMutation.mutate({ id });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <div className="flex items-center gap-3">
          <DateRangeFilter
            startDate={startDate}
            endDate={endDate}
            onStartChange={setStartDate}
            onEndChange={setEndDate}
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-secondary border border-border rounded-md text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">All statuses</option>
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status === 'IN_PROGRESS' ? 'In Progress' : status === 'TODO' ? 'To Do' : 'Completed'}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="px-3 py-2 border border-border rounded-md text-sm hover:bg-secondary transition-colors"
          >
            Print Schedule
          </button>
          <button
            onClick={handleBatchComplete}
            disabled={selectedIds.length === 0 || completeMutation.isPending}
            className="px-3 py-2 bg-primary text-primary-foreground rounded-md text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            Complete Selected ({selectedIds.length})
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md text-sm text-destructive">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="text-sm text-muted-foreground">Loading seeding tasks...</div>
      ) : (
        <SeedingSchedule
          groupedTasks={groupedTasks}
          selectedIds={selectedIds}
          onToggle={toggleSelection}
          onComplete={handleCompleteSingle}
        />
      )}
    </div>
  );
}
