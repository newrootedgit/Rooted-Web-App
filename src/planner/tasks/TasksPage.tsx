import { useState } from 'react';
import { Search } from 'lucide-react';
import { trpc } from '../../lib/trpc';
import { TaskList } from './components/TaskList';
import { TaskCompletionForm } from './components/TaskCompletionForm';

const TASK_TYPES = ['SOAK', 'SEED', 'MOVE_TO_LIGHT', 'HARVEST'];
const TASK_STATUSES = ['TODO', 'IN_PROGRESS', 'COMPLETED'];

export function TasksPage() {
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [completingTaskId, setCompletingTaskId] = useState<string | null>(null);

  const utils = trpc.useUtils();

  const { data, isLoading } = trpc.tasks.list.useQuery({
    type: typeFilter || undefined,
    status: statusFilter || undefined,
  });

  const updateStatusMutation = trpc.tasks.updateStatus.useMutation({
    onSuccess: () => utils.tasks.list.invalidate(),
  });

  function handleStart(id: string) {
    updateStatusMutation.mutate({ id, status: 'IN_PROGRESS' });
  }

  function handleComplete(id: string) {
    setCompletingTaskId(id);
  }

  function handleCompletionSuccess() {
    utils.tasks.list.invalidate();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">Tasks</h1>
      </div>

      <div className="flex items-center gap-4">
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-2 bg-secondary border border-border rounded-md text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">All types</option>
          {TASK_TYPES.map((t) => (
            <option key={t} value={t}>
              {t === 'MOVE_TO_LIGHT' ? 'Move to Light' : t.charAt(0) + t.slice(1).toLowerCase()}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 bg-secondary border border-border rounded-md text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">All statuses</option>
          {TASK_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s === 'IN_PROGRESS' ? 'In Progress' : s === 'TODO' ? 'To Do' : 'Completed'}
            </option>
          ))}
        </select>
      </div>

      <TaskList
        tasks={data?.items ?? []}
        isLoading={isLoading}
        onStart={handleStart}
        onComplete={handleComplete}
      />

      <TaskCompletionForm
        isOpen={completingTaskId !== null}
        taskId={completingTaskId}
        onClose={() => setCompletingTaskId(null)}
        onSuccess={handleCompletionSuccess}
      />
    </div>
  );
}
