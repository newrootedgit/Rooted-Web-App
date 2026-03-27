import { useState } from 'react';
import { X } from 'lucide-react';

interface CloneOrderModalProps {
  isOpen: boolean;
  order: any;
  onClose: () => void;
  onSubmit: (dayOffset: number) => void;
}

export function CloneOrderModal({ isOpen, order, onClose, onSubmit }: CloneOrderModalProps) {
  const [dayOffset, setDayOffset] = useState(7);

  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-lg">
        <button onClick={onClose} className="absolute right-4 top-4 text-muted-foreground hover:text-foreground">
          <X size={20} />
        </button>
        <h2 className="mb-2 text-xl font-semibold text-foreground">Clone Order</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          {order.orderNumber} • {order.customer?.name ?? 'No customer'} • {(order.items ?? []).length} item(s)
        </p>
        <div className="space-y-3">
          <label className="block text-sm font-medium text-foreground">Shift harvest dates by days</label>
          <input
            type="number"
            value={dayOffset}
            onChange={(e) => setDayOffset(Number(e.target.value))}
            className="w-full px-3 py-2 bg-secondary border border-border rounded-md text-sm"
          />
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={onClose} className="px-4 py-2 border border-border rounded-md hover:bg-secondary transition-colors">Cancel</button>
            <button onClick={() => onSubmit(dayOffset)} className="px-4 py-2 bg-primary text-primary-foreground rounded-md font-semibold hover:bg-primary/90 transition-colors">Clone Order</button>
          </div>
        </div>
      </div>
    </div>
  );
}
