import { MapPin, Server, Trash2 } from 'lucide-react';
import { trpc } from '../lib/trpc';

interface FarmListProps {
  tenantId: string;
}

export function FarmList({ tenantId }: FarmListProps) {
  const utils = trpc.useUtils();
  const { data: farms, isLoading } = trpc.admin.getTenantFarms.useQuery({ tenantId });
  const deleteMutation = trpc.admin.deleteFarm.useMutation({
    onSuccess: () => {
      utils.admin.getTenantFarms.invalidate({ tenantId });
      utils.admin.getAllTenants.invalidate();
    },
  });

  if (isLoading) {
    return <div className="text-center py-8 text-muted-foreground">Loading farms...</div>;
  }

  if (!farms || farms.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No farms found for this tenant
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {farms.map((farm) => (
        <div
          key={farm.id}
          className="flex items-center justify-between p-4 bg-secondary/50 border border-border rounded-lg hover:bg-secondary transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100">
              <MapPin size={16} className="text-blue-600" />
            </div>
            <div>
              <p className="font-medium">{farm.name}</p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                <Server size={12} />
                <span>{farm._count.machines} machine{farm._count.machines !== 1 ? 's' : ''}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right text-xs text-muted-foreground">
              {farm.contact_email && <div>{farm.contact_email}</div>}
              {farm.created_at && (
                <div>Created {new Date(farm.created_at).toLocaleDateString()}</div>
              )}
            </div>
            <button
              onClick={() => {
                if (confirm(`Delete farm "${farm.name}"? This will also delete all associated machines.`)) {
                  deleteMutation.mutate({ farmId: farm.id });
                }
              }}
              disabled={deleteMutation.isPending}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
