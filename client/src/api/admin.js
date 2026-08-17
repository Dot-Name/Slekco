import { api, toQuery } from './client.js';

const BASE = import.meta.env.VITE_API_URL || '/api';

/* Every call here needs an admin Bearer token — pass the token from useAuth(). */

export const fetchStats = (token, opts) => api.get('/admin/stats', { ...opts, token });

export const fetchAdminProducts = (params, token, opts) =>
  api.get(`/admin/products${toQuery(params)}`, { ...opts, token });

export const createProduct = (payload, token) => api.post('/products', payload, { token });
export const updateProduct = (id, payload, token) => api.put(`/products/${id}`, payload, { token });
export const deleteProduct = (id, token) => api.del(`/products/${id}`, { token });

export const createCategory = (payload, token) => api.post('/categories', payload, { token });
export const updateCategory = (id, payload, token) => api.put(`/categories/${id}`, payload, { token });
export const deleteCategory = (id, token) => api.del(`/categories/${id}`, { token });

export const fetchAdminOrders = (params, token, opts) =>
  api.get(`/orders${toQuery(params)}`, { ...opts, token });
export const setOrderStatus = (id, status, token) =>
  api.patch(`/orders/${id}/status`, { status }, { token });

export const fetchMessages = (token, opts) => api.get('/contact', { ...opts, token });
export const markMessageRead = (id, token) => api.patch(`/contact/${id}/read`, {}, { token });

/**
 * Image upload is multipart, so it bypasses the JSON client.
 * Returns the public URLs the API stored the files at.
 */
export async function uploadImages(files, token) {
  const form = new FormData();
  Array.from(files).forEach((f) => form.append('images', f));

  const res = await fetch(`${BASE}/admin/uploads`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'The upload did not go through.');
  return data.urls;
}
