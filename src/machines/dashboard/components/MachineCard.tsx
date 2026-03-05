import { useState } from 'react';
import { ChevronDown, ChevronUp, Trash2, Settings, Calendar, Cpu, Wifi, Power, PowerOff, RotateCcw, AlertTriangle, Timer } from 'lucide-react';
import type { Machine } from '../../../../shared';
import { getMachineImage } from '../../utils/machine-images';
import ChangeWifiModal from '../../wifi-provisioning/components/ChangeWifiModal';

interface MachineCardProps {
  machine: Machine;
  onDelete: (id: string) => void;
}

export default function MachineCard({ machine, onDelete }: MachineCardProps) {
  const machineImage = getMachineImage(machine.name);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showChangeWifi, setShowChangeWifi] = useState(false);
  const isOnline = machine.status === 'online';

  const formatDate = (date: string | Date | null) => {
    if (!date) return 'Unknown';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatDateTime = (date: string | Date | null) => {
    if (!date) return 'Never';
    const d = new Date(date);
    return d.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const parseIntegerValue = (value: string | number | bigint | null | undefined): bigint | null => {
    if (value === null || value === undefined) return null;
    if (typeof value === 'bigint') return value;
    if (typeof value === 'number') return BigInt(Math.trunc(value));
    if (typeof value === 'string' && value.trim() !== '') {
      try {
        return BigInt(value);
      } catch {
        return null;
      }
    }
    return null;
  };

  const formatInteger = (value: string | number | bigint | null | undefined) => {
    const parsed = parseIntegerValue(value);
    if (parsed === null) return '0';
    return parsed.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const formatDurationMs = (value: string | number | bigint | null | undefined) => {
    const parsed = parseIntegerValue(value);
    if (parsed === null) return 'Unknown';

    const totalSeconds = parsed / 1000n;
    const days = totalSeconds / 86400n;
    const hours = (totalSeconds % 86400n) / 3600n;
    const minutes = (totalSeconds % 3600n) / 60n;

    if (days > 0n) return `${days.toString()}d ${hours.toString()}h`;
    if (hours > 0n) return `${hours.toString()}h ${minutes.toString()}m`;
    if (minutes > 0n) return `${minutes.toString()}m`;
    return `${totalSeconds.toString()}s`;
  };

  const totalUptimeMs = (() => {
    const historical = parseIntegerValue(machine.totalUptimeMs);
    const currentBoot = parseIntegerValue(machine.currentBootUptimeMs);
    if (historical === null && currentBoot === null) return null;
    return (historical ?? 0n) + (currentBoot ?? 0n);
  })();
  const bladeFaultCountValue = parseIntegerValue(machine.bladeFaultCount) ?? 0n;
  const showBladeFaultCount = bladeFaultCountValue > 0n;

  const bladeMotorUptimeValue = parseIntegerValue(machine.bladeMotorUptimeMs) ?? 0n;
  const showBladeMotorUptime = bladeMotorUptimeValue > 0n;

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to delete "${machine.displayName || machine.name}"?`)) {
      onDelete(machine.deviceId);
    }
  };

  const handleUpdate = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowChangeWifi(true);
  };

  return (
    <div
      className={`bg-card border rounded-lg cursor-pointer transition-all overflow-hidden ${
        isExpanded ? 'border-primary shadow-lg' : 'border-border hover:border-border/80 hover:shadow-md'
      }`}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="flex items-center justify-between p-4">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground">{machine.displayName || machine.name}</span>
            <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
          </div>
          <span className="text-sm text-muted-foreground font-mono">{machine.deviceId}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="px-4 pb-4 border-t border-border animate-in slide-in-from-top-2 duration-200">
          <div className={`flex gap-6 py-4 ${machineImage ? 'flex-row' : 'flex-col'}`}>
            {machineImage && (
              <>
                <img src={machineImage} alt={machine.name} className="w-64 h-64 object-contain flex-shrink-0" />
                <div className="w-px bg-border my-2" />
              </>
            )}
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${machineImage ? 'flex-1 pl-2' : ''}`}>
              <div className="flex items-start gap-2">
                <Cpu size={16} className="text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Machine ID</span>
                  <span className="text-sm text-foreground break-all">{machine.deviceId}</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Calendar size={16} className="text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Added On</span>
                  <span className="text-sm text-foreground">{formatDate(machine.createdAt)}</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                {isOnline ? (
                  <Power size={16} className="text-muted-foreground mt-0.5 flex-shrink-0" />
                ) : (
                  <PowerOff size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                )}
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Status</span>
                  <span className="flex items-center gap-1.5 text-sm text-foreground">
                    {isOnline ? (
                      <>
                        <span className="text-green-600 font-medium">Online</span>
                      </>
                    ) : (
                      <>
                        <span className="text-gray-500">Offline</span>
                      </>
                    )}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Wifi size={16} className="text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Network</span>
                  <span className="text-sm text-foreground font-mono">{machine.currentWifiSsid?.toUpperCase() || 'Unknown'}</span>
                </div>
              </div>
              {machine.lastSeenAt && (
                <div className="flex items-start gap-2">
                  <Calendar size={16} className="text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Last Seen</span>
                    <span className="text-sm text-foreground">{formatDateTime(machine.lastSeenAt)}</span>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-2">
                <RotateCcw size={16} className="text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Reboots</span>
                  <span className="text-sm text-foreground">{formatInteger(machine.rebootCount)}</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <AlertTriangle size={16} className="text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Fault Counts</span>
                  <span className="text-sm text-foreground">
                    Belt {formatInteger(machine.beltFaultCount)}
                    {showBladeFaultCount ? ` | Blade ${formatInteger(machine.bladeFaultCount)}` : ''}
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Timer size={16} className="text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Total Uptime</span>
                  <span className="text-sm text-foreground">{formatDurationMs(totalUptimeMs)}</span>
                </div>
              </div>
              {(machine.beltMotorUptimeMs != null || machine.bladeMotorUptimeMs != null) && (
                <div className="flex items-start gap-2">
                  <Timer size={16} className="text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Motor Uptime</span>
                    <span className="text-sm text-foreground">
                      Belt {formatDurationMs(machine.beltMotorUptimeMs)}
                      {showBladeMotorUptime ? ` | Blade ${formatDurationMs(machine.bladeMotorUptimeMs)}` : ''}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2 pt-3 border-t border-border">
            <button
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-secondary border border-border rounded-md text-sm font-medium text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
              onClick={handleUpdate}
            >
              <Settings size={16} />
              Configure
            </button>
            <button
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-transparent border border-destructive rounded-md text-sm font-medium text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors"
              onClick={handleDelete}
            >
              <Trash2 size={16} />
              Delete
            </button>
          </div>
        </div>
      )}

      {showChangeWifi && (
        <ChangeWifiModal
          machineName={machine.name}
          onClose={() => setShowChangeWifi(false)}
        />
      )}
    </div>
  );
}
