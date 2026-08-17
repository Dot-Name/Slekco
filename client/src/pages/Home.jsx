import { useApi } from '../hooks/useApi';
import { fetchProducts, fetchTrending, fetchBrands } from '../api/products';
import { useCatalog } from '../context/CatalogContext';

import Hero from '../components/home/Hero';
import SectionHead from '../components/home/SectionHead';
import CategoryGrid from '../components/home/CategoryGrid';
import BrandRail from '../components/home/BrandRail';
import PromoBanner from '../components/home/PromoBanner';
import ValueStrip from '../components/home/ValueStrip';
import ProductRail from '../components/product/ProductRail';
import Spectrum from '../components/ui/Spectrum';

export default function Home() {
  const { categories, loading: catsLoading } = useCatalog();
  const featured = useApi((o) => fetchProducts({ featured: true, limit: 4 }, o), []);
  const trending = useApi((o) => fetchTrending(8, o), []);
  const brands = useApi((o) => fetchBrands(o), []);
  const newest = useApi((o) => fetchProducts({ sort: 'newest', limit: 4 }, o), []);

  return (
    <>
      <Hero products={featured.data?.items || []} />

      <section className="shell pb-4">
        <ValueStrip />
      </section>

      <section className="shell py-14 lg:py-20">
        <SectionHead
          eyebrow="Shop by aisle"
          title="Six categories, one account"
          description="Each aisle has its own colour across the site — so you always know which part of the market you're in."
          linkTo="/shop"
          linkLabel="All products"
        />
        <CategoryGrid categories={categories} loading={catsLoading} />
      </section>

      <section className="shell pb-14 lg:pb-20">
        <SectionHead
          eyebrow="Brands on Slekco"
          title="Names worth keeping"
          description="Twelve sellers, each verified before their first listing goes live."
        />
        <BrandRail brands={brands.data?.items || []} loading={brands.loading} />
      </section>

      <div className="shell">
        <Spectrum animate={false} className="opacity-40" />
      </div>

      <section className="shell py-14 lg:py-20">
        <SectionHead
          eyebrow="Selling fastest this week"
          title="Trending across the market"
          linkTo="/shop?sort=popular"
          linkLabel="See the full list"
        />
        <ProductRail products={trending.data?.items || []} loading={trending.loading} />
      </section>

      <PromoBanner />

      <section className="shell py-14 lg:py-20">
        <SectionHead
          eyebrow="Just listed"
          title="New to the catalogue"
          linkTo="/shop?sort=newest"
          linkLabel="Browse new arrivals"
        />
        <ProductRail products={newest.data?.items || []} loading={newest.loading} />
      </section>
    </>
  );
}
