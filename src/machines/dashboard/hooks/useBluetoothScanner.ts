import { useState, useCallback } from 'react';
import { scanForDevice, MachineGATTClient } from '../../../lib/bluetooth';
import type { ScanState, ScanError } from '../../../../shared';

// Re-export type from shared for convenience
export type { ScanState } from '../../../../shared';

interface UseBluetoothScannerResult {
  state: ScanState;
  error: string | null;
  device: MachineGATTClient | null;
  scan: () => Promise<void>;
  disconnect: () => void;
}

export function useBluetoothScanner(): UseBluetoothScannerResult {
  const [state, setState] = useState<ScanState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [device, setDevice] = useState<MachineGATTClient | null>(null);

  const scan = useCallback(async () => {
    setState('scanning');
    setError(null);

    try {
      const bluetoothDevice = await scanForDevice();

      setState('connecting');

      const client = new MachineGATTClient(bluetoothDevice, {
        onDisconnect: () => {
          setState('idle');
          setDevice(null);
        },
      });

      await client.connect();
      await client.subscribeToStatus();

      setDevice(client);
      setState('connected');
    } catch (err) {
      const scanError = err as ScanError;

      if (scanError.type === 'user_cancelled') {
        setState('idle');
        return;
      }

      setError(scanError.message);
      setState('error');
    }
  }, []);

  const disconnect = useCallback(() => {
    device?.disconnect();
    setDevice(null);
    setState('idle');
  }, [device]);

  return {
    state,
    error,
    device,
    scan,
    disconnect,
  };
}
