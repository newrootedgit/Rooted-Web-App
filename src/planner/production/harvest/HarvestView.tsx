import { useMemo, useState } from 'react';
import { trpc } from '../../../lib/trpc';
import { TaskCompletionForm } from '../../tasks/components/TaskCompletionForm';
import { DateRangeFilter } from '../components/DateRangeFilter';
import { useHarvestTasks } from '../hooks/useHarvestTasks';
import type { ProductionTask } from '../types';
import { addDays, toDateKey, toInputDate } from '../utils/dates';
import { HarvestSchedule } from './HarvestSchedule';

const STATUS_OPTIONS = ['TODO', 'IN_PROGRESS', 'COMPLETED'];

export function HarvestView() {
  const today = new Date();
  const [startDate, setStartDate] = useState(toInputDate(today));
  const [endDate, setEndDate] = useState(toInputDate(addDays(today, 7)));
  const [statusFilter, setStatusFilter] = useState('');
  const [recordingTaskId, setRecordingTaskId] = useState<string | null>(null);

  const utils = trpc.useUtils();

  const { tasks, isLoading } = useHarvestTasks({
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

  function handleFormSuccess() {
    utils.tasks.list.invalidate();
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
        <button
          onClick={() => window.print()}
          className="px-3 py-2 border border-border rounded-md text-sm hover:bg-secondary transition-colors"
        >
          Print Schedule
        </button>
      </div>

      {isLoading ? (
        <div className="text-sm text-muted-foreground">Loading harvest tasks...</div>
      ) : (
        <HarvestSchedule groupedTasks={groupedTasks} onRecordYield={setRecordingTaskId} />
      )}

      <TaskCompletionForm
        isOpen={recordingTaskId !== null}
        taskId={recordingTaskId}
        onClose={() => setRecordingTaskId(null)}
        onSuccess={handleFormSuccess}
      />
    </div>
  );
}
