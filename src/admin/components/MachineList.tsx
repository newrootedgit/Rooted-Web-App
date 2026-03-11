import { MapPin } from 'lucide-react';
import { trpc } from '../lib/trpc';
import MachineCard from '../../machines/dashboard/components/MachineCard';

interface MachineListProps {
  tenantId: string;
}

export function MachineList({ tenantId }: MachineListProps) {
  const utils = trpc.useUtils();
  const { data: machines, isLoading } = trpc.admin.getTenantMachines.useQuery({ tenantId });
  const deleteMutation = trpc.admin.deleteMachine.useMutation({
    onSuccess: () => {
      utils.admin.getTenantMachines.invalidate({ tenantId });
      utils.admin.getAllTenants.invalidate();
    },
  });

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
        <MachineCard
          key={machine.id}
          machine={machine}
          collapsible={false}
          defaultExpanded
          showConfigureAction={false}
          faultQueryScope="admin"
          headerMeta={(
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
              <MapPin size={12} />
              <span>{machine.farms?.name || 'No farm assigned'}</span>
            </div>
          )}
          onDelete={(selectedMachine) => {
            deleteMutation.mutate({ machineId: selectedMachine.id });
          }}
        />
      ))}
    </div>
  );
}
