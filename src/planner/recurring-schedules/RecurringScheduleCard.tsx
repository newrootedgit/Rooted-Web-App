import { trpc } from '../../lib/trpc';

interface RecurringScheduleCardProps {
  schedule: any;
  onEdit: () => void;
  onChanged: () => void;
}

function formatDate(date: string | Date | null | undefined) {
  if (!date) return '—';
  return new Date(date).toLocaleDateString();
}

export function RecurringScheduleCard({ schedule, onEdit, onChanged }: RecurringScheduleCardProps) {
  const toggleMutation = trpc.recurringSchedules.toggleActive.useMutation({
    onSuccess: onChanged,
  });
  const deleteMutation = trpc.recurringSchedules.delete.useMutation({
    onSuccess: onChanged,
  });
  const generateMutation = trpc.recurringSchedules.generateOrder.useMutation({
    onSuccess: onChanged,
  });

  return (
    <div className="rounded-lg border border-border bg-card p-4 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-foreground">{schedule.name}</div>
          <div className="text-xs text-muted-foreground">
            {schedule.scheduleType === 'FIXED_DAY'
              ? `Fixed days: ${(schedule.daysOfWeek ?? []).join(', ')}`
              : `Every ${schedule.intervalDays} day(s)`}
          </div>
        </div>
        <span className={`rounded-full px-2 py-1 text-xs ${schedule.isActive ? 'bg-green-500/10 text-green-500' : 'bg-secondary text-muted-foreground'}`}>
          {schedule.isActive ? 'Active' : 'Inactive'}
        </span>
      </div>

      <div className="text-sm text-muted-foreground space-y-1">
        <div>Customer: {schedule.customer?.name ?? 'No customer'}</div>
        <div>Next harvest: {formatDate(schedule.nextHarvestDate)}</div>
        <div>Items: {(schedule.items ?? []).length}</div>
        <div>Last generated: {formatDate(schedule.lastGeneratedAt)}</div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button onClick={onEdit} className="px-3 py-1.5 text-xs font-medium border border-border rounded hover:bg-secondary transition-colors">Edit</button>
        <button
          onClick={() => toggleMutation.mutate({ id: schedule.id, isActive: !schedule.isActive })}
          className="px-3 py-1.5 text-xs font-medium border border-border rounded hover:bg-secondary transition-colors"
        >
          {schedule.isActive ? 'Deactivate' : 'Activate'}
        </button>
        <button
          onClick={() => generateMutation.mutate({ scheduleId: schedule.id })}
          className="px-3 py-1.5 text-xs font-medium border border-primary/30 text-primary rounded hover:bg-primary/10 transition-colors"
        >
          Generate Order
        </button>
        <button
          onClick={() => deleteMutation.mutate({ id: schedule.id })}
          className="px-3 py-1.5 text-xs font-medium border border-destructive/30 text-destructive rounded hover:bg-destructive/10 transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
