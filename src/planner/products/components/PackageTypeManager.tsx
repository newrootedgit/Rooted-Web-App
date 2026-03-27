import { useState } from 'react';
import { trpc } from '../../../lib/trpc';

export function PackageTypeManager() {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const utils = trpc.useUtils();

  const { data } = trpc.products.packageTypes.list.useQuery();
  const createMutation = trpc.products.packageTypes.create.useMutation({
    onSuccess: () => {
      setName('');
      setCode('');
      utils.products.packageTypes.list.invalidate();
    },
  });
  const deleteMutation = trpc.products.packageTypes.delete.useMutation({
    onSuccess: () => utils.products.packageTypes.list.invalidate(),
  });
  const seedMutation = trpc.products.packageTypes.seedDefaults.useMutation({
    onSuccess: () => utils.products.packageTypes.list.invalidate(),
  });

  return (
    <div className="space-y-3 rounded-lg border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Package Types</h3>
        <button onClick={() => seedMutation.mutate()} className="text-xs text-primary hover:underline">Seed defaults</button>
      </div>
      <div className="flex gap-2">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="flex-1 px-3 py-2 bg-secondary border border-border rounded-md text-sm" />
        <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Code" className="w-24 px-3 py-2 bg-secondary border border-border rounded-md text-sm" />
        <button onClick={() => createMutation.mutate({ name, code: code || undefined })} className="px-3 py-2 bg-primary text-primary-foreground rounded-md text-sm font-semibold">Add</button>
      </div>
      <div className="space-y-2">
        {(data ?? []).map((item) => (
          <div key={item.id} className="flex items-center justify-between rounded-md border border-border bg-secondary/40 px-3 py-2">
            <div className="text-sm text-foreground">{item.name} {item.code ? <span className="text-muted-foreground">({item.code})</span> : null}</div>
            <button onClick={() => deleteMutation.mutate({ id: item.id })} className="text-xs text-destructive hover:underline">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
