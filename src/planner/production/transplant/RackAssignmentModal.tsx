import { X } from 'lucide-react';
import type { ProductionTask } from '../types';

interface RackAssignmentModalProps {
  task: ProductionTask | null;
  isOpen: boolean;
  onClose: () => void;
}

export function RackAssignmentModal({ task, isOpen, onClose }: RackAssignmentModalProps) {
  if (!isOpen || !task) return null;

  const productName = task.orderItem?.products?.name ?? task.orderItem?.blends?.name ?? task.title;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="relative bg-card rounded-lg p-6 w-full max-w-md shadow-lg border border-border">
        <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
          <X size={20} />
        </button>

        <h2 className="text-xl font-semibold text-foreground mb-2">Rack Assignment</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Rack assignments will be fully implemented in Phase 5. For now, use this as a placeholder.
        </p>

        <div className="space-y-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Task</div>
            <div className="text-sm font-medium text-foreground">{productName}</div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-foreground">Rack ID</label>
            <input
              type="text"
              disabled
              placeholder="Rack assignment coming in Phase 5"
              className="px-3 py-2 bg-secondary border border-border rounded-md text-foreground text-sm focus:outline-none"
            />
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-full px-4 py-2 bg-secondary text-foreground rounded-md font-semibold hover:bg-secondary/80 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
