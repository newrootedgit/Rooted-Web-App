import { useState } from 'react';
import { X } from 'lucide-react';
import { trpc } from '../../../lib/trpc';

interface TaskCompletionFormProps {
  isOpen: boolean;
  taskId: string | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function TaskCompletionForm({ isOpen, taskId, onClose, onSuccess }: TaskCompletionFormProps) {
  const [actualTrays, setActualTrays] = useState('');
  const [seedLot, setSeedLot] = useState('');
  const [completionNotes, setCompletionNotes] = useState('');
  const [error, setError] = useState('');

  const completeMutation = trpc.tasks.complete.useMutation({
    onSuccess: () => {
      onSuccess();
      handleClose();
    },
    onError: (err) => setError(err.message),
  });

  function handleClose() {
    setActualTrays('');
    setSeedLot('');
    setCompletionNotes('');
    setError('');
    onClose();
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!taskId) return;

    completeMutation.mutate({
      id: taskId,
      actualTrays: actualTrays ? parseInt(actualTrays, 10) : undefined,
      seedLot: seedLot || undefined,
      completionNotes: completionNotes || undefined,
    });
  }

  if (!isOpen || !taskId) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="relative bg-card rounded-lg p-6 w-full max-w-md shadow-lg border border-border">
        <button onClick={handleClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
          <X size={20} />
        </button>

        <h2 className="text-xl font-semibold text-foreground mb-6">Complete Task</h2>

        {error && (
          <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md text-sm text-destructive">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-foreground">Actual Trays</label>
            <input
              type="number"
              value={actualTrays}
              onChange={(e) => setActualTrays(e.target.value)}
              min={0}
              placeholder="Optional"
              className="px-3 py-2 bg-secondary border border-border rounded-md text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-foreground">Seed Lot</label>
            <input
              type="text"
              value={seedLot}
              onChange={(e) => setSeedLot(e.target.value)}
              placeholder="Optional"
              className="px-3 py-2 bg-secondary border border-border rounded-md text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-foreground">Notes</label>
            <textarea
              value={completionNotes}
              onChange={(e) => setCompletionNotes(e.target.value)}
              rows={3}
              placeholder="Optional"
              className="px-3 py-2 bg-secondary border border-border rounded-md text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={completeMutation.isPending}
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-md font-semibold hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              {completeMutation.isPending ? 'Completing...' : 'Mark Complete'}
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 bg-transparent border border-border text-foreground rounded-md hover:bg-secondary transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
