import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { fetchAdminProducts, deleteProduct, updateProduct } from '../../api/admin';
import { useApi } from '../../hooks/useApi';
import { useDebounced } from '../../hooks/useDebounced';
import { useAuth } from '../../context/AuthContext';
import { useCatalog } from '../../context/CatalogContext';
import { useToast } from '../../context/ToastContext';

import AdminHeader from '../../components/admin/AdminHeader';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import Button from '../../components/ui/Button';
import Icon from '../../components/ui/Icon';
import ProductImage from '../../components/ui/ProductImage';
import StateMessage from '../../components/ui/StateMessage';
import { formatPrice } from '../../utils/format';

const STATUSES = [
  { value: '', label: 'All products' },
  { value: 'active', label: 'Live' },
  { value: 'hidden', label: 'Hidden' },
  { value: 'low', label: 'Low stock' },
];

export default function AdminProducts() {
  const { token } = useAuth();
  const { categories } = useCatalog();
  const { toast } = useToast();
  const [params, setParams] = useSearchParams();

  const [term, setTerm] = useState(params.get('q') || '');
  const q = useDebounced(term, 350);
  const [pending, setPending] = useState(null);
  const [busy, setBusy] = useState(false);
  const [version, setVersion] = useState(0);

  const query = useMemo(
    () => ({
      q,
      category: params.get('category') || '',
      status: params.get('status') || '',
      sort: params.get('sort') || 'newest',
      page: params.get('page') || 1,
      limit: 20,
    }),
    [q, params]
  );

  const { data, loading, error, retry } = useApi(
    (o) => fetchAdminProducts(query, token, o),
    [JSON.stringify(query), token, version]
  );

  const update = (patch) => {
    const next = new URLSearchParams(params);
    Object.entries(patch).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)));
    if (!('page' in patch)) next.delete('page');
    setParams(next, { replace: true });
  };

  const toggleVisibility = async (product) => {
    try {
      await updateProduct(product._id, { isActive: !product.isActive }, token);
      toast(`${product.name} is now ${product.isActive ? 'hidden from' : 'live on'} the storefront`);
      setVersion((v) => v + 1);
    } catch (err) {
      toast(err.message, 'error');
    }
  };

  const confirmDelete = async () => {
    setBusy(true);
    try {
      await deleteProduct(pending._id, token);
      toast(`${pending.name} deleted`);
      setPending(null);
      setVersion((v) => v + 1);
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <AdminHeader
        eyebrow="Catalogue"
        title="Products"
        description="Add, edit, hide or remove listings. Live products appear on the storefront straight away."
      >
        <Button to="/admin/products/new"><Icon name="plus" size={17} /> Add product</Button>
      </AdminHeader>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative min-w-[220px] flex-1">
          <Icon name="search" size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-mute" />
          <input
            value={term}
            onChange={(e) => { setTerm(e.target.value); update({ q: e.target.value }); }}
            placeholder="Search by name, brand or SKU"
            aria-label="Search products"
            className="h-11 w-full rounded-full border border-line bg-surface pl-10 pr-4 text-sm focus:border-ink"
          />
        </div>

        <select
          value={params.get('category') || ''}
          onChange={(e) => update({ category: e.target.value })}
          aria-label="Filter by category"
          className="h-11 rounded-full border border-line bg-surface px-4 text-sm focus:border-ink"
        >
          <option value="">All categories</option>
          {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>

        <select
          value={params.get('status') || ''}
          onChange={(e) => update({ status: e.target.value })}
          aria-label="Filter by status"
          className="h-11 rounded-full border border-line bg-surface px-4 text-sm focus:border-ink"
        >
          {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>

        <select
          value={params.get('sort') || 'newest'}
          onChange={(e) => update({ sort: e.target.value })}
          aria-label="Sort products"
          className="h-11 rounded-full border border-line bg-surface px-4 text-sm focus:border-ink"
        >
          <option value="newest">Newest first</option>
          <option value="name">Name A–Z</option>
          <option value="price-desc">Price: high to low</option>
          <option value="stock-asc">Stock: low to high</option>
        </select>
      </div>

      {error ? (
        <StateMessage icon="alert" title="The list did not load" body={error.message} actionLabel="Try again" onAction={retry} />
      ) : loading ? (
        <div className="space-y-2">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton h-20 rounded-2xl" />)}</div>
      ) : data.items.length === 0 ? (
        <StateMessage icon="box" title="No products match" body="Change the filters, or add the first product in this view." actionLabel="Add product" to="/admin/products/new" />
      ) : (
        <>
          <p className="mb-3 font-mono text-2xs uppercase tracking-[0.12em] text-ink-mute">
            {data.total} product{data.total === 1 ? '' : 's'}
          </p>

          <ul className="space-y-2">
            {data.items.map((p) => (
              <li key={p._id} className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-3 sm:gap-4">
                <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-xl" style={{ backgroundColor: `${p.category?.accent || '#14161A'}0F` }}>
                  <ProductImage src={p.images?.[0]} alt={p.name} accent={p.category?.accent} className="h-full w-full object-cover" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="font-mono text-2xs uppercase tracking-[0.12em] text-ink-mute">
                    {p.brand} · {p.category?.name} · {p.sku || '—'}
                  </p>
                  <h2 className="clamp-1 mt-0.5 text-sm font-semibold">
                    <Link to={`/admin/products/${p._id}`} className="hover:underline underline-offset-4">{p.name}</Link>
                  </h2>
                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                    <span className="font-medium tabular-nums">{formatPrice(p.price)}</span>
                    <span className={p.stock === 0 ? 'text-danger' : p.stock <= 15 ? 'text-cat-fitness' : 'text-ink-mute'}>
                      {p.stock} in stock
                    </span>
                    <span className={`rounded-full px-2 py-0.5 font-mono text-2xs uppercase ${p.isActive ? 'bg-success/10 text-success' : 'bg-canvas text-ink-mute'}`}>
                      {p.isActive ? 'Live' : 'Hidden'}
                    </span>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-1">
                  <button
                    onClick={() => toggleVisibility(p)}
                    title={p.isActive ? 'Hide from storefront' : 'Publish to storefront'}
                    aria-label={p.isActive ? `Hide ${p.name}` : `Publish ${p.name}`}
                    className="rounded-full p-2 text-ink-mute transition-colors hover:bg-canvas hover:text-ink"
                  >
                    <Icon name={p.isActive ? 'check' : 'plus'} size={17} />
                  </button>
                  <Link
                    to={`/admin/products/${p._id}`}
                    aria-label={`Edit ${p.name}`}
                    className="rounded-full p-2 text-ink-mute transition-colors hover:bg-canvas hover:text-ink"
                  >
                    <Icon name="filter" size={17} />
                  </Link>
                  <button
                    onClick={() => setPending(p)}
                    aria-label={`Delete ${p.name}`}
                    className="rounded-full p-2 text-ink-mute transition-colors hover:bg-canvas hover:text-danger"
                  >
                    <Icon name="trash" size={17} />
                  </button>
                </div>
              </li>
            ))}
          </ul>

          {data.pages > 1 && (
            <nav className="mt-6 flex justify-center gap-1.5" aria-label="Pagination">
              {Array.from({ length: data.pages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => update({ page: i + 1 })}
                  aria-current={data.page === i + 1}
                  className={`h-9 w-9 rounded-full font-mono text-sm ${data.page === i + 1 ? 'bg-ink text-white' : 'border border-line hover:border-ink'}`}
                >
                  {i + 1}
                </button>
              ))}
            </nav>
          )}
        </>
      )}

      <ConfirmDialog
        open={Boolean(pending)}
        title={`Delete ${pending?.name}?`}
        body="This removes the product from the database and the storefront. It cannot be undone — hide it instead if you might relist it."
        busy={busy}
        onConfirm={confirmDelete}
        onCancel={() => setPending(null)}
      />
    </>
  );
}
