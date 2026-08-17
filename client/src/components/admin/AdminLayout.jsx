import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useState } from 'react';
import Logo from '../layout/Logo';
import Icon from '../ui/Icon';
import Button from '../ui/Button';
import Spectrum from '../ui/Spectrum';
import { useAuth } from '../../context/AuthContext';
import { classNames } from '../../utils/format';

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: 'grid', end: true },
  { to: '/admin/products', label: 'Products', icon: 'box' },
  { to: '/admin/categories', label: 'Categories', icon: 'filter' },
  { to: '/admin/orders', label: 'Orders', icon: 'truck' },
  { to: '/admin/messages', label: 'Messages', icon: 'mail' },
];

function NavList({ onNavigate }) {
  return (
    <nav className="space-y-1">
      {NAV.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          onClick={onNavigate}
          className={({ isActive }) =>
            classNames(
              'flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm transition-colors',
              isActive ? 'bg-white/15 font-medium text-white' : 'text-white/60 hover:bg-white/10 hover:text-white'
            )
          }
        >
          <Icon name={item.icon} size={18} />
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}

/**
 * The admin shell. Dark rail on the left, work surface on the right — a
 * deliberately different environment from the storefront, using the same tokens.
 */
export default function AdminLayout() {
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <div className="flex min-h-screen bg-canvas">
      {/* Desktop rail */}
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col bg-ink px-4 py-5 lg:flex">
        <div className="px-2">
          <Logo tone="light" />
          <p className="mt-1.5 font-mono text-2xs uppercase tracking-[0.14em] text-white/40">Admin console</p>
        </div>

        <div className="mt-7 flex-1"><NavList /></div>

        <div className="border-t border-white/10 pt-4">
          <p className="px-3.5 text-sm font-medium text-white">{user?.name}</p>
          <p className="px-3.5 font-mono text-2xs uppercase tracking-[0.12em] text-white/40">{user?.role}</p>
          <div className="mt-3 space-y-1">
            <NavLink to="/" className="flex items-center gap-3 rounded-xl px-3.5 py-2 text-sm text-white/60 transition-colors hover:bg-white/10 hover:text-white">
              <Icon name="arrowRight" size={16} /> View storefront
            </NavLink>
            <button
              onClick={signOut}
              className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2 text-sm text-white/60 transition-colors hover:bg-white/10 hover:text-white"
            >
              <Icon name="close" size={16} /> Sign out
            </button>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile bar */}
        <header className="sticky top-0 z-30 bg-ink lg:hidden">
          <div className="flex items-center gap-3 px-4 py-3">
            <button onClick={() => setOpen((v) => !v)} className="rounded-lg p-1.5 text-white" aria-label="Toggle admin menu" aria-expanded={open}>
              <Icon name={open ? 'close' : 'menu'} size={22} />
            </button>
            <Logo tone="light" />
            <span className="ml-auto font-mono text-2xs uppercase tracking-[0.12em] text-white/40">Admin</span>
          </div>
          {open && (
            <div className="border-t border-white/10 px-4 py-4" key={pathname}>
              <NavList onNavigate={() => setOpen(false)} />
              <div className="mt-4 flex gap-2 border-t border-white/10 pt-4">
                <Button to="/" size="sm" className="flex-1 bg-white/15 text-white hover:bg-white/25">Storefront</Button>
                <Button size="sm" onClick={signOut} className="flex-1 bg-white/15 text-white hover:bg-white/25">Sign out</Button>
              </div>
            </div>
          )}
          <Spectrum animate={false} />
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
