import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { fetchProduct, fetchRelated } from '../api/products';
import { useApi } from '../hooks/useApi';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';

import Gallery from '../components/product/Gallery';
import ProductRail from '../components/product/ProductRail';
import SectionHead from '../components/home/SectionHead';
import Button from '../components/ui/Button';
import Icon from '../components/ui/Icon';
import Rating from '../components/ui/Rating';
import QuantityStepper from '../components/ui/QuantityStepper';
import StateMessage from '../components/ui/StateMessage';
import { accentOf, discountPercent, formatPrice } from '../utils/format';

function DetailSkeleton() {
  return (
    <div className="shell grid gap-10 py-10 lg:grid-cols-2">
      <div className="skeleton aspect-square rounded-2xl" />
      <div className="space-y-4">
        <div className="skeleton h-4 w-24 rounded-full" />
        <div className="skeleton h-9 w-4/5 rounded-full" />
        <div className="skeleton h-6 w-32 rounded-full" />
        <div className="skeleton h-24 w-full rounded-2xl" />
        <div className="skeleton h-12 w-full rounded-full" />
      </div>
    </div>
  );
}

export default function ProductDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);

  const { data, loading, error, retry } = useApi((o) => fetchProduct(slug, o), [slug]);
  const related = useApi((o) => fetchRelated(slug, o), [slug]);

  const { add } = useCart();
  const { has, toggle } = useWishlist();
  const { toast } = useToast();

  if (loading) return <DetailSkeleton />;

  if (error) {
    return (
      <div className="shell py-20">
        <StateMessage
          icon="alert"
          title={error.status === 404 ? 'That product is no longer listed' : 'The product did not load'}
          body={error.message}
          actionLabel="Back to all products"
          to="/shop"
        />
      </div>
    );
  }

  const p = data.item;
  const accent = accentOf(p);
  const off = discountPercent(p.price, p.mrp);
  const saved = has(p._id);
  const soldOut = p.stock === 0;

  const addToCart = () => {
    add(p, qty);
    toast(`${qty} × ${p.name} added to cart`);
  };

  const buyNow = () => {
    add(p, qty);
    navigate('/checkout');
  };

  return (
    <div className="pb-10">
      <div className="shell">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 py-5 font-mono text-2xs uppercase tracking-[0.1em] text-ink-mute">
          <Link to="/" className="hover:text-ink">Home</Link>
          <Icon name="chevronRight" size={12} />
          <Link to="/shop" className="hover:text-ink">Shop</Link>
          <Icon name="chevronRight" size={12} />
          <Link to={`/shop?category=${p.category?.slug}`} className="hover:text-ink">{p.category?.name}</Link>
        </nav>
      </div>

      <div className="shell grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
        <Gallery images={p.images} alt={p.name} accent={accent} />

        <div className="lg:sticky lg:top-32 lg:self-start">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              to={`/shop?brand=${encodeURIComponent(p.brand)}`}
              className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-2xs uppercase tracking-[0.12em]"
              style={{ backgroundColor: `${accent}14`, color: accent }}
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: accent }} />
              {p.brand}
            </Link>
            {p.badge && (
              <span className="rounded-full bg-ink px-2.5 py-1 font-mono text-2xs uppercase tracking-[0.1em] text-white">
                {p.badge}
              </span>
            )}
            <span className="font-mono text-2xs uppercase tracking-[0.1em] text-ink-mute">{p.sku}</span>
          </div>

          <h1 className="mt-4 font-display text-3xl font-extrabold leading-[1.08] tracking-[-0.03em] lg:text-[2.6rem]">
            {p.name}
          </h1>

          <p className="mt-3 text-base leading-relaxed text-ink-soft">{p.shortDescription}</p>

          <div className="mt-4"><Rating value={p.rating} count={p.numReviews} size={16} /></div>

          <div className="mt-6 flex flex-wrap items-baseline gap-3">
            <span className="font-display text-4xl font-extrabold tracking-[-0.03em]">{formatPrice(p.price)}</span>
            {off > 0 && (
              <>
                <span className="text-lg text-ink-mute line-through">{formatPrice(p.mrp)}</span>
                <span className="rounded-full px-2.5 py-1 font-mono text-2xs font-semibold text-white" style={{ backgroundColor: accent }}>
                  Save {off}%
                </span>
              </>
            )}
          </div>
          <p className="mt-1.5 text-xs text-ink-mute">Inclusive of all taxes · Free delivery over ₹999</p>

          {p.highlights?.length > 0 && (
            <ul className="mt-6 grid gap-2 sm:grid-cols-2">
              {p.highlights.map((h) => (
                <li key={h} className="flex items-start gap-2 text-sm text-ink-soft">
                  <Icon name="check" size={15} className="mt-0.5 shrink-0" style={{ color: accent }} />
                  {h}
                </li>
              ))}
            </ul>
          )}

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <QuantityStepper value={qty} onChange={setQty} max={Math.max(1, p.stock)} />
            <span className={`font-mono text-2xs uppercase tracking-[0.1em] ${soldOut ? 'text-danger' : 'text-success'}`}>
              {soldOut ? 'Out of stock' : p.stock <= 15 ? `Only ${p.stock} left` : 'In stock'}
            </span>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <Button size="lg" onClick={addToCart} disabled={soldOut} className="flex-1 sm:flex-none">
              <Icon name="cart" size={18} /> Add to cart
            </Button>
            <Button size="lg" variant="outline" onClick={buyNow} disabled={soldOut} className="flex-1 sm:flex-none">
              Buy now
            </Button>
            <Button
              size="icon"
              variant="outline"
              onClick={() => toast(toggle(p._id) ? 'Saved to wishlist' : 'Removed from wishlist')}
              aria-pressed={saved}
              aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'}
              className={`h-13 w-13 ${saved ? 'border-ink bg-ink text-white' : ''}`}
            >
              <Icon name="heart" size={19} className={saved ? 'fill-current' : ''} />
            </Button>
          </div>

          <dl className="mt-7 grid grid-cols-3 gap-3 border-t border-line pt-6">
            {[
              { icon: 'truck', k: 'Delivery', v: '2–4 days' },
              { icon: 'refresh', k: 'Returns', v: '14 days' },
              { icon: 'shield', k: 'Warranty', v: 'Brand covered' },
            ].map((f) => (
              <div key={f.k} className="text-center">
                <Icon name={f.icon} size={20} className="mx-auto text-ink-soft" />
                <dt className="mt-1.5 font-mono text-2xs uppercase tracking-[0.1em] text-ink-mute">{f.k}</dt>
                <dd className="text-xs font-medium">{f.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <section className="shell mt-14 grid gap-10 lg:mt-20 lg:grid-cols-2 lg:gap-14">
        <div>
          <h2 className="font-display text-xl font-bold tracking-[-0.02em]">About this product</h2>
          <p className="mt-4 text-sm leading-[1.75] text-ink-soft">{p.description}</p>
        </div>

        {p.specs?.length > 0 && (
          <div>
            <h2 className="font-display text-xl font-bold tracking-[-0.02em]">Specifications</h2>
            <dl className="mt-4 overflow-hidden rounded-2xl border border-line">
              {p.specs.map((s, i) => (
                <div key={s.key} className={`flex gap-4 px-4 py-3 text-sm ${i % 2 ? 'bg-surface' : 'bg-canvas/60'}`}>
                  <dt className="w-2/5 shrink-0 font-mono text-2xs uppercase tracking-[0.08em] text-ink-mute">{s.key}</dt>
                  <dd className="font-medium">{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </section>

      {(related.loading || related.data?.items?.length > 0) && (
        <section className="shell mt-16 lg:mt-24">
          <SectionHead
            eyebrow="You might also like"
            title="Related in this aisle"
            linkTo={`/shop?category=${p.category?.slug}`}
            linkLabel={`All ${p.category?.name}`}
          />
          <ProductRail products={related.data?.items || []} loading={related.loading} />
        </section>
      )}
    </div>
  );
}
