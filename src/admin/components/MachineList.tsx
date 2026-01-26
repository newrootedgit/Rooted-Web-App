import { Circle, MapPin, Clock } from 'lucide-react';
import { trpc } from '../lib/trpc';

interface MachineListProps {
  tenantId: string;
}

export function MachineList({ tenantId }: MachineListProps) {
  const { data: machines, isLoading } = trpc.admin.getTenantMachines.useQuery({ tenantId });

  if (isLoading) {
    return <div className="text-center py-8 text-muted-foreground">Loading machines...</div>;
  }

  if (!machines || machines.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No machines found for this tenant
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {machines.map((machine) => (
        <div
          key={machine.id}
          className="flex items-center justify-between p-4 bg-secondary/50 border border-border rounded-lg hover:bg-secondary transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className={`
              flex items-center justify-center w-10 h-10 rounded-full
              ${machine.status === 'online' ? 'bg-green-100' : 'bg-gray-100'}
            `}>
              <Circle
                size={16}
                className={machine.status === 'online' ? 'text-green-600 fill-green-600' : 'text-gray-400 fill-gray-400'}
              />
            </div>
            <div>
              <p className="font-medium">{machine.name}</p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                <MapPin size={12} />
                <span>{machine.farms?.name || 'No farm assigned'}</span>
              </div>
            </div>
          </div>

          <div className="text-right">
            <span className={`
              inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
              ${machine.status === 'online' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'}
            `}>
              {machine.status}
            </span>
            {machine.last_seen_at && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                <Clock size={12} />
                <span>
                  {new Date(machine.last_seen_at).toLocaleString()}
                </span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
