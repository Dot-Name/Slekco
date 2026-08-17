/**
 * One inline SVG set, so the bundle carries no icon dependency.
 * Every icon inherits currentColor and the surrounding font size.
 */
const paths = {
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>,
  cart: <><path d="M3 4h2l2.4 11.2A2 2 0 0 0 9.36 17H18a2 2 0 0 0 1.96-1.6L21 8H6" /><circle cx="10" cy="20" r="1.4" /><circle cx="18" cy="20" r="1.4" /></>,
  heart: <path d="M12 20s-7.5-4.6-7.5-9.4A4.1 4.1 0 0 1 12 7.6a4.1 4.1 0 0 1 7.5 3C19.5 15.4 12 20 12 20z" />,
  user: <><circle cx="12" cy="8.5" r="3.5" /><path d="M4.5 20a7.5 7.5 0 0 1 15 0" /></>,
  menu: <><path d="M4 7h16" /><path d="M4 12h16" /><path d="M4 17h16" /></>,
  close: <><path d="m6 6 12 12" /><path d="M18 6 6 18" /></>,
  chevronDown: <path d="m6 9 6 6 6-6" />,
  chevronRight: <path d="m9 6 6 6-6 6" />,
  chevronLeft: <path d="m15 6-6 6 6 6" />,
  arrowRight: <><path d="M4 12h15" /><path d="m13 6 6 6-6 6" /></>,
  plus: <><path d="M12 5v14" /><path d="M5 12h14" /></>,
  minus: <path d="M5 12h14" />,
  trash: <><path d="M4 7h16" /><path d="M9 7V5h6v2" /><path d="M6 7l1 13h10l1-13" /></>,
  check: <path d="m5 13 4 4 10-10" />,
  filter: <><path d="M4 6h16" /><path d="M7 12h10" /><path d="M10 18h4" /></>,
  truck: <><path d="M3 7h10v9H3z" /><path d="M13 10h4l4 3v3h-8z" /><circle cx="7" cy="18" r="1.6" /><circle cx="17" cy="18" r="1.6" /></>,
  shield: <path d="M12 3.5 19 6v5.5c0 4.2-2.9 7.6-7 9-4.1-1.4-7-4.8-7-9V6z" />,
  refresh: <><path d="M4 12a8 8 0 0 1 13.7-5.7L20 8" /><path d="M20 4v4h-4" /><path d="M20 12a8 8 0 0 1-13.7 5.7L4 16" /><path d="M4 20v-4h4" /></>,
  alert: <><circle cx="12" cy="12" r="8.5" /><path d="M12 8v5" /><path d="M12 16.2v.1" /></>,
  spark: <path d="M12 3.5 13.9 9l5.6 1.9-5.6 1.9L12 18.4l-1.9-5.6L4.5 11 10.1 9z" />,
  instagram: <><rect x="4" y="4" width="16" height="16" rx="4.5" /><circle cx="12" cy="12" r="3.5" /><path d="M16.8 7.3v.1" /></>,
  x: <><path d="m5 5 14 14" /><path d="M19 5 5 19" /></>,
  facebook: <path d="M14.5 8.5h2.2V5.4h-2.6c-2.3 0-3.7 1.5-3.7 3.9v1.6H8v3.1h2.4V21h3.3v-7h2.4l.4-3.1h-2.8V9.6c0-.8.3-1.1.8-1.1z" />,
  youtube: <><rect x="3" y="6" width="18" height="12" rx="4" /><path d="m11 9.8 4 2.2-4 2.2z" /></>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="3" /><path d="m4 7 8 6 8-6" /></>,
  phone: <path d="M6 4h3l1.6 4-2 1.4a12 12 0 0 0 6 6l1.4-2 4 1.6v3a1.5 1.5 0 0 1-1.7 1.5C10.8 18.7 5.3 13.2 4.5 5.7A1.5 1.5 0 0 1 6 4z" />,
  pin: <><path d="M12 21s6-5.3 6-10a6 6 0 1 0-12 0c0 4.7 6 10 6 10z" /><circle cx="12" cy="11" r="2.2" /></>,
  grid: <><rect x="4" y="4" width="7" height="7" rx="2" /><rect x="13" y="4" width="7" height="7" rx="2" /><rect x="4" y="13" width="7" height="7" rx="2" /><rect x="13" y="13" width="7" height="7" rx="2" /></>,
  box: <><path d="M12 3.5 20 8v8l-8 4.5L4 16V8z" /><path d="M4 8l8 4.5L20 8" /><path d="M12 12.5V20.5" /></>,
};

export default function Icon({ name, size = 20, strokeWidth = 1.6, className = '', ...rest }) {
  const d = paths[name];
  if (!d) return null;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
      {...rest}
    >
      {d}
    </svg>
  );
}
