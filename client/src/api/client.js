const BASE = import.meta.env.VITE_API_URL || '/api';

export class ApiError extends Error {
  constructor(message, status, errors) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

async function request(path, { method = 'GET', body, token, signal } = {}) {
  let res;
  try {
    res = await fetch(`${BASE}${path}`, {
      method,
      signal,
      headers: {
        ...(body && { 'Content-Type': 'application/json' }),
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      ...(body && { body: JSON.stringify(body) }),
    });
  } catch (err) {
    if (err.name === 'AbortError') throw err;
    throw new ApiError('Could not reach the Slekco API. Check that the server is running on port 5000.', 0);
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(data.message || 'That request did not go through.', res.status, data.errors);
  return data;
}

export const api = {
  get: (path, opts) => request(path, opts),
  post: (path, body, opts) => request(path, { ...opts, method: 'POST', body }),
  put: (path, body, opts) => request(path, { ...opts, method: 'PUT', body }),
  patch: (path, body, opts) => request(path, { ...opts, method: 'PATCH', body }),
  del: (path, opts) => request(path, { ...opts, method: 'DELETE' }),
};

/** Turns { category: 'fashion', page: 2 } into '?category=fashion&page=2'. */
export const toQuery = (params = {}) => {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '' && v !== 'all') search.set(k, v);
  });
  const str = search.toString();
  return str ? `?${str}` : '';
};
