import { classNames } from '../../utils/format';

export const SPECTRUM = ['#2F4BF0', '#D6246E', '#12876F', '#7A46E0', '#E08700', '#0E8FA8'];

/**
 * Slekco's signature: six colour segments, one per category. It runs under
 * the header, splits sections, and reappears as the category accent on
 * cards — the palette itself says "many brands, one place".
 */
export default function Spectrum({ className = '', colors = SPECTRUM, animate = true }) {
  return (
    <div className={classNames('spectrum', className)} aria-hidden="true">
      {colors.map((c, i) => (
        <span
          key={c + i}
          style={{
            backgroundColor: c,
            animationDelay: animate ? `${i * 70}ms` : '0ms',
            animationPlayState: animate ? 'running' : 'paused',
          }}
        />
      ))}
    </div>
  );
}
