import { useBluetoothSupport } from './hooks/useBluetoothSupport';
import { useBluetoothScanner } from './hooks/useBluetoothScanner';
import { Header, layoutStyles } from 'shared/index';
import StatusBanner from './components/StatusBanner';
import MachinesList from './components/MachinesList';

export default function MachinesDashboard() {
  const isBluetoothSupported = useBluetoothSupport();
  const { state, error, device, scan, disconnect } = useBluetoothScanner();

  return (
    <div className={layoutStyles.container}>
      <Header title="Machine Management" subtitle="WiFi Provisioning for Raspberry Pi Devices" />

      <main className={layoutStyles.main}>
        <StatusBanner isSupported={isBluetoothSupported} />
        <MachinesList
          isBluetoothSupported={isBluetoothSupported}
          scanState={state}
          scanError={error}
          connectedDevice={device}
          onScanClick={scan}
          onDisconnect={disconnect}
        />
      </main>
    </div>
  );
}
