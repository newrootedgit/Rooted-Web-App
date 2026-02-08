import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { trpc } from '../../lib/trpc';
import { ProductList } from './components/ProductList';
import { ProductForm } from './components/ProductForm';
import { CategoryManager } from './components/CategoryManager';
import { BlendList } from './components/BlendList';
import { BlendForm } from './components/BlendForm';

type Tab = 'products' | 'blends';

export function ProductsPage() {
  const [tab, setTab] = useState<Tab>('products');
  const [search, setSearch] = useState('');
  const [showProductForm, setShowProductForm] = useState(false);
  const [showBlendForm, setShowBlendForm] = useState(false);
  const [editProduct, setEditProduct] = useState<any>(null);
  const [editBlend, setEditBlend] = useState<any>(null);
  const [showActiveOnly, setShowActiveOnly] = useState(true);

  const utils = trpc.useUtils();

  const { data: productsData, isLoading: productsLoading } = trpc.products.list.useQuery({
    search: search || undefined,
    isActive: showActiveOnly ? true : undefined,
  });

  const { data: blendsData, isLoading: blendsLoading } = trpc.products.blends.list.useQuery({});

  const { data: categories } = trpc.products.categories.list.useQuery();

  const archiveProductMutation = trpc.products.archive.useMutation({
    onSuccess: () => utils.products.list.invalidate(),
  });

  const archiveBlendMutation = trpc.products.blends.archive.useMutation({
    onSuccess: () => utils.products.blends.list.invalidate(),
  });

  const categoryNames: Record<string, string> = {};
  categories?.forEach((cat) => { categoryNames[cat.id] = cat.name; });

  function handleEditProduct(product: any) {
    setEditProduct(product);
    setShowProductForm(true);
  }

  function handleEditBlend(blend: any) {
    setEditBlend(blend);
    setShowBlendForm(true);
  }

  function handleProductFormSuccess() {
    utils.products.list.invalidate();
    utils.products.categories.list.invalidate();
  }

  function handleBlendFormSuccess() {
    utils.products.blends.list.invalidate();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">Varieties</h1>
        <div className="flex items-center gap-2">
          {tab === 'products' && (
            <button
              onClick={() => { setEditProduct(null); setShowProductForm(true); }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md font-semibold hover:bg-primary/90 transition-colors"
            >
              <Plus size={18} />
              New Variety
            </button>
          )}
          {tab === 'blends' && (
            <button
              onClick={() => { setEditBlend(null); setShowBlendForm(true); }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md font-semibold hover:bg-primary/90 transition-colors"
            >
              <Plus size={18} />
              New Blend
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4 border-b border-border">
        <button
          onClick={() => setTab('products')}
          className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${
            tab === 'products'
              ? 'border-primary text-foreground'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Varieties
        </button>
        <button
          onClick={() => setTab('blends')}
          className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${
            tab === 'blends'
              ? 'border-primary text-foreground'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Blends
        </button>
      </div>

      {tab === 'products' && (
        <>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search varieties..."
                className="w-full pl-9 pr-3 py-2 bg-secondary border border-border rounded-md text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
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

          <div className="grid grid-cols-[1fr_300px] gap-6">
            <ProductList
              products={productsData?.items ?? []}
              isLoading={productsLoading}
              onEdit={handleEditProduct}
              onArchive={(id) => archiveProductMutation.mutate({ id })}
              categoryNames={categoryNames}
            />
            <CategoryManager />
          </div>
        </>
      )}

      {tab === 'blends' && (
        <BlendList
          blends={blendsData?.items ?? []}
          isLoading={blendsLoading}
          onEdit={handleEditBlend}
          onArchive={(id) => archiveBlendMutation.mutate({ id })}
        />
      )}

      <ProductForm
        isOpen={showProductForm}
        onClose={() => { setShowProductForm(false); setEditProduct(null); }}
        onSuccess={handleProductFormSuccess}
        editProduct={editProduct}
      />

      <BlendForm
        isOpen={showBlendForm}
        onClose={() => { setShowBlendForm(false); setEditBlend(null); }}
        onSuccess={handleBlendFormSuccess}
        editBlend={editBlend}
      />
    </div>
  );
}
