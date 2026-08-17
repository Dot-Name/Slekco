import { classNames } from '../../utils/format';

export function SkeletonCard({ className = '' }) {
  return (
    <div className={classNames('card overflow-hidden', className)}>
      <div className="skeleton aspect-[4/5] w-full" />
      <div className="space-y-2.5 p-4">
        <div className="skeleton h-3 w-16 rounded-full" />
        <div className="skeleton h-4 w-4/5 rounded-full" />
        <div className="skeleton h-4 w-1/3 rounded-full" />
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
      {Array.from({ length: count }).map((_, i) => <SkeletonCard key={i} />)}
    </div>
  );
}
