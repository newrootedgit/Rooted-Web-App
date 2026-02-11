import { Loader2 } from 'lucide-react';
import { trpc } from '../../lib/trpc';
import MachinePresetCard from './components/MachinePresetCard';

export default function MachinePresets() {
  const { data, isLoading } = trpc.machines.list.useQuery({});

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 size={24} className="animate-spin text-muted-foreground" />
      </div>
    );
  }

  const machines = data?.items ?? [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-foreground">Machine Presets</h1>
      {machines.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>No machines registered yet.</p>
          <p className="text-sm mt-1">Add a machine from the Provisioning tab first.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {machines.map(machine => (
            <MachinePresetCard key={machine.id} machine={machine} />
          ))}
        </div>
      )}
    </div>
  );
}
