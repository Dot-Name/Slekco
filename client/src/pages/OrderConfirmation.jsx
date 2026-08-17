import { Link, useParams } from 'react-router-dom';
import { fetchOrder } from '../api/orders';
import { useApi } from '../hooks/useApi';
import Button from '../components/ui/Button';
import Icon from '../components/ui/Icon';
import Spectrum from '../components/ui/Spectrum';
import StateMessage from '../components/ui/StateMessage';
import { formatPrice } from '../utils/format';

export default function OrderConfirmation() {
  const { orderNumber } = useParams();
  const { data, loading, error } = useApi((o) => fetchOrder(orderNumber, o), [orderNumber]);

  if (loading) {
    return (
      <div className="shell py-16">
        <div className="skeleton mx-auto h-72 max-w-2xl rounded-3xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="shell py-20">
        <StateMessage icon="alert" title="We could not find that order" body={error.message} actionLabel="Back to shop" to="/shop" />
      </div>
    );
  }

  const order = data.item;

  return (
    <div className="shell py-10 lg:py-16">
      <div className="mx-auto max-w-2xl overflow-hidden rounded-3xl border border-line bg-surface">
        <Spectrum animate={false} />
        <div className="p-6 text-center sm:p-10">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success/10 text-success">
            <Icon name="check" size={26} strokeWidth={2.2} />
          </span>
          <h1 className="mt-5 font-display text-3xl font-extrabold tracking-[-0.03em]">Order placed</h1>
          <p className="mt-2 text-sm text-ink-soft">
            A confirmation is on its way to {order.customer.email}. Keep this number for tracking.
          </p>
          <p className="mt-5 inline-block rounded-full bg-canvas px-4 py-2 font-mono text-sm tracking-[0.08em]">
            {order.orderNumber}
          </p>
        </div>

        <ul className="divide-y divide-line border-t border-line">
          {order.items.map((i) => (
            <li key={i.product} className="flex items-center justify-between gap-4 px-6 py-3.5 text-sm sm:px-10">
              <span className="clamp-1">
                <span className="font-mono text-2xs text-ink-mute">{i.quantity}×</span> {i.name}
              </span>
              <span className="shrink-0 tabular-nums">{formatPrice(i.price * i.quantity)}</span>
            </li>
          ))}
        </ul>

        <dl className="space-y-2 border-t border-line px-6 py-5 text-sm sm:px-10">
          <div className="flex justify-between"><dt className="text-ink-soft">Items</dt><dd className="tabular-nums">{formatPrice(order.itemsTotal)}</dd></div>
          {order.discount > 0 && (
            <div className="flex justify-between"><dt className="text-ink-soft">Coupon {order.couponCode}</dt><dd className="tabular-nums text-success">−{formatPrice(order.discount)}</dd></div>
          )}
          <div className="flex justify-between"><dt className="text-ink-soft">Delivery</dt><dd className="tabular-nums">{order.shipping ? formatPrice(order.shipping) : 'Free'}</dd></div>
          <div className="flex justify-between border-t border-line pt-3 font-display text-lg font-bold">
            <dt>Total</dt><dd className="tabular-nums">{formatPrice(order.total)}</dd>
          </div>
        </dl>

        <div className="flex flex-col gap-3 border-t border-line px-6 py-6 sm:flex-row sm:px-10">
          <Button to="/shop" full>Keep shopping</Button>
          <Button to="/contact" variant="outline" full>Ask about this order</Button>
        </div>
      </div>

      <p className="mt-6 text-center text-xs text-ink-mute">
        Delivering to {order.shippingAddress?.city}, {order.shippingAddress?.state} · Payment: {order.paymentMethod.toUpperCase()}
      </p>
      <p className="mt-1 text-center text-xs text-ink-mute">
        <Link to="/" className="underline underline-offset-4 hover:text-ink">Back to the homepage</Link>
      </p>
    </div>
  );
}
