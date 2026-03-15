// src/lib/api.js
// Thin wrapper around fetch for all backend API calls.

const BASE = '';  // same origin via Vite proxy in dev; set to API URL in prod

async function request(path, options = {}) {
  const res = await fetch(BASE + path, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...options.headers },
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
  // Auth
  getMe:       ()          => request('/auth/me'),
  logout:      ()          => request('/auth/logout', { method: 'POST' }),

  // Locations
  getLocations:          ()   => request('/api/locations'),
  syncLocations:         ()   => request('/api/locations/sync', { method: 'POST' }),
  enableNotifications:   (id) => request(`/api/locations/${id}/enable-notifications`, { method: 'POST' }),

  // Reviews
  getReviews:   (status) => request(`/api/reviews${status ? `?status=${status}` : ''}`),
  getReview:    (id)     => request(`/api/reviews/${id}`),
  approveReview:(id, editedText) =>
    request(`/api/reviews/${id}/approve`, { method: 'POST', body: { editedText } }),
  regenerate:  (id)     => request(`/api/reviews/${id}/regenerate`, { method: 'POST' }),
  dismiss:     (id)     => request(`/api/reviews/${id}/dismiss`, { method: 'POST' }),
};
