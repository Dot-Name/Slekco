import { api, toQuery } from './client.js';

export const fetchProducts = (params, opts) => api.get(`/products${toQuery(params)}`, opts);
export const fetchTrending = (limit = 8, opts) => api.get(`/products/trending?limit=${limit}`, opts);
export const fetchBrands = (opts) => api.get('/products/brands', opts);
export const fetchProduct = (idOrSlug, opts) => api.get(`/products/${idOrSlug}`, opts);
export const fetchRelated = (idOrSlug, opts) => api.get(`/products/${idOrSlug}/related`, opts);
