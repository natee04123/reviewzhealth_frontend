const BASE = import.meta.env.VITE_API_BASE_URL ?? '';

function getToken() {
  return localStorage.getItem('rzh_token');
}

export function saveToken(token) {
  localStorage.setItem('rzh_token', token);
}

export function clearToken() {
  localStorage.removeItem('rzh_token');
}

async function request(path, options = {}) {
  const token = getToken();
  const res = await fetch(BASE + path, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'x-auth-token': token } : {}),
      ...options.headers,
    },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error ?? `Request failed: ${res.status}`);
  }

  return res.json();
}

export const api = {
  getMe:       ()          => request('/auth/me'),
  logout:      ()          => request('/auth/logout', { method: 'POST' }),

  getLocations:        ()   => request('/api/locations'),
  syncLocations:       ()   => request('/api/locations/sync', { method: 'POST' }),
  enableNotifications: (id) => request(`/api/locations/${id}/enable-notifications`, { method: 'POST' }),

  getReviews:   (status) => request(`/api/reviews${status ? `?status=${status}` : ''}`),
  getReview:    (id)     => request(`/api/reviews/${id}`),
  approveReview:(id, editedText) =>
    request(`/api/reviews/${id}/approve`, { method: 'POST', body: { editedText } }),
  regenerate:  (id)     => request(`/api/reviews/${id}/regenerate`, { method: 'POST' }),
  dismiss:     (id)     => request(`/api/reviews/${id}/dismiss`, { method: 'POST' }),
  // Billing
  createCheckout: (plan) => request('/api/billing/checkout', { method: 'POST', body: { plan } }),
};
