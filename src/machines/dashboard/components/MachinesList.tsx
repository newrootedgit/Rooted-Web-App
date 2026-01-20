import type { ScanState } from '../hooks/useBluetoothScanner';
import type { MachineGATTClient } from '../../lib/bluetooth';
import { Wifi, WifiOff, Loader2 } from 'lucide-react';
import styles from '../styles/MachinesList.module.css';

interface Machine {
  id: string;
  name: string;
  deviceId: string;
  createdAt: string | Date | null;
}

interface MachinesListProps {
  machines: Machine[];
  isLoading: boolean;
  isBluetoothSupported: boolean;
  scanState: ScanState;
  scanError: string | null;
  connectedDevice: MachineGATTClient | null;
  onScanClick: () => void;
  onDisconnect: () => void;
}

export default function MachinesList({
  machines,
  isLoading,
  isBluetoothSupported,
  scanState,
  scanError,
  connectedDevice,
  onScanClick,
  onDisconnect,
}: MachinesListProps) {
  const isScanning = scanState === 'scanning' || scanState === 'connecting';

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Your Machines</h2>

      {scanError && (
        <p className={styles.error}>{scanError}</p>
      )}

      {isLoading ? (
        <div className={styles.loadingWrapper}>
          <Loader2 className={styles.spinner} size={24} />
          <p>Loading machines...</p>
        </div>
      ) : machines.length > 0 ? (
        <div className={styles.machinesList}>
          {machines.map((machine) => (
            <div key={machine.id} className={styles.deviceCard}>
              <div className={styles.deviceInfo}>
                <span className={styles.deviceName}>{machine.name}</span>
                <span className={styles.deviceId}>{machine.deviceId}</span>
              </div>
              <div className={styles.provisionWrapper}>
                <Wifi size={20} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className={styles.emptyMessage}>
          No machines registered yet. Click "Add Machine" to get started.
        </p>
      )}

      {connectedDevice && (
        <div className={styles.deviceCard}>
          <div className={styles.deviceInfo}>
            <span className={styles.deviceName}>{connectedDevice.name}</span>
            <span className={styles.deviceStatus}>Connected via Bluetooth</span>
          </div>
          <button onClick={onDisconnect} className={styles.disconnectButton}>
            Disconnect
          </button>
        </div>
      )}

      <button
        disabled={!isBluetoothSupported || isScanning}
        onClick={onScanClick}
        className={styles.scanButton}
        data-disabled={!isBluetoothSupported}
      >
        {isScanning ? 'Scanning...' : 'Scan for Devices'}
      </button>
    </div>
  );
}
