import { useCallback, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchProducts } from '../api/products';
import { useApi } from '../hooks/useApi';
import { useCatalog } from '../context/CatalogContext';

import ProductGrid from '../components/product/ProductGrid';
import FilterPanel from '../components/product/FilterPanel';
import SortSelect from '../components/product/SortSelect';
import Drawer from '../components/ui/Drawer';
import Button from '../components/ui/Button';
import Icon from '../components/ui/Icon';
import { formatPrice } from '../utils/format';

const FILTER_KEYS = ['q', 'category', 'brand', 'minPrice', 'maxPrice', 'rating', 'sort', 'page'];

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const [sheetOpen, setSheetOpen] = useState(false);
  const { categories } = useCatalog();

  const filters = useMemo(
    () => Object.fromEntries(FILTER_KEYS.map((k) => [k, params.get(k) || ''])),
    [params]
  );

  const query = useMemo(
    () => ({ ...filters, sort: filters.sort || 'newest', page: filters.page || 1, limit: 12 }),
    [filters]
  );

  const { data, loading, error, retry } = useApi(
    (o) => fetchProducts(query, o),
    [JSON.stringify(query)]
  );

  const update = useCallback(
    (patch) => {
      const next = new URLSearchParams(params);
      Object.entries(patch).forEach(([k, v]) => {
        if (v === '' || v === null || v === undefined || v === 'all') next.delete(k);
        else next.set(k, v);
      });
      if (!('page' in patch)) next.delete('page');
      setParams(next, { replace: true });
    },
    [params, setParams]
  );

  const clearAll = useCallback(() => setParams({}, { replace: true }), [setParams]);

  const activeCategory = categories.find((c) => c.slug === filters.category);
  const brandsSelected = filters.brand ? filters.brand.split(',').filter(Boolean) : [];
  const activeCount =
    (filters.category ? 1 : 0) + brandsSelected.length + (filters.rating ? 1 : 0) +
    (filters.minPrice || filters.maxPrice ? 1 : 0);

  const chips = [
    filters.q && { label: `“${filters.q}”`, clear: { q: '' } },
    activeCategory && { label: activeCategory.name, clear: { category: '', brand: '' }, accent: activeCategory.accent },
    ...brandsSelected.map((b) => ({
      label: b,
      clear: { brand: brandsSelected.filter((x) => x !== b).join(',') },
    })),
    (filters.minPrice || filters.maxPrice) && {
      label: `${filters.minPrice ? formatPrice(filters.minPrice) : formatPrice(0)} – ${filters.maxPrice ? formatPrice(filters.maxPrice) : 'any'}`,
      clear: { minPrice: '', maxPrice: '' },
    },
    filters.rating && { label: `${filters.rating}★ & up`, clear: { rating: '' } },
  ].filter(Boolean);

  const panel = (
    <FilterPanel
      filters={filters}
      onChange={update}
      brands={data?.facets?.brands || []}
      priceRange={data?.facets?.priceRange || [0, 100000]}
      onClear={clearAll}
    />
  );

  return (
    <div className="shell py-8 lg:py-12">
      <header className="mb-6 lg:mb-8">
        <p className="eyebrow">{activeCategory ? 'Category' : 'Marketplace'}</p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
          <h1 className="flex items-center gap-3 font-display text-3xl font-extrabold tracking-[-0.03em] lg:text-4xl">
            {activeCategory && (
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: activeCategory.accent }} />
            )}
            {filters.q ? `Results for “${filters.q}”` : activeCategory?.name || 'All products'}
          </h1>
          <p className="font-mono text-2xs uppercase tracking-[0.12em] text-ink-mute">
            {loading ? 'Loading…' : `${data?.total ?? 0} products`}
          </p>
        </div>
        {activeCategory?.description && (
          <p className="mt-2 max-w-2xl text-sm text-ink-soft">{activeCategory.description}</p>
        )}
      </header>

      <div className="grid gap-8 lg:grid-cols-[248px_1fr] lg:gap-10">
        <aside className="hidden lg:block">
          <div className="sticky top-32 rounded-2xl border border-line bg-surface p-5">{panel}</div>
        </aside>

        <div>
          <div className="mb-5 flex items-center gap-3">
            <Button variant="outline" onClick={() => setSheetOpen(true)} className="lg:hidden">
              <Icon name="filter" size={17} /> Filters
              {activeCount > 0 && (
                <span className="ml-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-ink px-1 font-mono text-[10px] text-white">
                  {activeCount}
                </span>
              )}
            </Button>
            <div className="ml-auto">
              <SortSelect value={filters.sort || 'newest'} onChange={(v) => update({ sort: v, page: 1 })} />
            </div>
          </div>

          {chips.length > 0 && (
            <div className="mb-5 flex flex-wrap items-center gap-2">
              {chips.map((chip, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => update({ ...chip.clear, page: 1 })}
                  className="group inline-flex items-center gap-1.5 rounded-full border border-line bg-surface py-1.5 pl-3 pr-2 text-xs font-medium transition-colors hover:border-ink"
                >
                  {chip.accent && <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: chip.accent }} />}
                  {chip.label}
                  <Icon name="close" size={13} className="text-ink-mute transition-colors group-hover:text-ink" />
                </button>
              ))}
              <button type="button" onClick={clearAll} className="text-xs font-medium text-ink-mute underline-offset-4 hover:text-ink hover:underline">
                Clear all
              </button>
            </div>
          )}

          <ProductGrid
            products={data?.items || []}
            loading={loading}
            error={error}
            onRetry={retry}
            emptyAction={activeCount || filters.q ? clearAll : undefined}
          />

          {data?.pages > 1 && (
            <nav className="mt-10 flex items-center justify-center gap-1.5" aria-label="Pagination">
              <button
                type="button"
                onClick={() => update({ page: Math.max(1, data.page - 1) })}
                disabled={data.page <= 1}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-line transition-colors hover:border-ink disabled:opacity-35 disabled:hover:border-line"
                aria-label="Previous page"
              >
                <Icon name="chevronLeft" size={17} />
              </button>
              {Array.from({ length: data.pages }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => update({ page: i + 1 })}
                  aria-current={data.page === i + 1}
                  className={`h-10 w-10 rounded-full font-mono text-sm transition-colors ${
                    data.page === i + 1 ? 'bg-ink text-white' : 'border border-line hover:border-ink'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                type="button"
                onClick={() => update({ page: Math.min(data.pages, data.page + 1) })}
                disabled={data.page >= data.pages}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-line transition-colors hover:border-ink disabled:opacity-35 disabled:hover:border-line"
                aria-label="Next page"
              >
                <Icon name="chevronRight" size={17} />
              </button>
            </nav>
          )}
        </div>
      </div>

      <Drawer
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        side="bottom"
        title="Filters"
        footer={
          <Button full onClick={() => setSheetOpen(false)}>
            Show {data?.total ?? 0} products
          </Button>
        }
      >
        {panel}
      </Drawer>
    </div>
  );
}
