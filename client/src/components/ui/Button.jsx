import { Link } from 'react-router-dom';
import { classNames } from '../../utils/format';

const variants = {
  primary: 'bg-ink text-white hover:bg-brand-600 shadow-card',
  accent: 'bg-brand-500 text-white hover:bg-brand-600 shadow-card',
  outline: 'border border-line-strong bg-surface text-ink hover:border-ink hover:bg-ink hover:text-white',
  ghost: 'text-ink hover:bg-ink/5',
  quiet: 'bg-canvas text-ink hover:bg-line',
  danger: 'text-danger hover:bg-danger/10',
};

const sizes = {
  sm: 'h-9 px-3.5 text-sm gap-1.5',
  md: 'h-11 px-5 text-sm gap-2',
  lg: 'h-13 px-7 text-base gap-2.5',
  icon: 'h-10 w-10',
};

export default function Button({
  as,
  to,
  href,
  variant = 'primary',
  size = 'md',
  full,
  className = '',
  children,
  ...rest
}) {
  const cls = classNames(
    'inline-flex items-center justify-center rounded-full font-medium transition-all duration-200 ease-swift active:scale-[.97] disabled:pointer-events-none disabled:opacity-45',
    variants[variant],
    sizes[size],
    full && 'w-full',
    className
  );

  if (to) return <Link to={to} className={cls} {...rest}>{children}</Link>;
  if (href) return <a href={href} className={cls} {...rest}>{children}</a>;
  const Tag = as || 'button';
  return <Tag className={cls} {...rest}>{children}</Tag>;
}
