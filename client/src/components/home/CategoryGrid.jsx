import { Link } from 'react-router-dom';
import Icon from '../ui/Icon';
import ProductImage from '../ui/ProductImage';
import { pluralize } from '../../utils/format';

export default function CategoryGrid({ categories = [], loading }) {
  const list = loading ? Array.from({ length: 6 }) : categories;

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-6">
      {list.map((c, i) => {
        if (!c) return <div key={i} className="skeleton aspect-[5/4] rounded-2xl" />;
        return (
          <Link
            key={c.slug}
            to={`/shop?category=${c.slug}`}
            className="group relative flex aspect-[5/4] flex-col justify-end overflow-hidden rounded-2xl border border-line p-4 transition-all duration-300 ease-swift hover:-translate-y-1 hover:shadow-lift sm:p-5"
            style={{ backgroundColor: `${c.accent}12` }}
          >
            <ProductImage
              src={c.image}
              alt=""
              accent={c.accent}
              className="absolute inset-0 h-full w-full object-cover opacity-[0.22] transition-all duration-500 ease-swift group-hover:scale-105 group-hover:opacity-30"
            />
            <span className="absolute left-4 top-4 h-2.5 w-2.5 rounded-full sm:left-5 sm:top-5" style={{ backgroundColor: c.accent }} />

            <div className="relative">
              <h3 className="font-display text-lg font-bold leading-tight tracking-tight sm:text-xl">{c.name}</h3>
              <p className="mt-1 hidden text-sm leading-snug text-ink-soft sm:block">{c.description}</p>
              <span className="mt-3 inline-flex items-center gap-1.5 font-mono text-2xs uppercase tracking-[0.12em]" style={{ color: c.accent }}>
                {pluralize(c.productCount || 0, 'product')}
                <Icon name="arrowRight" size={13} className="transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
