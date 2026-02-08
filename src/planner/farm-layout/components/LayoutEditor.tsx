import { ArrowLeft, Save } from 'lucide-react';
import { useLayoutEditor } from '../hooks/useLayoutEditor';
import { ToolPalette } from './ToolPalette';
import { CanvasArea } from './CanvasArea';
import { ElementProperties } from './ElementProperties';

interface LayoutEditorProps {
  layoutId: string | null;
  onBack: () => void;
}

export function LayoutEditor({ layoutId, onBack }: LayoutEditorProps) {
  const editor = useLayoutEditor(layoutId);

  if (editor.isLoading) {
    return <div className="text-sm text-muted-foreground">Loading layout...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <input
            type="text"
            value={editor.layoutName}
            onChange={(e) => editor.setLayoutName(e.target.value)}
            className="text-lg font-semibold bg-transparent border-none outline-none text-foreground focus:ring-0"
            placeholder="Layout name"
          />
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={editor.isActive}
              onChange={(e) => editor.setIsActive(e.target.checked)}
              className="rounded border-border"
            />
            Active
          </label>
          <button
            onClick={editor.save}
            disabled={editor.isSaving || !editor.hasUnsavedChanges}
            className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            <Save size={16} />
            {editor.isSaving ? 'Saving...' : 'Save'}
          </button>
          {editor.hasUnsavedChanges && (
            <span className="text-xs text-yellow-400">Unsaved changes</span>
          )}
        </div>
      </div>

      <div className="flex gap-4" style={{ height: 'calc(100vh - 240px)' }}>
        <ToolPalette activeTool={editor.activeTool} onToolChange={editor.setActiveTool} />
        <CanvasArea
          elements={editor.elements}
          selectedId={editor.selectedId}
          activeTool={editor.activeTool}
          onSelect={editor.setSelectedId}
          onAddElement={editor.addElement}
          onMoveElement={editor.moveElement}
          onResizeElement={editor.resizeElement}
        />
        <ElementProperties
          element={editor.selectedElement}
          onUpdate={editor.updateElement}
          onDelete={editor.deleteElement}
        />
      </div>
    </div>
  );
}
