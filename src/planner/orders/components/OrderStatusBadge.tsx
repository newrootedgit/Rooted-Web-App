const STATUS_COLORS: Record<string, string> = {
  'Pending': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  'In Progress': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'Ready': 'bg-green-500/20 text-green-400 border-green-500/30',
  'Delivered': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  'Cancelled': 'bg-red-500/20 text-red-400 border-red-500/30',
};

interface OrderStatusBadgeProps {
  status: string;
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const colors = STATUS_COLORS[status] ?? 'bg-muted text-muted-foreground border-border';

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full border ${colors}`}>
      {status}
    </span>
  );
}
