import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { trpc } from '../../lib/trpc';
import { EmployeeForm } from './components/EmployeeForm';

export function EmployeesPage() {
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const utils = trpc.useUtils();

  const { data, isLoading } = trpc.employees.list.useQuery({
    search: search || undefined,
    limit: 100,
  });

  const deleteEmployee = trpc.employees.delete.useMutation({
    onSuccess: () => utils.employees.list.invalidate(),
  });

  function handleSuccess() {
    utils.employees.list.invalidate();
    setIsOpen(false);
    setEditing(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">Team</h1>
        <button
          onClick={() => { setEditing(null); setIsOpen(true); }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md font-semibold hover:bg-primary/90 transition-colors"
        >
          <Plus size={18} />
          New Employee
        </button>
      </div>

      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search employees..."
          className="w-full pl-9 pr-3 py-2 bg-secondary border border-border rounded-md text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {isLoading ? (
        <div className="text-sm text-muted-foreground">Loading team...</div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {(data?.items ?? []).map((employee) => (
            <div key={employee.id} className="rounded-lg border border-border bg-card p-4 space-y-3">
              <div>
                <div className="text-sm font-semibold text-foreground">
                  {employee.firstName} {employee.lastName}
                </div>
                <div className="text-xs text-muted-foreground">
                  {employee.position ?? 'Unassigned'} • {employee.status ?? 'ACTIVE'}
                </div>
              </div>
              {employee.email && <div className="text-sm text-muted-foreground">{employee.email}</div>}
              {employee.phone && <div className="text-sm text-muted-foreground">{employee.phone}</div>}
              <div className="flex gap-2">
                <button
                  onClick={() => { setEditing(employee); setIsOpen(true); }}
                  className="px-3 py-1.5 text-xs font-medium border border-border rounded hover:bg-secondary transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteEmployee.mutate({ id: employee.id })}
                  className="px-3 py-1.5 text-xs font-medium border border-destructive/30 text-destructive rounded hover:bg-destructive/10 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <EmployeeForm
        isOpen={isOpen}
        employee={editing}
        onClose={() => { setIsOpen(false); setEditing(null); }}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
