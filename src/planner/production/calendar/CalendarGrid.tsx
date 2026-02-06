import type { ProductionTask } from '../types';
import { formatLongDate, toDateKey } from '../utils/dates';
import { TaskEvent } from './TaskEvent';

interface CalendarGridProps {
  days: Date[];
  tasksByDate: Record<string, ProductionTask[]>;
  selectedTaskId: string | null;
  onSelectTask: (task: ProductionTask) => void;
}

export function CalendarGrid({
  days,
  tasksByDate,
  selectedTaskId,
  onSelectTask,
}: CalendarGridProps) {
  return (
    <div className="space-y-4">
      {days.map((day) => {
        const key = toDateKey(day);
        const tasks = tasksByDate[key] ?? [];

        return (
          <div key={key} className="border border-border rounded-lg p-4 bg-card">
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
          </div>
        );
      })}
    </div>
  );
}
