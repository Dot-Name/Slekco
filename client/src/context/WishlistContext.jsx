import { createContext, useCallback, useContext, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const [ids, setIds] = useLocalStorage('slekco:wishlist', []);

  const toggle = useCallback(
    (productId) => {
      let saved = false;
      setIds((prev) => {
        saved = !prev.includes(productId);
        return saved ? [...prev, productId] : prev.filter((id) => id !== productId);
      });
      return saved;
    },
    [setIds]
  );

  const value = useMemo(
    () => ({ ids, toggle, has: (id) => ids.includes(id), count: ids.length }),
    [ids, toggle]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used inside <WishlistProvider>');
  return ctx;
};
