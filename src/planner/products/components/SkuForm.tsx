import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { trpc } from '../../../lib/trpc';

interface SkuFormProps {
  isOpen: boolean;
  sku?: any;
  onClose: () => void;
  onSuccess: () => void;
}

export function SkuForm({ isOpen, sku, onClose, onSuccess }: SkuFormProps) {
  const [form, setForm] = useState<any>({
    ownerType: 'product',
    ownerId: '',
    code: '',
    name: '',
    weightOz: '4',
    price: '',
    packageTypeId: '',
    salesChannel: 'BOTH',
    isAvailable: true,
    isPublic: false,
    stockQuantity: '0',
    lowStockThreshold: '0',
  });
  const [error, setError] = useState('');

  const { data: products } = trpc.products.list.useQuery({ isActive: true, limit: 100 });
  const { data: blends } = trpc.products.blends.list.useQuery({ limit: 100 });
  const { data: packageTypes } = trpc.products.packageTypes.list.useQuery();

  const createMutation = trpc.products.skus.create.useMutation({ onSuccess, onError: (err) => setError(err.message) });
  const updateMutation = trpc.products.skus.update.useMutation({ onSuccess, onError: (err) => setError(err.message) });

  useEffect(() => {
    if (!isOpen) return;
    setForm({
      ownerType: sku?.productId ? 'product' : 'blend',
      ownerId: sku?.productId ?? sku?.blendId ?? '',
      code: sku?.code ?? '',
      name: sku?.name ?? '',
      weightOz: sku?.weightOz?.toString() ?? '4',
      price: sku?.price?.toString() ?? '',
      packageTypeId: sku?.packageTypeId ?? '',
      salesChannel: sku?.salesChannel ?? 'BOTH',
      isAvailable: sku?.isAvailable ?? true,
      isPublic: sku?.isPublic ?? false,
      stockQuantity: sku?.stockQuantity?.toString() ?? '0',
      lowStockThreshold: sku?.lowStockThreshold?.toString() ?? '0',
    });
    setError('');
  }, [isOpen, sku]);

  if (!isOpen) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      code: form.code,
      name: form.name,
      weightOz: Number(form.weightOz),
      price: form.price ? Number(form.price) : undefined,
      packageTypeId: form.packageTypeId || undefined,
      salesChannel: form.salesChannel,
      isAvailable: form.isAvailable,
      isPublic: form.isPublic,
      stockQuantity: Number(form.stockQuantity || 0),
      lowStockThreshold: Number(form.lowStockThreshold || 0),
      productId: form.ownerType === 'product' ? form.ownerId : undefined,
      blendId: form.ownerType === 'blend' ? form.ownerId : undefined,
    };
    if (sku?.id) {
      updateMutation.mutate({ id: sku.id, ...payload });
    } else {
      createMutation.mutate(payload);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-2xl rounded-lg border border-border bg-card p-6 shadow-lg">
        <button onClick={onClose} className="absolute right-4 top-4 text-muted-foreground hover:text-foreground">
          <X size={20} />
        </button>
        <h2 className="mb-4 text-xl font-semibold text-foreground">{sku ? 'Edit SKU' : 'New SKU'}</h2>
        {error && <div className="mb-4 rounded-md border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}
        <form onSubmit={handleSubmit} className="grid gap-3 md:grid-cols-2">
          <select value={form.ownerType} onChange={(e) => setForm({ ...form, ownerType: e.target.value, ownerId: '' })} className="px-3 py-2 bg-secondary border border-border rounded-md text-sm">
            <option value="product">Variety</option>
            <option value="blend">Blend</option>
          </select>
          <select value={form.ownerId} onChange={(e) => setForm({ ...form, ownerId: e.target.value })} className="px-3 py-2 bg-secondary border border-border rounded-md text-sm">
            <option value="">Select owner</option>
            {(form.ownerType === 'product' ? (products?.items ?? []) : (blends?.items ?? [])).map((item: any) => (
              <option key={item.id} value={item.id}>{item.name}</option>
            ))}
          </select>
          <input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="SKU code" className="px-3 py-2 bg-secondary border border-border rounded-md text-sm" />
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Display name" className="px-3 py-2 bg-secondary border border-border rounded-md text-sm" />
          <input type="number" min={0.01} step={0.01} value={form.weightOz} onChange={(e) => setForm({ ...form, weightOz: e.target.value })} placeholder="Weight (oz)" className="px-3 py-2 bg-secondary border border-border rounded-md text-sm" />
          <input type="number" min={0} step={0.01} value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="Price" className="px-3 py-2 bg-secondary border border-border rounded-md text-sm" />
          <select value={form.packageTypeId} onChange={(e) => setForm({ ...form, packageTypeId: e.target.value })} className="px-3 py-2 bg-secondary border border-border rounded-md text-sm">
            <option value="">No package type</option>
            {(packageTypes ?? []).map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select>
          <select value={form.salesChannel} onChange={(e) => setForm({ ...form, salesChannel: e.target.value })} className="px-3 py-2 bg-secondary border border-border rounded-md text-sm">
            <option value="BOTH">Both</option>
            <option value="WHOLESALE">Wholesale</option>
            <option value="RETAIL">Retail</option>
          </select>
          <input type="number" min={0} value={form.stockQuantity} onChange={(e) => setForm({ ...form, stockQuantity: e.target.value })} placeholder="Stock quantity" className="px-3 py-2 bg-secondary border border-border rounded-md text-sm" />
          <input type="number" min={0} value={form.lowStockThreshold} onChange={(e) => setForm({ ...form, lowStockThreshold: e.target.value })} placeholder="Low stock threshold" className="px-3 py-2 bg-secondary border border-border rounded-md text-sm" />
          <label className="flex items-center gap-2 text-sm text-foreground"><input type="checkbox" checked={form.isAvailable} onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })} /> Available</label>
          <label className="flex items-center gap-2 text-sm text-foreground"><input type="checkbox" checked={form.isPublic} onChange={(e) => setForm({ ...form, isPublic: e.target.checked })} /> Public</label>
          <div className="md:col-span-2 flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-border rounded-md hover:bg-secondary transition-colors">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground rounded-md font-semibold hover:bg-primary/90 transition-colors">{sku ? 'Save SKU' : 'Create SKU'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
