import Icon from '../ui/Icon';

const OPTIONS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'popular', label: 'Most popular' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'rating', label: 'Top rated' },
];

export default function SortSelect({ value, onChange }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Sort products"
        className="h-11 appearance-none rounded-full border border-line bg-surface pl-4 pr-10 text-sm font-medium text-ink transition-colors hover:border-ink-mute focus:border-ink"
      >
        {OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <Icon name="chevronDown" size={16} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-mute" />
    </div>
  );
}
