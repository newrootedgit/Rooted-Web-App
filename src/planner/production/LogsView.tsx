import { useState } from 'react';
import { trpc } from '../../lib/trpc';

export function LogsView() {
  const [type, setType] = useState('');
  const [completedByEmployeeId, setCompletedByEmployeeId] = useState('');

  const { data: employees } = trpc.employees.list.useQuery({ limit: 100 });
  const { data, isLoading } = trpc.tasks.listCompleted.useQuery({
    type: type || undefined,
    completedByEmployeeId: completedByEmployeeId || undefined,
    limit: 100,
  });

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <select value={type} onChange={(e) => setType(e.target.value)} className="px-3 py-2 bg-secondary border border-border rounded-md text-sm">
          <option value="">All task types</option>
          <option value="SOAK">Soak</option>
          <option value="SEED">Seed</option>
          <option value="MOVE_TO_LIGHT">Move to Light</option>
          <option value="HARVEST">Harvest</option>
        </select>
        <select value={completedByEmployeeId} onChange={(e) => setCompletedByEmployeeId(e.target.value)} className="px-3 py-2 bg-secondary border border-border rounded-md text-sm">
          <option value="">All employees</option>
          {(employees?.items ?? []).map((employee) => <option key={employee.id} value={employee.id}>{employee.firstName} {employee.lastName}</option>)}
        </select>
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-secondary/50 text-left text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Completed</th>
              <th className="px-4 py-3 font-medium">Employee</th>
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Trays</th>
              <th className="px-4 py-3 font-medium">Yield</th>
              <th className="px-4 py-3 font-medium">Seed Lot</th>
              <th className="px-4 py-3 font-medium">Notes</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={8} className="px-4 py-4 text-muted-foreground">Loading logs...</td></tr>
            ) : (
              (data?.items ?? []).map((task) => (
                <tr key={task.id} className="border-t border-border">
                  <td className="px-4 py-3">{task.completedAt ? new Date(task.completedAt).toLocaleString() : '—'}</td>
                  <td className="px-4 py-3">{task.completedBy ?? '—'}</td>
                  <td className="px-4 py-3">{task.orderItem?.products?.name ?? task.orderItem?.blends?.name ?? task.title}</td>
                  <td className="px-4 py-3">{task.type}</td>
                  <td className="px-4 py-3">{task.actualTrays ?? '—'}</td>
                  <td className="px-4 py-3">{task.actualYieldOz ?? '—'}</td>
                  <td className="px-4 py-3">{task.seedLot ?? '—'}</td>
                  <td className="px-4 py-3">{task.completionNotes ?? '—'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
