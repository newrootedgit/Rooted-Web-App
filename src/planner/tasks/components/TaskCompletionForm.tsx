import { useEffect, useMemo, useState } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import { trpc } from '../../../lib/trpc';

interface TaskCompletionFormProps {
  isOpen: boolean;
  taskId: string | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function TaskCompletionForm({ isOpen, taskId, onClose, onSuccess }: TaskCompletionFormProps) {
  const [actualTrays, setActualTrays] = useState('');
  const [actualYieldOz, setActualYieldOz] = useState('');
  const [seedLot, setSeedLot] = useState('');
  const [completionNotes, setCompletionNotes] = useState('');
  const [completedByEmployeeId, setCompletedByEmployeeId] = useState('');
  const [completedDate, setCompletedDate] = useState('');
  const [completedTime, setCompletedTime] = useState('');
  const [rackAssignments, setRackAssignments] = useState<Array<{ rackElementId: string; level: number; trayCount: number }>>([]);
  const [error, setError] = useState('');

  const { data: task } = trpc.tasks.byId.useQuery({ id: taskId! }, { enabled: !!taskId && isOpen });
  const { data: employees } = trpc.employees.list.useQuery({ limit: 100 }, { enabled: isOpen });
  const { data: activeLayout } = trpc.farmLayouts.active.useQuery(undefined, { enabled: isOpen });

  const completeMutation = trpc.tasks.complete.useMutation({
    onSuccess: () => {
      onSuccess();
      handleClose();
    },
    onError: (err) => setError(err.message),
  });

  const rackElements = useMemo(() => (activeLayout?.canvasData?.elements ?? []).filter((element: any) => element.type === 'rack'), [activeLayout?.canvasData?.elements]);

  useEffect(() => {
    if (!isOpen) return;
    const now = new Date();
    setActualTrays('');
    setActualYieldOz('');
    setSeedLot('');
    setCompletionNotes('');
    setCompletedByEmployeeId('');
    setCompletedDate(now.toISOString().slice(0, 10));
    setCompletedTime(now.toTimeString().slice(0, 5));
    setRackAssignments([]);
    setError('');
  }, [isOpen, taskId]);

  function handleClose() {
    setActualTrays('');
    setActualYieldOz('');
    setSeedLot('');
    setCompletionNotes('');
    setCompletedByEmployeeId('');
    setRackAssignments([]);
    setError('');
    onClose();
  }

  if (!isOpen || !taskId) return null;
  const currentTaskId = taskId;

  function getLevels(elementId: string) {
    const element = rackElements.find((item: any) => item.id === elementId);
    const count = element?.properties?.levels ?? 1;
    return Array.from({ length: count }, (_, index) => index + 1);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    completeMutation.mutate({
      id: currentTaskId,
      actualTrays: actualTrays ? parseInt(actualTrays, 10) : undefined,
      actualYieldOz: actualYieldOz ? Number(actualYieldOz) : undefined,
      completedByEmployeeId: completedByEmployeeId || undefined,
      completedAt: completedDate && completedTime ? new Date(`${completedDate}T${completedTime}:00`).toISOString() : undefined,
      seedLot: seedLot || undefined,
      completionNotes: completionNotes || undefined,
      rackAssignments: rackAssignments.length > 0 ? rackAssignments : undefined,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg border border-border bg-card p-6 shadow-lg">
        <button onClick={handleClose} className="absolute right-4 top-4 text-muted-foreground hover:text-foreground">
          <X size={20} />
        </button>

        <h2 className="mb-6 text-xl font-semibold text-foreground">Complete Task</h2>

        {error && (
          <div className="mb-4 rounded-md border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-3 md:grid-cols-2">
            <select value={completedByEmployeeId} onChange={(e) => setCompletedByEmployeeId(e.target.value)} className="px-3 py-2 bg-secondary border border-border rounded-md text-sm">
              <option value="">Completed by</option>
              {(employees?.items ?? []).map((employee) => (
                <option key={employee.id} value={employee.id}>{employee.firstName} {employee.lastName}</option>
              ))}
            </select>
            <input type="number" value={actualTrays} onChange={(e) => setActualTrays(e.target.value)} min={0} placeholder="Actual trays" className="px-3 py-2 bg-secondary border border-border rounded-md text-sm" />
            <input type="number" value={actualYieldOz} onChange={(e) => setActualYieldOz(e.target.value)} min={0} step={0.01} placeholder="Actual yield (oz)" className="px-3 py-2 bg-secondary border border-border rounded-md text-sm" />
            <input type="text" value={seedLot} onChange={(e) => setSeedLot(e.target.value)} placeholder="Seed lot" className="px-3 py-2 bg-secondary border border-border rounded-md text-sm" />
            <input type="date" value={completedDate} onChange={(e) => setCompletedDate(e.target.value)} className="px-3 py-2 bg-secondary border border-border rounded-md text-sm" />
            <input type="time" value={completedTime} onChange={(e) => setCompletedTime(e.target.value)} className="px-3 py-2 bg-secondary border border-border rounded-md text-sm" />
          </div>

          <textarea
            value={completionNotes}
            onChange={(e) => setCompletionNotes(e.target.value)}
            rows={3}
            placeholder="Completion notes"
            className="w-full resize-none rounded-md border border-border bg-secondary px-3 py-2 text-sm"
          />

          {task?.type === 'MOVE_TO_LIGHT' && (
            <div className="space-y-3 rounded-lg border border-border bg-secondary/30 p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">Rack Assignments</h3>
                <button
                  type="button"
                  onClick={() => setRackAssignments([...rackAssignments, { rackElementId: rackElements[0]?.id ?? '', level: 1, trayCount: 1 }])}
                  className="inline-flex items-center gap-1 text-xs text-primary"
                >
                  <Plus size={14} />
                  Add Rack
                </button>
              </div>
              {rackAssignments.map((assignment, index) => (
                <div key={`${assignment.rackElementId}-${index}`} className="grid gap-3 md:grid-cols-[2fr_1fr_1fr_auto]">
                  <select
                    value={assignment.rackElementId}
                    onChange={(e) => setRackAssignments(rackAssignments.map((item, itemIndex) => itemIndex === index ? { ...item, rackElementId: e.target.value, level: 1 } : item))}
                    className="px-3 py-2 bg-secondary border border-border rounded-md text-sm"
                  >
                    <option value="">Select rack</option>
                    {rackElements.map((element: any) => (
                      <option key={element.id} value={element.id}>{element.properties?.label || element.id}</option>
                    ))}
                  </select>
                  <select
                    value={assignment.level}
                    onChange={(e) => setRackAssignments(rackAssignments.map((item, itemIndex) => itemIndex === index ? { ...item, level: Number(e.target.value) } : item))}
                    className="px-3 py-2 bg-secondary border border-border rounded-md text-sm"
                  >
                    {getLevels(assignment.rackElementId).map((level) => <option key={level} value={level}>Level {level}</option>)}
                  </select>
                  <input
                    type="number"
                    min={1}
                    value={assignment.trayCount}
                    onChange={(e) => setRackAssignments(rackAssignments.map((item, itemIndex) => itemIndex === index ? { ...item, trayCount: Number(e.target.value) } : item))}
                    className="px-3 py-2 bg-secondary border border-border rounded-md text-sm"
                  />
                  <button type="button" onClick={() => setRackAssignments(rackAssignments.filter((_, itemIndex) => itemIndex !== index))} className="px-3 py-2 text-destructive hover:bg-destructive/10 rounded-md transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              {rackAssignments.length === 0 && <div className="text-sm text-muted-foreground">No rack assignments added yet.</div>}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={completeMutation.isPending} className="flex-1 rounded-md bg-primary px-4 py-2 font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50">
              {completeMutation.isPending ? 'Completing...' : 'Mark Complete'}
            </button>
            <button type="button" onClick={handleClose} className="rounded-md border border-border px-4 py-2 text-foreground hover:bg-secondary transition-colors">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
