import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchAdminOrders, setOrderStatus } from '../../api/admin';
import { useApi } from '../../hooks/useApi';
import { useDebounced } from '../../hooks/useDebounced';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

import AdminHeader from '../../components/admin/AdminHeader';
import Icon from '../../components/ui/Icon';
import StateMessage from '../../components/ui/StateMessage';
import { formatPrice } from '../../utils/format';

const STATUSES = ['placed', 'packed', 'shipped', 'delivered', 'cancelled'];
const TONE = {
  placed: 'bg-brand-50 text-brand-700',
  packed: 'bg-canvas text-ink-soft',
  shipped: 'bg-cat-accessories/10 text-cat-accessories',
  delivered: 'bg-success/10 text-success',
  cancelled: 'bg-danger/10 text-danger',
};

export default function AdminOrders() {
  const { token } = useAuth();
  const { toast } = useToast();
  const [params, setParams] = useSearchParams();
  const [term, setTerm] = useState(params.get('q') || '');
  const q = useDebounced(term, 350);
  const [open, setOpen] = useState(null);
  const [version, setVersion] = useState(0);

  const query = useMemo(
    () => ({ q, status: params.get('status') || '', page: params.get('page') || 1, limit: 20 }),
    [q, params]
  );

  const { data, loading, error, retry } = useApi(
    (o) => fetchAdminOrders(query, token, o),
    [JSON.stringify(query), token, version]
  );

  const update = (patch) => {
    const next = new URLSearchParams(params);
    Object.entries(patch).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)));
    if (!('page' in patch)) next.delete('page');
    setParams(next, { replace: true });
  };

  const changeStatus = async (order, status) => {
    try {
      await setOrderStatus(order._id, status, token);
      toast(`${order.orderNumber} marked ${status}`);
      setVersion((v) => v + 1);
    } catch (err) {
      toast(err.message, 'error');
    }
  };

  return (
    <>
      <AdminHeader eyebrow="Fulfilment" title="Orders" description="Every order placed through the storefront, newest first." />

      <div className="mb-4 flex flex-wrap gap-2">
        <div className="relative min-w-[220px] flex-1">
          <Icon name="search" size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-mute" />
          <input
            value={term}
            onChange={(e) => { setTerm(e.target.value); update({ q: e.target.value }); }}
            placeholder="Search order number, name or email"
            aria-label="Search orders"
            className="h-11 w-full rounded-full border border-line bg-surface pl-10 pr-4 text-sm focus:border-ink"
          />
        </div>
        <select
          value={params.get('status') || ''}
          onChange={(e) => update({ status: e.target.value })}
          aria-label="Filter by status"
          className="h-11 rounded-full border border-line bg-surface px-4 text-sm focus:border-ink"
        >
          <option value="">All statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {error ? (
        <StateMessage icon="alert" title="Orders did not load" body={error.message} actionLabel="Try again" onAction={retry} />
      ) : loading ? (
        <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton h-20 rounded-2xl" />)}</div>
      ) : data.items.length === 0 ? (
        <StateMessage icon="truck" title="No orders yet" body="Place an order from the storefront and it will appear here." to="/shop" actionLabel="Open the storefront" />
      ) : (
        <ul className="space-y-2">
          {data.items.map((o) => (
            <li key={o._id} className="rounded-2xl border border-line bg-surface">
              <div className="flex flex-wrap items-center gap-3 p-4">
                <button
                  onClick={() => setOpen(open === o._id ? null : o._id)}
                  className="flex min-w-0 flex-1 items-center gap-3 text-left"
                  aria-expanded={open === o._id}
                >
                  <Icon name="chevronRight" size={16} className={`shrink-0 text-ink-mute transition-transform ${open === o._id ? 'rotate-90' : ''}`} />
                  <div className="min-w-0">
                    <p className="font-mono text-sm">{o.orderNumber}</p>
                    <p className="clamp-1 text-xs text-ink-mute">
                      {o.customer?.name} · {o.items.length} item{o.items.length === 1 ? '' : 's'} ·{' '}
                      {new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </p>
                  </div>
                </button>

                <span className={`rounded-full px-2.5 py-1 font-mono text-2xs uppercase ${TONE[o.status]}`}>{o.status}</span>
                <span className="font-display text-base font-bold tabular-nums">{formatPrice(o.total)}</span>

                <select
                  value={o.status}
                  onChange={(e) => changeStatus(o, e.target.value)}
                  aria-label={`Change status of ${o.orderNumber}`}
                  className="h-9 rounded-full border border-line bg-surface px-3 text-xs focus:border-ink"
                >
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              {open === o._id && (
                <div className="border-t border-line px-4 py-4 text-sm">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="eyebrow mb-2">Items</p>
                      <ul className="space-y-1.5">
                        {o.items.map((i) => (
                          <li key={i.product} className="flex justify-between gap-3">
                            <span className="clamp-1"><span className="font-mono text-2xs">{i.quantity}×</span> {i.name}</span>
                            <span className="shrink-0 tabular-nums">{formatPrice(i.price * i.quantity)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="eyebrow mb-2">Deliver to</p>
                      <p className="text-ink-soft">
                        {o.customer?.name}<br />
                        {o.shippingAddress?.line1}<br />
                        {o.shippingAddress?.city}, {o.shippingAddress?.state} {o.shippingAddress?.postalCode}<br />
                        {o.customer?.phone} · {o.customer?.email}
                      </p>
                      <p className="mt-3 font-mono text-2xs uppercase tracking-[0.1em] text-ink-mute">
                        Payment: {o.paymentMethod} {o.couponCode && `· coupon ${o.couponCode}`}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {data?.pages > 1 && (
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
  );
}
