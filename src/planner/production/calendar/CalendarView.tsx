import { useMemo, useState } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core';
import { TaskTypeFilter } from '../components/TaskTypeFilter';
import { ProductionMetrics } from '../components/ProductionMetrics';
import { useCalendarTasks } from '../hooks/useCalendarTasks';
import { useTaskDragDrop } from '../hooks/useTaskDragDrop';
import type { ProductionTask } from '../types';
import type { CalendarView as CalendarViewType } from '../utils/dates';
import {
  getDateRangeForView,
  getMonthGridDays,
  listDaysBetween,
  toDateKey,
  toInputDate,
} from '../utils/dates';
import { CalendarControls } from './CalendarControls';
import { CalendarGrid } from './CalendarGrid';
import { TaskDetailPanel } from './TaskDetailPanel';
import { TaskEvent } from './TaskEvent';

const DEFAULT_TYPES = ['SOAK', 'SEED', 'MOVE_TO_LIGHT', 'HARVEST'];
const STATUS_OPTIONS = ['TODO', 'IN_PROGRESS', 'COMPLETED'];

export function CalendarView() {
  const [view, setView] = useState<CalendarViewType>('week');
  const [anchorDate, setAnchorDate] = useState(new Date());
  const [selectedTypes, setSelectedTypes] = useState<string[]>(DEFAULT_TYPES);
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedTask, setSelectedTask] = useState<ProductionTask | null>(null);
  const [activeTask, setActiveTask] = useState<ProductionTask | null>(null);

  const { handleDragEnd: rescheduleTask, isUpdating } = useTaskDragDrop();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  );

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

  const days = useMemo(() => {
    if (view === 'month') return getMonthGridDays(anchorDate);
    return listDaysBetween(range.start, range.end);
  }, [view, anchorDate, range.start, range.end]);

  function onDragStart(event: DragStartEvent) {
    const task = event.active.data.current?.task as ProductionTask | undefined;
    setActiveTask(task ?? null);
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as string;
    const newDateKey = over.id as string;
    const task = active.data.current?.task as ProductionTask | undefined;
    if (!task) return;

    const currentDateKey = toDateKey(task.dueDate);
    if (currentDateKey === newDateKey) return;

    rescheduleTask(taskId, newDateKey);
  }

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
        {isUpdating && (
          <span className="text-xs text-muted-foreground">Saving...</span>
        )}
      </div>

      {isLoading ? (
        <div className="text-sm text-muted-foreground">Loading calendar...</div>
      ) : (
        <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
            <CalendarGrid
              view={view}
              days={days}
              tasksByDate={tasksByDate}
              selectedTaskId={selectedTask?.id ?? null}
              onSelectTask={setSelectedTask}
              anchorDate={anchorDate}
            />
            <TaskDetailPanel task={selectedTask} />
          </div>
          <DragOverlay>
            {activeTask ? (
              <div className="w-64">
                <TaskEvent
                  task={activeTask}
                  onSelect={() => {}}
                  isSelected={false}
                  isDragOverlay
                />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
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
