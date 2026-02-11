import { useState } from 'react';
import { Save, RotateCcw } from 'lucide-react';

interface PresetEditorProps {
  presetNumber: string;
  values: Record<string, number>;
  onSave: (presetNumber: string, values: Record<string, number>) => void;
  disabled?: boolean;
}

function formatLabel(key: string): string {
  return key
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export default function PresetEditor({ presetNumber, values, onSave, disabled }: PresetEditorProps) {
  const [edited, setEdited] = useState<Record<string, number>>({ ...values });
  const hasChanges = Object.keys(edited).some(key => edited[key] !== values[key]);

  const handleChange = (key: string, value: string) => {
    const num = parseFloat(value);
    if (!isNaN(num)) {
      setEdited(prev => ({ ...prev, [key]: num }));
    }
  };

  const handleReset = () => {
    setEdited({ ...values });
  };

  const handleSave = () => {
    onSave(presetNumber, edited);
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        {Object.entries(edited).map(([key, value]) => {
          const isChanged = value !== values[key];
          return (
            <div key={key} className="flex flex-col gap-1">
              <label className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                {formatLabel(key)}
              </label>
              <input
                type="number"
                value={value}
                onChange={(e) => handleChange(key, e.target.value)}
                disabled={disabled}
                className={`px-3 py-1.5 bg-secondary border rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 ${
                  isChanged ? 'border-primary bg-primary/5' : 'border-border'
                }`}
              />
            </div>
          );
        })}
      </div>
      {hasChanges && (
        <div className="flex gap-2 pt-1">
          <button
            onClick={handleSave}
            disabled={disabled}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            <Save size={14} />
            Save
          </button>
          <button
            onClick={handleReset}
            disabled={disabled}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-secondary border border-border rounded-md text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <RotateCcw size={14} />
            Reset
          </button>
        </div>
      )}
    </div>
  );
}
