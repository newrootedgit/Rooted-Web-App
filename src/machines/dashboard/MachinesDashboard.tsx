import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import { useBluetoothSupport } from './hooks/useBluetoothSupport';
import { useBluetoothScanner } from './hooks/useBluetoothScanner';
import BluetoothIndicator from './components/BluetoothIndicator';
import MachinesList from './components/MachinesList';
import { OnboardMachine } from '../device-discovery/components/OnboardMachine';
import { trpc } from '../../lib/trpc';
import { MachineTutorial } from '../tutorial/MachineTutorial';

interface MachinesDashboardProps {
  runTutorial?: boolean;
  onTutorialFinish?: (outcome: 'continueToPresets' | 'dismissed') => void;
}

export default function MachinesDashboard({
  runTutorial = false,
  onTutorialFinish = () => {},
}: MachinesDashboardProps) {
  const { user } = useUser();
  const isBluetoothSupported = useBluetoothSupport();
  const { state, error, device, scan, disconnect } = useBluetoothScanner();
  const [isOnboardModalOpen, setIsOnboardModalOpen] = useState(false);

  const { data: machinesData, isLoading: isMachinesLoading } = trpc.machines.list.useQuery({});
  const trpcUtils = trpc.useUtils();
  const deleteMutation = trpc.machines.delete.useMutation({
    onSuccess: () => {
      trpcUtils.machines.list.invalidate();
    },
  });

  const handleOnboardSuccess = () => {
    trpcUtils.machines.list.invalidate();
    setIsOnboardModalOpen(false);
  };

  const handleDelete = (machine: { deviceId: string }) => {
    deleteMutation.mutate({ deviceId: machine.deviceId });
  };

  return (
    <div className="space-y-6">
      <MachineTutorial
        shouldRun={runTutorial && !isMachinesLoading && (machinesData?.items ?? []).some((machine) => machine.isDemo)}
        onFinish={onTutorialFinish}
      />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 data-tour="machines-heading" className="text-2xl font-semibold text-foreground">Machine Management</h1>
          <BluetoothIndicator isSupported={isBluetoothSupported} />
        </div>
        <div className="flex flex-col items-end gap-1">
          <button
            data-tour="add-machine-button"
            onClick={() => setIsOnboardModalOpen(true)}
            disabled={!isBluetoothSupported}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Plus size={18} />
            Add Machine
          </button>
          {!isBluetoothSupported && (
            <p className="text-xs text-muted-foreground">
              Enable Bluetooth to add machines
            </p>
          )}
        </div>
      </div>
      <MachinesList
        machines={machinesData?.items ?? []}
        isLoading={isMachinesLoading}
        isBluetoothSupported={isBluetoothSupported}
        scanState={state}
        scanError={error}
        connectedDevice={device}
        onScanClick={scan}
        onDisconnect={disconnect}
        onDelete={handleDelete}
      />
      <OnboardMachine
        isOpen={isOnboardModalOpen}
        onClose={() => setIsOnboardModalOpen(false)}
        onSuccess={handleOnboardSuccess}
        tenantId={user?.id ?? ''}
        userEmail={user?.primaryEmailAddress?.emailAddress ?? ''}
      />
    </div>
  );
}
