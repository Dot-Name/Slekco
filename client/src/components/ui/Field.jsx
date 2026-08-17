import { useId } from 'react';
import Icon from './Icon';
import { classNames } from '../../utils/format';

/**
 * One field primitive for inputs, textareas and selects, so every form in
 * Slekco reports errors the same way: red border, message under the field,
 * and aria-describedby wired up for screen readers.
 */
export default function Field({
  label,
  as = 'input',
  error,
  hint,
  className = '',
  children,
  ...rest
}) {
  const id = useId();
  const Tag = as;
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

  return (
    <div className={classNames('w-full', className)}>
      {label && (
        <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-ink-soft">
          {label}
        </label>
      )}
      <div className="relative">
        <Tag
          id={id}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          className={classNames(
            'w-full rounded-xl border bg-surface px-4 text-sm text-ink placeholder:text-ink-mute/70 transition-colors duration-200',
            as === 'textarea' ? 'min-h-[132px] resize-y py-3' : 'h-11',
            as === 'select' && 'appearance-none pr-10',
            error
              ? 'border-danger focus:border-danger'
              : 'border-line focus:border-ink'
          )}
          {...rest}
        >
          {children}
        </Tag>
        {as === 'select' && (
          <Icon name="chevronDown" size={16} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-mute" />
        )}
      </div>
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 flex items-center gap-1.5 text-sm text-danger">
          <Icon name="alert" size={14} /> {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-sm text-ink-mute">{hint}</p>
      ) : null}
    </div>
  );
}
