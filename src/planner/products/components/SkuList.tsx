import { useState } from 'react';
import { Plus } from 'lucide-react';
import { trpc } from '../../../lib/trpc';
import { PackageTypeManager } from './PackageTypeManager';
import { SkuForm } from './SkuForm';

export function SkuList() {
  const [search, setSearch] = useState('');
  const [channel, setChannel] = useState('');
  const [availability, setAvailability] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);

  const utils = trpc.useUtils();
  const { data, isLoading } = trpc.products.skus.list.useQuery({
    search: search || undefined,
    salesChannel: (channel || undefined) as any,
    isAvailable: availability === '' ? undefined : availability === 'available',
    limit: 200,
  });

  const updateMutation = trpc.products.skus.update.useMutation({
    onSuccess: () => utils.products.skus.list.invalidate(),
  });
  const deleteMutation = trpc.products.skus.delete.useMutation({
    onSuccess: () => utils.products.skus.list.invalidate(),
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-3">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search SKUs..." className="w-64 px-3 py-2 bg-secondary border border-border rounded-md text-sm" />
          <select value={channel} onChange={(e) => setChannel(e.target.value)} className="px-3 py-2 bg-secondary border border-border rounded-md text-sm">
            <option value="">All channels</option>
            <option value="WHOLESALE">Wholesale</option>
            <option value="RETAIL">Retail</option>
            <option value="BOTH">Both</option>
          </select>
          <select value={availability} onChange={(e) => setAvailability(e.target.value)} className="px-3 py-2 bg-secondary border border-border rounded-md text-sm">
            <option value="">All availability</option>
            <option value="available">Available</option>
            <option value="unavailable">Unavailable</option>
          </select>
        </div>
        <button onClick={() => { setEditing(null); setIsOpen(true); }} className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md font-semibold hover:bg-primary/90 transition-colors">
          <Plus size={18} />
          New SKU
        </button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        <div className="overflow-hidden rounded-lg border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="bg-secondary/50 text-left text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Code</th>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Owner</th>
                <th className="px-4 py-3 font-medium">Weight</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Available</th>
                <th className="px-4 py-3 font-medium">Public</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={8} className="px-4 py-4 text-muted-foreground">Loading SKUs...</td></tr>
              ) : (
                (data?.items ?? []).map((sku) => (
                  <tr key={sku.id} className="border-t border-border">
                    <td className="px-4 py-3">{sku.code}</td>
                    <td className="px-4 py-3">{sku.name}</td>
                    <td className="px-4 py-3">{sku.product?.name ?? sku.blend?.name ?? 'Unknown'}</td>
                    <td className="px-4 py-3">{sku.weightOz} oz</td>
                    <td className="px-4 py-3">{sku.price != null ? `$${sku.price.toFixed(2)}` : '—'}</td>
                    <td className="px-4 py-3">
                      <input type="checkbox" checked={!!sku.isAvailable} onChange={(e) => updateMutation.mutate({ id: sku.id, isAvailable: e.target.checked })} />
                    </td>
                    <td className="px-4 py-3">
                      <input type="checkbox" checked={!!sku.isPublic} onChange={(e) => updateMutation.mutate({ id: sku.id, isPublic: e.target.checked })} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => { setEditing(sku); setIsOpen(true); }} className="text-xs text-primary hover:underline">Edit</button>
                        <button onClick={() => deleteMutation.mutate({ id: sku.id })} className="text-xs text-destructive hover:underline">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <PackageTypeManager />
      </div>

      <SkuForm
        isOpen={isOpen}
        sku={editing}
        onClose={() => { setIsOpen(false); setEditing(null); }}
        onSuccess={() => {
          utils.products.skus.list.invalidate();
          setIsOpen(false);
          setEditing(null);
        }}
      />
    </div>
  );
}
