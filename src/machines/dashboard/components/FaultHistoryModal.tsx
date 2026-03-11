import { X, AlertTriangle, Loader2 } from 'lucide-react';
import { trpc } from '../../../lib/trpc';

interface FaultHistoryModalProps {
  machineId: string;
  machineName: string;
  onClose: () => void;
  queryScope?: 'tenant' | 'admin';
}

export default function FaultHistoryModal({
  machineId,
  machineName,
  onClose,
  queryScope = 'tenant',
}: FaultHistoryModalProps) {
  const tenantQuery = trpc.machines.faults.useQuery(
    { machineId },
    { enabled: queryScope === 'tenant' }
  );
  const adminQuery = trpc.admin.getMachineFaults.useQuery(
    { machineId },
    { enabled: queryScope === 'admin' }
  );

  const { data: faults, isLoading, error } = queryScope === 'admin' ? adminQuery : tenantQuery;

  const formatDateTime = (date: string | Date) => {
    const d = new Date(date);
    return d.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const getMotorLabel = (motor: string | null) => {
    if (motor === 'belt') return 'Belt';
    if (motor === 'blade') return 'Blade';
    return motor ?? 'Unknown';
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-card border border-border rounded-lg w-full max-w-lg m-4 max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Fault History</h2>
            <span className="text-sm text-muted-foreground">{machineName}</span>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X size={20} />
          </button>
        </div>

        <div className="p-4 overflow-y-auto flex-1">
          {isLoading && (
            <div className="flex items-center justify-center gap-2 py-8 text-muted-foreground">
              <Loader2 size={16} className="animate-spin" />
              <span>Loading faults...</span>
            </div>
          )}

          {error && (
            <div className="text-sm text-destructive py-4">
              Failed to load fault history.
            </div>
          )}

          {faults && faults.length === 0 && (
            <div className="text-sm text-muted-foreground py-8 text-center">
              No faults recorded.
            </div>
          )}

          {faults && faults.length > 0 && (
            <div className="space-y-2">
              {faults.map((fault) => (
                <div key={fault.id} className="flex items-start gap-3 p-3 rounded-md bg-secondary/50 border border-border">
                  <AlertTriangle size={16} className="text-amber-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">
                        {getMotorLabel(fault.motor)}
                      </span>
                      <span className="text-xs font-mono text-muted-foreground">
                        {fault.faultType}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {formatDateTime(fault.createdAt)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
