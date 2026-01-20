import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useBluetoothSupport } from './hooks/useBluetoothSupport';
import { useBluetoothScanner } from './hooks/useBluetoothScanner';
import StatusBanner from './components/StatusBanner';
import MachinesList from './components/MachinesList';
import { OnboardMachine } from '../device-discovery/components/OnboardMachine';
import { trpc } from '../../lib/trpc';

// TODO: Replace with real auth context
const FAKE_TENANT_ID = 'test-tenant-123';
const FAKE_FARM_ID = 'test-farm-456';

export default function MachinesDashboard() {
  const isBluetoothSupported = useBluetoothSupport();
  const { state, error, device, scan, disconnect } = useBluetoothScanner();
  const [isOnboardModalOpen, setIsOnboardModalOpen] = useState(false);

  const { data: machinesData, isLoading: isMachinesLoading } = trpc.machines.list.useQuery({});
  const trpcUtils = trpc.useUtils();

  const handleOnboardSuccess = () => {
    trpcUtils.machines.list.invalidate();
    setIsOnboardModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Machine Management</h1>
          <p className="text-muted-foreground mt-1">WiFi Provisioning for Raspberry Pi Devices</p>
        </div>
        <button
          onClick={() => setIsOnboardModalOpen(true)}
          disabled={!isBluetoothSupported}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Plus size={18} />
          Add Machine
        </button>
      </div>
      <StatusBanner isSupported={isBluetoothSupported} />
      <MachinesList
        machines={machinesData?.items ?? []}
        isLoading={isMachinesLoading}
        isBluetoothSupported={isBluetoothSupported}
        scanState={state}
        scanError={error}
        connectedDevice={device}
        onScanClick={scan}
        onDisconnect={disconnect}
      />
      <OnboardMachine
        isOpen={isOnboardModalOpen}
        onClose={() => setIsOnboardModalOpen(false)}
        onSuccess={handleOnboardSuccess}
        tenantId={FAKE_TENANT_ID}
        farmId={FAKE_FARM_ID}
      />
    </div>
  );
}
