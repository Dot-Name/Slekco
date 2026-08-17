import Icon from './Icon';
import Button from './Button';

/** Empty and error states: say what happened, then offer the way forward. */
export default function StateMessage({
  icon = 'box',
  title,
  body,
  actionLabel,
  onAction,
  to,
  className = '',
}) {
  return (
    <div className={`flex flex-col items-center justify-center rounded-2xl border border-dashed border-line-strong bg-surface/60 px-6 py-16 text-center ${className}`}>
      <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-canvas text-ink-soft">
        <Icon name={icon} size={22} />
      </span>
      <h3 className="text-lg font-semibold">{title}</h3>
      {body && <p className="mt-1.5 max-w-sm text-sm text-ink-mute">{body}</p>}
      {(onAction || to) && (
        <Button className="mt-6" onClick={onAction} to={to} variant="primary">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
