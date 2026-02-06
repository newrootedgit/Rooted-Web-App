import { useMemo, useState } from 'react';
import { TaskTypeFilter } from '../components/TaskTypeFilter';
import { ProductionMetrics } from '../components/ProductionMetrics';
import { useCalendarTasks } from '../hooks/useCalendarTasks';
import type { ProductionTask } from '../types';
import type { CalendarView as CalendarViewType } from '../utils/dates';
import {
  getDateRangeForView,
  listDaysBetween,
  toDateKey,
  toInputDate,
} from '../utils/dates';
import { CalendarControls } from './CalendarControls';
import { CalendarGrid } from './CalendarGrid';

const DEFAULT_TYPES = ['SOAK', 'SEED', 'MOVE_TO_LIGHT', 'HARVEST'];
const STATUS_OPTIONS = ['TODO', 'IN_PROGRESS', 'COMPLETED'];

export function CalendarView() {
  const [view, setView] = useState<CalendarViewType>('week');
  const [anchorDate, setAnchorDate] = useState(new Date());
  const [selectedTypes, setSelectedTypes] = useState<string[]>(DEFAULT_TYPES);
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedTask, setSelectedTask] = useState<ProductionTask | null>(null);

  const range = getDateRangeForView(view, anchorDate);
  const dueDateStart = toInputDate(range.start);
  const dueDateEnd = toInputDate(range.end);

  const {
    tasks,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useCalendarTasks({
    types: selectedTypes.length === 0 ? undefined : selectedTypes,
    status: statusFilter || undefined,
    dueDateStart,
    dueDateEnd,
  });

  const tasksByDate = useMemo(() => {
    const grouped: Record<string, ProductionTask[]> = {};
    tasks.forEach((task) => {
      const key = toDateKey(task.dueDate);
      if (!key) return;
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(task);
    });
    return grouped;
  }, [tasks]);

  const days = useMemo(() => listDaysBetween(range.start, range.end), [range.start, range.end]);

  return (
    <div className="space-y-6">
      <div className="print:hidden">
        <CalendarControls
          view={view}
          anchorDate={anchorDate}
          onViewChange={setView}
          onAnchorChange={setAnchorDate}
        />
      </div>

      <ProductionMetrics tasks={tasks} />

      <div className="flex flex-wrap items-center gap-4 print:hidden">
        <TaskTypeFilter selected={selectedTypes} onChange={setSelectedTypes} />
        <div className="flex items-center gap-2">
          <label className="text-sm text-muted-foreground">Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-secondary border border-border rounded-md text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">All</option>
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status === 'IN_PROGRESS' ? 'In Progress' : status === 'TODO' ? 'To Do' : 'Completed'}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="text-sm text-muted-foreground">Loading calendar...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
          <CalendarGrid
            days={days}
            tasksByDate={tasksByDate}
            selectedTaskId={selectedTask?.id ?? null}
            onSelectTask={setSelectedTask}
          />
          <div className="border border-border rounded-lg p-4 bg-card h-fit print:hidden">
            <h3 className="text-sm font-semibold text-foreground mb-2">Task Details</h3>
            {!selectedTask ? (
              <div className="text-sm text-muted-foreground">Select a task to view details.</div>
            ) : (
              <div className="space-y-2">
                <div className="text-xs uppercase tracking-wider text-muted-foreground">{selectedTask.type}</div>
                <div className="text-lg font-semibold text-foreground">
                  {selectedTask.orderItem?.products?.name
                    ?? selectedTask.orderItem?.blends?.name
                    ?? selectedTask.title}
                </div>
                <div className="text-sm text-muted-foreground">
                  Order {selectedTask.orderItem?.orders?.order_number ?? '—'}
                </div>
                <div className="text-sm text-muted-foreground">
                  Due {new Date(selectedTask.dueDate).toLocaleDateString()}
                </div>
                {selectedTask.orderItem?.trays_needed != null && (
                  <div className="text-sm text-muted-foreground">
                    Trays needed: {selectedTask.orderItem.trays_needed}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          className="px-4 py-2 border border-border rounded-md text-sm hover:bg-secondary transition-colors disabled:opacity-50"
        >
          {isFetchingNextPage ? 'Loading more...' : 'Load more tasks'}
        </button>
      )}
    </div>
  );
}
