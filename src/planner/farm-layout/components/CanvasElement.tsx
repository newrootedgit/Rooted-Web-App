import { useRef, useCallback } from 'react';
import type { CanvasElement as CanvasElementType } from '../hooks/useLayoutEditor';

const TYPE_LABELS: Record<string, string> = {
  rack: 'Rack',
  wall: 'Wall',
  table: 'Table',
  sink: 'Sink',
  walkway: 'Walkway',
};

interface CanvasElementProps {
  element: CanvasElementType;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onMove: (id: string, position: { x: number; y: number }) => void;
  onResize: (id: string, dimensions: { width: number; height: number }) => void;
}

export function CanvasElementComponent({
  element,
  isSelected,
  onSelect,
  onMove,
  onResize,
}: CanvasElementProps) {
  const dragRef = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(null);
  const resizeRef = useRef<{ startX: number; startY: number; origW: number; origH: number } | null>(null);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    e.stopPropagation();
    onSelect(element.id);

    const svg = (e.target as SVGElement).ownerSVGElement;
    if (!svg) return;

    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const svgPt = pt.matrixTransform(svg.getScreenCTM()!.inverse());

    dragRef.current = {
      startX: svgPt.x,
      startY: svgPt.y,
      origX: element.position.x,
      origY: element.position.y,
    };

    (e.target as SVGElement).setPointerCapture(e.pointerId);
  }, [element.id, element.position, onSelect]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragRef.current && !resizeRef.current) return;

    const svg = (e.target as SVGElement).ownerSVGElement;
    if (!svg) return;

    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const svgPt = pt.matrixTransform(svg.getScreenCTM()!.inverse());

    if (dragRef.current) {
      const dx = svgPt.x - dragRef.current.startX;
      const dy = svgPt.y - dragRef.current.startY;
      onMove(element.id, {
        x: Math.round(dragRef.current.origX + dx),
        y: Math.round(dragRef.current.origY + dy),
      });
    }

    if (resizeRef.current) {
      const dx = svgPt.x - resizeRef.current.startX;
      const dy = svgPt.y - resizeRef.current.startY;
      onResize(element.id, {
        width: Math.max(20, Math.round(resizeRef.current.origW + dx)),
        height: Math.max(20, Math.round(resizeRef.current.origH + dy)),
      });
    }
  }, [element.id, onMove, onResize]);

  const handlePointerUp = useCallback(() => {
    dragRef.current = null;
    resizeRef.current = null;
  }, []);

  const handleResizePointerDown = useCallback((e: React.PointerEvent) => {
    e.stopPropagation();
    onSelect(element.id);

    const svg = (e.target as SVGElement).ownerSVGElement;
    if (!svg) return;

    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const svgPt = pt.matrixTransform(svg.getScreenCTM()!.inverse());

    resizeRef.current = {
      startX: svgPt.x,
      startY: svgPt.y,
      origW: element.dimensions.width,
      origH: element.dimensions.height,
    };

    (e.target as SVGElement).setPointerCapture(e.pointerId);
  }, [element.id, element.dimensions, onSelect]);

  const label = element.properties.label || TYPE_LABELS[element.type] || element.type;
  const isWalkway = element.type === 'walkway';

  return (
    <g
      transform={`translate(${element.position.x}, ${element.position.y}) rotate(${element.rotation}, ${element.dimensions.width / 2}, ${element.dimensions.height / 2})`}
    >
      <rect
        width={element.dimensions.width}
        height={element.dimensions.height}
        fill={element.color}
        fillOpacity={0.3}
        stroke={isSelected ? '#6366f1' : element.color}
        strokeWidth={isSelected ? 2 : 1}
        strokeDasharray={isWalkway ? '8 4' : undefined}
        rx={4}
        style={{ cursor: 'move' }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      />
      <text
        x={element.dimensions.width / 2}
        y={element.dimensions.height / 2}
        textAnchor="middle"
        dominantBaseline="central"
        fill="white"
        fontSize={12}
        fontWeight={500}
        style={{ pointerEvents: 'none', userSelect: 'none' }}
      >
        {label}
      </text>
      {isSelected && (
        <rect
          x={element.dimensions.width - 6}
          y={element.dimensions.height - 6}
          width={12}
          height={12}
          fill="#6366f1"
          stroke="white"
          strokeWidth={1}
          rx={2}
          style={{ cursor: 'se-resize' }}
          onPointerDown={handleResizePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        />
      )}
    </g>
  );
}
