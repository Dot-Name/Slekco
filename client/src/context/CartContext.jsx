import { createContext, useCallback, useContext, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const CartContext = createContext(null);

const COUPONS = { SLEK10: 0.1, WELCOME5: 0.05 };
export const FREE_SHIPPING_ABOVE = 999;
export const SHIPPING_FEE = 49;

export function CartProvider({ children }) {
  const [items, setItems] = useLocalStorage('slekco:cart', []);
  const [coupon, setCoupon] = useLocalStorage('slekco:coupon', '');

  const add = useCallback(
    (product, quantity = 1) => {
      setItems((prev) => {
        const existing = prev.find((i) => i.product === product._id);
        if (existing) {
          return prev.map((i) =>
            i.product === product._id
              ? { ...i, quantity: Math.min(i.quantity + quantity, product.stock || 99) }
              : i
          );
        }
        return [
          ...prev,
          {
            product: product._id,
            slug: product.slug,
            name: product.name,
            brand: product.brand,
            image: product.images?.[0],
            price: product.price,
            mrp: product.mrp,
            stock: product.stock,
            accent: product.category?.accent || '#14161A',
            quantity,
          },
        ];
      });
    },
    [setItems]
  );

  const setQuantity = useCallback(
    (productId, quantity) =>
      setItems((prev) =>
        prev.map((i) =>
          i.product === productId
            ? { ...i, quantity: Math.max(1, Math.min(quantity, i.stock || 99)) }
            : i
        )
      ),
    [setItems]
  );

  const remove = useCallback(
    (productId) => setItems((prev) => prev.filter((i) => i.product !== productId)),
    [setItems]
  );

  const clear = useCallback(() => {
    setItems([]);
    setCoupon('');
  }, [setItems, setCoupon]);

  const applyCoupon = useCallback(
    (code) => {
      const key = code.trim().toUpperCase();
      if (!COUPONS[key]) return { ok: false, message: `${key} is not an active code.` };
      setCoupon(key);
      return { ok: true, message: `${key} applied — ${COUPONS[key] * 100}% off this order.` };
    },
    [setCoupon]
  );

  const totals = useMemo(() => {
    const itemsTotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const savings = items.reduce((sum, i) => sum + Math.max(0, (i.mrp || i.price) - i.price) * i.quantity, 0);
    const rate = COUPONS[coupon] || 0;
    const discount = Math.round(itemsTotal * rate);
    const payable = itemsTotal - discount;
    const shipping = payable === 0 || payable >= FREE_SHIPPING_ABOVE ? 0 : SHIPPING_FEE;
    return {
      count: items.reduce((n, i) => n + i.quantity, 0),
      itemsTotal,
      savings,
      discount,
      shipping,
      total: payable + shipping,
    };
  }, [items, coupon]);

  const value = useMemo(
    () => ({ items, coupon, add, remove, setQuantity, clear, applyCoupon, removeCoupon: () => setCoupon(''), totals }),
    [items, coupon, add, remove, setQuantity, clear, applyCoupon, setCoupon, totals]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
};
