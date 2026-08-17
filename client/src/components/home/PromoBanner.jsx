import Button from '../ui/Button';
import Icon from '../ui/Icon';
import Spectrum from '../ui/Spectrum';

export default function PromoBanner() {
  return (
    <section className="shell">
      <div className="relative overflow-hidden rounded-3xl bg-ink text-white">
        <Spectrum className="absolute inset-x-0 top-0 rounded-none" animate={false} />

        {/* Six soft colour fields, one per category, drifting behind the copy. */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.35]" aria-hidden="true">
          {['#2F4BF0', '#D6246E', '#12876F', '#7A46E0', '#E08700', '#0E8FA8'].map((c, i) => (
            <span
              key={c}
              className="absolute h-56 w-56 rounded-full blur-3xl"
              style={{ backgroundColor: c, left: `${8 + i * 16}%`, top: i % 2 ? '-18%' : '48%' }}
            />
          ))}
        </div>

        <div className="relative grid gap-8 px-6 py-12 sm:px-10 lg:grid-cols-[1.2fr_auto] lg:items-center lg:px-14 lg:py-16">
          <div>
            <p className="font-mono text-2xs uppercase tracking-[0.16em] text-white/60">Marketplace offer</p>
            <h2 className="mt-4 font-display text-3xl font-extrabold leading-[1.05] tracking-[-0.03em] sm:text-4xl lg:text-5xl">
              Mix any two categories,
              <br />
              take 10% off the order.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/70">
              Use code <span className="rounded-md bg-white/10 px-2 py-0.5 font-mono text-white">SLEK10</span> at
              checkout. Works on everything in the catalogue, stacks with items already reduced.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <Button to="/shop" variant="accent" size="lg" className="bg-white text-ink hover:bg-white/90">
              Start an order <Icon name="arrowRight" size={18} />
            </Button>
            <Button to="/shop?sort=price-asc" size="lg" className="border border-white/25 bg-transparent text-white hover:bg-white/10">
              Browse under ₹2,000
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
