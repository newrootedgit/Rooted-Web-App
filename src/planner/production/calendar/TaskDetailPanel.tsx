import type { ProductionTask } from '../types';
import { trpc } from '../../../lib/trpc';

const TYPE_COLORS: Record<string, string> = {
  SOAK: 'bg-blue-500/20 text-blue-400',
  SEED: 'bg-green-500/20 text-green-400',
  MOVE_TO_LIGHT: 'bg-yellow-500/20 text-yellow-400',
  HARVEST: 'bg-red-500/20 text-red-400',
};

const TYPE_LABELS: Record<string, string> = {
  SOAK: 'Soak',
  SEED: 'Seed',
  MOVE_TO_LIGHT: 'Move to Light',
  HARVEST: 'Harvest',
};

const STATUS_COLORS: Record<string, string> = {
  TODO: 'bg-gray-500/20 text-gray-400',
  IN_PROGRESS: 'bg-blue-500/20 text-blue-400',
  COMPLETED: 'bg-green-500/20 text-green-400',
};

const STATUS_LABELS: Record<string, string> = {
  TODO: 'To Do',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
};

interface TaskDetailPanelProps {
  task: ProductionTask | null;
}

export function TaskDetailPanel({ task }: TaskDetailPanelProps) {
  const utils = trpc.useUtils();
  const updateStatus = trpc.tasks.updateStatus.useMutation({
    onSuccess: () => {
      utils.tasks.list.invalidate();
    },
  });

  if (!task) {
    return (
      <div className="border border-border rounded-lg p-4 bg-card h-fit print:hidden">
        <h3 className="text-sm font-semibold text-foreground mb-2">Task Details</h3>
        <div className="text-sm text-muted-foreground">Select a task to view details.</div>
      </div>
    );
  }

  const productName =
    task.orderItem?.products?.name ?? task.orderItem?.blends?.name ?? task.title;
  const orderNumber = task.orderItem?.orders?.order_number;
  const typeColor = TYPE_COLORS[task.type] ?? 'bg-secondary text-foreground';
  const typeLabel = TYPE_LABELS[task.type] ?? task.type;
  const statusColor = STATUS_COLORS[task.status ?? ''] ?? 'bg-secondary text-foreground';
  const statusLabel = STATUS_LABELS[task.status ?? ''] ?? task.status ?? 'Unknown';

  const nextStatus =
    task.status === 'TODO'
      ? 'IN_PROGRESS'
      : task.status === 'IN_PROGRESS'
        ? 'COMPLETED'
        : null;

  return (
    <div className="border border-border rounded-lg p-4 bg-card h-fit print:hidden space-y-4">
      <h3 className="text-sm font-semibold text-foreground">Task Details</h3>

      <div className="flex items-center gap-2">
        <span className={`px-2 py-0.5 rounded text-xs font-medium ${typeColor}`}>
          {typeLabel}
        </span>
        <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusColor}`}>
          {statusLabel}
        </span>
      </div>

      <div className="text-lg font-semibold text-foreground">{productName}</div>

      {orderNumber && (
        <div className="text-sm text-muted-foreground">Order {orderNumber}</div>
      )}

      <div className="text-sm text-muted-foreground">
        Due {new Date(task.dueDate).toLocaleDateString()}
      </div>

      {task.orderItem?.trays_needed != null && (
        <div className="text-sm text-muted-foreground">
          Trays needed: {task.orderItem.trays_needed}
        </div>
      )}

      {task.orderItem?.quantity_oz != null && (
        <div className="text-sm text-muted-foreground">
          Quantity: {task.orderItem.quantity_oz} oz
        </div>
      )}

      {nextStatus && (
        <button
          onClick={() =>
            updateStatus.mutate({
              id: task.id,
              status: nextStatus as 'TODO' | 'IN_PROGRESS' | 'COMPLETED',
            })
          }
          disabled={updateStatus.isPending}
          className="w-full px-3 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {updateStatus.isPending
            ? 'Updating...'
            : nextStatus === 'IN_PROGRESS'
              ? 'Start Task'
              : 'Complete Task'}
        </button>
      )}
    </div>
  );
}
