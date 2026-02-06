import { useState, useEffect } from 'react';
import { X, Plus, XCircle } from 'lucide-react';
import { trpc } from '../../../lib/trpc';

const CUSTOMER_TYPES = ['Retail', 'Wholesale', 'Restaurant', 'Farmers Market', 'Distributor'] as const;
const PAYMENT_TERMS = ['Due on Receipt', 'Net 7', 'Net 15', 'Net 30', 'Net 60'] as const;

interface CustomerFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editCustomer?: {
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
  } | null;
}

export function CustomerForm({ isOpen, onClose, onSuccess, editCustomer }: CustomerFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [customerType, setCustomerType] = useState('');
  const [paymentTerms, setPaymentTerms] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const createMutation = trpc.customers.create.useMutation({
    onSuccess: () => { onSuccess(); handleClose(); },
    onError: (err) => setError(err.message),
  });

  const updateMutation = trpc.customers.update.useMutation({
    onSuccess: () => { onSuccess(); handleClose(); },
    onError: (err) => setError(err.message),
  });

  useEffect(() => {
    if (editCustomer) {
      setName(editCustomer.name);
      setEmail(editCustomer.email ?? '');
      setPhone(editCustomer.phone ?? '');
      setCompanyName(editCustomer.companyName ?? '');
      setCustomerType(editCustomer.customerType ?? '');
      setPaymentTerms(editCustomer.paymentTerms ?? '');
      const addr = editCustomer.address as Record<string, string> | null;
      setStreet(addr?.street ?? '');
      setCity(addr?.city ?? '');
      setState(addr?.state ?? '');
      setZip(addr?.zip ?? '');
      setTags([...editCustomer.tags]);
      setNotes(editCustomer.notes ?? '');
    } else {
      resetForm();
    }
  }, [editCustomer, isOpen]);

  function resetForm() {
    setName('');
    setEmail('');
    setPhone('');
    setCompanyName('');
    setCustomerType('');
    setPaymentTerms('');
    setStreet('');
    setCity('');
    setState('');
    setZip('');
    setTags([]);
    setTagInput('');
    setNotes('');
    setError('');
  }

  function handleClose() {
    resetForm();
    onClose();
  }

  function addTag() {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
    }
    setTagInput('');
  }

  function removeTag(tag: string) {
    setTags(tags.filter((t) => t !== tag));
  }

  function handleTagKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  }

  function buildAddress() {
    if (!street && !city && !state && !zip) return undefined;
    return { street: street || undefined, city: city || undefined, state: state || undefined, zip: zip || undefined };
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    const address = buildAddress();

    if (editCustomer) {
      updateMutation.mutate({
        id: editCustomer.id,
        name: name || undefined,
        email: email || null,
        phone: phone || null,
        companyName: companyName || null,
        customerType: (customerType as typeof CUSTOMER_TYPES[number]) || null,
        paymentTerms: (paymentTerms as typeof PAYMENT_TERMS[number]) || null,
        address: address ?? null,
        tags,
        notes: notes || null,
      });
    } else {
      createMutation.mutate({
        name,
        email: email || undefined,
        phone: phone || undefined,
        companyName: companyName || undefined,
        customerType: (customerType as typeof CUSTOMER_TYPES[number]) || undefined,
        paymentTerms: (paymentTerms as typeof PAYMENT_TERMS[number]) || undefined,
        address,
        tags: tags.length > 0 ? tags : undefined,
        notes: notes || undefined,
      });
    }
  }

  if (!isOpen) return null;

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="relative bg-card rounded-lg p-6 w-full max-w-lg shadow-lg border border-border max-h-[90vh] overflow-y-auto">
        <button onClick={handleClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors">
          <X size={20} />
        </button>

        <h2 className="text-xl font-semibold text-foreground mb-6">
          {editCustomer ? 'Edit Customer' : 'New Customer'}
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md text-sm text-destructive">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-foreground">Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="px-3 py-2 bg-secondary border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-foreground">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-3 py-2 bg-secondary border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-foreground">Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="px-3 py-2 bg-secondary border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-foreground">Company Name</label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="px-3 py-2 bg-secondary border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-foreground">Customer Type</label>
              <select
                value={customerType}
                onChange={(e) => setCustomerType(e.target.value)}
                className="px-3 py-2 bg-secondary border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select type</option>
                {CUSTOMER_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-foreground">Payment Terms</label>
              <select
                value={paymentTerms}
                onChange={(e) => setPaymentTerms(e.target.value)}
                className="px-3 py-2 bg-secondary border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select terms</option>
                {PAYMENT_TERMS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <fieldset className="border border-border rounded-md p-3">
            <legend className="text-sm font-medium text-foreground px-1">Address</legend>
            <div className="flex flex-col gap-3">
              <input
                type="text"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                placeholder="Street"
                className="px-3 py-2 bg-secondary border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <div className="grid grid-cols-3 gap-3">
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="City"
                  className="px-3 py-2 bg-secondary border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="State"
                  className="px-3 py-2 bg-secondary border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                  type="text"
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                  placeholder="ZIP"
                  className="px-3 py-2 bg-secondary border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </fieldset>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-foreground">Tags</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder="Add a tag and press Enter"
                className="flex-1 px-3 py-2 bg-secondary border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="button"
                onClick={addTag}
                className="px-3 py-2 bg-secondary border border-border rounded-md text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {tags.map((tag) => (
                  <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-primary/10 text-primary rounded-full">
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)} className="hover:text-destructive">
                      <XCircle size={14} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-foreground">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="px-3 py-2 bg-secondary border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-md font-semibold hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? 'Saving...' : editCustomer ? 'Update Customer' : 'Create Customer'}
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 bg-transparent border border-border text-foreground rounded-md hover:bg-secondary transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
