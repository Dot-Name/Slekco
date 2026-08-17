import { classNames } from '../../utils/format';

export default function Badge({ children, tone = 'ink', accent, className = '' }) {
  const tones = {
    ink: 'bg-ink text-white',
    light: 'bg-canvas text-ink-soft',
    outline: 'border border-line text-ink-soft',
    accent: '',
  };
  return (
    <span
      className={classNames(
        'inline-flex items-center rounded-full px-2.5 py-1 font-mono text-2xs font-medium uppercase tracking-[0.1em]',
        tones[tone],
        className
      )}
      style={tone === 'accent' ? { backgroundColor: `${accent}14`, color: accent } : undefined}
    >
      {children}
    </span>
  );
}
