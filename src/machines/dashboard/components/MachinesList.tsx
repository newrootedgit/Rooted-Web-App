import type { ScanState } from '../hooks/useBluetoothScanner';
import type { MachineGATTClient } from '../../lib/bluetooth';
import { Wifi, WifiOff } from 'lucide-react';
import styles from '../styles/MachinesList.module.css';

interface MachinesListProps {
  isBluetoothSupported: boolean;
  scanState: ScanState;
  scanError: string | null;
  connectedDevice: MachineGATTClient | null;
  onScanClick: () => void;
  onDisconnect: () => void;
}

export default function MachinesList({
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

      {connectedDevice ? (
        <div className={styles.deviceCard}>
          <div className={styles.deviceInfo}>
            <span className={styles.deviceName}>{connectedDevice.name}</span>
            <span className={styles.deviceStatus}>Connected</span>
          </div>
          <div className={styles.provisionWrapper}>
            <button className={styles.provisionButton}>
              Provision WiFi
              <span className={styles.provisioningDot} />
            </button>
            {true ? <Wifi size={20} /> : <WifiOff size={20} />}
          </div>
          <button onClick={onDisconnect} className={styles.disconnectButton}>
            Disconnect
          </button>
        </div>
      ) : (
        <p className={styles.emptyMessage}>
          No machines connected yet. Click "Scan for Devices" to get started.
        </p>
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
