import { useEffect, useMemo, useState } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import { trpc } from '../../../lib/trpc';

interface OrderItemState {
  productId?: string;
  blendId?: string;
  skuId?: string;
  quantityUnits: number;
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

function formatDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

function getLongestTiming(blend: any) {
  const ingredients = blend?.ingredients ?? [];
  return ingredients.reduce((longest: any, ingredient: any) => {
    const product = ingredient.product;
    if (!product) return longest;
    const total = product.daysSoaking + product.daysGermination + product.daysLight;
    const currentLongest = longest
      ? longest.daysSoaking + longest.daysGermination + longest.daysLight
      : -1;
    return total > currentLongest ? product : longest;
  }, null);
}

export function OrderForm({ isOpen, onClose, onSuccess }: OrderFormProps) {
  const [customerId, setCustomerId] = useState('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<OrderItemState[]>([{ quantityUnits: 1, harvestDate: '', overagePercent: 10 }]);
  const [error, setError] = useState('');

  const { data: productsData } = trpc.products.list.useQuery({ isActive: true, limit: 100 });
  const { data: blendsData } = trpc.products.blends.list.useQuery({ limit: 100 });
  const { data: customersData } = trpc.customers.list.useQuery({ isActive: true, limit: 100 });
  const { data: skusData } = trpc.products.skus.list.useQuery({ isAvailable: true, limit: 300 });

  const products = productsData?.items ?? [];
  const blends = blendsData?.items ?? [];
  const customers = customersData?.items ?? [];
  const skus = skusData?.items ?? [];

  const createMutation = trpc.orders.create.useMutation({
    onSuccess: () => {
      onSuccess();
      handleClose();
    },
    onError: (err) => setError(err.message),
  });

  useEffect(() => {
    if (isOpen) {
      setCustomerId('');
      setNotes('');
      setItems([{ quantityUnits: 1, harvestDate: '', overagePercent: 10 }]);
      setError('');
    }
  }, [isOpen]);

  const skuLookup = useMemo(() => Object.fromEntries(skus.map((sku) => [sku.id, sku])), [skus]);

  if (!isOpen) return null;

  function handleClose() {
    setCustomerId('');
    setNotes('');
    setItems([{ quantityUnits: 1, harvestDate: '', overagePercent: 10 }]);
    setError('');
    onClose();
  }

  function updateItem(index: number, patch: Partial<OrderItemState>) {
    const next = [...items];
    next[index] = { ...next[index], ...patch };
    if (patch.productId !== undefined) {
      next[index].blendId = undefined;
      next[index].skuId = undefined;
    }
    if (patch.blendId !== undefined) {
      next[index].productId = undefined;
      next[index].skuId = undefined;
    }
    setItems(next);
  }

  function getOwnerSkus(item: OrderItemState) {
    return skus.filter((sku) => (item.productId ? sku.productId === item.productId : sku.blendId === item.blendId));
  }

  function getQuantityOz(item: OrderItemState) {
    const sku = item.skuId ? skuLookup[item.skuId] : null;
    return sku ? sku.weightOz * item.quantityUnits : 0;
  }

  function getProductionDates(item: OrderItemState) {
    if (!item.harvestDate) return null;
    const timing = item.productId
      ? products.find((product) => product.id === item.productId)
      : blends.find((blend) => blend.id === item.blendId) && getLongestTiming(blends.find((blend) => blend.id === item.blendId));

    if (!timing) return null;

    const harvest = new Date(item.harvestDate);
    const moveToLightDate = subDays(harvest, timing.daysLight);
    const seedDate = subDays(moveToLightDate, timing.daysGermination);
    const soakDate = subDays(seedDate, timing.daysSoaking);
    return {
      soakDate: formatDate(soakDate),
      seedDate: formatDate(seedDate),
      moveToLightDate: formatDate(moveToLightDate),
    };
  }

  function getBlendBreakdown(item: OrderItemState) {
    const blend = item.blendId ? blends.find((value) => value.id === item.blendId) : null;
    if (!blend || !item.harvestDate || !item.skuId) return [];
    const quantityOz = getQuantityOz(item);
    const totalWithOverage = quantityOz * (1 + item.overagePercent / 100);
    const harvestDate = new Date(item.harvestDate);
    return (blend.ingredients ?? []).map((ingredient: any) => {
      const targetOz = totalWithOverage * (ingredient.percentage / 100);
      const product = ingredient.product;
      const traysNeeded = product?.avgYieldPerTray ? Math.ceil(targetOz / product.avgYieldPerTray) : null;
      const moveToLightDate = subDays(harvestDate, product.daysLight);
      const seedDate = subDays(moveToLightDate, product.daysGermination);
      const soakDate = subDays(seedDate, product.daysSoaking);
      return {
        id: ingredient.id,
        name: product?.name ?? 'Unknown',
        percentage: ingredient.percentage,
        targetOz,
        traysNeeded,
        soakDate: formatDate(soakDate),
        seedDate: formatDate(seedDate),
        moveToLightDate: formatDate(moveToLightDate),
      };
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validItems = items.filter((item) => (item.productId || item.blendId) && item.skuId && item.harvestDate && item.quantityUnits > 0);
    if (validItems.length === 0) {
      setError('At least one complete item is required');
      return;
    }

    createMutation.mutate({
      customerId: customerId || undefined,
      notes: notes || undefined,
      items: validItems.map((item) => ({
        productId: item.productId,
        blendId: item.blendId,
        skuId: item.skuId,
        quantityUnits: item.quantityUnits,
        quantityOz: getQuantityOz(item),
        harvestDate: item.harvestDate,
        overagePercent: item.overagePercent,
      })),
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg border border-border bg-card p-6 shadow-lg">
        <button onClick={handleClose} className="absolute right-4 top-4 text-muted-foreground hover:text-foreground">
          <X size={20} />
        </button>
        <h2 className="mb-6 text-xl font-semibold text-foreground">New Order</h2>
        {error && <div className="mb-4 rounded-md border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-3 md:grid-cols-2">
            <select value={customerId} onChange={(e) => setCustomerId(e.target.value)} className="px-3 py-2 bg-secondary border border-border rounded-md text-sm">
              <option value="">No customer</option>
              {customers.map((customer) => <option key={customer.id} value={customer.id}>{customer.name}</option>)}
            </select>
            <input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes" className="px-3 py-2 bg-secondary border border-border rounded-md text-sm" />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">Items</h3>
              <button type="button" onClick={() => setItems([...items, { quantityUnits: 1, harvestDate: '', overagePercent: 10 }])} className="inline-flex items-center gap-1 text-xs text-primary">
                <Plus size={14} />
                Add Item
              </button>
            </div>

            {items.map((item, index) => {
              const ownerSkus = getOwnerSkus(item);
              const quantityOz = getQuantityOz(item);
              const dates = getProductionDates(item);
              const blendBreakdown = getBlendBreakdown(item);
              return (
                <div key={index} className="space-y-3 rounded-lg border border-border bg-secondary/40 p-4">
                  <div className="grid gap-3 md:grid-cols-[2fr_2fr_1fr_1fr_auto]">
                    <select
                      value={item.productId || item.blendId || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        const isBlend = blends.some((blend) => blend.id === value);
                        updateItem(index, isBlend ? { blendId: value } : { productId: value });
                      }}
                      className="px-3 py-2 bg-secondary border border-border rounded-md text-sm"
                    >
                      <option value="">Select variety or blend</option>
                      <optgroup label="Varieties">
                        {products.map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}
                      </optgroup>
                      <optgroup label="Blends">
                        {blends.map((blend) => <option key={blend.id} value={blend.id}>{blend.name}</option>)}
                      </optgroup>
                    </select>
                    <select value={item.skuId || ''} onChange={(e) => updateItem(index, { skuId: e.target.value })} className="px-3 py-2 bg-secondary border border-border rounded-md text-sm" disabled={!item.productId && !item.blendId}>
                      <option value="">Select SKU / package</option>
                      {ownerSkus.map((sku) => <option key={sku.id} value={sku.id}>{sku.name} ({sku.weightOz} oz)</option>)}
                    </select>
                    <input type="number" min={1} value={item.quantityUnits} onChange={(e) => updateItem(index, { quantityUnits: Number(e.target.value) })} className="px-3 py-2 bg-secondary border border-border rounded-md text-sm" />
                    <input type="date" value={item.harvestDate} onChange={(e) => updateItem(index, { harvestDate: e.target.value })} className="px-3 py-2 bg-secondary border border-border rounded-md text-sm" />
                    <button type="button" onClick={() => items.length > 1 && setItems(items.filter((_, itemIndex) => itemIndex !== index))} className="px-3 py-2 text-destructive hover:bg-destructive/10 rounded-md transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="grid gap-3 md:grid-cols-4">
                    <input type="number" min={0} max={100} value={item.overagePercent} onChange={(e) => updateItem(index, { overagePercent: Number(e.target.value) })} placeholder="Overage %" className="px-3 py-2 bg-secondary border border-border rounded-md text-sm" />
                    <div className="rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground">Total oz: {quantityOz.toFixed(2)}</div>
                    <div className="rounded-md border border-border bg-card px-3 py-2 text-sm text-muted-foreground">Soak: {dates?.soakDate ?? '—'}</div>
                    <div className="rounded-md border border-border bg-card px-3 py-2 text-sm text-muted-foreground">Seed: {dates?.seedDate ?? '—'}</div>
                  </div>

                  {item.blendId && blendBreakdown.length > 0 && (
                    <div className="rounded-lg border border-border bg-card p-3">
                      <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Ingredient Breakdown</div>
                      <div className="space-y-2">
                        {blendBreakdown.map((ingredient) => (
                          <div key={ingredient.id} className="grid gap-2 text-sm md:grid-cols-6">
                            <div className="font-medium text-foreground">{ingredient.name} ({ingredient.percentage}%)</div>
                            <div className="text-muted-foreground">{ingredient.targetOz.toFixed(2)} oz</div>
                            <div className="text-muted-foreground">Trays {ingredient.traysNeeded ?? '—'}</div>
                            <div className="text-muted-foreground">Soak {ingredient.soakDate}</div>
                            <div className="text-muted-foreground">Seed {ingredient.seedDate}</div>
                            <div className="text-muted-foreground">Light {ingredient.moveToLightDate}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex justify-end gap-3">
            <button type="button" onClick={handleClose} className="px-4 py-2 border border-border rounded-md hover:bg-secondary transition-colors">Cancel</button>
            <button type="submit" disabled={createMutation.isPending} className="px-4 py-2 bg-primary text-primary-foreground rounded-md font-semibold hover:bg-primary/90 disabled:opacity-50 transition-colors">
              {createMutation.isPending ? 'Creating...' : 'Create Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
