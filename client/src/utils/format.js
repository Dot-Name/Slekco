const inr = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

export const formatPrice = (value = 0) => inr.format(Math.round(value));

export const discountPercent = (price, mrp) =>
  !mrp || mrp <= price ? 0 : Math.round(((mrp - price) / mrp) * 100);

export const classNames = (...parts) => parts.filter(Boolean).join(' ');

// Category accent, with a graceful default for products whose category
// has not loaded yet.
export const accentOf = (product) => product?.category?.accent || '#14161A';

export const pluralize = (count, word) => `${count} ${word}${count === 1 ? '' : 's'}`;
