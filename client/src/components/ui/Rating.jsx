import { classNames } from '../../utils/format';

/** Half-star accurate rating built from a clipped gradient, not two icon sets. */
export default function Rating({ value = 0, count, size = 14, className = '' }) {
  return (
    <div className={classNames('flex items-center gap-1.5', className)}>
      <div className="flex items-center gap-0.5" role="img" aria-label={`Rated ${value} out of 5`}>
        {[0, 1, 2, 3, 4].map((i) => {
          const fill = Math.max(0, Math.min(1, value - i));
          return (
            <svg key={i} width={size} height={size} viewBox="0 0 20 20" aria-hidden="true">
              <defs>
                <linearGradient id={`s${i}-${size}-${Math.round(value * 10)}`}>
                  <stop offset={`${fill * 100}%`} stopColor="#E08700" />
                  <stop offset={`${fill * 100}%`} stopColor="#D8DBE2" />
                </linearGradient>
              </defs>
              <path
                d="M10 1.6l2.5 5.1 5.6.8-4 3.9 1 5.6L10 14.4 5 17l1-5.6-4-3.9 5.6-.8z"
                fill={`url(#s${i}-${size}-${Math.round(value * 10)})`}
              />
            </svg>
          );
        })}
      </div>
      <span className="font-mono text-2xs text-ink-mute">
        {value.toFixed(1)}
        {count != null && ` (${count})`}
      </span>
    </div>
  );
}
