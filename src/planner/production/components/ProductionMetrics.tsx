import { addDays, toDateKey } from '../utils/dates';

interface MetricTask {
  type: string;
  status: string | null;
  dueDate: string | Date;
}

interface ProductionMetricsProps {
  tasks: MetricTask[];
}

export function ProductionMetrics({ tasks }: ProductionMetricsProps) {
  const todayKey = toDateKey(new Date());
  const nextWeekKey = toDateKey(addDays(new Date(), 7));

  const dueToday = tasks.filter((task) => toDateKey(task.dueDate) === todayKey).length;
  const dueNext7 = tasks.filter((task) => {
    const key = toDateKey(task.dueDate);
    return key >= todayKey && key <= nextWeekKey;
  }).length;
  const completed = tasks.filter((task) => task.status === 'COMPLETED').length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="p-4 rounded-lg border border-border bg-card">
        <div className="text-xs uppercase tracking-wider text-muted-foreground">Due Today</div>
        <div className="text-2xl font-semibold text-foreground">{dueToday}</div>
      </div>
      <div className="p-4 rounded-lg border border-border bg-card">
        <div className="text-xs uppercase tracking-wider text-muted-foreground">Next 7 Days</div>
        <div className="text-2xl font-semibold text-foreground">{dueNext7}</div>
      </div>
      <div className="p-4 rounded-lg border border-border bg-card">
        <div className="text-xs uppercase tracking-wider text-muted-foreground">Completed</div>
        <div className="text-2xl font-semibold text-foreground">{completed}</div>
      </div>
    </div>
  );
}
