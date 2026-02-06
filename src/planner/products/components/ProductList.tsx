import { useState } from 'react';
import { ChevronDown, ChevronUp, Edit2, Archive, Sprout, Clock, DollarSign } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  sku: string | null;
  categoryId: string | null;
  daysSoaking: number;
  daysGermination: number;
  daysLight: number;
  avgYieldPerTray: number | null;
  seedWeight: number | null;
  seedUnit: string | null;
  unitCost: number | null;
  unitPrice: number | null;
  isActive: boolean | null;
  createdAt: string | Date | null;
}

interface ProductListProps {
  products: Product[];
  isLoading: boolean;
  onEdit: (product: Product) => void;
  onArchive: (id: string) => void;
  categoryNames: Record<string, string>;
}

function ProductCard({ product, onEdit, onArchive, categoryName }: {
  product: Product;
  onEdit: (product: Product) => void;
  onArchive: (id: string) => void;
  categoryName: string | undefined;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const totalDays = product.daysSoaking + product.daysGermination + product.daysLight;

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
            <span className="font-semibold text-foreground">{product.name}</span>
            {product.sku && <span className="text-xs text-muted-foreground font-mono">({product.sku})</span>}
            {!product.isActive && (
              <span className="px-1.5 py-0.5 text-xs bg-muted text-muted-foreground rounded">Archived</span>
            )}
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            {categoryName && <span>{categoryName}</span>}
            <span className="flex items-center gap-1">
              <Clock size={14} />
              {totalDays} days total
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {isExpanded ? <ChevronUp size={20} className="text-muted-foreground" /> : <ChevronDown size={20} className="text-muted-foreground" />}
        </div>
      </div>

      {isExpanded && (
        <div className="px-4 pb-4 border-t border-border">
          <div className="grid grid-cols-3 gap-4 py-4">
            <div className="flex items-start gap-2">
              <Sprout size={16} className="text-muted-foreground mt-0.5" />
              <div className="flex flex-col gap-0.5">
                <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Growing Schedule</span>
                <span className="text-sm text-foreground">
                  Soak: {product.daysSoaking}d | Germ: {product.daysGermination}d | Light: {product.daysLight}d
                </span>
              </div>
            </div>
            {product.avgYieldPerTray !== null && (
              <div className="flex items-start gap-2">
                <Sprout size={16} className="text-muted-foreground mt-0.5" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Avg Yield/Tray</span>
                  <span className="text-sm text-foreground">{product.avgYieldPerTray} oz</span>
                </div>
              </div>
            )}
            {(product.unitCost !== null || product.unitPrice !== null) && (
              <div className="flex items-start gap-2">
                <DollarSign size={16} className="text-muted-foreground mt-0.5" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Pricing</span>
                  <span className="text-sm text-foreground">
                    {product.unitCost !== null && `Cost: $${product.unitCost}`}
                    {product.unitCost !== null && product.unitPrice !== null && ' | '}
                    {product.unitPrice !== null && `Price: $${product.unitPrice}`}
                  </span>
                </div>
              </div>
            )}
            {product.seedWeight !== null && (
              <div className="flex items-start gap-2">
                <Sprout size={16} className="text-muted-foreground mt-0.5" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Seed Weight</span>
                  <span className="text-sm text-foreground">
                    {product.seedWeight} {product.seedUnit ?? ''}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-3 border-t border-border">
            <button
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-secondary border border-border rounded-md text-sm font-medium text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
              onClick={(e) => { e.stopPropagation(); onEdit(product); }}
            >
              <Edit2 size={16} />
              Edit
            </button>
            {product.isActive && (
              <button
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-transparent border border-destructive rounded-md text-sm font-medium text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm(`Archive "${product.name}"?`)) onArchive(product.id);
                }}
              >
                <Archive size={16} />
                Archive
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function ProductList({ products, isLoading, onEdit, onArchive, categoryNames }: ProductListProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-muted-foreground gap-4">
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent" />
        <p>Loading products...</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <p className="text-muted-foreground py-8 text-center">
        No products yet. Click "New Product" to get started.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onEdit={onEdit}
          onArchive={onArchive}
          categoryName={product.categoryId ? categoryNames[product.categoryId] : undefined}
        />
      ))}
    </div>
  );
}
