import Icon from '../ui/Icon';

const points = [
  { icon: 'truck', title: 'One delivery', body: 'Six categories, one box wherever possible.' },
  { icon: 'refresh', title: '14-day returns', body: 'Free pickup from your address.' },
  { icon: 'shield', title: 'Brand-verified', body: 'Every seller is checked before listing.' },
  { icon: 'phone', title: 'Human support', body: 'Reply within one business day.' },
];

export default function ValueStrip() {
  return (
    <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
      {points.map((p) => (
        <li key={p.title} className="flex items-start gap-3 rounded-2xl border border-line bg-surface p-4">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-canvas text-ink">
            <Icon name={p.icon} size={18} />
          </span>
          <div>
            <h3 className="text-sm font-semibold">{p.title}</h3>
            <p className="mt-0.5 text-xs leading-snug text-ink-mute">{p.body}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
