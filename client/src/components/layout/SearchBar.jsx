import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Icon from '../ui/Icon';

export default function SearchBar({ onSubmitted, autoFocus, className = '' }) {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [term, setTerm] = useState(params.get('q') || '');

  useEffect(() => setTerm(params.get('q') || ''), [params]);

  const submit = (e) => {
    e.preventDefault();
    const q = term.trim();
    navigate(q ? `/shop?q=${encodeURIComponent(q)}` : '/shop');
    onSubmitted?.();
  };

  return (
    <form onSubmit={submit} role="search" className={`relative w-full ${className}`}>
      <Icon name="search" size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-mute" />
      <input
        type="search"
        value={term}
        autoFocus={autoFocus}
        onChange={(e) => setTerm(e.target.value)}
        placeholder="Search products, brands and categories"
        aria-label="Search products"
        className="h-11 w-full rounded-full border border-line bg-canvas pl-11 pr-24 text-sm text-ink placeholder:text-ink-mute/80 transition-colors focus:border-ink focus:bg-surface"
      />
      <button
        type="submit"
        className="absolute right-1.5 top-1/2 h-8 -translate-y-1/2 rounded-full bg-ink px-4 text-xs font-medium text-white transition-colors hover:bg-brand-600"
      >
        Search
      </button>
    </form>
  );
}
