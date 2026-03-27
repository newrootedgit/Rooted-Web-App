import { useState } from 'react';
import { ChevronDown, ChevronUp, Package, Calendar } from 'lucide-react';
import { OrderStatusBadge } from './OrderStatusBadge';

interface OrderItem {
  id: string;
  productId: string | null;
  blendId: string | null;
  skuId?: string | null;
  quantityUnits?: number | null;
  quantityOz: number;
  harvestDate: string | Date;
  traysNeeded: number | null;
  soakDate: string | Date | null;
  seedDate: string | Date | null;
  moveToLightDate: string | Date | null;
  product?: { name: string } | null;
  blend?: { name: string } | null;
  sku?: { name: string } | null;
  tasks?: any[];
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  notes: string | null;
  customerId: string | null;
  customer?: { name: string } | null;
  items?: OrderItem[];
  createdAt: string | Date | null;
}

interface OrderListProps {
  orders: Order[];
  isLoading: boolean;
  onViewDetail: (order: Order) => void;
  onUpdateStatus: (id: string, status: string) => void;
  onClone: (order: Order) => void;
}

function formatDate(d: string | Date | null): string {
  if (!d) return '-';
  return new Date(d).toLocaleDateString();
}

function getNextStatuses(current: string): string[] {
  const map: Record<string, string[]> = {
    'Pending': ['In Progress', 'Cancelled'],
    'In Progress': ['Ready', 'Cancelled'],
    'Ready': ['Delivered', 'Cancelled'],
  };
  return map[current] ?? [];
}

function OrderCard({ order, onViewDetail, onUpdateStatus, onClone }: {
  order: Order;
  onViewDetail: (order: Order) => void;
  onUpdateStatus: (id: string, status: string) => void;
  onClone: (order: Order) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const nextStatuses = getNextStatuses(order.status);
  const harvestDates = order.items?.map(i => formatDate(i.harvestDate)).filter(Boolean) ?? [];
  const uniqueHarvest = [...new Set(harvestDates)];

  return (
    <div
      className={`bg-card border rounded-lg cursor-pointer transition-all overflow-hidden ${
        isExpanded ? 'border-primary shadow-lg' : 'border-border hover:border-border/80 hover:shadow-md'
      }`}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="flex items-center justify-between p-4">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground">{order.orderNumber}</span>
            <OrderStatusBadge status={order.status} />
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            {order.customer?.name && <span>{order.customer.name}</span>}
            <span className="flex items-center gap-1">
              <Package size={14} />
              {order.items?.length ?? 0} item{(order.items?.length ?? 0) !== 1 ? 's' : ''}
            </span>
            {uniqueHarvest.length > 0 && (
              <span className="flex items-center gap-1">
                <Calendar size={14} />
                {uniqueHarvest.join(', ')}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClone(order);
            }}
            className="px-2 py-1 text-xs border border-border rounded hover:bg-secondary transition-colors"
          >
            Clone
          </button>
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </div>

      {isExpanded && (
        <div className="px-4 pb-4 border-t border-border" onClick={(e) => e.stopPropagation()}>
          {order.items && order.items.length > 0 && (
            <div className="mt-3">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-muted-foreground text-left">
                    <th className="pb-2 font-medium">Variety / Blend</th>
                    <th className="pb-2 font-medium">SKU</th>
                    <th className="pb-2 font-medium">Units</th>
                    <th className="pb-2 font-medium">Qty (oz)</th>
                    <th className="pb-2 font-medium">Trays</th>
                    <th className="pb-2 font-medium">Harvest</th>
                    <th className="pb-2 font-medium">Tasks</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item) => (
                    <tr key={item.id} className="border-t border-border/50">
                      <td className="py-2 text-foreground">
                        {item.product?.name ?? item.blend?.name ?? 'Unknown'}
                      </td>
                      <td className="py-2 text-foreground">{item.sku?.name ?? '—'}</td>
                      <td className="py-2 text-foreground">{item.quantityUnits ?? '—'}</td>
                      <td className="py-2 text-foreground">{item.quantityOz}</td>
                      <td className="py-2 text-foreground">{item.traysNeeded ?? '-'}</td>
                      <td className="py-2 text-foreground">{formatDate(item.harvestDate)}</td>
                      <td className="py-2 text-foreground">{item.tasks?.length ?? 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {order.notes && (
            <p className="mt-3 text-sm text-muted-foreground">{order.notes}</p>
          )}

          <div className="flex gap-2 pt-3 mt-3 border-t border-border">
            {nextStatuses.map((status) => (
              <button
                key={status}
                onClick={() => onUpdateStatus(order.id, status)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors ${
                  status === 'Cancelled'
                    ? 'border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground'
                    : 'border-primary text-primary hover:bg-primary hover:text-primary-foreground'
                }`}
              >
                {status === 'In Progress' ? 'Start' : status === 'Cancelled' ? 'Cancel' : status}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function OrderList({ orders, isLoading, onViewDetail, onUpdateStatus, onClone }: OrderListProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-muted-foreground gap-4">
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent" />
        <p>Loading orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <p className="text-muted-foreground py-8 text-center">
        No orders yet. Click "New Order" to get started.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {orders.map((order) => (
        <OrderCard
          key={order.id}
          order={order}
          onViewDetail={onViewDetail}
          onUpdateStatus={onUpdateStatus}
          onClone={onClone}
        />
      ))}
    </div>
  );
}
