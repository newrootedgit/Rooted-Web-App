import { useMemo, useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { trpc } from '../../lib/trpc';
import { RecurringScheduleForm } from './RecurringScheduleForm';
import { RecurringScheduleCard } from './RecurringScheduleCard';

export function RecurringSchedulesPage() {
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const utils = trpc.useUtils();

  const { data, isLoading } = trpc.recurringSchedules.list.useQuery({
    search: search || undefined,
    limit: 100,
  });

  const stats = useMemo(() => {
    const items = data?.items ?? [];
    return {
      total: items.length,
      active: items.filter((item) => item.isActive).length,
    };
  }, [data?.items]);

  function handleSuccess() {
    utils.recurringSchedules.list.invalidate();
    utils.orders.list.invalidate();
    setEditing(null);
    setIsOpen(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Recurring Schedules</h1>
          <p className="text-sm text-muted-foreground">Active {stats.active} of {stats.total}</p>
        </div>
        <button
          onClick={() => { setEditing(null); setIsOpen(true); }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md font-semibold hover:bg-primary/90 transition-colors"
        >
          <Plus size={18} />
          New Schedule
        </button>
      </div>

      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search schedules..."
          className="w-full pl-9 pr-3 py-2 bg-secondary border border-border rounded-md text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {isLoading ? (
        <div className="text-sm text-muted-foreground">Loading recurring schedules...</div>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {(data?.items ?? []).map((schedule) => (
            <RecurringScheduleCard
              key={schedule.id}
              schedule={schedule}
              onEdit={() => { setEditing(schedule); setIsOpen(true); }}
              onChanged={handleSuccess}
            />
          ))}
        </div>
      )}

      <RecurringScheduleForm
        isOpen={isOpen}
        schedule={editing}
        onClose={() => { setIsOpen(false); setEditing(null); }}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
