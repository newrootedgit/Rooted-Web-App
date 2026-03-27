import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { trpc } from '../../../lib/trpc';

interface EmployeeFormProps {
  isOpen: boolean;
  employee?: any;
  onClose: () => void;
  onSuccess: () => void;
}

export function EmployeeForm({ isOpen, employee, onClose, onSuccess }: EmployeeFormProps) {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: '',
    status: 'ACTIVE',
    hireDate: '',
    hourlyRate: '',
    notes: '',
  });
  const [error, setError] = useState('');

  const createMutation = trpc.employees.create.useMutation({
    onSuccess,
    onError: (err) => setError(err.message),
  });
  const updateMutation = trpc.employees.update.useMutation({
    onSuccess,
    onError: (err) => setError(err.message),
  });

  useEffect(() => {
    if (!isOpen) return;
    setForm({
      firstName: employee?.firstName ?? '',
      lastName: employee?.lastName ?? '',
      email: employee?.email ?? '',
      phone: employee?.phone ?? '',
      position: employee?.position ?? '',
      status: employee?.status ?? 'ACTIVE',
      hireDate: employee?.hireDate ? new Date(employee.hireDate).toISOString().slice(0, 10) : '',
      hourlyRate: employee?.hourlyRate?.toString() ?? '',
      notes: employee?.notes ?? '',
    });
    setError('');
  }, [employee, isOpen]);

  if (!isOpen) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email || undefined,
      phone: form.phone || undefined,
      position: form.position || undefined,
      status: form.status || undefined,
      hireDate: form.hireDate || undefined,
      hourlyRate: form.hourlyRate ? Number(form.hourlyRate) : undefined,
      notes: form.notes || undefined,
    };

    if (employee?.id) {
      updateMutation.mutate({ id: employee.id, ...payload });
    } else {
      createMutation.mutate(payload);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-xl rounded-lg border border-border bg-card p-6 shadow-lg">
        <button onClick={onClose} className="absolute right-4 top-4 text-muted-foreground hover:text-foreground">
          <X size={20} />
        </button>
        <h2 className="mb-4 text-xl font-semibold text-foreground">
          {employee ? 'Edit Employee' : 'New Employee'}
        </h2>
        {error && <div className="mb-4 rounded-md border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}
        <form onSubmit={handleSubmit} className="grid gap-3 md:grid-cols-2">
          <input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} placeholder="First name" className="px-3 py-2 bg-secondary border border-border rounded-md text-sm" />
          <input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} placeholder="Last name" className="px-3 py-2 bg-secondary border border-border rounded-md text-sm" />
          <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" className="px-3 py-2 bg-secondary border border-border rounded-md text-sm" />
          <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone" className="px-3 py-2 bg-secondary border border-border rounded-md text-sm" />
          <input value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} placeholder="Position" className="px-3 py-2 bg-secondary border border-border rounded-md text-sm" />
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="px-3 py-2 bg-secondary border border-border rounded-md text-sm">
            <option value="ACTIVE">Active</option>
            <option value="ON_LEAVE">On Leave</option>
            <option value="TERMINATED">Terminated</option>
          </select>
          <input type="date" value={form.hireDate} onChange={(e) => setForm({ ...form, hireDate: e.target.value })} className="px-3 py-2 bg-secondary border border-border rounded-md text-sm" />
          <input type="number" min={0} step={0.01} value={form.hourlyRate} onChange={(e) => setForm({ ...form, hourlyRate: e.target.value })} placeholder="Hourly rate" className="px-3 py-2 bg-secondary border border-border rounded-md text-sm" />
          <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Notes" rows={3} className="md:col-span-2 px-3 py-2 bg-secondary border border-border rounded-md text-sm resize-none" />
          <div className="md:col-span-2 flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-border rounded-md hover:bg-secondary transition-colors">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground rounded-md font-semibold hover:bg-primary/90 transition-colors">
              {employee ? 'Save Changes' : 'Create Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
