const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers
    }
  });

  const payload = response.status === 204 ? null : await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(payload?.message || 'Request failed.');
    error.status = response.status;
    error.errors = payload?.errors || {};
    throw error;
  }
  return payload;
}

export const userApi = {
  list: (search = '') => request(`/users?search=${encodeURIComponent(search)}`),
  get: (id) => request(`/users/${id}`),
  create: (data) => request('/users', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  remove: (id) => request(`/users/${id}`, { method: 'DELETE' })
};
