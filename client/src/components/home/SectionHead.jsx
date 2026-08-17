import { Link } from 'react-router-dom';
import Icon from '../ui/Icon';

export default function SectionHead({ eyebrow, title, description, linkTo, linkLabel }) {
  return (
    <div className="mb-7 flex flex-wrap items-end justify-between gap-4 lg:mb-9">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2 className="mt-2 font-display text-2xl font-extrabold tracking-[-0.03em] sm:text-3xl lg:text-[2.1rem]">
          {title}
        </h2>
        {description && <p className="mt-2 max-w-xl text-sm text-ink-soft sm:text-base">{description}</p>}
      </div>
      {linkTo && (
        <Link
          to={linkTo}
          className="group inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-4 py-2 text-sm font-medium transition-colors hover:border-ink"
        >
          {linkLabel}
          <Icon name="arrowRight" size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  );
}
