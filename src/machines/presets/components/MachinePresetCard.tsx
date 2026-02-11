import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Loader2, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import type { Machine } from '../../../../shared';
import { useMachineConfig } from '../hooks/useMachineConfig';
import PresetEditor from './PresetEditor';

interface MachinePresetCardProps {
  machine: Machine;
}

export default function MachinePresetCard({ machine }: MachinePresetCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const { status, config, error, fetchConfig, updatePresets } = useMachineConfig(machine.id);
  const isOnline = machine.status === 'online';
  const isBusy = status === 'fetching' || status === 'updating';

  useEffect(() => {
    if (isExpanded && status === 'idle' && isOnline) {
      fetchConfig();
    }
  }, [isExpanded, status, isOnline, fetchConfig]);

  const handleSavePreset = (presetNumber: string, values: Record<string, number>) => {
    updatePresets({ [presetNumber]: values });
  };

  const getPresets = (): [string, Record<string, number>][] => {
    if (!config) return [];
    return Object.entries(config)
      .filter(([key]) => /^([1-9]|1[0-9]|20)$/.test(key))
      .sort(([a], [b]) => parseInt(a) - parseInt(b))
      .map(([key, value]) => [key, value as Record<string, number>]);
  };

  return (
    <div
      className={`bg-card border rounded-lg transition-all overflow-hidden ${
        isExpanded ? 'border-primary shadow-lg' : 'border-border hover:border-border/80 hover:shadow-md'
      }`}
    >
      <div
        className="flex items-center justify-between p-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground">
              {machine.displayName || machine.name}
            </span>
            <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
          </div>
          <span className="text-sm text-muted-foreground">
            {isOnline ? 'Online' : 'Offline'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {isExpanded ? <ChevronUp size={20} className="text-muted-foreground" /> : <ChevronDown size={20} className="text-muted-foreground" />}
        </div>
      </div>

      {isExpanded && (
        <div className="px-4 pb-4 border-t border-border">
          {!isOnline && (
            <div className="flex items-center gap-2 py-4 text-muted-foreground">
              <AlertCircle size={16} />
              <span className="text-sm">Machine must be online to view presets</span>
            </div>
          )}

          {isOnline && status === 'fetching' && (
            <div className="flex items-center gap-2 py-8 justify-center text-muted-foreground">
              <Loader2 size={20} className="animate-spin" />
              <span className="text-sm">Fetching config from machine...</span>
            </div>
          )}

          {isOnline && status === 'updating' && (
            <div className="flex items-center gap-2 py-8 justify-center text-muted-foreground">
              <Loader2 size={20} className="animate-spin" />
              <span className="text-sm">Sending update to machine...</span>
            </div>
          )}

          {isOnline && (status === 'error' || status === 'timeout') && (
            <div className="flex flex-col items-center gap-3 py-8">
              <div className="flex items-center gap-2 text-destructive">
                <AlertCircle size={16} />
                <span className="text-sm">{error}</span>
              </div>
              <button
                onClick={fetchConfig}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-secondary border border-border rounded-md text-sm font-medium text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
              >
                <RefreshCw size={14} />
                Retry
              </button>
            </div>
          )}

          {isOnline && status === 'updated' && (
            <div className="flex flex-col items-center gap-3 py-4">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle size={16} />
                <span className="text-sm font-medium">Config updated successfully</span>
              </div>
              <button
                onClick={fetchConfig}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-secondary border border-border rounded-md text-sm font-medium text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
              >
                <RefreshCw size={14} />
                Refresh
              </button>
            </div>
          )}

          {isOnline && status === 'received' && config && (
            <div className="py-4 space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary rounded-md">
                  <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Ready</span>
                  <span className={`text-sm font-medium ${config.ready_to_run ? 'text-green-600' : 'text-muted-foreground'}`}>
                    {config.ready_to_run ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary rounded-md">
                  <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Active Variety</span>
                  <span className="text-sm font-medium text-foreground">
                    {config.active_variety != null ? `#${config.active_variety}` : 'None'}
                  </span>
                </div>
                <button
                  onClick={fetchConfig}
                  className="ml-auto inline-flex items-center gap-1.5 px-2 py-1.5 text-muted-foreground hover:text-foreground transition-colors"
                  title="Refresh config"
                >
                  <RefreshCw size={14} />
                </button>
              </div>

              <div className="space-y-1">
                {getPresets().map(([num, values]) => (
                  <div key={num} className="border border-border rounded-md overflow-hidden">
                    <button
                      className={`w-full flex items-center justify-between px-3 py-2 text-left transition-colors ${
                        activePreset === num
                          ? 'bg-primary/5 border-b border-border'
                          : 'hover:bg-secondary'
                      }`}
                      onClick={() => setActivePreset(activePreset === num ? null : num)}
                    >
                      <span className="text-sm font-medium text-foreground">
                        Variety {num}
                        {config.active_variety != null && parseInt(num) === Number(config.active_variety) && (
                          <span className="ml-2 text-xs text-primary font-medium">(Active)</span>
                        )}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {Object.entries(values).map(([k, v]) => `${v}`).join(' / ')}
                      </span>
                    </button>
                    {activePreset === num && (
                      <div className="p-3 bg-card">
                        <PresetEditor
                          presetNumber={num}
                          values={values}
                          onSave={handleSavePreset}
                          disabled={isBusy}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
