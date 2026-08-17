import { useEffect } from 'react';
import Button from '../ui/Button';
import { useLockBody } from '../../hooks/useLockBody';

/** Destructive actions ask once, in plain language, before they run. */
export default function ConfirmDialog({ open, title, body, confirmLabel = 'Delete', busy, onConfirm, onCancel }) {
  useLockBody(open);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && onCancel();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center" role="dialog" aria-modal="true">
      <button className="absolute inset-0 bg-ink/45 backdrop-blur-[2px]" onClick={onCancel} aria-label="Cancel" />
      <div className="relative w-full max-w-md rounded-2xl border border-line bg-surface p-6 shadow-pop">
        <h2 className="font-display text-lg font-bold tracking-[-0.02em]">{title}</h2>
        <p className="mt-2 text-sm text-ink-soft">{body}</p>
        <div className="mt-6 flex gap-3">
          <Button variant="outline" full onClick={onCancel} disabled={busy}>Keep it</Button>
          <Button full onClick={onConfirm} disabled={busy} className="bg-danger text-white hover:opacity-90">
            {busy ? 'Working…' : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
