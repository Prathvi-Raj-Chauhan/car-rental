const BASE = '/api';
const getToken = () => localStorage.getItem('token');

export const api = {
  async request(path, options = {}) {
    const headers = { ...options.headers };
    if (!headers['Content-Type'] && !(options.body instanceof FormData)) headers['Content-Type'] = 'application/json';
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(BASE + path, { ...options, headers });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || 'Request failed');
    return data;
  },
  auth: {
    login: (body) => api.request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
    getMe: () => api.request('/auth/me'),
  },
  categories: {
    getAll: () => api.request('/categories'),
    create: (body) => api.request('/categories', { method: 'POST', body: JSON.stringify(body) }),
    update: (id, body) => api.request('/categories/' + id, { method: 'PUT', body: JSON.stringify(body) }),
    delete: (id) => api.request('/categories/' + id, { method: 'DELETE' }),
  },
  cars: {
    getAll: (params) => api.request('/cars' + (params ? '?' + new URLSearchParams(params).toString() : '')),
    getOne: (id) => api.request('/cars/' + id),
    create: (formData) => api.request('/cars', { method: 'POST', body: formData }),
    update: (id, formData) => api.request('/cars/' + id, { method: 'PUT', body: formData }),
    delete: (id) => api.request('/cars/' + id, { method: 'DELETE' }),
  },
  bookings: {
    getAll: () => api.request('/bookings'),
    updateStatus: (id, status) => api.request('/bookings/' + id + '/status', { method: 'PUT', body: JSON.stringify({ status }) }),
  },
  users: {
    getAll: () => api.request('/users'),
    getOne: (id) => api.request('/users/' + id),
    update: (id, body) => api.request('/users/' + id, { method: 'PUT', body: JSON.stringify(body) }),
    delete: (id) => api.request('/users/' + id, { method: 'DELETE' }),
  },
  drivers: {
    getAll: () => api.request('/drivers'),
    verify: (id) => api.request('/drivers/' + id + '/verify', { method: 'PUT' }),
    reject: (id) => api.request('/drivers/' + id + '/reject', { method: 'PUT' }),
  },
  rides: {
    getAll: () => api.request('/rides'),
  },
};
