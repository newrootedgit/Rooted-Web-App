import { MousePointer2, Grid3X3, Square, Table, Droplets, Footprints } from 'lucide-react';
import type { ToolType } from '../hooks/useLayoutEditor';

interface ToolPaletteProps {
  activeTool: ToolType;
  onToolChange: (tool: ToolType) => void;
}

const TOOLS: { id: ToolType; label: string; icon: React.ReactNode }[] = [
  { id: 'select', label: 'Select', icon: <MousePointer2 size={18} /> },
  { id: 'rack', label: 'Grow Rack', icon: <Grid3X3 size={18} /> },
  { id: 'wall', label: 'Wall', icon: <Square size={18} /> },
  { id: 'table', label: 'Table', icon: <Table size={18} /> },
  { id: 'sink', label: 'Sink', icon: <Droplets size={18} /> },
  { id: 'walkway', label: 'Walkway', icon: <Footprints size={18} /> },
];

export function ToolPalette({ activeTool, onToolChange }: ToolPaletteProps) {
  return (
    <div className="w-16 border border-border rounded-lg bg-card p-2 flex flex-col gap-1">
      {TOOLS.map((tool) => (
        <button
          key={tool.id}
          onClick={() => onToolChange(tool.id)}
          title={tool.label}
          className={`p-2 rounded-md transition-colors flex items-center justify-center ${
            activeTool === tool.id
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
          }`}
        >
          {tool.icon}
        </button>
      ))}
    </div>
  );
}
