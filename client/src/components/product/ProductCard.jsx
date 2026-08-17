import { Link } from 'react-router-dom';
import Icon from '../ui/Icon';
import Rating from '../ui/Rating';
import ProductImage from '../ui/ProductImage';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useToast } from '../../context/ToastContext';
import { accentOf, classNames, discountPercent, formatPrice } from '../../utils/format';

export default function ProductCard({ product, className = '' }) {
  const { add } = useCart();
  const { has, toggle } = useWishlist();
  const { toast } = useToast();

  const accent = accentOf(product);
  const off = discountPercent(product.price, product.mrp);
  const saved = has(product._id);
  const soldOut = product.stock === 0;

  const addToCart = () => {
    add(product, 1);
    toast(`${product.name} added to cart`);
  };

  const toggleSaved = () => {
    const nowSaved = toggle(product._id);
    toast(nowSaved ? `${product.name} saved to wishlist` : `${product.name} removed from wishlist`);
  };

  return (
    <article
      className={classNames(
        'group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-card transition-all duration-300 ease-swift hover:-translate-y-1 hover:shadow-lift',
        className
      )}
    >
      {/* Accent hairline — the card carries its category's colour. */}
      <span className="absolute inset-x-0 top-0 z-10 h-[3px] origin-left scale-x-0 transition-transform duration-300 ease-swift group-hover:scale-x-100" style={{ backgroundColor: accent }} />

      <div className="relative aspect-[4/5] overflow-hidden" style={{ backgroundColor: `${accent}0A` }}>
        <Link to={`/product/${product.slug}`} className="block h-full w-full" tabIndex={-1} aria-hidden="true">
          <ProductImage
            src={product.images?.[0]}
            alt={product.name}
            accent={accent}
            className="h-full w-full object-cover transition-transform duration-500 ease-swift group-hover:scale-[1.06]"
          />
        </Link>

        <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {off > 0 && (
            <span className="rounded-full px-2 py-1 font-mono text-2xs font-semibold text-white" style={{ backgroundColor: accent }}>
              −{off}%
            </span>
          )}
          {product.badge && (
            <span className="rounded-full bg-ink px-2 py-1 font-mono text-2xs font-medium uppercase tracking-[0.1em] text-white">
              {product.badge}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={toggleSaved}
          aria-pressed={saved}
          aria-label={saved ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
          className={classNames(
            'absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-200',
            saved
              ? 'border-transparent bg-ink text-white'
              : 'border-line bg-surface/90 text-ink-soft backdrop-blur hover:border-ink hover:text-ink'
          )}
        >
          <Icon name="heart" size={17} className={saved ? 'fill-current' : ''} />
        </button>

        {soldOut ? (
          <div className="absolute inset-x-0 bottom-0 bg-ink/85 py-2.5 text-center font-mono text-2xs uppercase tracking-[0.14em] text-white">
            Back in stock soon
          </div>
        ) : (
          /* Quick add: slides in on hover for pointer devices. */
          <div className="pointer-events-none absolute inset-x-2 bottom-2 hidden translate-y-3 opacity-0 transition-all duration-300 ease-swift group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 lg:block">
            <button
              type="button"
              onClick={addToCart}
              className="flex h-10 w-full items-center justify-center gap-2 rounded-full bg-ink text-sm font-medium text-white shadow-pop transition-colors hover:bg-brand-600"
            >
              <Icon name="cart" size={16} /> Add to cart
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3.5 sm:p-4">
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: accent }} />
          <span className="font-mono text-2xs uppercase tracking-[0.12em] text-ink-mute">
            {product.brand}
            {product.category?.name && <span className="hidden sm:inline"> · {product.category.name}</span>}
          </span>
        </div>

        <h3 className="clamp-2 text-sm font-semibold leading-snug sm:text-[0.95rem]">
          <Link to={`/product/${product.slug}`} className="after:absolute after:inset-0 after:content-['']">
            {product.name}
          </Link>
        </h3>

        <Rating value={product.rating} count={product.numReviews} />

        <div className="mt-auto flex items-end justify-between gap-2 pt-1">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <span className="font-display text-lg font-bold tracking-tight">{formatPrice(product.price)}</span>
            {off > 0 && <span className="text-xs text-ink-mute line-through">{formatPrice(product.mrp)}</span>}
          </div>

          {!soldOut && (
            <button
              type="button"
              onClick={addToCart}
              aria-label={`Add ${product.name} to cart`}
              className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-canvas text-ink transition-colors hover:bg-ink hover:text-white lg:hidden"
            >
              <Icon name="plus" size={17} />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
