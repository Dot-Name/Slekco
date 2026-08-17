import { useEffect } from 'react';
import Icon from './Icon';
import { useLockBody } from '../../hooks/useLockBody';
import { classNames } from '../../utils/format';

/** Slide-over panel used for mobile navigation and the filter sheet. */
export default function Drawer({ open, onClose, title, side = 'left', children, footer }) {
  useLockBody(open);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const sides = {
    left: 'left-0 top-0 h-full w-[86%] max-w-sm animate-slide-in-left',
    right: 'right-0 top-0 h-full w-[86%] max-w-sm animate-slide-in-right',
    bottom: 'inset-x-0 bottom-0 max-h-[88vh] rounded-t-3xl animate-slide-up',
  };

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label={title}>
      <button className="absolute inset-0 bg-ink/40 backdrop-blur-[2px]" onClick={onClose} aria-label="Close panel" />
      <div
        className={classNames(
          'absolute flex flex-col bg-surface shadow-pop',
          sides[side]
        )}
      >
        <header className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="font-display text-lg font-bold">{title}</h2>
          <button onClick={onClose} className="rounded-full p-1.5 text-ink-mute transition-colors hover:bg-canvas hover:text-ink" aria-label="Close">
            <Icon name="close" size={20} />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto px-5 py-5">{children}</div>
        {footer && <div className="border-t border-line px-5 py-4">{footer}</div>}
      </div>
    </div>
  );
}
