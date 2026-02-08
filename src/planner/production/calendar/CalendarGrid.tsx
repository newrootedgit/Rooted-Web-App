import { useDroppable } from '@dnd-kit/core';
import type { ProductionTask } from '../types';
import type { CalendarView } from '../utils/dates';
import { formatLongDate, getDayOfWeekHeaders, toDateKey, toInputDate } from '../utils/dates';
import { TaskEvent } from './TaskEvent';

interface CalendarGridProps {
  view: CalendarView;
  days: Date[];
  tasksByDate: Record<string, ProductionTask[]>;
  selectedTaskId: string | null;
  onSelectTask: (task: ProductionTask) => void;
  anchorDate: Date;
}

// ─── Droppable Cell (shared) ───────────────────────────────────────

function DroppableCell({
  dateKey,
  children,
  className,
}: {
  dateKey: string;
  children: React.ReactNode;
  className?: string;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: dateKey });

  return (
    <div
      ref={setNodeRef}
      className={`transition-all ${isOver ? 'ring-2 ring-primary bg-primary/5' : ''} ${className ?? ''}`}
    >
      {children}
    </div>
  );
}

// ─── Month Grid ────────────────────────────────────────────────────

const MAX_VISIBLE_TASKS = 3;

function MonthGrid({
  days,
  tasksByDate,
  selectedTaskId,
  onSelectTask,
  anchorDate,
}: Omit<CalendarGridProps, 'view'>) {
  const headers = getDayOfWeekHeaders();
  const todayKey = toInputDate(new Date());
  const currentMonth = anchorDate.getMonth();

  return (
    <div>
      <div className="grid grid-cols-7 border-b border-border mb-1">
        {headers.map((h) => (
          <div key={h} className="text-center text-xs font-medium text-muted-foreground py-2">
            {h}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 border-l border-t border-border">
        {days.map((day) => {
          const key = toDateKey(day);
          const tasks = tasksByDate[key] ?? [];
          const isToday = key === todayKey;
          const isCurrentMonth = day.getMonth() === currentMonth;
          const overflow = tasks.length > MAX_VISIBLE_TASKS ? tasks.length - MAX_VISIBLE_TASKS : 0;

          return (
            <DroppableCell
              key={key}
              dateKey={key}
              className={`border-r border-b border-border min-h-[100px] p-1 ${
                isToday ? 'bg-primary/5' : ''
              }`}
            >
              <div className={`text-xs font-medium mb-1 ${
                isToday
                  ? 'text-primary font-bold'
                  : isCurrentMonth
                    ? 'text-foreground'
                    : 'text-muted-foreground/50'
              }`}>
                {day.getDate()}
              </div>
              <div className="space-y-0.5">
                {tasks.slice(0, MAX_VISIBLE_TASKS).map((task) => (
                  <TaskEvent
                    key={task.id}
                    task={task}
                    onSelect={onSelectTask}
                    isSelected={selectedTaskId === task.id}
                    compact
                  />
                ))}
                {overflow > 0 && (
                  <div className="text-[10px] text-muted-foreground pl-1">
                    +{overflow} more
                  </div>
                )}
              </div>
            </DroppableCell>
          );
        })}
      </div>
    </div>
  );
}

// ─── Week Grid ─────────────────────────────────────────────────────

function WeekGrid({
  days,
  tasksByDate,
  selectedTaskId,
  onSelectTask,
}: Omit<CalendarGridProps, 'view' | 'anchorDate'>) {
  const todayKey = toInputDate(new Date());

  return (
    <div className="grid grid-cols-7 gap-2">
      {days.map((day) => {
        const key = toDateKey(day);
        const tasks = tasksByDate[key] ?? [];
        const isToday = key === todayKey;

        return (
          <DroppableCell
            key={key}
            dateKey={key}
            className={`border border-border rounded-lg p-2 min-h-[300px] bg-card ${
              isToday ? 'ring-1 ring-primary bg-primary/5' : ''
            }`}
          >
            <div className={`text-xs font-semibold mb-2 text-center ${
              isToday ? 'text-primary' : 'text-foreground'
            }`}>
              {formatLongDate(day)}
            </div>
            <div className="text-[10px] text-muted-foreground text-center mb-2">
              {tasks.length} tasks
            </div>
            <div className="space-y-1">
              {tasks.map((task) => (
                <TaskEvent
                  key={task.id}
                  task={task}
                  onSelect={onSelectTask}
                  isSelected={selectedTaskId === task.id}
                />
              ))}
            </div>
          </DroppableCell>
        );
      })}
    </div>
  );
}

// ─── Day Column ────────────────────────────────────────────────────

function DayColumn({
  days,
  tasksByDate,
  selectedTaskId,
  onSelectTask,
}: Omit<CalendarGridProps, 'view' | 'anchorDate'>) {
  const day = days[0];
  if (!day) return null;
  const key = toDateKey(day);
  const tasks = tasksByDate[key] ?? [];

  return (
    <DroppableCell
      dateKey={key}
      className="border border-border rounded-lg p-4 bg-card"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-foreground">{formatLongDate(day)}</h3>
        <span className="text-xs text-muted-foreground">{tasks.length} tasks</span>
      </div>
      {tasks.length === 0 ? (
        <div className="text-xs text-muted-foreground">No tasks scheduled</div>
      ) : (
        <div className="space-y-2">
          {tasks.map((task) => (
            <TaskEvent
              key={task.id}
              task={task}
              onSelect={onSelectTask}
              isSelected={selectedTaskId === task.id}
            />
          ))}
        </div>
      )}
    </DroppableCell>
  );
}

// ─── Main Component ────────────────────────────────────────────────

export function CalendarGrid(props: CalendarGridProps) {
  const { view, ...rest } = props;

  if (view === 'month') {
    return <MonthGrid {...rest} />;
  }
  if (view === 'week') {
    return <WeekGrid {...rest} />;
  }
  return <DayColumn {...rest} />;
}
