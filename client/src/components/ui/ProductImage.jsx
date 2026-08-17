import { useState } from 'react';
import { classNames } from '../../utils/format';

/**
 * Product photography with a graceful failure: if a remote image will not
 * load, we fall back to a tinted monogram in the category's accent colour
 * rather than a broken-image glyph.
 */
export default function ProductImage({ src, alt, accent = '#14161A', className = '', ...rest }) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  if (failed || !src) {
    return (
      <div
        className={classNames('flex items-center justify-center', className)}
        style={{ backgroundColor: `${accent}12` }}
        role="img"
        aria-label={alt}
      >
        <span className="font-display text-3xl font-extrabold tracking-tight" style={{ color: accent }}>
          {(alt || 'S').slice(0, 1).toUpperCase()}
        </span>
      </div>
    );
  }

  return (
    <>
      {!loaded && <div className={classNames('skeleton absolute inset-0', className)} aria-hidden="true" />}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
        className={classNames(className, loaded ? 'opacity-100' : 'opacity-0', 'transition-opacity duration-500')}
        {...rest}
      />
    </>
  );
}
