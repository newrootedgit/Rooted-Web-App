import type { ProductionTask } from '../types';
import { formatShortDate } from '../utils/dates';

interface HarvestTaskCardProps {
  task: ProductionTask;
  onRecordYield: (id: string) => void;
}

export function HarvestTaskCard({ task, onRecordYield }: HarvestTaskCardProps) {
  const productName = task.orderItem?.products?.name ?? task.orderItem?.blends?.name ?? task.title;
  const traysNeeded = task.orderItem?.trays_needed ?? '—';
  const orderNumber = task.orderItem?.orders?.order_number ?? '';

  return (
    <div className="flex items-center justify-between gap-4 border border-border rounded-lg p-3 bg-card">
      <div className="flex flex-col">
        <span className="text-sm font-semibold text-foreground">{productName}</span>
        <span className="text-xs text-muted-foreground">
          Due {formatShortDate(task.dueDate)} • Trays {traysNeeded}
        </span>
        {orderNumber && <span className="text-xs text-muted-foreground">Order {orderNumber}</span>}
      </div>
      <button
        onClick={() => onRecordYield(task.id)}
        className="px-3 py-1.5 text-xs font-medium text-green-500 border border-green-500/30 rounded hover:bg-green-500/10 transition-colors"
      >
        Record Yield
      </button>
    </div>
  );
}
