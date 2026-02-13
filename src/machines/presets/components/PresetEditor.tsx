import { Save, RotateCcw } from 'lucide-react';

interface VariableRange {
  min: number;
  max: number;
}

interface PresetEditorProps {
  values: Record<string, number>;
  onChange: (values: Record<string, number>) => void;
  disabled?: boolean;
  variableRanges?: Record<string, VariableRange>;
}

function formatLabel(key: string): string {
  return key
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function clamp(value: number, min?: number, max?: number): number {
  if (min !== undefined && value < min) return min;
  if (max !== undefined && value > max) return max;
  return value;
}

export default function PresetEditor({ values, onChange, disabled, variableRanges }: PresetEditorProps) {
  const handleChange = (key: string, raw: string) => {
    const num = parseFloat(raw);
    if (!isNaN(num)) {
      const range = variableRanges?.[key];
      onChange({ ...values, [key]: clamp(num, range?.min, range?.max) });
    }
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      {Object.entries(values).map(([key, value]) => {
        const range = variableRanges?.[key];
        return (
          <div key={key} className="flex flex-col gap-1">
            <label className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
              {formatLabel(key)}
              {range && (
                <span className="ml-1 normal-case tracking-normal font-normal">
                  ({range.min}–{range.max})
                </span>
              )}
            </label>
            <input
              type="number"
              value={value}
              min={range?.min}
              max={range?.max}
              onChange={(e) => handleChange(key, e.target.value)}
              disabled={disabled}
              className="px-3 py-1.5 bg-secondary border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
            />
          </div>
        );
      })}
    </div>
  );
}
