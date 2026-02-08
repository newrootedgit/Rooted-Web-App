import { Plus, Pencil, Trash2 } from 'lucide-react';
import { trpc } from '../../../lib/trpc';

interface LayoutListProps {
  onEdit: (layoutId: string) => void;
  onNew: () => void;
}

export function LayoutList({ onEdit, onNew }: LayoutListProps) {
  const utils = trpc.useUtils();
  const { data, isLoading } = trpc.farmLayouts.list.useQuery({ limit: 50 });
  const deleteMutation = trpc.farmLayouts.delete.useMutation({
    onSuccess: () => {
      utils.farmLayouts.list.invalidate();
    },
  });

  const layouts = data?.items ?? [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Farm Layouts</h2>
        <button
          onClick={onNew}
          className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Plus size={16} />
          New Layout
        </button>
      </div>

      {isLoading ? (
        <div className="text-sm text-muted-foreground">Loading layouts...</div>
      ) : layouts.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-sm">No layouts yet. Create your first farm layout.</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {layouts.map((layout) => (
            <div
              key={layout.id}
              className="border border-border rounded-lg p-4 bg-card flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div>
                  <div className="font-medium text-foreground">{layout.name}</div>
                  <div className="text-xs text-muted-foreground">
                    Created {layout.createdAt ? new Date(layout.createdAt).toLocaleDateString() : '—'}
                  </div>
                </div>
                {layout.isActive && (
                  <span className="px-2 py-0.5 rounded text-xs font-medium bg-green-500/20 text-green-400">
                    Active
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onEdit(layout.id)}
                  className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                  title="Edit"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => {
                    if (confirm('Delete this layout?')) {
                      deleteMutation.mutate({ id: layout.id });
                    }
                  }}
                  disabled={deleteMutation.isPending}
                  className="p-2 rounded-md text-muted-foreground hover:text-red-400 hover:bg-red-400/10 transition-colors disabled:opacity-50"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
