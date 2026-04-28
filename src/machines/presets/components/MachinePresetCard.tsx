import { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronUp, Loader2, AlertCircle, CheckCircle, RefreshCw, Pencil, Check, X, Save, RotateCcw } from 'lucide-react';
import type { Machine } from '../../../../shared';
import { useMachineConfig } from '../hooks/useMachineConfig';
import PresetEditor from './PresetEditor';
import { isProd } from '@/lib/env';

interface MachinePresetCardProps {
  machine: Machine;
  startDemoTutorial?: boolean;
}

function InlineNameEditor({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (name: string) => void;
  disabled?: boolean;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) inputRef.current?.focus();
  }, [isEditing]);

  const handleConfirm = () => {
    const trimmed = draft.trim().slice(0, 12);
    if (trimmed && trimmed !== value) {
      onChange(trimmed);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setDraft(value);
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <span className="inline-flex items-center gap-1 group">
        <span>{value}</span>
        {!disabled && (
          <button
            onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
            className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground transition-opacity"
          >
            <Pencil size={12} />
          </button>
        )}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
      <input
        ref={inputRef}
        value={draft}
        maxLength={12}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleConfirm();
          if (e.key === 'Escape') handleCancel();
        }}
        className="px-1.5 py-0.5 text-sm bg-secondary border border-border rounded w-32 focus:outline-none focus:ring-1 focus:ring-primary"
      />
      <button onClick={handleConfirm} className="text-green-600 hover:text-green-700">
        <Check size={14} />
      </button>
      <button onClick={handleCancel} className="text-muted-foreground hover:text-foreground">
        <X size={14} />
      </button>
    </span>
  );
}

export default function MachinePresetCard({ machine, startDemoTutorial = false }: MachinePresetCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const { status, config, error, fetchConfig, updatePresets } = useMachineConfig(machine.id);
  const isOnline = machine.status === 'online' || !isProd(); 
  const isBusy = status === 'fetching' || status === 'updating';

  // Lifted edit state
  const [editedPresets, setEditedPresets] = useState<Record<string, Record<string, number>>>({});
  const [editedNames, setEditedNames] = useState<Record<string, string>>({});

  // Reset edits when config is freshly received
  useEffect(() => {
    if (status === 'received') {
      setEditedPresets({});
      setEditedNames({});
    }
  }, [status]);

  useEffect(() => {
    if ((isExpanded && status === 'idle' && isOnline)) {
      fetchConfig();
    }
  }, [isExpanded, status, isOnline, fetchConfig]);

  useEffect(() => {
    if (startDemoTutorial && machine.isDemo) {
      setIsExpanded(true);
    }
  }, [machine.isDemo, startDemoTutorial]);

  const variableRanges = config?.variable_ranges as Record<string, { min: number; max: number }> | undefined;
  const varietyNames = config?.variety_names as Record<string, string> | undefined;

  const getVarietyName = (num: string): string => {
    return editedNames[num] ?? varietyNames?.[num] ?? `Variety ${num}`;
  };

  const getOriginalVarietyName = (num: string): string => {
    return varietyNames?.[num] ?? `Variety ${num}`;
  };

  const getPresets = (): [string, Record<string, number>][] => {
    if (!config) return [];
    return Object.entries(config)
      .filter(([key]) => /^([1-9]|1[0-9]|20)$/.test(key))
      .sort(([a], [b]) => parseInt(a) - parseInt(b))
      .map(([key, value]) => [key, value as Record<string, number>]);
  };

  const getEditedValues = (num: string, original: Record<string, number>): Record<string, number> => {
    return editedPresets[num] ?? original;
  };

  const hasChanges = Object.keys(editedPresets).length > 0 || Object.keys(editedNames).length > 0;

  const handlePresetChange = (num: string, original: Record<string, number>, updated: Record<string, number>) => {
    const changed = Object.keys(updated).some(k => updated[k] !== original[k]);
    setEditedPresets(prev => {
      if (!changed) {
        const { [num]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [num]: updated };
    });
  };

  const handleNameChange = (num: string, name: string) => {
    const originalName = getOriginalVarietyName(num);
    setEditedNames(prev => {
      if (name === originalName) {
        const { [num]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [num]: name };
    });
  };

  const handleSave = () => {
    const payload: { presets?: Record<string, Record<string, number>>; variety_names?: Record<string, string> } = {};
    if (Object.keys(editedPresets).length > 0) payload.presets = editedPresets;
    if (Object.keys(editedNames).length > 0) payload.variety_names = editedNames;
    updatePresets(payload);
  };

  const handleReset = () => {
    setEditedPresets({});
    setEditedNames({});
  };

  const activeVarietyName = config?.active_variety != null
    ? getVarietyName(String(config.active_variety))
    : null;

  return (
    <div
      data-tour={machine.isDemo ? 'demo-preset-card' : undefined}
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
            {machine.isDemo && (
              <span className="rounded bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                Demo
              </span>
            )}
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
              {machine.isDemo && (
                <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
                  Demo preset changes are saved to this sandbox only and are never sent to machine hardware.
                </div>
              )}
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
                    {activeVarietyName ? `${activeVarietyName} (#${config.active_variety})` : 'None'}
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

              <div data-tour={machine.isDemo ? 'demo-preset-list' : undefined} className="space-y-1">
                {getPresets().map(([num, originalValues]) => {
                  const currentValues = getEditedValues(num, originalValues);
                  const isPresetEdited = !!editedPresets[num];
                  const isNameEdited = !!editedNames[num];
                  return (
                    <div key={num} className={`border rounded-md overflow-hidden ${
                      isPresetEdited || isNameEdited ? 'border-primary' : 'border-border'
                    }`}>
                      <button
                        className={`w-full flex items-center justify-between px-3 py-2 text-left transition-colors ${
                          activePreset === num
                            ? 'bg-primary/5 border-b border-border'
                            : 'hover:bg-secondary'
                        }`}
                        onClick={() => setActivePreset(activePreset === num ? null : num)}
                      >
                        <span className="text-sm font-medium text-foreground">
                          <InlineNameEditor
                            value={getVarietyName(num)}
                            onChange={(name) => handleNameChange(num, name)}
                            disabled={isBusy}
                          />
                          {config.active_variety != null && parseInt(num) === Number(config.active_variety) && (
                            <span className="ml-2 text-xs text-primary font-medium">(Active)</span>
                          )}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {Object.entries(currentValues).map(([k, v]) => `${v}`).join(' / ')}
                        </span>
                      </button>
                      {activePreset === num && (
                        <div className="p-3 bg-card">
                          <PresetEditor
                            values={currentValues}
                            onChange={(updated) => handlePresetChange(num, originalValues, updated)}
                            disabled={isBusy}
                            variableRanges={variableRanges}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {hasChanges && (
                <div className="flex gap-2 pt-2 border-t border-border">
                  <button
                    data-tour={machine.isDemo ? 'demo-preset-save' : undefined}
                    onClick={handleSave}
                    disabled={isBusy}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
                  >
                    <Save size={14} />
                    Save All Changes
                  </button>
                  <button
                    onClick={handleReset}
                    disabled={isBusy}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-secondary border border-border rounded-md text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <RotateCcw size={14} />
                    Reset
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
