import { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Edit2,
  UserX,
  Mail,
  Phone,
  Building,
  Tag,
  FileText,
} from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  companyName: string | null;
  customerType: string | null;
  paymentTerms: string | null;
  address: Record<string, unknown> | null;
  tags: string[];
  notes: string | null;
  isActive: boolean | null;
  createdAt: string | Date | null;
}

interface CustomerListProps {
  customers: Customer[];
  isLoading: boolean;
  onEdit: (customer: Customer) => void;
  onDeactivate: (id: string) => void;
}

function formatAddress(address: Record<string, unknown> | null): string | null {
  if (!address) return null;
  const parts = [address.street, address.city, address.state, address.zip].filter(Boolean);
  return parts.length > 0 ? parts.join(', ') as string : null;
}

function CustomerCard({ customer, onEdit, onDeactivate }: {
  customer: Customer;
  onEdit: (customer: Customer) => void;
  onDeactivate: (id: string) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const addressStr = formatAddress(customer.address);

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
            <span className="font-semibold text-foreground">{customer.name}</span>
            {customer.companyName && (
              <span className="text-sm text-muted-foreground">{customer.companyName}</span>
            )}
            {!customer.isActive && (
              <span className="px-1.5 py-0.5 text-xs bg-muted text-muted-foreground rounded">Inactive</span>
            )}
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            {customer.customerType && <span>{customer.customerType}</span>}
            {customer.email && (
              <span className="flex items-center gap-1">
                <Mail size={14} />
                {customer.email}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {customer.tags.length > 0 && (
            <div className="flex items-center gap-1">
              {customer.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="px-2 py-0.5 text-xs bg-primary/10 text-primary rounded-full">
                  {tag}
                </span>
              ))}
              {customer.tags.length > 3 && (
                <span className="text-xs text-muted-foreground">+{customer.tags.length - 3}</span>
              )}
            </div>
          )}
          {isExpanded ? <ChevronUp size={20} className="text-muted-foreground" /> : <ChevronDown size={20} className="text-muted-foreground" />}
        </div>
      </div>

      {isExpanded && (
        <div className="px-4 pb-4 border-t border-border">
          <div className="grid grid-cols-2 gap-4 py-4">
            {customer.phone && (
              <div className="flex items-start gap-2">
                <Phone size={16} className="text-muted-foreground mt-0.5" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Phone</span>
                  <span className="text-sm text-foreground">{customer.phone}</span>
                </div>
              </div>
            )}
            {customer.companyName && (
              <div className="flex items-start gap-2">
                <Building size={16} className="text-muted-foreground mt-0.5" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Company</span>
                  <span className="text-sm text-foreground">{customer.companyName}</span>
                </div>
              </div>
            )}
            {customer.paymentTerms && (
              <div className="flex items-start gap-2">
                <FileText size={16} className="text-muted-foreground mt-0.5" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Payment Terms</span>
                  <span className="text-sm text-foreground">{customer.paymentTerms}</span>
                </div>
              </div>
            )}
            {addressStr && (
              <div className="flex items-start gap-2">
                <Building size={16} className="text-muted-foreground mt-0.5" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Address</span>
                  <span className="text-sm text-foreground">{addressStr}</span>
                </div>
              </div>
            )}
            {customer.tags.length > 0 && (
              <div className="flex items-start gap-2">
                <Tag size={16} className="text-muted-foreground mt-0.5" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Tags</span>
                  <div className="flex flex-wrap gap-1">
                    {customer.tags.map((tag) => (
                      <span key={tag} className="px-2 py-0.5 text-xs bg-primary/10 text-primary rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {customer.notes && (
              <div className="flex items-start gap-2 col-span-2">
                <FileText size={16} className="text-muted-foreground mt-0.5" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Notes</span>
                  <span className="text-sm text-foreground whitespace-pre-wrap">{customer.notes}</span>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-3 border-t border-border">
            <button
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-secondary border border-border rounded-md text-sm font-medium text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
              onClick={(e) => { e.stopPropagation(); onEdit(customer); }}
            >
              <Edit2 size={16} />
              Edit
            </button>
            {customer.isActive && (
              <button
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-transparent border border-destructive rounded-md text-sm font-medium text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm(`Deactivate "${customer.name}"?`)) onDeactivate(customer.id);
                }}
              >
                <UserX size={16} />
                Deactivate
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function CustomerList({ customers, isLoading, onEdit, onDeactivate }: CustomerListProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-muted-foreground gap-4">
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent" />
        <p>Loading customers...</p>
      </div>
    );
  }

  if (customers.length === 0) {
    return (
      <p className="text-muted-foreground py-8 text-center">
        No customers yet. Click "New Customer" to get started.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {customers.map((customer) => (
        <CustomerCard
          key={customer.id}
          customer={customer}
          onEdit={onEdit}
          onDeactivate={onDeactivate}
        />
      ))}
    </div>
  );
}
