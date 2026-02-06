import { TaskCard } from './TaskCard';

interface Task {
  id: string;
  title: string;
  type: string;
  dueDate: string | Date;
  status: string | null;
  orderItem?: any;
}

interface TaskListProps {
  tasks: Task[];
  isLoading: boolean;
  onStart: (id: string) => void;
  onComplete: (id: string) => void;
}

function formatDateGroup(d: string | Date): string {
  const date = new Date(d);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const taskDate = new Date(date);
  taskDate.setHours(0, 0, 0, 0);

  const diff = (taskDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);

  if (diff < 0) return `Overdue - ${date.toLocaleDateString()}`;
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Tomorrow';
  return date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
}

function groupByDate(tasks: Task[]): Map<string, Task[]> {
  const groups = new Map<string, Task[]>();
  for (const task of tasks) {
    const key = formatDateGroup(task.dueDate);
    const existing = groups.get(key) ?? [];
    existing.push(task);
    groups.set(key, existing);
  }
  return groups;
}

export function TaskList({ tasks, isLoading, onStart, onComplete }: TaskListProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-muted-foreground gap-4">
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent" />
        <p>Loading tasks...</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <p className="text-muted-foreground py-8 text-center">
        No tasks found. Tasks are automatically created when orders are placed.
      </p>
    );
  }

  const grouped = groupByDate(tasks);

  return (
    <div className="flex flex-col gap-6">
      {[...grouped.entries()].map(([dateLabel, dateTasks]) => (
        <div key={dateLabel}>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">{dateLabel}</h3>
          <div className="flex flex-col gap-2">
            {dateTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onStart={onStart}
                onComplete={onComplete}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
