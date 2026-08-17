import ProductCard from './ProductCard';
import { SkeletonCard } from '../ui/Skeleton';

/** Horizontal scroller — how the homepage shows a set without a full grid. */
export default function ProductRail({ products = [], loading }) {
  const list = loading ? Array.from({ length: 4 }) : products;

  return (
    <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 no-scrollbar sm:-mx-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-visible lg:px-0">
      {list.map((p, i) => (
        <div key={p?._id || i} className="w-[68%] shrink-0 snap-start sm:w-[42%] lg:w-auto">
          {loading ? <SkeletonCard /> : <ProductCard product={p} />}
        </div>
      ))}
    </div>
  );
}
