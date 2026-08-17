import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Runs an API function on mount (and whenever `deps` change), tracking
 * loading and error state. Requests are aborted when deps change or the
 * component unmounts, so a fast filter click never renders stale results.
 */
export function useApi(fn, deps = [], { skip = false } = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(!skip);
  const [error, setError] = useState(null);
  const [nonce, setNonce] = useState(0);
  const fnRef = useRef(fn);
  fnRef.current = fn;

  useEffect(() => {
    if (skip) return undefined;
    const controller = new AbortController();
    let alive = true;

    setLoading(true);
    setError(null);

    fnRef
      .current({ signal: controller.signal })
      .then((res) => alive && setData(res))
      .catch((err) => {
        if (err.name === 'AbortError' || !alive) return;
        setError(err);
      })
      .finally(() => alive && setLoading(false));

    return () => {
      alive = false;
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, skip, nonce]);

  const retry = useCallback(() => setNonce((n) => n + 1), []);
  return { data, loading, error, retry };
}
