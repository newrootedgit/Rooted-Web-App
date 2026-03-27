import { useEffect, useState } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import { trpc } from '../../lib/trpc';

const DAY_OPTIONS = [
  { value: 0, label: 'Sun' },
  { value: 1, label: 'Mon' },
  { value: 2, label: 'Tue' },
  { value: 3, label: 'Wed' },
  { value: 4, label: 'Thu' },
  { value: 5, label: 'Fri' },
  { value: 6, label: 'Sat' },
];

interface RecurringScheduleFormProps {
  isOpen: boolean;
  schedule?: any;
  onClose: () => void;
  onSuccess: () => void;
}

export function RecurringScheduleForm({ isOpen, schedule, onClose, onSuccess }: RecurringScheduleFormProps) {
  const [form, setForm] = useState<any>({
    name: '',
    customerId: '',
    scheduleType: 'FIXED_DAY',
    daysOfWeek: [1],
    intervalDays: 7,
    startDate: '',
    endDate: '',
    leadTimeDays: 7,
    notes: '',
    items: [{ productId: '', blendId: '', quantityOz: 16, overagePercent: 10 }],
    skipDates: [] as any[],
    skipDateInput: '',
  });
  const [error, setError] = useState('');

  const { data: customers } = trpc.customers.list.useQuery({ isActive: true, limit: 100 });
  const { data: products } = trpc.products.list.useQuery({ isActive: true, limit: 100 });
  const { data: blends } = trpc.products.blends.list.useQuery({ limit: 100 });
  const createMutation = trpc.recurringSchedules.create.useMutation({ onError: (err) => setError(err.message) });
  const updateMutation = trpc.recurringSchedules.update.useMutation({ onError: (err) => setError(err.message) });
  const addSkipDateMutation = trpc.recurringSchedules.addSkipDate.useMutation({ onError: (err) => setError(err.message) });

  useEffect(() => {
    if (!isOpen) return;
    setForm({
      name: schedule?.name ?? '',
      customerId: schedule?.customerId ?? '',
      scheduleType: schedule?.scheduleType ?? 'FIXED_DAY',
      daysOfWeek: schedule?.daysOfWeek ?? [1],
      intervalDays: schedule?.intervalDays ?? 7,
      startDate: schedule?.startDate ? new Date(schedule.startDate).toISOString().slice(0, 10) : '',
      endDate: schedule?.endDate ? new Date(schedule.endDate).toISOString().slice(0, 10) : '',
      leadTimeDays: schedule?.leadTimeDays ?? 7,
      notes: schedule?.notes ?? '',
      items: schedule?.items?.map((item: any) => ({
        productId: item.productId ?? '',
        blendId: item.blendId ?? '',
        quantityOz: item.quantityOz,
        overagePercent: item.overagePercent ?? 10,
      })) ?? [{ productId: '', blendId: '', quantityOz: 16, overagePercent: 10 }],
      skipDates: schedule?.skipDates?.map((item: any) => ({
        id: item.id,
        skipDate: new Date(item.skipDate).toISOString().slice(0, 10),
        reason: item.reason ?? '',
      })) ?? [],
      skipDateInput: '',
    });
    setError('');
  }, [isOpen, schedule]);

  if (!isOpen) return null;

  function updateItem(index: number, patch: Record<string, any>) {
    const items = [...form.items];
    items[index] = { ...items[index], ...patch };
    if (patch.productId !== undefined) items[index].blendId = '';
    if (patch.blendId !== undefined) items[index].productId = '';
    setForm({ ...form, items });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      name: form.name,
      customerId: form.customerId || undefined,
      scheduleType: form.scheduleType,
      daysOfWeek: form.daysOfWeek,
      intervalDays: form.scheduleType === 'INTERVAL' ? Number(form.intervalDays) : undefined,
      startDate: form.startDate,
      endDate: form.endDate || undefined,
      leadTimeDays: Number(form.leadTimeDays),
      notes: form.notes || undefined,
      items: form.items
        .filter((item: any) => (item.productId || item.blendId) && item.quantityOz)
        .map((item: any) => ({
          productId: item.productId || undefined,
          blendId: item.blendId || undefined,
          quantityOz: Number(item.quantityOz),
          overagePercent: Number(item.overagePercent ?? 10),
        })),
    };

    try {
      const saved = schedule?.id
        ? await updateMutation.mutateAsync({ id: schedule.id, ...payload })
        : await createMutation.mutateAsync(payload);

      for (const skip of form.skipDates.filter((item: any) => !item.id)) {
        await addSkipDateMutation.mutateAsync({
          scheduleId: saved.id,
          skipDate: skip.skipDate,
          reason: skip.reason || undefined,
        });
      }

      onSuccess();
    } catch {
      // Mutation-specific error state is already handled above.
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg border border-border bg-card p-6 shadow-lg">
        <button onClick={onClose} className="absolute right-4 top-4 text-muted-foreground hover:text-foreground">
          <X size={20} />
        </button>
        <h2 className="mb-4 text-xl font-semibold text-foreground">{schedule ? 'Edit Recurring Schedule' : 'New Recurring Schedule'}</h2>
        {error && <div className="mb-4 rounded-md border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-3 md:grid-cols-2">
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Schedule name" className="px-3 py-2 bg-secondary border border-border rounded-md text-sm" />
            <select value={form.customerId} onChange={(e) => setForm({ ...form, customerId: e.target.value })} className="px-3 py-2 bg-secondary border border-border rounded-md text-sm">
              <option value="">No customer</option>
              {(customers?.items ?? []).map((customer) => <option key={customer.id} value={customer.id}>{customer.name}</option>)}
            </select>
            <select value={form.scheduleType} onChange={(e) => setForm({ ...form, scheduleType: e.target.value })} className="px-3 py-2 bg-secondary border border-border rounded-md text-sm">
              <option value="FIXED_DAY">Fixed Day</option>
              <option value="INTERVAL">Interval</option>
            </select>
            {form.scheduleType === 'INTERVAL' ? (
              <input type="number" min={1} value={form.intervalDays} onChange={(e) => setForm({ ...form, intervalDays: e.target.value })} placeholder="Every N days" className="px-3 py-2 bg-secondary border border-border rounded-md text-sm" />
            ) : (
              <div className="flex flex-wrap items-center gap-2 rounded-md border border-border bg-secondary px-3 py-2">
                {DAY_OPTIONS.map((day) => (
                  <label key={day.value} className="flex items-center gap-1 text-xs text-foreground">
                    <input
                      type="checkbox"
                      checked={form.daysOfWeek.includes(day.value)}
                      onChange={(e) => setForm({
                        ...form,
                        daysOfWeek: e.target.checked
                          ? [...form.daysOfWeek, day.value]
                          : form.daysOfWeek.filter((value: number) => value !== day.value),
                      })}
                    />
                    {day.label}
                  </label>
                ))}
              </div>
            )}
            <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className="px-3 py-2 bg-secondary border border-border rounded-md text-sm" />
            <input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} className="px-3 py-2 bg-secondary border border-border rounded-md text-sm" />
            <input type="number" min={1} value={form.leadTimeDays} onChange={(e) => setForm({ ...form, leadTimeDays: e.target.value })} placeholder="Lead time days" className="px-3 py-2 bg-secondary border border-border rounded-md text-sm" />
            <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Notes" rows={2} className="px-3 py-2 bg-secondary border border-border rounded-md text-sm resize-none" />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">Items</h3>
              <button type="button" onClick={() => setForm({ ...form, items: [...form.items, { productId: '', blendId: '', quantityOz: 16, overagePercent: 10 }] })} className="inline-flex items-center gap-1 text-xs text-primary">
                <Plus size={14} />
                Add Item
              </button>
            </div>
            {form.items.map((item: any, index: number) => (
              <div key={index} className="grid gap-3 rounded-lg border border-border bg-secondary/40 p-3 md:grid-cols-[2fr_1fr_1fr_auto]">
                <select value={item.productId || item.blendId || ''} onChange={(e) => {
                  const value = e.target.value;
                  const isBlend = (blends?.items ?? []).some((blend) => blend.id === value);
                  updateItem(index, isBlend ? { blendId: value } : { productId: value });
                }} className="px-3 py-2 bg-secondary border border-border rounded-md text-sm">
                  <option value="">Select variety or blend</option>
                  <optgroup label="Varieties">
                    {(products?.items ?? []).map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}
                  </optgroup>
                  <optgroup label="Blends">
                    {(blends?.items ?? []).map((blend) => <option key={blend.id} value={blend.id}>{blend.name}</option>)}
                  </optgroup>
                </select>
                <input type="number" min={0.01} step={0.01} value={item.quantityOz} onChange={(e) => updateItem(index, { quantityOz: e.target.value })} placeholder="Oz" className="px-3 py-2 bg-secondary border border-border rounded-md text-sm" />
                <input type="number" min={0} max={100} value={item.overagePercent} onChange={(e) => updateItem(index, { overagePercent: e.target.value })} placeholder="Overage %" className="px-3 py-2 bg-secondary border border-border rounded-md text-sm" />
                <button type="button" onClick={() => setForm({ ...form, items: form.items.filter((_: any, itemIndex: number) => itemIndex !== index) })} className="px-3 py-2 text-destructive hover:bg-destructive/10 rounded-md transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Skip Dates</h3>
            <div className="flex gap-3">
              <input type="date" value={form.skipDateInput} onChange={(e) => setForm({ ...form, skipDateInput: e.target.value })} className="px-3 py-2 bg-secondary border border-border rounded-md text-sm" />
              <button
                type="button"
                onClick={() => form.skipDateInput && setForm({
                  ...form,
                  skipDates: [...form.skipDates, { skipDate: form.skipDateInput, reason: '' }],
                  skipDateInput: '',
                })}
                className="px-3 py-2 border border-border rounded-md hover:bg-secondary transition-colors"
              >
                Add Skip Date
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.skipDates.map((skip: any, index: number) => (
                <span key={`${skip.skipDate}-${index}`} className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs text-foreground">
                  {skip.skipDate}
                  <button type="button" onClick={() => setForm({ ...form, skipDates: form.skipDates.filter((_: any, skipIndex: number) => skipIndex !== index) })}>x</button>
                </span>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-border rounded-md hover:bg-secondary transition-colors">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground rounded-md font-semibold hover:bg-primary/90 transition-colors">
              {schedule ? 'Save Schedule' : 'Create Schedule'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
