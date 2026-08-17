import { fetchProducts } from '../api/products';
import { useApi } from '../hooks/useApi';
import { useWishlist } from '../context/WishlistContext';
import ProductGrid from '../components/product/ProductGrid';
import StateMessage from '../components/ui/StateMessage';

export default function Wishlist() {
  const { ids } = useWishlist();

  // Wishlist ids live on the device; the products themselves still come from the API.
  const { data, loading, error, retry } = useApi(
    (o) => fetchProducts({ limit: 48 }, o),
    [],
    { skip: ids.length === 0 }
  );

  if (!ids.length) {
    return (
      <div className="shell py-16 lg:py-24">
        <StateMessage
          icon="heart"
          title="Nothing saved yet"
          body="Tap the heart on any product to keep it here while you decide."
          actionLabel="Find something to save"
          to="/shop"
        />
      </div>
    );
  }

  const saved = (data?.items || []).filter((p) => ids.includes(p._id));

  return (
    <div className="shell py-8 lg:py-12">
      <header className="mb-7">
        <p className="eyebrow">Saved for later</p>
        <h1 className="mt-2 font-display text-3xl font-extrabold tracking-[-0.03em] lg:text-4xl">
          Wishlist · {ids.length} {ids.length === 1 ? 'item' : 'items'}
        </h1>
      </header>
      <ProductGrid products={saved} loading={loading} error={error} onRetry={retry} />
    </div>
  );
}
