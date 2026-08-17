import { Link } from 'react-router-dom';

const BARS = ['#2F4BF0', '#D6246E', '#12876F', '#E08700'];

export default function Logo({ className = '', tone = 'ink' }) {
  return (
    <Link to="/" className={`group inline-flex items-baseline gap-2 ${className}`} aria-label="Slekco home">
      <span
        className={`font-display text-[1.45rem] font-extrabold leading-none tracking-[-0.045em] ${
          tone === 'light' ? 'text-white' : 'text-ink'
        }`}
      >
        Slekco
      </span>
      {/* Four bars, four of the six category accents — the mark is the palette. */}
      <span className="flex items-end gap-[3px] pb-[3px]" aria-hidden="true">
        {BARS.map((c, i) => (
          <span
            key={c}
            className="block w-[3px] rounded-full transition-all duration-300 ease-swift group-hover:h-3"
            style={{ backgroundColor: c, height: 6 + i * 2 }}
          />
        ))}
      </span>
    </Link>
  );
}
