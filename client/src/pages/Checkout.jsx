import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { placeOrder } from '../api/orders';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { rules, validate } from '../utils/validation';

import { CartSummary } from './Cart';
import Field from '../components/ui/Field';
import Button from '../components/ui/Button';
import Icon from '../components/ui/Icon';
import StateMessage from '../components/ui/StateMessage';
import { formatPrice } from '../utils/format';

const schema = {
  name: [rules.required('Full name')],
  email: [rules.required('Email'), rules.email()],
  phone: [rules.required('Phone'), rules.phone()],
  line1: [rules.required('Address')],
  city: [rules.required('City')],
  state: [rules.required('State')],
  postalCode: [rules.required('PIN code'), rules.postalCode()],
};

export default function Checkout() {
  const { items, totals, coupon, clear } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [values, setValues] = useState({
    name: user?.name || '', email: user?.email || '', phone: user?.phone || '',
    line1: '', city: '', state: '', postalCode: '', paymentMethod: 'cod',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [failure, setFailure] = useState('');

  if (!items.length) {
    return (
      <div className="shell py-16 lg:py-24">
        <StateMessage
          icon="cart"
          title="There is nothing to check out"
          body="Add something to your cart and this page will fill itself in."
          actionLabel="Browse the marketplace"
          to="/shop"
        />
      </div>
    );
  }

  const set = (field) => (e) => {
    setValues((v) => ({ ...v, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const submit = async (e) => {
    e.preventDefault();
    const found = validate(values, schema);
    setErrors(found);
    if (Object.keys(found).length) {
      document.querySelector('[aria-invalid="true"]')?.focus();
      return;
    }

    setSubmitting(true);
    setFailure('');
    try {
      const res = await placeOrder({
        items: items.map((i) => ({ product: i.product, quantity: i.quantity })),
        customer: { name: values.name, email: values.email, phone: values.phone },
        shippingAddress: {
          line1: values.line1, city: values.city, state: values.state, postalCode: values.postalCode,
        },
        paymentMethod: values.paymentMethod,
        couponCode: coupon,
      });
      clear();
      toast(`Order ${res.item.orderNumber} placed`);
      navigate(`/order/${res.item.orderNumber}`, { replace: true });
    } catch (err) {
      setFailure(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="shell py-8 lg:py-12">
      <header className="mb-7">
        <p className="eyebrow">Step 2 of 2</p>
        <h1 className="mt-2 font-display text-3xl font-extrabold tracking-[-0.03em] lg:text-4xl">Checkout</h1>
      </header>

      <form onSubmit={submit} noValidate className="grid gap-8 lg:grid-cols-[1fr_360px] lg:gap-10">
        <div className="space-y-6">
          <fieldset className="rounded-2xl border border-line bg-surface p-5 lg:p-6">
            <legend className="px-1 font-display text-lg font-bold tracking-[-0.02em]">Contact</legend>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Full name" value={values.name} onChange={set('name')} error={errors.name} autoComplete="name" />
              <Field label="Phone" value={values.phone} onChange={set('phone')} error={errors.phone} autoComplete="tel" inputMode="tel" />
              <Field className="sm:col-span-2" label="Email" type="email" value={values.email} onChange={set('email')} error={errors.email} autoComplete="email" hint="Order updates go here." />
            </div>
          </fieldset>

          <fieldset className="rounded-2xl border border-line bg-surface p-5 lg:p-6">
            <legend className="px-1 font-display text-lg font-bold tracking-[-0.02em]">Delivery address</legend>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field className="sm:col-span-2" label="Address" value={values.line1} onChange={set('line1')} error={errors.line1} autoComplete="street-address" />
              <Field label="City" value={values.city} onChange={set('city')} error={errors.city} autoComplete="address-level2" />
              <Field label="State" value={values.state} onChange={set('state')} error={errors.state} autoComplete="address-level1" />
              <Field label="PIN code" value={values.postalCode} onChange={set('postalCode')} error={errors.postalCode} inputMode="numeric" autoComplete="postal-code" />
            </div>
          </fieldset>

          <fieldset className="rounded-2xl border border-line bg-surface p-5 lg:p-6">
            <legend className="px-1 font-display text-lg font-bold tracking-[-0.02em]">Payment</legend>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {[
                { value: 'cod', label: 'Cash on delivery', hint: 'Pay the courier' },
                { value: 'upi', label: 'UPI', hint: 'Any UPI app' },
                { value: 'card', label: 'Card', hint: 'Credit or debit' },
              ].map((m) => (
                <label
                  key={m.value}
                  className={`cursor-pointer rounded-xl border p-4 transition-colors ${
                    values.paymentMethod === m.value ? 'border-ink bg-canvas' : 'border-line hover:border-line-strong'
                  }`}
                >
                  <input
                    type="radio" name="paymentMethod" value={m.value}
                    checked={values.paymentMethod === m.value}
                    onChange={set('paymentMethod')}
                    className="sr-only"
                  />
                  <span className="flex items-center justify-between text-sm font-semibold">
                    {m.label}
                    {values.paymentMethod === m.value && <Icon name="check" size={16} />}
                  </span>
                  <span className="mt-0.5 block text-xs text-ink-mute">{m.hint}</span>
                </label>
              ))}
            </div>
            <p className="mt-4 text-xs text-ink-mute">
              This is a demonstration store — no payment is taken and no card details are collected.
            </p>
          </fieldset>
        </div>

        <div className="lg:sticky lg:top-32 lg:self-start">
          <ul className="mb-3 space-y-2 rounded-2xl border border-line bg-surface p-5 text-sm">
            {items.map((i) => (
              <li key={i.product} className="flex justify-between gap-3">
                <span className="clamp-1 text-ink-soft">
                  <span className="font-mono text-2xs">{i.quantity}×</span> {i.name}
                </span>
                <span className="shrink-0 tabular-nums">{formatPrice(i.price * i.quantity)}</span>
              </li>
            ))}
          </ul>

          <CartSummary totals={totals} coupon={coupon}>
            {failure && (
              <p className="mt-4 flex items-start gap-2 rounded-xl bg-danger/10 px-3.5 py-3 text-sm text-danger">
                <Icon name="alert" size={16} className="mt-0.5 shrink-0" /> {failure}
              </p>
            )}
            <Button type="submit" size="lg" full className="mt-5" disabled={submitting}>
              {submitting ? 'Placing order…' : `Place order · ${formatPrice(totals.total)}`}
            </Button>
            <Link to="/cart" className="mt-3 block text-center text-xs text-ink-mute hover:text-ink">
              Back to cart
            </Link>
          </CartSummary>
        </div>
      </form>
    </div>
  );
}
