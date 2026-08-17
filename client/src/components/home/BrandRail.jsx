import { Link } from 'react-router-dom';
import { formatPrice } from '../../utils/format';

/** Brands as typographic chips — a marketplace is a list of names first. */
export default function BrandRail({ brands = [], loading }) {
  const list = loading ? Array.from({ length: 8 }) : brands;

  return (
    <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 no-scrollbar sm:-mx-6 sm:px-6 lg:mx-0 lg:flex-wrap lg:px-0">
      {list.map((b, i) =>
        b ? (
          <Link
            key={b.name}
            to={`/shop?brand=${encodeURIComponent(b.name)}`}
            className="group flex shrink-0 items-center gap-3 rounded-2xl border border-line bg-surface px-5 py-4 transition-all duration-300 ease-swift hover:-translate-y-1 hover:border-ink hover:shadow-card"
          >
            <span className="font-display text-lg font-bold tracking-[-0.03em]">{b.name}</span>
            <span className="hidden border-l border-line pl-3 font-mono text-2xs uppercase tracking-[0.1em] text-ink-mute sm:block">
              from {formatPrice(b.minPrice)}
            </span>
          </Link>
        ) : (
          <div key={i} className="skeleton h-[58px] w-40 shrink-0 rounded-2xl" />
        )
      )}
    </div>
  );
}
