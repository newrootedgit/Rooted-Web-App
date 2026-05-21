import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { ChevronDown, ChevronUp, Trash2, Settings, Calendar, Cpu, Wifi, Power, PowerOff, RotateCcw, AlertTriangle, Timer, Layers, ClipboardList, Save, X } from 'lucide-react';
import type { Machine } from '../../../../shared';
import { getMachineImage } from '../../utils/machine-images';
import ChangeWifiModal from '../../wifi-provisioning/components/ChangeWifiModal';
import FaultHistoryModal from './FaultHistoryModal';

interface MachineCardProps {
  machine: Machine;
  onDelete?: (machine: Machine) => void;
  collapsible?: boolean;
  defaultExpanded?: boolean;
  showConfigureAction?: boolean;
  showFaultHistoryAction?: boolean;
  faultQueryScope?: 'tenant' | 'admin';
  headerMeta?: ReactNode;
  onUpdateLaborSavings?: (machine: Machine, laborMinutesSavedPerHour: number | null) => Promise<void> | void;
  isUpdatingLaborSavings?: boolean;
}

export default function MachineCard({
  machine,
  onDelete,
  collapsible = true,
  defaultExpanded = false,
  showConfigureAction = true,
  showFaultHistoryAction = true,
  faultQueryScope = 'tenant',
  headerMeta,
  onUpdateLaborSavings,
  isUpdatingLaborSavings = false,
}: MachineCardProps) {
  const machineImage = getMachineImage(machine.name);
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [showChangeWifi, setShowChangeWifi] = useState(false);
  const [showFaultHistory, setShowFaultHistory] = useState(false);
  const [isEditingLabor, setIsEditingLabor] = useState(false);
  const [laborDraft, setLaborDraft] = useState(machine.laborMinutesSavedPerHour?.toString() ?? '');
  const [laborError, setLaborError] = useState<string | null>(null);
  const isOnline = machine.status === 'online';
  const isCardExpanded = collapsible ? isExpanded : true;

  useEffect(() => {
    setLaborDraft(machine.laborMinutesSavedPerHour?.toString() ?? '');
  }, [machine.laborMinutesSavedPerHour]);

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

  const totalUptimeMs = parseIntegerValue(machine.totalUptimeMs);
  const bladeFaultCountValue = parseIntegerValue(machine.bladeFaultCount) ?? 0n;
  const showBladeFaultCount = bladeFaultCountValue > 0n;

  const trayCountValue = parseIntegerValue(machine.trayCount) ?? 0n;
  const showTrayCount = trayCountValue > 0n;

  const beltMotorUptimeValue = parseIntegerValue(machine.beltMotorUptimeMs);
  const bladeMotorUptimeValue = parseIntegerValue(machine.bladeMotorUptimeMs) ?? 0n;
  const rollerMotorUptimeValue = parseIntegerValue(machine.rollerMotorUptimeMs) ?? 0n;
  const motorUptimeItems = [
    beltMotorUptimeValue !== null ? `Belt ${formatDurationMs(machine.beltMotorUptimeMs)}` : null,
    bladeMotorUptimeValue > 0n ? `Blade ${formatDurationMs(machine.bladeMotorUptimeMs)}` : null,
    rollerMotorUptimeValue > 0n ? `Roller ${formatDurationMs(machine.rollerMotorUptimeMs)}` : null,
  ].filter((item): item is string => item !== null);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onDelete) return;
    if (confirm(`Are you sure you want to delete "${machine.displayName || machine.name}"?`)) {
      onDelete(machine);
    }
  };

  const handleUpdate = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowChangeWifi(true);
  };

  const handleLaborSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!onUpdateLaborSavings) return;

    const trimmed = laborDraft.trim();
    const nextValue = trimmed === '' ? null : Number(trimmed);
    if (nextValue !== null && (!Number.isFinite(nextValue) || nextValue < 0)) {
      setLaborError('Enter zero or a positive number.');
      return;
    }

    setLaborError(null);
    await onUpdateLaborSavings(machine, nextValue === null ? null : Math.round(nextValue));
    setIsEditingLabor(false);
  };

  return (
    <div
      data-tour={machine.isDemo ? 'demo-machine-card' : undefined}
      className={`bg-card border rounded-lg transition-all overflow-hidden ${
        collapsible ? 'cursor-pointer' : ''
      } ${
        isCardExpanded ? 'border-primary shadow-lg' : 'border-border hover:border-border/80 hover:shadow-md'
      }`}
      onClick={collapsible ? () => setIsExpanded(!isExpanded) : undefined}
    >
      <div className="flex items-center justify-between p-4">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground">{machine.displayName || machine.name}</span>
            {machine.isDemo && (
              <span className="rounded bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                Demo
              </span>
            )}
            <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
          </div>
          <span className="text-sm text-muted-foreground font-mono">{machine.deviceId}</span>
          {headerMeta}
        </div>
        {collapsible && (
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
              {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>
          </div>
        )}
      </div>

      {isCardExpanded && (
        <div className="px-4 pb-4 border-t border-border animate-in slide-in-from-top-2 duration-200">
          <div className={`flex gap-6 py-4 ${machineImage ? 'flex-row' : 'flex-col'}`}>
            {machineImage && (
              <>
                <img src={machineImage} alt={machine.name} className="w-64 h-64 object-contain flex-shrink-0" />
                <div className="w-px bg-border my-2" />
              </>
            )}
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${machineImage ? 'flex-1 pl-2' : ''}`}>
              <div data-tour={machine.isDemo ? 'machine-status' : undefined} className="flex items-start gap-2">
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
              {showTrayCount && (
                <div className="flex items-start gap-2">
                  <Layers size={16} className="text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Total Tray Count</span>
                    <span className="text-sm text-foreground">{formatInteger(machine.trayCount)}</span>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-2">
                <Timer size={16} className="text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Total Uptime</span>
                  <span className="text-sm text-foreground">{formatDurationMs(totalUptimeMs)}</span>
                </div>
              </div>
              {motorUptimeItems.length > 0 && (
                <div className="flex items-start gap-2">
                  <Timer size={16} className="text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Motor Uptime</span>
                    <span className="text-sm text-foreground">
                      {motorUptimeItems.join(' | ')}
                    </span>
                  </div>
                </div>
              )}
              {onUpdateLaborSavings && (
                <div className="flex items-start gap-2" onClick={(e) => e.stopPropagation()}>
                  <Timer size={16} className="text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div className="flex min-w-0 flex-col gap-1">
                    <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Manual Labor Saved</span>
                    {isEditingLabor ? (
                      <form className="flex flex-wrap items-center gap-2" onSubmit={handleLaborSubmit}>
                        <input
                          type="number"
                          min={0}
                          step={1}
                          value={laborDraft}
                          onChange={(e) => setLaborDraft(e.target.value)}
                          placeholder="Unset"
                          className="w-24 rounded-md border border-border bg-secondary px-2 py-1 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <span className="text-sm text-muted-foreground">min/hr</span>
                        <button
                          type="submit"
                          disabled={isUpdatingLaborSavings}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-secondary text-foreground hover:bg-primary hover:text-primary-foreground disabled:opacity-50"
                          aria-label="Save labor savings"
                        >
                          <Save size={15} />
                        </button>
                        <button
                          type="button"
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-transparent text-muted-foreground hover:bg-secondary hover:text-foreground"
                          aria-label="Cancel labor savings edit"
                          onClick={() => {
                            setLaborDraft(machine.laborMinutesSavedPerHour?.toString() ?? '');
                            setLaborError(null);
                            setIsEditingLabor(false);
                          }}
                        >
                          <X size={15} />
                        </button>
                      </form>
                    ) : (
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm text-foreground">
                          {machine.laborMinutesSavedPerHour == null ? 'Not set' : `${machine.laborMinutesSavedPerHour} min/hr`}
                        </span>
                        <button
                          type="button"
                          className="rounded-md border border-border bg-secondary px-2 py-1 text-xs font-medium text-foreground hover:bg-primary hover:text-primary-foreground"
                          onClick={() => setIsEditingLabor(true)}
                        >
                          Edit
                        </button>
                      </div>
                    )}
                    {laborError && <span className="text-xs text-destructive">{laborError}</span>}
                  </div>
                </div>
              )}
            </div>
          </div>

          {(showConfigureAction || showFaultHistoryAction || onDelete) && (
            <div className="flex gap-2 pt-3 border-t border-border">
              {showConfigureAction && (
                <button
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-secondary border border-border rounded-md text-sm font-medium text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
                  onClick={handleUpdate}
                >
                  <Settings size={16} />
                  Configure
                </button>
              )}
              {showFaultHistoryAction && (
                <button
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-secondary border border-border rounded-md text-sm font-medium text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
                  onClick={(e) => { e.stopPropagation(); setShowFaultHistory(true); }}
                >
                  <ClipboardList size={16} />
                  Faults
                </button>
              )}
              {onDelete && (
                <button
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-transparent border border-destructive rounded-md text-sm font-medium text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors"
                  onClick={handleDelete}
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {showConfigureAction && showChangeWifi && (
        <ChangeWifiModal
          machineName={machine.name}
          onClose={() => setShowChangeWifi(false)}
        />
      )}

      {showFaultHistoryAction && showFaultHistory && (
        <FaultHistoryModal
          machineId={machine.id}
          machineName={machine.displayName || machine.name}
          queryScope={faultQueryScope}
          onClose={() => setShowFaultHistory(false)}
        />
      )}
    </div>
  );
}
