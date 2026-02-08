import { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { trpc } from '../../../lib/trpc';

interface OrderItem {
  productId?: string;
  blendId?: string;
  quantityOz: number;
  harvestDate: string;
  overagePercent: number;
}

interface OrderFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

function subDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() - days);
  return result;
}

function formatDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function OrderForm({ isOpen, onClose, onSuccess }: OrderFormProps) {
  const [customerId, setCustomerId] = useState('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<OrderItem[]>([{
    quantityOz: 16,
    harvestDate: '',
    overagePercent: 10,
  }]);
  const [error, setError] = useState('');

  const { data: productsData } = trpc.products.list.useQuery({ isActive: true, limit: 100 });
  const { data: blendsData } = trpc.products.blends.list.useQuery({ limit: 100 });
  const { data: customersData } = trpc.customers.list.useQuery({ isActive: true, limit: 100 });

  const products = productsData?.items ?? [];
  const blends = blendsData?.items ?? [];
  const customers = customersData?.items ?? [];

  const createMutation = trpc.orders.create.useMutation({
    onSuccess: () => {
      onSuccess();
      handleClose();
    },
    onError: (err) => setError(err.message),
  });

  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen]);

  function resetForm() {
    setCustomerId('');
    setNotes('');
    setItems([{ quantityOz: 16, harvestDate: '', overagePercent: 10 }]);
    setError('');
  }

  function handleClose() {
    resetForm();
    onClose();
  }

  function addItem() {
    setItems([...items, { quantityOz: 16, harvestDate: '', overagePercent: 10 }]);
  }

  function removeItem(index: number) {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== index));
  }

  function updateItem(index: number, field: keyof OrderItem, value: any) {
    const updated = [...items];
    (updated[index] as any)[field] = value;
    // Clear the other selection when one is picked
    if (field === 'productId') {
      updated[index].blendId = undefined;
    } else if (field === 'blendId') {
      updated[index].productId = undefined;
    }
    setItems(updated);
  }

  function getCalculatedDates(item: OrderItem) {
    if (!item.harvestDate) return null;

    let timing: { daysSoaking: number; daysGermination: number; daysLight: number } | null = null;

    if (item.productId) {
      const product = products.find(p => p.id === item.productId);
      if (product) {
        timing = {
          daysSoaking: product.daysSoaking,
          daysGermination: product.daysGermination,
          daysLight: product.daysLight,
        };
      }
    }

    if (!timing) return null;

    const harvest = new Date(item.harvestDate);
    const moveToLight = subDays(harvest, timing.daysLight);
    const seed = subDays(moveToLight, timing.daysGermination);
    const soak = subDays(seed, timing.daysSoaking);

    return {
      soakDate: formatDate(soak),
      seedDate: formatDate(seed),
      moveToLightDate: formatDate(moveToLight),
    };
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    const validItems = items.filter(i => (i.productId || i.blendId) && i.harvestDate);
    if (validItems.length === 0) {
      setError('At least one item with a product/blend and harvest date is required');
      return;
    }

    createMutation.mutate({
      customerId: customerId || undefined,
      notes: notes || undefined,
      items: validItems.map(i => ({
        productId: i.productId || undefined,
        blendId: i.blendId || undefined,
        quantityOz: i.quantityOz,
        harvestDate: i.harvestDate,
        overagePercent: i.overagePercent,
      })),
    });
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="relative bg-card rounded-lg p-6 w-full max-w-2xl shadow-lg border border-border max-h-[90vh] overflow-y-auto">
        <button onClick={handleClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
          <X size={20} />
        </button>

        <h2 className="text-xl font-semibold text-foreground mb-6">New Order</h2>

        {error && (
          <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md text-sm text-destructive">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-foreground">Customer</label>
              <select
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                className="px-3 py-2 bg-secondary border border-border rounded-md text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">No customer</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-foreground">Notes</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Optional notes"
                className="px-3 py-2 bg-secondary border border-border rounded-md text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-foreground">Items</h3>
              <button
                type="button"
                onClick={addItem}
                className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-primary hover:bg-primary/10 rounded-md transition-colors"
              >
                <Plus size={14} />
                Add Item
              </button>
            </div>

            {items.map((item, index) => {
              const dates = getCalculatedDates(item);
              return (
                <div key={index} className="p-3 bg-secondary/50 border border-border rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="flex-1 grid grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1">
                        <label className="text-xs text-muted-foreground">Variety or Blend</label>
                        <select
                          value={item.productId || item.blendId || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            const isBlend = blends.some(b => b.id === val);
                            if (isBlend) {
                              updateItem(index, 'blendId', val);
                            } else {
                              updateItem(index, 'productId', val);
                            }
                          }}
                          className="px-2 py-1.5 bg-secondary border border-border rounded-md text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          <option value="">Select...</option>
                          <optgroup label="Varieties">
                            {products.map((p) => (
                              <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                          </optgroup>
                          {blends.length > 0 && (
                            <optgroup label="Blends">
                              {blends.map((b) => (
                                <option key={b.id} value={b.id}>{b.name}</option>
                              ))}
                            </optgroup>
                          )}
                        </select>
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-xs text-muted-foreground">Harvest Date</label>
                        <input
                          type="date"
                          value={item.harvestDate}
                          onChange={(e) => updateItem(index, 'harvestDate', e.target.value)}
                          className="px-2 py-1.5 bg-secondary border border-border rounded-md text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-xs text-muted-foreground">Quantity (oz)</label>
                        <input
                          type="number"
                          value={item.quantityOz}
                          onChange={(e) => updateItem(index, 'quantityOz', Number(e.target.value))}
                          min={0.01}
                          step={0.01}
                          className="px-2 py-1.5 bg-secondary border border-border rounded-md text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-xs text-muted-foreground">Overage %</label>
                        <input
                          type="number"
                          value={item.overagePercent}
                          onChange={(e) => updateItem(index, 'overagePercent', Number(e.target.value))}
                          min={0}
                          max={100}
                          className="px-2 py-1.5 bg-secondary border border-border rounded-md text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="mt-5 p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                  {dates && (
                    <div className="mt-2 pt-2 border-t border-border/50 flex gap-4 text-xs text-muted-foreground">
                      <span>Soak: {dates.soakDate}</span>
                      <span>Seed: {dates.seedDate}</span>
                      <span>Light: {dates.moveToLightDate}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-md font-semibold hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              {createMutation.isPending ? 'Creating...' : 'Create Order'}
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
