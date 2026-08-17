import { api } from './client.js';

export const fetchCategories = (opts) => api.get('/categories', opts);
export const fetchCategory = (slug, opts) => api.get(`/categories/${slug}`, opts);
