import type { ProductionTask } from '../types';
import { formatLongDate } from '../utils/dates';
import { SeedingTaskCard } from './SeedingTaskCard';

interface SeedingScheduleProps {
  groupedTasks: { date: string; tasks: ProductionTask[] }[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  onComplete: (id: string) => void;
}

export function SeedingSchedule({
  groupedTasks,
  selectedIds,
  onToggle,
  onComplete,
}: SeedingScheduleProps) {
  if (groupedTasks.length === 0) {
    return <div className="text-sm text-muted-foreground">No seeding tasks in this range.</div>;
  }

  return (
    <div className="space-y-4">
      {groupedTasks.map(({ date, tasks }) => (
        <div key={date} className="border border-border rounded-lg p-4 bg-card">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-foreground">{formatLongDate(date)}</h3>
            <span className="text-xs text-muted-foreground">{tasks.length} tasks</span>
          </div>
          <div className="space-y-2">
            {tasks.map((task) => (
              <SeedingTaskCard
                key={task.id}
                task={task}
                selected={selectedIds.includes(task.id)}
                onToggle={onToggle}
                onComplete={onComplete}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
