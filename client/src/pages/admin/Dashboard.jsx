import { Link } from 'react-router-dom';
import { fetchStats } from '../../api/admin';
import { useApi } from '../../hooks/useApi';
import { useAuth } from '../../context/AuthContext';
import AdminHeader from '../../components/admin/AdminHeader';
import Button from '../../components/ui/Button';
import Icon from '../../components/ui/Icon';
import StateMessage from '../../components/ui/StateMessage';
import { formatPrice } from '../../utils/format';

const STATUS_TONE = {
  placed: 'bg-brand-50 text-brand-700',
  packed: 'bg-canvas text-ink-soft',
  shipped: 'bg-cat-accessories/10 text-cat-accessories',
  delivered: 'bg-success/10 text-success',
  cancelled: 'bg-danger/10 text-danger',
};

export default function Dashboard() {
  const { token, user } = useAuth();
  const { data, loading, error, retry } = useApi((o) => fetchStats(token, o), [token]);

  if (error) {
    return <StateMessage icon="alert" title="The dashboard did not load" body={error.message} actionLabel="Try again" onAction={retry} />;
  }

  const s = data?.stats;
  const cards = [
    { label: 'Products', value: s?.products, to: '/admin/products', icon: 'box' },
    { label: 'Orders', value: s?.orders, to: '/admin/orders', icon: 'truck' },
    { label: 'Revenue', value: s ? formatPrice(s.revenue) : null, to: '/admin/orders', icon: 'spark' },
    { label: 'Customers', value: s?.users, to: '/admin/orders', icon: 'user' },
  ];

  return (
    <>
      <AdminHeader
        eyebrow={`Signed in as ${user?.name}`}
        title="Dashboard"
        description="Everything you add here appears on the storefront immediately — the shop reads the same API."
      >
        <Button to="/admin/products/new"><Icon name="plus" size={17} /> Add product</Button>
      </AdminHeader>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        {cards.map((c) => (
          <Link key={c.label} to={c.to} className="rounded-2xl border border-line bg-surface p-4 transition-all hover:-translate-y-0.5 hover:shadow-card lg:p-5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-2xs uppercase tracking-[0.12em] text-ink-mute">{c.label}</span>
              <Icon name={c.icon} size={16} className="text-ink-mute" />
            </div>
            {loading ? (
              <div className="skeleton mt-3 h-8 w-20 rounded-lg" />
            ) : (
              <p className="mt-2 font-display text-2xl font-extrabold tracking-[-0.02em] lg:text-3xl">{c.value}</p>
            )}
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border border-line bg-surface p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold tracking-[-0.02em]">Running low</h2>
            <Link to="/admin/products?status=low" className="text-sm text-ink-mute hover:text-ink">Manage stock</Link>
          </div>
          {loading ? (
            <div className="mt-4 space-y-2">{[0, 1, 2].map((i) => <div key={i} className="skeleton h-11 rounded-xl" />)}</div>
          ) : data.lowStock.length === 0 ? (
            <p className="mt-4 text-sm text-ink-mute">Every product has healthy stock.</p>
          ) : (
            <ul className="mt-4 space-y-1.5">
              {data.lowStock.map((p) => (
                <li key={p._id} className="flex items-center justify-between gap-3 rounded-xl px-2 py-2 text-sm hover:bg-canvas">
                  <Link to={`/admin/products/${p._id}`} className="clamp-1 flex-1 font-medium hover:underline underline-offset-4">{p.name}</Link>
                  <span className={`font-mono text-2xs ${p.stock === 0 ? 'text-danger' : 'text-ink-mute'}`}>
                    {p.stock === 0 ? 'out of stock' : `${p.stock} left`}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-2xl border border-line bg-surface p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold tracking-[-0.02em]">Latest orders</h2>
            <Link to="/admin/orders" className="text-sm text-ink-mute hover:text-ink">All orders</Link>
          </div>
          {loading ? (
            <div className="mt-4 space-y-2">{[0, 1, 2].map((i) => <div key={i} className="skeleton h-11 rounded-xl" />)}</div>
          ) : data.recentOrders.length === 0 ? (
            <p className="mt-4 text-sm text-ink-mute">No orders yet. Place one from the storefront to see it here.</p>
          ) : (
            <ul className="mt-4 space-y-1.5">
              {data.recentOrders.map((o) => (
                <li key={o._id} className="flex items-center justify-between gap-3 rounded-xl px-2 py-2 text-sm hover:bg-canvas">
                  <div className="min-w-0">
                    <p className="font-mono text-2xs">{o.orderNumber}</p>
                    <p className="clamp-1 text-ink-mute">{o.customer?.name}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className={`rounded-full px-2 py-0.5 font-mono text-2xs uppercase ${STATUS_TONE[o.status]}`}>{o.status}</span>
                    <span className="font-medium tabular-nums">{formatPrice(o.total)}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {s?.unreadMessages > 0 && (
        <Link to="/admin/messages" className="mt-4 flex items-center gap-3 rounded-2xl border border-line bg-surface p-4 transition-colors hover:border-ink">
          <Icon name="mail" size={18} />
          <span className="text-sm font-medium">
            {s.unreadMessages} unread support {s.unreadMessages === 1 ? 'message' : 'messages'}
          </span>
          <Icon name="arrowRight" size={16} className="ml-auto text-ink-mute" />
        </Link>
      )}
    </>
  );
}
