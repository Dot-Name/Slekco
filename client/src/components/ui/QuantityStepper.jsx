import Icon from './Icon';

export default function QuantityStepper({ value, onChange, max = 99, size = 'md' }) {
  const h = size === 'sm' ? 'h-9' : 'h-11';
  const btn = 'flex h-full w-9 items-center justify-center text-ink-soft transition-colors hover:text-ink disabled:opacity-35 disabled:hover:text-ink-soft';

  return (
    <div className={`inline-flex ${h} items-center rounded-full border border-line bg-surface`}>
      <button type="button" className={btn} onClick={() => onChange(value - 1)} disabled={value <= 1} aria-label="Reduce quantity">
        <Icon name="minus" size={15} />
      </button>
      <span className="w-8 text-center font-mono text-sm tabular-nums" aria-live="polite">{value}</span>
      <button type="button" className={btn} onClick={() => onChange(value + 1)} disabled={value >= max} aria-label="Increase quantity">
        <Icon name="plus" size={15} />
      </button>
    </div>
  );
}
