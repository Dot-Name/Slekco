import { Link } from 'react-router-dom';
import Logo from './Logo';
import Icon from '../ui/Icon';
import Spectrum from '../ui/Spectrum';
import { useCatalog } from '../../context/CatalogContext';

const help = [
  { label: 'Track an order', to: '/contact' },
  { label: 'Returns and refunds', to: '/contact' },
  { label: 'Delivery information', to: '/contact' },
  { label: 'Contact support', to: '/contact' },
];

const company = [
  { label: 'About Slekco', to: '/contact' },
  { label: 'Sell with us', to: '/contact' },
  { label: 'Careers', to: '/contact' },
  { label: 'Press', to: '/contact' },
];

const social = [
  { name: 'instagram', label: 'Instagram' },
  { name: 'x', label: 'X' },
  { name: 'facebook', label: 'Facebook' },
  { name: 'youtube', label: 'YouTube' },
];

export default function Footer() {
  const { categories } = useCatalog();

  return (
    <footer className="mt-20 bg-ink text-white">
      <Spectrum animate={false} />
      <div className="shell grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-5 lg:py-16">
        <div className="lg:col-span-2">
          <Logo tone="light" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
            One marketplace for six categories and the brands worth keeping. Order from as many as you
            like — it all arrives in a single delivery.
          </p>
          <div className="mt-6 flex gap-2">
            {social.map((s) => (
              <a
                key={s.name}
                href="#"
                aria-label={s.label}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-white hover:text-white"
              >
                <Icon name={s.name} size={18} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-mono text-2xs uppercase tracking-[0.14em] text-white/50">Shop</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link to={`/shop?category=${c.slug}`} className="group flex items-center gap-2 text-white/70 transition-colors hover:text-white">
                  <span className="h-1.5 w-1.5 rounded-full opacity-0 transition-opacity group-hover:opacity-100" style={{ backgroundColor: c.accent }} />
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-mono text-2xs uppercase tracking-[0.14em] text-white/50">Help</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {help.map((l) => (
              <li key={l.label}>
                <Link to={l.to} className="text-white/70 transition-colors hover:text-white">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-mono text-2xs uppercase tracking-[0.14em] text-white/50">Company</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {company.map((l) => (
              <li key={l.label}>
                <Link to={l.to} className="text-white/70 transition-colors hover:text-white">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="shell flex flex-col gap-3 py-5 text-2xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono">© {new Date().getFullYear()} Slekco Marketplace</p>
          <p className="font-mono">Made by Md Farhan</p>
        </div>
      </div>
    </footer>
  );
}
