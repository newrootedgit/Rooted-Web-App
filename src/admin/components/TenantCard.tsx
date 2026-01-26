import { Building2, MapPin, Server } from 'lucide-react';

interface Tenant {
  id: string;
  name: string;
  slug: string;
  _count: {
    farms: number;
    machines: number;
  };
}

interface TenantCardProps {
  tenant: Tenant;
  isSelected: boolean;
  onClick: () => void;
}

export function TenantCard({ tenant, isSelected, onClick }: TenantCardProps) {
  return (
    <button
      onClick={onClick}
      className={`
        p-6 bg-card border rounded-lg text-left transition-all
        hover:shadow-md hover:border-primary/50
        ${isSelected ? 'border-primary shadow-md ring-2 ring-primary/20' : 'border-border'}
      `}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Building2 size={20} className="text-primary" />
          <h3 className="font-semibold text-lg">{tenant.name}</h3>
        </div>
      </div>
      
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin size={14} />
          <span>{tenant._count.farms} farm{tenant._count.farms !== 1 ? 's' : ''}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Server size={14} />
          <span>{tenant._count.machines} machine{tenant._count.machines !== 1 ? 's' : ''}</span>
        </div>
      </div>
    </button>
  );
}
