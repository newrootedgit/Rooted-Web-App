import type { ScanState, Machine } from '../../../../shared';
import type { MachineGATTClient } from '../../../lib/bluetooth';
import { Loader2 } from 'lucide-react';
import MachineCard from './MachineCard';

interface MachinesListProps {
  machines: Machine[];
  isLoading: boolean;
  isBluetoothSupported: boolean;
  scanState: ScanState;
  scanError: string | null;
  connectedDevice: MachineGATTClient | null;
  onScanClick: () => void;
  onDisconnect: () => void;
  onDelete: (id: string) => void;
}

export default function MachinesList({
  machines,
  isLoading,
  connectedDevice,
  onDisconnect,
  onDelete,
}: MachinesListProps) {
  // const isScanning = scanState === 'scanning' || scanState === 'connecting';

  return (
    <div className="py-6">
      <h2 className="text-xl font-semibold mb-6 pb-4 border-b border-border text-foreground">
        Your Machines
      </h2>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-8 text-muted-foreground gap-4">
          <Loader2 className="animate-spin" size={24} />
          <p>Loading machines...</p>
        </div>
      ) : machines.length > 0 ? (
        <div className="flex flex-col gap-3 mb-6">
          {machines.map((machine) => (
            <MachineCard key={machine.id} machine={machine} onDelete={onDelete} />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground mb-6">
          No machines registered yet. Click "Add Machine" to get started.
        </p>
      )}

      {connectedDevice && (
        <div className="flex items-center justify-between p-4 bg-card border border-border rounded-lg">
          <div className="flex flex-col gap-1">
            <span className="font-medium text-foreground">{connectedDevice.name}</span>
            <span className="text-sm text-green-500 font-medium">Connected via Bluetooth</span>
          </div>
          <button
            onClick={onDisconnect}
            className="px-3 py-2 bg-transparent text-destructive border border-destructive rounded-md text-sm font-medium hover:bg-destructive hover:text-destructive-foreground transition-colors"
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
}
