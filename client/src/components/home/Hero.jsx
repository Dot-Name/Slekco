import { Link } from 'react-router-dom';
import Button from '../ui/Button';
import Icon from '../ui/Icon';
import ProductImage from '../ui/ProductImage';
import { accentOf, formatPrice } from '../../utils/format';

function FloatTile({ product, className = '', offset = '' }) {
  if (!product) return <div className={`skeleton rounded-2xl ${className}`} />;
  const accent = accentOf(product);

  return (
    <Link
      to={`/product/${product.slug}`}
      className={`group relative block overflow-hidden rounded-2xl border border-line bg-surface shadow-card transition-all duration-500 ease-swift hover:-translate-y-1.5 hover:shadow-lift ${className} ${offset}`}
    >
      <div className="absolute -inset-6 -z-10 rounded-full opacity-40 blur-3xl" style={{ backgroundColor: `${accent}55` }} />
      <div className="relative h-full w-full" style={{ backgroundColor: `${accent}0F` }}>
        <ProductImage
          src={product.images?.[0]}
          alt={product.name}
          accent={accent}
          className="h-full w-full object-cover transition-transform duration-700 ease-swift group-hover:scale-105"
        />
      </div>
      <div className="absolute inset-x-2 bottom-2 flex items-center justify-between gap-2 rounded-xl bg-surface/90 px-3 py-2 backdrop-blur">
        <span className="clamp-1 font-mono text-2xs uppercase tracking-[0.1em] text-ink-mute">{product.brand}</span>
        <span className="font-display text-sm font-bold">{formatPrice(product.price)}</span>
      </div>
    </Link>
  );
}

export default function Hero({ products = [] }) {
  return (
    <section className="relative overflow-hidden">
      <div className="shell grid gap-12 py-12 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-16 lg:py-20">
        <div className="animate-fade-up">
          <p className="eyebrow flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>Six categories</span><span className="text-line-strong">/</span>
            <span>Twelve brands</span><span className="text-line-strong">/</span>
            <span>One checkout</span>
          </p>

          <h1 className="mt-5 font-display text-[2.6rem] font-extrabold leading-[0.98] tracking-[-0.035em] sm:text-6xl lg:text-[4.25rem]">
            Six aisles.
            <br />
            One basket.
          </h1>

          <p className="mt-6 max-w-lg text-base leading-relaxed text-ink-soft sm:text-lg">
            Headphones, linen sheets, a lip trio and a kettlebell can share the same order. Slekco puts
            every brand behind one search bar — and sends it all in one delivery.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button to="/shop" size="lg">
              Shop the marketplace <Icon name="arrowRight" size={18} />
            </Button>
            <Button to="/shop?sort=popular" variant="outline" size="lg">
              See what's selling
            </Button>
          </div>

          <dl className="mt-10 flex flex-wrap gap-x-8 gap-y-4 border-t border-line pt-6">
            {[
              { k: 'Delivery', v: 'Free over ₹999' },
              { k: 'Returns', v: '14 days, no questions' },
              { k: 'Payments', v: 'UPI, card or COD' },
            ].map((s) => (
              <div key={s.k}>
                <dt className="font-mono text-2xs uppercase tracking-[0.12em] text-ink-mute">{s.k}</dt>
                <dd className="mt-1 text-sm font-semibold">{s.v}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* The shelf: three products at staggered heights, each glowing in its
            own category colour. */}
        <div className="relative grid grid-cols-2 gap-3 sm:gap-4 lg:gap-5">
          <FloatTile product={products[0]} className="col-span-1 row-span-2 aspect-[3/5]" />
          <FloatTile product={products[1]} className="aspect-square" offset="lg:translate-y-6" />
          <FloatTile product={products[2]} className="aspect-[4/5]" offset="lg:translate-y-6" />
        </div>
      </div>
    </section>
  );
}
