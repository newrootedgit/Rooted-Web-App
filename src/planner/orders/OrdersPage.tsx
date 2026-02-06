import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { trpc } from '../../lib/trpc';
import { OrderList } from './components/OrderList';
import { OrderForm } from './components/OrderForm';

const ORDER_STATUSES = ['Pending', 'In Progress', 'Ready', 'Delivered', 'Cancelled'];

export function OrdersPage() {
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');

  const utils = trpc.useUtils();

  const { data, isLoading } = trpc.orders.list.useQuery({
    search: search || undefined,
    status: statusFilter || undefined,
  });

  const updateStatusMutation = trpc.orders.updateStatus.useMutation({
    onSuccess: () => {
      utils.orders.list.invalidate();
    },
  });

  function handleFormSuccess() {
    utils.orders.list.invalidate();
    utils.tasks.list.invalidate();
  }

  function handleUpdateStatus(id: string, status: string) {
    updateStatusMutation.mutate({ id, status: status as any });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">Orders</h1>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md font-semibold hover:bg-primary/90 transition-colors"
        >
          <Plus size={18} />
          New Order
        </button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search orders..."
            className="w-full pl-9 pr-3 py-2 bg-secondary border border-border rounded-md text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 bg-secondary border border-border rounded-md text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">All statuses</option>
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <OrderList
        orders={data?.items ?? []}
        isLoading={isLoading}
        onViewDetail={() => {}}
        onUpdateStatus={handleUpdateStatus}
      />

      <OrderForm
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSuccess={handleFormSuccess}
      />
    </div>
  );
}
