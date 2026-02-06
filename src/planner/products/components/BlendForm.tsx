import { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { trpc } from '../../../lib/trpc';

interface BlendFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editBlend?: {
    id: string;
    name: string;
    description: string | null;
    ingredients?: {
      productId: string | null;
      percentage: number;
    }[];
  };
}

interface IngredientRow {
  productId: string;
  percentage: number;
}

export function BlendForm({ isOpen, onClose, onSuccess, editBlend }: BlendFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState<IngredientRow[]>([{ productId: '', percentage: 100 }]);
  const [error, setError] = useState('');

  const { data: productsData } = trpc.products.list.useQuery({ isActive: true, limit: 100 });
  const products = productsData?.items ?? [];

  const createMutation = trpc.products.blends.create.useMutation({
    onSuccess: () => { onSuccess(); handleClose(); },
    onError: (err) => setError(err.message),
  });

  const updateMutation = trpc.products.blends.update.useMutation({
    onSuccess: () => { onSuccess(); handleClose(); },
    onError: (err) => setError(err.message),
  });

  useEffect(() => {
    if (editBlend) {
      setName(editBlend.name);
      setDescription(editBlend.description ?? '');
      setIngredients(
        editBlend.ingredients?.map((i) => ({
          productId: i.productId ?? '',
          percentage: i.percentage,
        })) ?? [{ productId: '', percentage: 100 }]
      );
    } else {
      resetForm();
    }
  }, [editBlend, isOpen]);

  function resetForm() {
    setName('');
    setDescription('');
    setIngredients([{ productId: '', percentage: 100 }]);
    setError('');
  }

  function handleClose() {
    resetForm();
    onClose();
  }

  function addIngredient() {
    setIngredients([...ingredients, { productId: '', percentage: 0 }]);
  }

  function removeIngredient(index: number) {
    if (ingredients.length <= 1) return;
    setIngredients(ingredients.filter((_, i) => i !== index));
  }

  function updateIngredient(index: number, field: keyof IngredientRow, value: string | number) {
    setIngredients(ingredients.map((ing, i) => i === index ? { ...ing, [field]: value } : ing));
  }

  const totalPercentage = ingredients.reduce((sum, i) => sum + i.percentage, 0);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    const validIngredients = ingredients
      .filter((i) => i.productId)
      .map((i) => ({ productId: i.productId, percentage: i.percentage }));

    if (validIngredients.length === 0) {
      setError('Add at least one ingredient');
      return;
    }

    if (editBlend) {
      updateMutation.mutate({ id: editBlend.id, name, description: description || undefined, ingredients: validIngredients });
    } else {
      createMutation.mutate({ name, description: description || undefined, ingredients: validIngredients });
    }
  }

  if (!isOpen) return null;

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="relative bg-card rounded-lg p-6 w-full max-w-lg shadow-lg border border-border max-h-[90vh] overflow-y-auto">
        <button onClick={handleClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors">
          <X size={20} />
        </button>

        <h2 className="text-xl font-semibold text-foreground mb-6">
          {editBlend ? 'Edit Blend' : 'New Blend'}
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md text-sm text-destructive">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-foreground">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="px-3 py-2 bg-secondary border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-foreground">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="px-3 py-2 bg-secondary border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">Ingredients</label>
              <span className={`text-sm font-medium ${Math.abs(totalPercentage - 100) < 0.01 ? 'text-green-600' : 'text-destructive'}`}>
                Total: {totalPercentage}%
              </span>
            </div>

            {ingredients.map((ing, index) => (
              <div key={index} className="flex items-center gap-2">
                <select
                  value={ing.productId}
                  onChange={(e) => updateIngredient(index, 'productId', e.target.value)}
                  className="flex-1 px-3 py-2 bg-secondary border border-border rounded-md text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                >
                  <option value="">Select product</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    step="0.01"
                    value={ing.percentage}
                    onChange={(e) => updateIngredient(index, 'percentage', Number(e.target.value))}
                    className="w-20 px-2 py-2 bg-secondary border border-border rounded-md text-foreground text-sm text-right focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                  <span className="text-sm text-muted-foreground">%</span>
                </div>
                {ingredients.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeIngredient(index)}
                    className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={addIngredient}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-primary hover:text-primary/80 transition-colors self-start"
            >
              <Plus size={16} />
              Add Ingredient
            </button>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-md font-semibold hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? 'Saving...' : editBlend ? 'Update Blend' : 'Create Blend'}
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
