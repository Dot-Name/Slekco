import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart, FREE_SHIPPING_ABOVE } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

import Button from '../components/ui/Button';
import Icon from '../components/ui/Icon';
import ProductImage from '../components/ui/ProductImage';
import QuantityStepper from '../components/ui/QuantityStepper';
import StateMessage from '../components/ui/StateMessage';
import { formatPrice } from '../utils/format';

export function CartSummary({ totals, coupon, children }) {
  const toFreeShipping = Math.max(0, FREE_SHIPPING_ABOVE - (totals.itemsTotal - totals.discount));

  return (
    <div className="rounded-2xl border border-line bg-surface p-5 lg:p-6">
      <h2 className="font-display text-lg font-bold tracking-[-0.02em]">Order summary</h2>

      <dl className="mt-5 space-y-3 text-sm">
        <div className="flex justify-between">
          <dt className="text-ink-soft">Subtotal</dt>
          <dd className="font-medium tabular-nums">{formatPrice(totals.itemsTotal)}</dd>
        </div>
        {totals.savings > 0 && (
          <div className="flex justify-between">
            <dt className="text-ink-soft">Brand discounts</dt>
            <dd className="font-medium tabular-nums text-success">−{formatPrice(totals.savings)}</dd>
          </div>
        )}
        {totals.discount > 0 && (
          <div className="flex justify-between">
            <dt className="text-ink-soft">
              Coupon <span className="font-mono text-2xs uppercase">{coupon}</span>
            </dt>
            <dd className="font-medium tabular-nums text-success">−{formatPrice(totals.discount)}</dd>
          </div>
        )}
        <div className="flex justify-between">
          <dt className="text-ink-soft">Delivery</dt>
          <dd className="font-medium tabular-nums">
            {totals.shipping === 0 ? 'Free' : formatPrice(totals.shipping)}
          </dd>
        </div>
      </dl>

      {toFreeShipping > 0 && (
        <p className="mt-4 rounded-xl bg-canvas px-3.5 py-3 text-xs text-ink-soft">
          Add {formatPrice(toFreeShipping)} more to get free delivery.
        </p>
      )}

      <div className="mt-5 flex items-baseline justify-between border-t border-line pt-5">
        <span className="font-display text-lg font-bold">Total</span>
        <span className="font-display text-2xl font-extrabold tabular-nums tracking-[-0.02em]">
          {formatPrice(totals.total)}
        </span>
      </div>

      {children}
    </div>
  );
}

export default function Cart() {
  const { items, totals, setQuantity, remove, coupon, applyCoupon, removeCoupon } = useCart();
  const { toast } = useToast();
  const [code, setCode] = useState('');
  const [couponError, setCouponError] = useState('');

  if (!items.length) {
    return (
      <div className="shell py-16 lg:py-24">
        <StateMessage
          icon="cart"
          title="Your cart is empty"
          body="Everything you add from any of the six categories collects here, and ships as one order."
          actionLabel="Browse the marketplace"
          to="/shop"
        />
      </div>
    );
  }

  const submitCoupon = (e) => {
    e.preventDefault();
    const result = applyCoupon(code);
    setCouponError(result.ok ? '' : result.message);
    if (result.ok) {
      setCode('');
      toast(result.message);
    }
  };

  return (
    <div className="shell py-8 lg:py-12">
      <header className="mb-7">
        <p className="eyebrow">Basket</p>
        <h1 className="mt-2 font-display text-3xl font-extrabold tracking-[-0.03em] lg:text-4xl">
          Your cart · {totals.count} {totals.count === 1 ? 'item' : 'items'}
        </h1>
      </header>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:gap-10">
        <ul className="space-y-3">
          {items.map((item) => (
            <li key={item.product} className="flex gap-4 rounded-2xl border border-line bg-surface p-3 sm:p-4">
              <Link
                to={`/product/${item.slug}`}
                className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl sm:h-28 sm:w-24"
                style={{ backgroundColor: `${item.accent}0F` }}
              >
                <ProductImage src={item.image} alt={item.name} accent={item.accent} className="h-full w-full object-cover" />
              </Link>

              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-mono text-2xs uppercase tracking-[0.12em] text-ink-mute">{item.brand}</p>
                    <h2 className="clamp-2 mt-1 text-sm font-semibold leading-snug">
                      <Link to={`/product/${item.slug}`} className="hover:underline underline-offset-4">{item.name}</Link>
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => { remove(item.product); toast(`${item.name} removed from cart`); }}
                    aria-label={`Remove ${item.name} from cart`}
                    className="shrink-0 rounded-full p-2 text-ink-mute transition-colors hover:bg-canvas hover:text-danger"
                  >
                    <Icon name="trash" size={17} />
                  </button>
                </div>

                <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-3">
                  <QuantityStepper
                    size="sm"
                    value={item.quantity}
                    max={item.stock || 99}
                    onChange={(q) => setQuantity(item.product, q)}
                  />
                  <div className="text-right">
                    <p className="font-display text-base font-bold tabular-nums">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                    {item.quantity > 1 && (
                      <p className="font-mono text-2xs text-ink-mute">{formatPrice(item.price)} each</p>
                    )}
                  </div>
                </div>
              </div>
            </li>
          ))}

          <li className="pt-2">
            <Link to="/shop" className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft transition-colors hover:text-ink">
              <Icon name="chevronLeft" size={16} /> Continue shopping
            </Link>
          </li>
        </ul>

        <div className="lg:sticky lg:top-32 lg:self-start">
          <div className="mb-3 rounded-2xl border border-line bg-surface p-5">
            <h2 className="text-sm font-semibold">Have a code?</h2>
            {coupon ? (
              <div className="mt-3 flex items-center justify-between rounded-xl bg-canvas px-3.5 py-2.5">
                <span className="flex items-center gap-2 text-sm">
                  <Icon name="check" size={15} className="text-success" />
                  <span className="font-mono text-xs uppercase">{coupon}</span> applied
                </span>
                <button type="button" onClick={() => { removeCoupon(); toast('Coupon removed'); }} className="text-xs text-ink-mute hover:text-ink">
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={submitCoupon} className="mt-3">
                <div className="flex gap-2">
                  <input
                    value={code}
                    onChange={(e) => { setCode(e.target.value); setCouponError(''); }}
                    placeholder="SLEK10"
                    aria-label="Coupon code"
                    aria-invalid={Boolean(couponError)}
                    className={`h-11 w-full rounded-xl border bg-surface px-3.5 font-mono text-sm uppercase tracking-wide transition-colors ${
                      couponError ? 'border-danger' : 'border-line focus:border-ink'
                    }`}
                  />
                  <Button type="submit" variant="quiet" disabled={!code.trim()}>Apply</Button>
                </div>
                {couponError && (
                  <p className="mt-1.5 flex items-center gap-1.5 text-sm text-danger">
                    <Icon name="alert" size={14} /> {couponError}
                  </p>
                )}
              </form>
            )}
          </div>

          <CartSummary totals={totals} coupon={coupon}>
            <Button to="/checkout" size="lg" full className="mt-5">
              Checkout <Icon name="arrowRight" size={18} />
            </Button>
            <p className="mt-3 text-center text-xs text-ink-mute">
              14-day returns on everything in this order.
            </p>
          </CartSummary>
        </div>
      </div>
    </div>
  );
}
