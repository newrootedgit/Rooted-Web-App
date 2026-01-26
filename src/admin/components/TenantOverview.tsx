import { useState } from 'react';
import { Building2, Server, AlertCircle } from 'lucide-react';
import { trpc } from '../lib/trpc';
import { TenantCard } from './TenantCard';
import { MachineList } from './MachineList';

export function TenantOverview() {
  const [selectedTenantId, setSelectedTenantId] = useState<string | null>(null);
  const { data: tenants, isLoading } = trpc.admin.getAllTenants.useQuery();

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground">Loading tenants...</div>;
  }

  if (!tenants || tenants.length === 0) {
    return (
      <div className="p-8 text-center">
        <AlertCircle size={48} className="mx-auto text-muted-foreground mb-3" />
        <p className="text-muted-foreground">No tenants found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Portal</h1>
          <p className="text-muted-foreground mt-1">Monitor machines across all tenants</p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-lg">
            <Building2 size={16} className="text-primary" />
            <span className="text-muted-foreground">Tenants:</span>
            <span className="font-semibold">{tenants.length}</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-lg">
            <Server size={16} className="text-primary" />
            <span className="text-muted-foreground">Total Machines:</span>
            <span className="font-semibold">
              {tenants.reduce((sum, t) => sum + t._count.machines, 0)}
            </span>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tenants.map((tenant) => (
          <TenantCard
            key={tenant.id}
            tenant={tenant}
            isSelected={selectedTenantId === tenant.id}
            onClick={() => setSelectedTenantId(tenant.id)}
          />
        ))}
      </div>

      {selectedTenantId && (
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">
              {tenants.find((t) => t.id === selectedTenantId)?.name} - Machines
            </h2>
            <button
              onClick={() => setSelectedTenantId(null)}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Clear selection
            </button>
          </div>
          <MachineList tenantId={selectedTenantId} />
        </div>
      )}

      {!selectedTenantId && (
        <div className="bg-secondary/50 border border-border rounded-lg p-8 text-center">
          <AlertCircle size={48} className="mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">
            Select a tenant to view their machines
          </p>
        </div>
      )}
    </div>
  );
}
