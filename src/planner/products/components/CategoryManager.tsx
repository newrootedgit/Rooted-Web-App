import { useState } from 'react';
import { Plus, Edit2, Trash2, X, Check } from 'lucide-react';
import { trpc } from '../../../lib/trpc';

export function CategoryManager() {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const { data: categories, isLoading } = trpc.products.categories.list.useQuery();
  const utils = trpc.useUtils();

  const createMutation = trpc.products.categories.create.useMutation({
    onSuccess: () => {
      utils.products.categories.list.invalidate();
      setIsAdding(false);
      setName('');
      setDescription('');
      setError('');
    },
    onError: (err) => setError(err.message),
  });

  const updateMutation = trpc.products.categories.update.useMutation({
    onSuccess: () => {
      utils.products.categories.list.invalidate();
      setEditingId(null);
      setName('');
      setDescription('');
      setError('');
    },
    onError: (err) => setError(err.message),
  });

  const archiveMutation = trpc.products.categories.archive.useMutation({
    onSuccess: () => utils.products.categories.list.invalidate(),
    onError: (err) => setError(err.message),
  });

  function startEdit(cat: { id: string; name: string; description: string | null }) {
    setEditingId(cat.id);
    setName(cat.name);
    setDescription(cat.description ?? '');
    setError('');
  }

  function cancelEdit() {
    setEditingId(null);
    setIsAdding(false);
    setName('');
    setDescription('');
    setError('');
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editingId) {
      updateMutation.mutate({ id: editingId, name, description: description || undefined });
    } else {
      createMutation.mutate({ name, description: description || undefined });
    }
  }

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Categories</h3>
        {!isAdding && !editingId && (
          <button
            onClick={() => { setIsAdding(true); setError(''); }}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            <Plus size={16} />
            Add
          </button>
        )}
      </div>

      {error && (
        <div className="mb-3 p-2 bg-destructive/10 border border-destructive/20 rounded-md text-sm text-destructive">
          {error}
        </div>
      )}

      {(isAdding || editingId) && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2 mb-4 p-3 bg-secondary rounded-md">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Category name"
            className="px-3 py-2 bg-background border border-border rounded-md text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            required
            autoFocus
          />
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (optional)"
            className="px-3 py-2 bg-background border border-border rounded-md text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <div className="flex gap-2">
            <button type="submit" className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
              <Check size={14} />
              {editingId ? 'Update' : 'Create'}
            </button>
            <button type="button" onClick={cancelEdit} className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <X size={14} />
              Cancel
            </button>
          </div>
        </form>
      )}

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading...</p>
      ) : categories && categories.length > 0 ? (
        <ul className="space-y-1">
          {categories.map((cat) => (
            <li key={cat.id} className="flex items-center justify-between px-3 py-2 rounded-md hover:bg-secondary transition-colors">
              <div>
                <span className="text-sm font-medium text-foreground">{cat.name}</span>
                {cat.description && <span className="text-xs text-muted-foreground ml-2">{cat.description}</span>}
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => startEdit(cat)}
                  className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Delete "${cat.name}"?`)) archiveMutation.mutate({ id: cat.id });
                  }}
                  className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">No categories yet.</p>
      )}
    </div>
  );
}
