import ProductCard from './ProductCard';
import { SkeletonGrid } from '../ui/Skeleton';
import StateMessage from '../ui/StateMessage';

export default function ProductGrid({ products = [], loading, error, onRetry, emptyAction }) {
  if (loading) return <SkeletonGrid count={8} />;

  if (error) {
    return (
      <StateMessage
        icon="alert"
        title="The catalogue did not load"
        body={error.message}
        actionLabel="Try again"
        onAction={onRetry}
      />
    );
  }

  if (!products.length) {
    return (
      <StateMessage
        icon="search"
        title="Nothing matches those filters"
        body="Widen the price range or clear a filter to see more of the catalogue."
        actionLabel={emptyAction ? 'Clear all filters' : undefined}
        onAction={emptyAction}
      />
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
      {products.map((p) => <ProductCard key={p._id} product={p} />)}
    </div>
  );
}
