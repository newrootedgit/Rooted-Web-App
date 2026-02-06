import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { trpc } from '../../../lib/trpc';

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editProduct?: {
    id: string;
    name: string;
    categoryId: string | null;
    sku: string | null;
    daysSoaking: number;
    daysGermination: number;
    daysLight: number;
    avgYieldPerTray: number | null;
    seedWeight: number | null;
    seedUnit: string | null;
    unitCost: number | null;
    unitPrice: number | null;
  };
}

export function ProductForm({ isOpen, onClose, onSuccess, editProduct }: ProductFormProps) {
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [sku, setSku] = useState('');
  const [daysSoaking, setDaysSoaking] = useState(0);
  const [daysGermination, setDaysGermination] = useState(0);
  const [daysLight, setDaysLight] = useState(0);
  const [avgYieldPerTray, setAvgYieldPerTray] = useState('');
  const [seedWeight, setSeedWeight] = useState('');
  const [seedUnit, setSeedUnit] = useState('');
  const [unitCost, setUnitCost] = useState('');
  const [unitPrice, setUnitPrice] = useState('');
  const [error, setError] = useState('');

  const { data: categories } = trpc.products.categories.list.useQuery();

  const createMutation = trpc.products.create.useMutation({
    onSuccess: () => { onSuccess(); handleClose(); },
    onError: (err) => setError(err.message),
  });

  const updateMutation = trpc.products.update.useMutation({
    onSuccess: () => { onSuccess(); handleClose(); },
    onError: (err) => setError(err.message),
  });

  useEffect(() => {
    if (editProduct) {
      setName(editProduct.name);
      setCategoryId(editProduct.categoryId ?? '');
      setSku(editProduct.sku ?? '');
      setDaysSoaking(editProduct.daysSoaking);
      setDaysGermination(editProduct.daysGermination);
      setDaysLight(editProduct.daysLight);
      setAvgYieldPerTray(editProduct.avgYieldPerTray?.toString() ?? '');
      setSeedWeight(editProduct.seedWeight?.toString() ?? '');
      setSeedUnit(editProduct.seedUnit ?? '');
      setUnitCost(editProduct.unitCost?.toString() ?? '');
      setUnitPrice(editProduct.unitPrice?.toString() ?? '');
    } else {
      resetForm();
    }
  }, [editProduct, isOpen]);

  function resetForm() {
    setName('');
    setCategoryId('');
    setSku('');
    setDaysSoaking(0);
    setDaysGermination(0);
    setDaysLight(0);
    setAvgYieldPerTray('');
    setSeedWeight('');
    setSeedUnit('');
    setUnitCost('');
    setUnitPrice('');
    setError('');
  }

  function handleClose() {
    resetForm();
    onClose();
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    const base = {
      name,
      categoryId: categoryId || undefined,
      sku: sku || undefined,
      daysSoaking,
      daysGermination,
      daysLight,
      avgYieldPerTray: avgYieldPerTray ? Number(avgYieldPerTray) : undefined,
      seedWeight: seedWeight ? Number(seedWeight) : undefined,
      seedUnit: seedUnit || undefined,
      unitCost: unitCost ? Number(unitCost) : undefined,
      unitPrice: unitPrice ? Number(unitPrice) : undefined,
    };

    if (editProduct) {
      updateMutation.mutate({ id: editProduct.id, ...base });
    } else {
      createMutation.mutate(base);
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
          {editProduct ? 'Edit Product' : 'New Product'}
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
            <label className="text-sm font-medium text-foreground">Category</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="px-3 py-2 bg-secondary border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">None</option>
              {categories?.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-foreground">SKU</label>
            <input
              type="text"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              className="px-3 py-2 bg-secondary border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-foreground">Days Soaking</label>
              <input
                type="number"
                min={0}
                value={daysSoaking}
                onChange={(e) => setDaysSoaking(Number(e.target.value))}
                className="px-3 py-2 bg-secondary border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-foreground">Days Germination</label>
              <input
                type="number"
                min={0}
                value={daysGermination}
                onChange={(e) => setDaysGermination(Number(e.target.value))}
                className="px-3 py-2 bg-secondary border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-foreground">Days Light</label>
              <input
                type="number"
                min={0}
                value={daysLight}
                onChange={(e) => setDaysLight(Number(e.target.value))}
                className="px-3 py-2 bg-secondary border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-foreground">Avg Yield/Tray</label>
              <input
                type="number"
                step="0.01"
                min={0}
                value={avgYieldPerTray}
                onChange={(e) => setAvgYieldPerTray(e.target.value)}
                className="px-3 py-2 bg-secondary border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-foreground">Seed Weight</label>
              <input
                type="number"
                step="0.01"
                min={0}
                value={seedWeight}
                onChange={(e) => setSeedWeight(e.target.value)}
                className="px-3 py-2 bg-secondary border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-foreground">Seed Unit</label>
              <input
                type="text"
                value={seedUnit}
                onChange={(e) => setSeedUnit(e.target.value)}
                placeholder="e.g. grams"
                className="px-3 py-2 bg-secondary border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-foreground">Unit Cost ($)</label>
              <input
                type="number"
                step="0.01"
                min={0}
                value={unitCost}
                onChange={(e) => setUnitCost(e.target.value)}
                className="px-3 py-2 bg-secondary border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-foreground">Unit Price ($)</label>
              <input
                type="number"
                step="0.01"
                min={0}
                value={unitPrice}
                onChange={(e) => setUnitPrice(e.target.value)}
                className="px-3 py-2 bg-secondary border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-md font-semibold hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? 'Saving...' : editProduct ? 'Update Product' : 'Create Product'}
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
