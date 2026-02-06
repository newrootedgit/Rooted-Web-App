import type { ProductionTask } from '../types';
import { formatShortDate } from '../utils/dates';

interface SeedingTaskCardProps {
  task: ProductionTask;
  selected: boolean;
  onToggle: (id: string) => void;
  onComplete: (id: string) => void;
}

export function SeedingTaskCard({ task, selected, onToggle, onComplete }: SeedingTaskCardProps) {
  const productName = task.orderItem?.products?.name ?? task.orderItem?.blends?.name ?? task.title;
  const traysNeeded = task.orderItem?.trays_needed ?? '—';
  const orderNumber = task.orderItem?.orders?.order_number ?? '';

  return (
    <div className="flex items-center justify-between gap-4 border border-border rounded-lg p-3 bg-card">
      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onToggle(task.id)}
          className="rounded"
        />
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-foreground">{productName}</span>
          <span className="text-xs text-muted-foreground">
            {task.type === 'SOAK' ? 'Soak' : 'Seed'} • Due {formatShortDate(task.dueDate)}
          </span>
          {orderNumber && <span className="text-xs text-muted-foreground">Order {orderNumber}</span>}
        </div>
      </label>
      <div className="text-sm text-muted-foreground">Trays: {traysNeeded}</div>
      <button
        onClick={() => onComplete(task.id)}
        className="px-3 py-1.5 text-xs font-medium text-green-500 border border-green-500/30 rounded hover:bg-green-500/10 transition-colors"
      >
        Complete
      </button>
    </div>
  );
}
