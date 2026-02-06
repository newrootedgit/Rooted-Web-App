import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { trpc } from '../../lib/trpc';
import { CustomerList } from './components/CustomerList';
import { CustomerForm } from './components/CustomerForm';

const CUSTOMER_TYPES = ['Retail', 'Wholesale', 'Restaurant', 'Farmers Market', 'Distributor'];

export function CustomersPage() {
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editCustomer, setEditCustomer] = useState<any>(null);
  const [showActiveOnly, setShowActiveOnly] = useState(true);
  const [typeFilter, setTypeFilter] = useState('');

  const utils = trpc.useUtils();

  const { data, isLoading } = trpc.customers.list.useQuery({
    search: search || undefined,
    isActive: showActiveOnly ? true : undefined,
    customerType: typeFilter || undefined,
  });

  const deactivateMutation = trpc.customers.deactivate.useMutation({
    onSuccess: () => utils.customers.list.invalidate(),
  });

  function handleEdit(customer: any) {
    setEditCustomer(customer);
    setShowForm(true);
  }

  function handleFormSuccess() {
    utils.customers.list.invalidate();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">Customers</h1>
        <button
          onClick={() => { setEditCustomer(null); setShowForm(true); }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md font-semibold hover:bg-primary/90 transition-colors"
        >
          <Plus size={18} />
          New Customer
        </button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customers..."
            className="w-full pl-9 pr-3 py-2 bg-secondary border border-border rounded-md text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-2 bg-secondary border border-border rounded-md text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">All types</option>
          {CUSTOMER_TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <input
            type="checkbox"
            checked={showActiveOnly}
            onChange={(e) => setShowActiveOnly(e.target.checked)}
            className="rounded"
          />
          Active only
        </label>
      </div>

      <CustomerList
        customers={data?.items ?? []}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDeactivate={(id) => deactivateMutation.mutate({ id })}
      />

      <CustomerForm
        isOpen={showForm}
        onClose={() => { setShowForm(false); setEditCustomer(null); }}
        onSuccess={handleFormSuccess}
        editCustomer={editCustomer}
      />
    </div>
  );
}
