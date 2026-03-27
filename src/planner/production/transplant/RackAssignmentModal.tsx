import { useState } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import { trpc } from '../../../lib/trpc';
import type { ProductionTask } from '../types';

interface RackAssignmentModalProps {
  task: ProductionTask | null;
  isOpen: boolean;
  onClose: () => void;
}

export function RackAssignmentModal({ task, isOpen, onClose }: RackAssignmentModalProps) {
  const [employeeId, setEmployeeId] = useState('');
  const [assignments, setAssignments] = useState<Array<{ rackElementId: string; level: number; trayCount: number }>>([]);
  const [notes, setNotes] = useState('');
  const utils = trpc.useUtils();

  const { data: employees } = trpc.employees.list.useQuery({ limit: 100 }, { enabled: isOpen });
  const { data: activeLayout } = trpc.farmLayouts.active.useQuery(undefined, { enabled: isOpen });
  const completeMutation = trpc.tasks.complete.useMutation({
    onSuccess: () => {
      utils.tasks.list.invalidate();
      onClose();
      setEmployeeId('');
      setAssignments([]);
      setNotes('');
    },
  });

  if (!isOpen || !task) return null;

  const productName = task.orderItem?.products?.name ?? task.orderItem?.blends?.name ?? task.title;
  const rackElements = (activeLayout?.canvasData?.elements ?? []).filter((element: any) => element.type === 'rack');

  function getLevels(elementId: string) {
    const element = rackElements.find((item: any) => item.id === elementId);
    const count = element?.properties?.levels ?? 1;
    return Array.from({ length: count }, (_, index) => index + 1);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-2xl rounded-lg border border-border bg-card p-6 shadow-lg">
        <button onClick={onClose} className="absolute right-4 top-4 text-muted-foreground hover:text-foreground">
          <X size={20} />
        </button>

        <h2 className="mb-2 text-xl font-semibold text-foreground">Rack Assignment</h2>
        <p className="mb-6 text-sm text-muted-foreground">{productName}</p>

        <div className="space-y-4">
          <select value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} className="w-full px-3 py-2 bg-secondary border border-border rounded-md text-sm">
            <option value="">Completed by</option>
            {(employees?.items ?? []).map((employee) => (
              <option key={employee.id} value={employee.id}>{employee.firstName} {employee.lastName}</option>
            ))}
          </select>

          <div className="space-y-3 rounded-lg border border-border bg-secondary/30 p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">Assignments</h3>
              <button type="button" onClick={() => setAssignments([...assignments, { rackElementId: rackElements[0]?.id ?? '', level: 1, trayCount: 1 }])} className="inline-flex items-center gap-1 text-xs text-primary">
                <Plus size={14} />
                Add Rack
              </button>
            </div>
            {assignments.map((assignment, index) => (
              <div key={`${assignment.rackElementId}-${index}`} className="grid gap-3 md:grid-cols-[2fr_1fr_1fr_auto]">
                <select value={assignment.rackElementId} onChange={(e) => setAssignments(assignments.map((item, itemIndex) => itemIndex === index ? { ...item, rackElementId: e.target.value, level: 1 } : item))} className="px-3 py-2 bg-secondary border border-border rounded-md text-sm">
                  <option value="">Select rack</option>
                  {rackElements.map((element: any) => <option key={element.id} value={element.id}>{element.properties?.label || element.id}</option>)}
                </select>
                <select value={assignment.level} onChange={(e) => setAssignments(assignments.map((item, itemIndex) => itemIndex === index ? { ...item, level: Number(e.target.value) } : item))} className="px-3 py-2 bg-secondary border border-border rounded-md text-sm">
                  {getLevels(assignment.rackElementId).map((level) => <option key={level} value={level}>Level {level}</option>)}
                </select>
                <input type="number" min={1} value={assignment.trayCount} onChange={(e) => setAssignments(assignments.map((item, itemIndex) => itemIndex === index ? { ...item, trayCount: Number(e.target.value) } : item))} className="px-3 py-2 bg-secondary border border-border rounded-md text-sm" />
                <button type="button" onClick={() => setAssignments(assignments.filter((_, itemIndex) => itemIndex !== index))} className="px-3 py-2 text-destructive hover:bg-destructive/10 rounded-md transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="Completion notes" className="w-full resize-none rounded-md border border-border bg-secondary px-3 py-2 text-sm" />

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => completeMutation.mutate({
                id: task.id,
                completedByEmployeeId: employeeId || undefined,
                completionNotes: notes || undefined,
                rackAssignments: assignments,
              })}
              className="flex-1 rounded-md bg-primary px-4 py-2 font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Assign Rack & Complete
            </button>
            <button type="button" onClick={onClose} className="rounded-md border border-border px-4 py-2 hover:bg-secondary transition-colors">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
