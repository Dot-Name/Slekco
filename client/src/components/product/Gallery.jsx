import { useEffect, useState } from 'react';
import ProductImage from '../ui/ProductImage';
import { classNames } from '../../utils/format';

export default function Gallery({ images = [], alt, accent = '#14161A' }) {
  const [active, setActive] = useState(0);

  useEffect(() => setActive(0), [alt]);

  return (
    <div className="flex flex-col gap-3 lg:flex-row-reverse lg:gap-4">
      <div
        className="relative aspect-square w-full overflow-hidden rounded-2xl border border-line lg:flex-1"
        style={{ backgroundColor: `${accent}0A` }}
      >
        <ProductImage
          key={images[active]}
          src={images[active]}
          alt={`${alt} — view ${active + 1}`}
          accent={accent}
          className="h-full w-full object-cover"
        />
      </div>

      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto no-scrollbar lg:w-20 lg:flex-col lg:overflow-visible">
          {images.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show image ${i + 1} of ${images.length}`}
              aria-current={i === active}
              className={classNames(
                'relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-all duration-200',
                i === active ? 'border-ink' : 'border-line hover:border-line-strong'
              )}
              style={{ backgroundColor: `${accent}0A` }}
            >
              <ProductImage src={src} alt="" accent={accent} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
