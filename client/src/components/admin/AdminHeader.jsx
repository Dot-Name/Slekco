export default function AdminHeader({ eyebrow, title, description, children }) {
  return (
    <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1 className="mt-1.5 font-display text-2xl font-extrabold tracking-[-0.03em] lg:text-3xl">{title}</h1>
        {description && <p className="mt-1.5 max-w-xl text-sm text-ink-soft">{description}</p>}
      </div>
      {children && <div className="flex flex-wrap items-center gap-2">{children}</div>}
    </header>
  );
}
