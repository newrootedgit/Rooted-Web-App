import { Trash2 } from 'lucide-react';
import type { CanvasElement } from '../hooks/useLayoutEditor';

interface ElementPropertiesProps {
  element: CanvasElement | null;
  onUpdate: (id: string, updates: Partial<CanvasElement>) => void;
  onDelete: (id: string) => void;
}

const TYPE_LABELS: Record<string, string> = {
  rack: 'Grow Rack',
  wall: 'Wall',
  table: 'Table',
  sink: 'Sink',
  walkway: 'Walkway',
};

export function ElementProperties({ element, onUpdate, onDelete }: ElementPropertiesProps) {
  if (!element) {
    return (
      <div className="w-56 border border-border rounded-lg bg-card p-4">
        <h3 className="text-sm font-semibold text-foreground mb-2">Properties</h3>
        <p className="text-xs text-muted-foreground">Select an element to edit its properties.</p>
      </div>
    );
  }

  return (
    <div className="w-56 border border-border rounded-lg bg-card p-4 space-y-4">
      <h3 className="text-sm font-semibold text-foreground">
        {TYPE_LABELS[element.type] ?? element.type}
      </h3>

      <div className="space-y-3">
        <div>
          <label className="text-xs text-muted-foreground block mb-1">Position</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={element.position.x}
              onChange={(e) =>
                onUpdate(element.id, { position: { ...element.position, x: Number(e.target.value) } })
              }
              className="w-full px-2 py-1 bg-secondary border border-border rounded text-xs text-foreground"
              placeholder="X"
            />
            <input
              type="number"
              value={element.position.y}
              onChange={(e) =>
                onUpdate(element.id, { position: { ...element.position, y: Number(e.target.value) } })
              }
              className="w-full px-2 py-1 bg-secondary border border-border rounded text-xs text-foreground"
              placeholder="Y"
            />
          </div>
        </div>

        <div>
          <label className="text-xs text-muted-foreground block mb-1">Dimensions</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={element.dimensions.width}
              onChange={(e) =>
                onUpdate(element.id, { dimensions: { ...element.dimensions, width: Number(e.target.value) } })
              }
              className="w-full px-2 py-1 bg-secondary border border-border rounded text-xs text-foreground"
              placeholder="W"
            />
            <input
              type="number"
              value={element.dimensions.height}
              onChange={(e) =>
                onUpdate(element.id, { dimensions: { ...element.dimensions, height: Number(e.target.value) } })
              }
              className="w-full px-2 py-1 bg-secondary border border-border rounded text-xs text-foreground"
              placeholder="H"
            />
          </div>
        </div>

        <div>
          <label className="text-xs text-muted-foreground block mb-1">Rotation</label>
          <input
            type="range"
            min={0}
            max={360}
            value={element.rotation}
            onChange={(e) => onUpdate(element.id, { rotation: Number(e.target.value) })}
            className="w-full"
          />
          <span className="text-xs text-muted-foreground">{element.rotation}°</span>
        </div>

        <div>
          <label className="text-xs text-muted-foreground block mb-1">Color</label>
          <input
            type="color"
            value={element.color}
            onChange={(e) => onUpdate(element.id, { color: e.target.value })}
            className="w-full h-8 rounded border border-border cursor-pointer"
          />
        </div>

        {element.type === 'rack' && (
          <>
            <div>
              <label className="text-xs text-muted-foreground block mb-1">Label</label>
              <input
                type="text"
                value={element.properties.label ?? ''}
                onChange={(e) =>
                  onUpdate(element.id, {
                    properties: { ...element.properties, label: e.target.value },
                  })
                }
                className="w-full px-2 py-1 bg-secondary border border-border rounded text-xs text-foreground"
                placeholder="e.g. Rack A"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1">Levels</label>
              <input
                type="number"
                min={1}
                value={element.properties.levels ?? 4}
                onChange={(e) =>
                  onUpdate(element.id, {
                    properties: { ...element.properties, levels: Number(e.target.value) },
                  })
                }
                className="w-full px-2 py-1 bg-secondary border border-border rounded text-xs text-foreground"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1">Trays per Level</label>
              <input
                type="number"
                min={1}
                value={element.properties.traysPerLevel ?? 5}
                onChange={(e) =>
                  onUpdate(element.id, {
                    properties: { ...element.properties, traysPerLevel: Number(e.target.value) },
                  })
                }
                className="w-full px-2 py-1 bg-secondary border border-border rounded text-xs text-foreground"
              />
            </div>
          </>
        )}
      </div>

      <button
        onClick={() => onDelete(element.id)}
        className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-red-400 border border-red-400/30 hover:bg-red-400/10 transition-colors"
      >
        <Trash2 size={14} />
        Delete
      </button>
    </div>
  );
}
