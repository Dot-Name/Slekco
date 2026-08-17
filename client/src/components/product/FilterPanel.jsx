import { useEffect, useState } from 'react';
import Icon from '../ui/Icon';
import Button from '../ui/Button';
import { useCatalog } from '../../context/CatalogContext';
import { formatPrice } from '../../utils/format';

const RATINGS = [4, 3, 2];

function Section({ title, children }) {
  return (
    <section className="border-b border-line py-5 first:pt-0 last:border-0">
      <h3 className="eyebrow mb-3.5">{title}</h3>
      {children}
    </section>
  );
}

/**
 * The single source of filter UI — rendered in the sidebar on desktop and
 * inside a bottom sheet on mobile, so both stay in sync by construction.
 */
export default function FilterPanel({ filters, onChange, brands = [], priceRange = [0, 100000], onClear }) {
  const { categories } = useCatalog();
  const [minPrice, setMinPrice] = useState(filters.minPrice ?? '');
  const [maxPrice, setMaxPrice] = useState(filters.maxPrice ?? '');

  useEffect(() => {
    setMinPrice(filters.minPrice ?? '');
    setMaxPrice(filters.maxPrice ?? '');
  }, [filters.minPrice, filters.maxPrice]);

  const toggleBrand = (brand) => {
    const current = filters.brand ? filters.brand.split(',') : [];
    const next = current.includes(brand) ? current.filter((b) => b !== brand) : [...current, brand];
    onChange({ brand: next.join(','), page: 1 });
  };

  const applyPrice = () => onChange({ minPrice, maxPrice, page: 1 });

  const quickRanges = [
    { label: `Under ${formatPrice(2000)}`, min: '', max: 2000 },
    { label: `${formatPrice(2000)} – ${formatPrice(10000)}`, min: 2000, max: 10000 },
    { label: `Over ${formatPrice(10000)}`, min: 10000, max: '' },
  ];

  return (
    <div className="text-sm">
      <Section title="Category">
        <ul className="space-y-0.5">
          {[{ slug: 'all', name: 'Everything', accent: '#14161A' }, ...categories].map((c) => {
            const active = (filters.category || 'all') === c.slug;
            return (
              <li key={c.slug}>
                <button
                  type="button"
                  onClick={() => onChange({ category: c.slug, brand: '', page: 1 })}
                  className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors ${
                    active ? 'bg-canvas font-semibold text-ink' : 'text-ink-soft hover:bg-canvas/70'
                  }`}
                >
                  <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: c.accent }} />
                  <span className="flex-1">{c.name}</span>
                  {c.productCount != null && (
                    <span className="font-mono text-2xs text-ink-mute">{c.productCount}</span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </Section>

      <Section title="Price">
        <div className="mb-3 flex flex-wrap gap-2">
          {quickRanges.map((r) => (
            <button
              key={r.label}
              type="button"
              onClick={() => onChange({ minPrice: r.min, maxPrice: r.max, page: 1 })}
              className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                String(filters.minPrice ?? '') === String(r.min) && String(filters.maxPrice ?? '') === String(r.max)
                  ? 'border-ink bg-ink text-white'
                  : 'border-line text-ink-soft hover:border-ink-mute'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <input
            type="number" inputMode="numeric" min={0} placeholder={String(priceRange[0])}
            value={minPrice} onChange={(e) => setMinPrice(e.target.value)}
            aria-label="Minimum price"
            className="h-10 w-full rounded-xl border border-line bg-surface px-3 font-mono text-xs focus:border-ink"
          />
          <span className="text-ink-mute">–</span>
          <input
            type="number" inputMode="numeric" min={0} placeholder={String(priceRange[1])}
            value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)}
            aria-label="Maximum price"
            className="h-10 w-full rounded-xl border border-line bg-surface px-3 font-mono text-xs focus:border-ink"
          />
          <Button size="sm" variant="quiet" onClick={applyPrice}>Set</Button>
        </div>
      </Section>

      {brands.length > 0 && (
        <Section title={`Brand · ${brands.length}`}>
          <ul className="max-h-56 space-y-0.5 overflow-y-auto pr-1">
            {brands.map((b) => {
              const checked = (filters.brand || '').split(',').includes(b);
              return (
                <li key={b}>
                  <label className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 transition-colors hover:bg-canvas/70">
                    <span
                      className={`flex h-4.5 w-4.5 items-center justify-center rounded-[5px] border transition-colors ${
                        checked ? 'border-ink bg-ink text-white' : 'border-line-strong'
                      }`}
                      style={{ height: 18, width: 18 }}
                    >
                      {checked && <Icon name="check" size={12} strokeWidth={2.4} />}
                    </span>
                    <input type="checkbox" checked={checked} onChange={() => toggleBrand(b)} className="sr-only" />
                    <span className={checked ? 'font-medium text-ink' : 'text-ink-soft'}>{b}</span>
                  </label>
                </li>
              );
            })}
          </ul>
        </Section>
      )}

      <Section title="Customer rating">
        <div className="flex flex-wrap gap-2">
          {RATINGS.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => onChange({ rating: filters.rating === String(r) ? '' : r, page: 1 })}
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition-colors ${
                filters.rating === String(r) ? 'border-ink bg-ink text-white' : 'border-line text-ink-soft hover:border-ink-mute'
              }`}
            >
              {r}
              <Icon name="spark" size={12} className="fill-current" /> & up
            </button>
          ))}
        </div>
      </Section>

      <button
        type="button"
        onClick={onClear}
        className="mt-5 flex items-center gap-1.5 text-sm font-medium text-ink-mute transition-colors hover:text-ink"
      >
        <Icon name="refresh" size={15} /> Clear all filters
      </button>
    </div>
  );
}
