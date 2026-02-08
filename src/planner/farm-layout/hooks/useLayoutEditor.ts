import { useState, useCallback, useEffect } from 'react';
import { trpc } from '../../../lib/trpc';

export interface CanvasElement {
  id: string;
  type: string;
  position: { x: number; y: number };
  dimensions: { width: number; height: number };
  rotation: number;
  color: string;
  properties: Record<string, any>;
}

export type ToolType = 'select' | 'rack' | 'wall' | 'table' | 'sink' | 'walkway';

const ELEMENT_DEFAULTS: Record<string, { color: string; dimensions: { width: number; height: number }; properties: Record<string, any> }> = {
  rack: { color: '#22c55e', dimensions: { width: 120, height: 60 }, properties: { levels: 4, traysPerLevel: 5, label: '' } },
  wall: { color: '#374151', dimensions: { width: 200, height: 10 }, properties: {} },
  table: { color: '#a16207', dimensions: { width: 100, height: 60 }, properties: {} },
  sink: { color: '#3b82f6', dimensions: { width: 60, height: 40 }, properties: {} },
  walkway: { color: '#6b7280', dimensions: { width: 200, height: 40 }, properties: {} },
};

export function useLayoutEditor(layoutId: string | null) {
  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeTool, setActiveTool] = useState<ToolType>('select');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [layoutName, setLayoutName] = useState('Untitled Layout');
  const [isActive, setIsActive] = useState(false);

  const utils = trpc.useUtils();

  const layoutQuery = trpc.farmLayouts.byId.useQuery(
    { id: layoutId! },
    { enabled: !!layoutId }
  );

  const saveMutation = trpc.farmLayouts.update.useMutation({
    onSuccess: () => {
      setHasUnsavedChanges(false);
      utils.farmLayouts.list.invalidate();
      utils.farmLayouts.byId.invalidate();
    },
  });

  const createMutation = trpc.farmLayouts.create.useMutation({
    onSuccess: () => {
      setHasUnsavedChanges(false);
      utils.farmLayouts.list.invalidate();
    },
  });

  useEffect(() => {
    if (layoutQuery.data) {
      setElements(layoutQuery.data.canvasData?.elements ?? []);
      setLayoutName(layoutQuery.data.name);
      setIsActive(layoutQuery.data.isActive ?? false);
      setHasUnsavedChanges(false);
    }
  }, [layoutQuery.data]);

  const addElement = useCallback((position: { x: number; y: number }) => {
    if (activeTool === 'select') return;

    const defaults = ELEMENT_DEFAULTS[activeTool];
    if (!defaults) return;

    const newElement: CanvasElement = {
      id: `el-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      type: activeTool,
      position,
      dimensions: { ...defaults.dimensions },
      rotation: 0,
      color: defaults.color,
      properties: { ...defaults.properties },
    };

    setElements((prev) => [...prev, newElement]);
    setSelectedId(newElement.id);
    setHasUnsavedChanges(true);
    setActiveTool('select');
  }, [activeTool]);

  const moveElement = useCallback((id: string, position: { x: number; y: number }) => {
    setElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, position } : el))
    );
    setHasUnsavedChanges(true);
  }, []);

  const resizeElement = useCallback((id: string, dimensions: { width: number; height: number }) => {
    setElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, dimensions } : el))
    );
    setHasUnsavedChanges(true);
  }, []);

  const updateElement = useCallback((id: string, updates: Partial<CanvasElement>) => {
    setElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, ...updates } : el))
    );
    setHasUnsavedChanges(true);
  }, []);

  const deleteElement = useCallback((id: string) => {
    setElements((prev) => prev.filter((el) => el.id !== id));
    if (selectedId === id) setSelectedId(null);
    setHasUnsavedChanges(true);
  }, [selectedId]);

  const save = useCallback(() => {
    const canvasData = { elements };

    if (layoutId) {
      saveMutation.mutate({
        id: layoutId,
        name: layoutName,
        canvasData,
        isActive,
      });
    } else {
      createMutation.mutate({
        name: layoutName,
        canvasData,
        isActive,
      });
    }
  }, [layoutId, elements, layoutName, isActive, saveMutation, createMutation]);

  const selectedElement = elements.find((el) => el.id === selectedId) ?? null;

  return {
    elements,
    selectedId,
    selectedElement,
    activeTool,
    hasUnsavedChanges,
    layoutName,
    isActive,
    isSaving: saveMutation.isPending || createMutation.isPending,
    isLoading: layoutQuery.isLoading,
    setSelectedId,
    setActiveTool,
    setLayoutName,
    setIsActive,
    addElement,
    moveElement,
    resizeElement,
    updateElement,
    deleteElement,
    save,
  };
}
