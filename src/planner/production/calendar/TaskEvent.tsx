import { useDraggable } from '@dnd-kit/core';
import type { ProductionTask } from '../types';

const TYPE_COLORS: Record<string, string> = {
  'SOAK': 'border-blue-500 text-blue-500 bg-blue-500/10',
  'SEED': 'border-green-500 text-green-500 bg-green-500/10',
  'MOVE_TO_LIGHT': 'border-yellow-500 text-yellow-500 bg-yellow-500/10',
  'HARVEST': 'border-red-500 text-red-500 bg-red-500/10',
};

const TYPE_LABELS: Record<string, string> = {
  'SOAK': 'Soak',
  'SEED': 'Seed',
  'MOVE_TO_LIGHT': 'Move to Light',
  'HARVEST': 'Harvest',
};

interface TaskEventProps {
  task: ProductionTask;
  onSelect: (task: ProductionTask) => void;
  isSelected: boolean;
  isDragOverlay?: boolean;
  compact?: boolean;
}

export function TaskEvent({ task, onSelect, isSelected, isDragOverlay, compact }: TaskEventProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: task.id,
    data: { task },
  });

  const typeLabel = TYPE_LABELS[task.type] ?? task.type;
  const productName = task.orderItem?.products?.name ?? task.orderItem?.blends?.name ?? task.title;
  const orderNumber = task.orderItem?.orders?.order_number ?? '';
  const color = TYPE_COLORS[task.type] ?? 'border-border text-foreground bg-secondary';

  return (
    <div
      ref={isDragOverlay ? undefined : setNodeRef}
      role="button"
      tabIndex={0}
      onClick={() => onSelect(task)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onSelect(task); }}
      className={`w-full text-left border rounded-md px-2 py-1 text-xs font-medium transition-colors cursor-pointer select-none ${color} ${
        isSelected ? 'ring-2 ring-primary/40' : ''
      } ${isDragging ? 'opacity-30' : ''} ${isDragOverlay ? 'shadow-lg ring-2 ring-primary' : ''}`}
      style={{ touchAction: 'none' }}
      {...(isDragOverlay ? {} : { ...listeners, ...attributes })}
    >
      {compact ? (
        <span className="truncate block">{productName}</span>
      ) : (
        <>
          <div className="flex items-center justify-between gap-2">
            <span className="truncate">{productName}</span>
            <span className="text-[10px] uppercase tracking-wide">{typeLabel}</span>
          </div>
          {orderNumber && <div className="text-[10px] text-muted-foreground">{orderNumber}</div>}
        </>
      )}
    </div>
  );
}
