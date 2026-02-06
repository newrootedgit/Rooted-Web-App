import type { ProductionTask } from '../types';
import { formatLongDate, formatShortDate } from '../utils/dates';

interface TransplantScheduleProps {
  groupedTasks: { date: string; tasks: ProductionTask[] }[];
  onAssignRack: (task: ProductionTask) => void;
}

export function TransplantSchedule({ groupedTasks, onAssignRack }: TransplantScheduleProps) {
  if (groupedTasks.length === 0) {
    return <div className="text-sm text-muted-foreground">No transplant tasks in this range.</div>;
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
            {tasks.map((task) => {
              const productName = task.orderItem?.products?.name ?? task.orderItem?.blends?.name ?? task.title;
              const traysNeeded = task.orderItem?.trays_needed ?? '—';
              const orderNumber = task.orderItem?.orders?.order_number ?? '';
              return (
                <div key={task.id} className="flex flex-wrap items-center justify-between gap-4 border border-border rounded-lg p-3 bg-secondary/30">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-foreground">{productName}</span>
                    <span className="text-xs text-muted-foreground">
                      Due {formatShortDate(task.dueDate)} • Trays {traysNeeded}
                    </span>
                    {orderNumber && <span className="text-xs text-muted-foreground">Order {orderNumber}</span>}
                  </div>
                  <button
                    onClick={() => onAssignRack(task)}
                    className="px-3 py-1.5 text-xs font-medium text-foreground border border-border rounded hover:bg-secondary transition-colors"
                  >
                    Assign Rack
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
