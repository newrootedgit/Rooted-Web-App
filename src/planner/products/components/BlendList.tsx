import { useState } from 'react';
import { ChevronDown, ChevronUp, Edit2, Archive } from 'lucide-react';

interface BlendIngredient {
  id: string;
  productId: string | null;
  percentage: number;
  product?: {
    name: string;
    daysSoaking: number;
    daysGermination: number;
    daysLight: number;
  };
}

interface Blend {
  id: string;
  name: string;
  description: string | null;
  createdAt: string | Date | null;
  ingredients?: BlendIngredient[];
}

interface BlendListProps {
  blends: Blend[];
  isLoading: boolean;
  onEdit: (blend: Blend) => void;
  onArchive: (id: string) => void;
}

function BlendCard({ blend, onEdit, onArchive }: {
  blend: Blend;
  onEdit: (blend: Blend) => void;
  onArchive: (id: string) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className={`bg-card border rounded-lg cursor-pointer transition-all overflow-hidden ${
        isExpanded ? 'border-primary shadow-lg' : 'border-border hover:border-border/80 hover:shadow-md'
      }`}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="flex items-center justify-between p-4">
        <div className="flex flex-col gap-0.5">
          <span className="font-semibold text-foreground">{blend.name}</span>
          {blend.description && <span className="text-sm text-muted-foreground">{blend.description}</span>}
          <span className="text-xs text-muted-foreground">
            {blend.ingredients?.length ?? 0} ingredient{(blend.ingredients?.length ?? 0) !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="flex items-center gap-3">
          {isExpanded ? <ChevronUp size={20} className="text-muted-foreground" /> : <ChevronDown size={20} className="text-muted-foreground" />}
        </div>
      </div>

      {isExpanded && (
        <div className="px-4 pb-4 border-t border-border">
          {blend.ingredients && blend.ingredients.length > 0 && (
            <div className="py-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-muted-foreground uppercase tracking-wide">
                    <th className="pb-2">Product</th>
                    <th className="pb-2 text-right">Percentage</th>
                    <th className="pb-2 text-right">Total Days</th>
                  </tr>
                </thead>
                <tbody>
                  {blend.ingredients.map((ing) => {
                    const totalDays = ing.product
                      ? ing.product.daysSoaking + ing.product.daysGermination + ing.product.daysLight
                      : null;
                    return (
                      <tr key={ing.id} className="border-t border-border/50">
                        <td className="py-2 text-foreground">{ing.product?.name ?? 'Unknown'}</td>
                        <td className="py-2 text-right text-foreground">{ing.percentage}%</td>
                        <td className="py-2 text-right text-muted-foreground">{totalDays !== null ? `${totalDays}d` : '-'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex gap-2 pt-3 border-t border-border">
            <button
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-secondary border border-border rounded-md text-sm font-medium text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
              onClick={(e) => { e.stopPropagation(); onEdit(blend); }}
            >
              <Edit2 size={16} />
              Edit
            </button>
            <button
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-transparent border border-destructive rounded-md text-sm font-medium text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                if (confirm(`Delete "${blend.name}"?`)) onArchive(blend.id);
              }}
            >
              <Archive size={16} />
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function BlendList({ blends, isLoading, onEdit, onArchive }: BlendListProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-muted-foreground gap-4">
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent" />
        <p>Loading blends...</p>
      </div>
    );
  }

  if (blends.length === 0) {
    return (
      <p className="text-muted-foreground py-8 text-center">
        No blends yet. Click "New Blend" to get started.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {blends.map((blend) => (
        <BlendCard key={blend.id} blend={blend} onEdit={onEdit} onArchive={onArchive} />
      ))}
    </div>
  );
}
