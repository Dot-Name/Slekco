import { useEffect } from 'react';

/** Stops the page behind a drawer or modal from scrolling. */
export function useLockBody(locked) {
  useEffect(() => {
    if (!locked) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [locked]);
}
