import { useBluetoothSupport } from './hooks/useBluetoothSupport';
import { useBluetoothScanner } from './hooks/useBluetoothScanner';
import StatusBanner from './components/StatusBanner';
import MachinesList from './components/MachinesList';

export default function MachinesDashboard() {
  const isBluetoothSupported = useBluetoothSupport();
  const { state, error, device, scan, disconnect } = useBluetoothScanner();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Machine Management</h1>
        <p className="text-muted-foreground mt-1">WiFi Provisioning for Raspberry Pi Devices</p>
      </div>
      <StatusBanner isSupported={isBluetoothSupported} />
      <MachinesList
        isBluetoothSupported={isBluetoothSupported}
        scanState={state}
        scanError={error}
        connectedDevice={device}
        onScanClick={scan}
        onDisconnect={disconnect}
      />
    </div>
  );
}
