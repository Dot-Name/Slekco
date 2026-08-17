import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import Logo from './Logo';
import SearchBar from './SearchBar';
import Icon from '../ui/Icon';
import Drawer from '../ui/Drawer';
import Spectrum from '../ui/Spectrum';
import Button from '../ui/Button';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useCatalog } from '../../context/CatalogContext';
import { useAuth } from '../../context/AuthContext';
import { classNames } from '../../utils/format';

function CountBadge({ value, accent = '#2F4BF0' }) {
  if (!value) return null;
  return (
    <span
      key={value}
      className="absolute -right-1 -top-1 flex h-4.5 min-w-[18px] animate-pop items-center justify-center rounded-full px-1 font-mono text-[10px] font-semibold text-white"
      style={{ backgroundColor: accent, height: 18 }}
    >
      {value > 99 ? '99+' : value}
    </span>
  );
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { categories } = useCatalog();
  const { totals } = useCart();
  const { count: savedCount } = useWishlist();
  const { user } = useAuth();
  const location = useLocation();

  useEffect(() => setMenuOpen(false), [location.pathname, location.search]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const iconLink = 'relative flex h-10 w-10 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-canvas hover:text-ink';

  return (
    <>
      <div className="bg-ink text-white">
        <div className="shell flex h-9 items-center justify-between gap-4 text-2xs">
          <p className="font-mono uppercase tracking-[0.12em]">Free delivery over ₹999</p>
          <p className="hidden font-mono uppercase tracking-[0.12em] text-white/70 sm:block">
            14-day returns · 6 categories · 12 brands
          </p>
          <Link to="/shop?sort=popular" className="font-mono uppercase tracking-[0.12em] underline-offset-4 hover:underline">
            Shop trending
          </Link>
        </div>
      </div>

      <header
        className={classNames(
          'sticky top-0 z-40 border-b bg-surface/95 backdrop-blur transition-shadow duration-300',
          scrolled ? 'border-line shadow-card' : 'border-transparent'
        )}
      >
        <div className="shell flex h-16 items-center gap-3 lg:h-18 lg:gap-6">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className={classNames(iconLink, 'lg:hidden')}
            aria-label="Open menu"
          >
            <Icon name="menu" size={22} />
          </button>

          <Logo className="shrink-0" />

          <SearchBar className="hidden max-w-xl flex-1 lg:block" />

          <div className="ml-auto flex items-center gap-0.5">
            <NavLink to="/shop" className={classNames(iconLink, 'hidden lg:flex')} aria-label="Browse all products">
              <Icon name="grid" size={20} />
            </NavLink>
            <NavLink to="/wishlist" className={iconLink} aria-label={`Wishlist, ${savedCount} items`}>
              <Icon name="heart" size={20} />
              <CountBadge value={savedCount} accent="#D6246E" />
            </NavLink>
            {user?.role === 'admin' && (
              <NavLink
                to="/admin"
                className="mr-1 hidden items-center gap-1.5 rounded-full bg-ink px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-brand-600 sm:flex"
              >
                <Icon name="shield" size={14} /> Admin
              </NavLink>
            )}
            <NavLink to="/account" className={classNames(iconLink, 'hidden sm:flex')} aria-label={user ? `Account: ${user.name}` : 'Sign in'}>
              <Icon name="user" size={20} />
            </NavLink>
            <NavLink to="/cart" className={iconLink} aria-label={`Cart, ${totals.count} items`}>
              <Icon name="cart" size={20} />
              <CountBadge value={totals.count} />
            </NavLink>
          </div>
        </div>

        {/* Category rail — every entry carries its own accent. */}
        <nav aria-label="Product categories" className="hidden border-t border-line lg:block">
          <div className="shell flex h-11 items-center gap-1">
            <NavLink
              to="/shop"
              end
              className={({ isActive }) =>
                classNames(
                  'rounded-full px-3 py-1.5 text-sm transition-colors',
                  isActive ? 'bg-ink text-white' : 'text-ink-soft hover:bg-canvas'
                )
              }
            >
              All products
            </NavLink>
            {categories.map((c) => (
              <NavLink
                key={c.slug}
                to={`/shop?category=${c.slug}`}
                className="group flex items-center gap-2 rounded-full px-3 py-1.5 text-sm text-ink-soft transition-colors hover:bg-canvas hover:text-ink"
              >
                <span className="h-1.5 w-1.5 rounded-full transition-transform duration-200 group-hover:scale-150" style={{ backgroundColor: c.accent }} />
                {c.name}
              </NavLink>
            ))}
            <Link to="/contact" className="ml-auto text-sm text-ink-mute transition-colors hover:text-ink">
              Help centre
            </Link>
          </div>
        </nav>

        <div className="shell pb-3 lg:hidden">
          <SearchBar />
        </div>

        <Spectrum />
      </header>

      <Drawer open={menuOpen} onClose={() => setMenuOpen(false)} title="Browse Slekco">
        <nav className="space-y-1">
          <Link to="/shop" className="flex items-center justify-between rounded-xl bg-canvas px-4 py-3 font-medium">
            All products <Icon name="arrowRight" size={17} />
          </Link>
          {categories.map((c) => (
            <Link
              key={c.slug}
              to={`/shop?category=${c.slug}`}
              className="flex items-center gap-3 rounded-xl px-4 py-3 transition-colors hover:bg-canvas"
            >
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: c.accent }} />
              <span className="flex-1">{c.name}</span>
              <span className="font-mono text-2xs text-ink-mute">{c.productCount}</span>
            </Link>
          ))}
        </nav>

        <div className="mt-6 space-y-1 border-t border-line pt-5">
          {[
            { to: '/wishlist', label: 'Wishlist', icon: 'heart' },
            { to: '/cart', label: 'Cart', icon: 'cart' },
            { to: '/account', label: user ? user.name : 'Sign in', icon: 'user' },
            { to: '/contact', label: 'Help centre', icon: 'mail' },
            ...(user?.role === 'admin' ? [{ to: '/admin', label: 'Admin console', icon: 'shield' }] : []),
          ].map((l) => (
            <Link key={l.to} to={l.to} className="flex items-center gap-3 rounded-xl px-4 py-3 text-ink-soft transition-colors hover:bg-canvas hover:text-ink">
              <Icon name={l.icon} size={18} /> {l.label}
            </Link>
          ))}
        </div>

        <Button to="/shop" full className="mt-6">Start shopping</Button>
      </Drawer>
    </>
  );
}
