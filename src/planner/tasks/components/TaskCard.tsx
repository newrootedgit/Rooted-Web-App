import { Clock, Play, CheckCircle2 } from 'lucide-react';

const TYPE_COLORS: Record<string, string> = {
  'SOAK': 'border-l-blue-500 bg-blue-500/5',
  'SEED': 'border-l-green-500 bg-green-500/5',
  'MOVE_TO_LIGHT': 'border-l-yellow-500 bg-yellow-500/5',
  'HARVEST': 'border-l-red-500 bg-red-500/5',
};

const TYPE_LABELS: Record<string, string> = {
  'SOAK': 'Soak',
  'SEED': 'Seed',
  'MOVE_TO_LIGHT': 'Move to Light',
  'HARVEST': 'Harvest',
};

const STATUS_ICONS: Record<string, React.ReactNode> = {
  'TODO': <Clock size={14} className="text-muted-foreground" />,
  'IN_PROGRESS': <Play size={14} className="text-blue-400" />,
  'COMPLETED': <CheckCircle2 size={14} className="text-green-400" />,
};

interface Task {
  id: string;
  title: string;
  type: string;
  dueDate: string | Date;
  status: string | null;
  orderItem?: {
    orders?: { order_number: string } | null;
    products?: { name: string } | null;
    blends?: { name: string } | null;
  } | null;
}

interface TaskCardProps {
  task: Task;
  onStart: (id: string) => void;
  onComplete: (id: string) => void;
}

function formatDate(d: string | Date): string {
  return new Date(d).toLocaleDateString();
}

export function TaskCard({ task, onStart, onComplete }: TaskCardProps) {
  const typeColor = TYPE_COLORS[task.type] ?? '';
  const typeLabel = TYPE_LABELS[task.type] ?? task.type;
  const productName = task.orderItem?.products?.name ?? task.orderItem?.blends?.name ?? '';
  const orderNumber = task.orderItem?.orders?.order_number ?? '';

  return (
    <div className={`border border-border border-l-4 rounded-lg p-3 ${typeColor}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-1 min-w-0">
          <div className="flex items-center gap-2">
            {STATUS_ICONS[task.status ?? 'TODO']}
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {typeLabel}
            </span>
          </div>
          <span className="text-sm font-medium text-foreground truncate">{productName}</span>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {orderNumber && <span>{orderNumber}</span>}
            <span>{formatDate(task.dueDate)}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {task.status === 'TODO' && (
            <button
              onClick={() => onStart(task.id)}
              className="px-2 py-1 text-xs font-medium text-blue-400 border border-blue-500/30 rounded hover:bg-blue-500/10 transition-colors"
            >
              Start
            </button>
          )}
          {(task.status === 'TODO' || task.status === 'IN_PROGRESS') && (
            <button
              onClick={() => onComplete(task.id)}
              className="px-2 py-1 text-xs font-medium text-green-400 border border-green-500/30 rounded hover:bg-green-500/10 transition-colors"
            >
              Complete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
