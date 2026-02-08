import { useRef, useState, useCallback } from 'react';
import type { CanvasElement as CanvasElementType } from '../hooks/useLayoutEditor';
import { CanvasElementComponent } from './CanvasElement';

interface CanvasAreaProps {
  elements: CanvasElementType[];
  selectedId: string | null;
  activeTool: string;
  onSelect: (id: string | null) => void;
  onAddElement: (position: { x: number; y: number }) => void;
  onMoveElement: (id: string, position: { x: number; y: number }) => void;
  onResizeElement: (id: string, dimensions: { width: number; height: number }) => void;
}

const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 800;
const GRID_SIZE = 20;

function screenToSvg(
  svg: SVGSVGElement,
  clientX: number,
  clientY: number
): { x: number; y: number } {
  const pt = svg.createSVGPoint();
  pt.x = clientX;
  pt.y = clientY;
  const svgPt = pt.matrixTransform(svg.getScreenCTM()!.inverse());
  return { x: Math.round(svgPt.x), y: Math.round(svgPt.y) };
}

export function CanvasArea({
  elements,
  selectedId,
  activeTool,
  onSelect,
  onAddElement,
  onMoveElement,
  onResizeElement,
}: CanvasAreaProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const panRef = useRef<{ startX: number; startY: number; origPanX: number; origPanY: number } | null>(null);

  const viewBox = `${-pan.x / zoom} ${-pan.y / zoom} ${CANVAS_WIDTH / zoom} ${CANVAS_HEIGHT / zoom}`;

  const handleClick = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      if (activeTool === 'select') {
        onSelect(null);
        return;
      }

      if (!svgRef.current) return;
      const pos = screenToSvg(svgRef.current, e.clientX, e.clientY);
      onAddElement(pos);
    },
    [activeTool, onAddElement, onSelect]
  );

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom((prev) => Math.max(0.3, Math.min(3, prev * delta)));
  }, []);

  const handleMiddleMouseDown = useCallback((e: React.PointerEvent) => {
    if (e.button !== 1) return;
    e.preventDefault();
    panRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      origPanX: pan.x,
      origPanY: pan.y,
    };
    (e.target as SVGElement).setPointerCapture(e.pointerId);
  }, [pan]);

  const handleMiddleMouseMove = useCallback((e: React.PointerEvent) => {
    if (!panRef.current) return;
    const dx = e.clientX - panRef.current.startX;
    const dy = e.clientY - panRef.current.startY;
    setPan({
      x: panRef.current.origPanX + dx,
      y: panRef.current.origPanY + dy,
    });
  }, []);

  const handleMiddleMouseUp = useCallback(() => {
    panRef.current = null;
  }, []);

  return (
    <div className="flex-1 border border-border rounded-lg overflow-hidden bg-card relative">
      <div className="absolute top-2 right-2 z-10 flex gap-1">
        <button
          onClick={() => setZoom((z) => Math.min(3, z * 1.2))}
          className="px-2 py-1 text-xs bg-secondary border border-border rounded hover:bg-secondary/80"
        >
          +
        </button>
        <button
          onClick={() => setZoom((z) => Math.max(0.3, z * 0.8))}
          className="px-2 py-1 text-xs bg-secondary border border-border rounded hover:bg-secondary/80"
        >
          -
        </button>
        <button
          onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}
          className="px-2 py-1 text-xs bg-secondary border border-border rounded hover:bg-secondary/80"
        >
          Reset
        </button>
      </div>
      <svg
        ref={svgRef}
        viewBox={viewBox}
        className="w-full h-full"
        style={{ minHeight: 500, cursor: activeTool !== 'select' ? 'crosshair' : 'default' }}
        onClick={handleClick}
        onWheel={handleWheel}
        onPointerDown={handleMiddleMouseDown}
        onPointerMove={handleMiddleMouseMove}
        onPointerUp={handleMiddleMouseUp}
      >
        <defs>
          <pattern id="grid" width={GRID_SIZE} height={GRID_SIZE} patternUnits="userSpaceOnUse">
            <path
              d={`M ${GRID_SIZE} 0 L 0 0 0 ${GRID_SIZE}`}
              fill="none"
              stroke="currentColor"
              strokeWidth={0.3}
              opacity={0.15}
            />
          </pattern>
        </defs>
        <rect
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          fill="url(#grid)"
          stroke="currentColor"
          strokeWidth={1}
          strokeOpacity={0.2}
        />
        {elements.map((el) => (
          <CanvasElementComponent
            key={el.id}
            element={el}
            isSelected={selectedId === el.id}
            onSelect={onSelect}
            onMove={onMoveElement}
            onResize={onResizeElement}
          />
        ))}
      </svg>
    </div>
  );
}
