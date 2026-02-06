import type { ProductionTask } from '../types';
import { formatLongDate } from '../utils/dates';
import { HarvestTaskCard } from './HarvestTaskCard';

interface HarvestScheduleProps {
  groupedTasks: { date: string; tasks: ProductionTask[] }[];
  onRecordYield: (id: string) => void;
}

export function HarvestSchedule({ groupedTasks, onRecordYield }: HarvestScheduleProps) {
  if (groupedTasks.length === 0) {
    return <div className="text-sm text-muted-foreground">No harvest tasks in this range.</div>;
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
              <HarvestTaskCard key={task.id} task={task} onRecordYield={onRecordYield} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
