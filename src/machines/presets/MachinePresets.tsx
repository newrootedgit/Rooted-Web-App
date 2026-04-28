import { Loader2 } from 'lucide-react';
import { trpc } from '../../lib/trpc';
import MachinePresetCard from './components/MachinePresetCard';
import { isProd } from '../../lib/env';
import { PresetTutorial } from '../tutorial/PresetTutorial';

interface MachinePresetsProps {
  runTutorial?: boolean;
  onTutorialFinish?: () => void;
}

export default function MachinePresets({
  runTutorial = false,
  onTutorialFinish = () => {},
}: MachinePresetsProps) {
  const { data, isLoading } = trpc.machines.list.useQuery({});

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 size={24} className="animate-spin text-muted-foreground" />
      </div>
    );
  }

  const machines = data?.items ?? [];
  const hasDemoMachine = machines.some((machine) => machine.isDemo);

  return (
    <div className="space-y-6">
      <PresetTutorial
        shouldRun={runTutorial && hasDemoMachine}
        onFinish={onTutorialFinish}
      />
      <h1 className="text-2xl font-semibold text-foreground">Machine Presets</h1>
      {!isProd() && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-sm text-yellow-800">
            You are running in a non-production environment.
          </p>
        </div>
      )}
      {machines.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>No machines registered yet.</p>
          <p className="text-sm mt-1">Add a machine from the Provisioning tab first.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {machines.map(machine => (
            <MachinePresetCard
              key={machine.id}
              machine={machine}
              startDemoTutorial={runTutorial && machine.isDemo}
            />
          ))}
        </div>
      )}
    </div>
  );
}
