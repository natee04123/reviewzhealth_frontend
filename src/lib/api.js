import {
  isDemoMode, DEMO_USER, DEMO_LOCATIONS,
  DEMO_REVIEWS, DEMO_ANALYTICS, DEMO_BILLING,
} from '../demo.js';

const BASE = import.meta.env.VITE_API_BASE_URL;

function getToken() {
  return localStorage.getItem('rzh_token');
}

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': getToken() || '',
      ...(options.headers || {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || 'Request failed');
  }
  return res.json();
}

export const api = {
// Auth
  getMe: () => {
    if (isDemoMode()) return Promise.resolve(DEMO_USER);
    return request('/auth/me');
  },
  logout: () => {
    if (isDemoMode()) return Promise.resolve();
    return request('/auth/logout', { method: 'POST' });
  },

  // Locations
  getLocations: () => {
    if (isDemoMode()) return Promise.resolve(DEMO_LOCATIONS);
    return request('/api/locations');
  },
  syncLocations: () => {
    if (isDemoMode()) return Promise.resolve(DEMO_LOCATIONS);
    return request('/api/locations/sync', { method: 'POST' });
  },
  enableNotifications: (id) => {
    if (isDemoMode()) return Promise.resolve({ ok: true });
    return request(`/api/locations/${id}/enable-notifications`, { method: 'POST' });
  },

  // Reviews
  getReviews: (params = {}) => {
    if (isDemoMode()) {
      let reviews = [...DEMO_REVIEWS];
      if (params.status) reviews = reviews.filter(r => r.draft_status === params.status);
      return Promise.resolve(reviews);
    }
    const q = new URLSearchParams(params).toString();
    return request(`/api/reviews${q ? '?' + q : ''}`);
  },
  getReview: (id) => {
    if (isDemoMode()) return Promise.resolve(DEMO_REVIEWS.find(r => r.id === id));
    return request(`/api/reviews/${id}`);
  },
  approveReview: (id) => {
    if (isDemoMode()) return Promise.resolve({ ok: true });
    return request(`/api/reviews/${id}/approve`, { method: 'POST' });
  },
  editReview: (id, text) => {
    if (isDemoMode()) return Promise.resolve({ ok: true });
    return request(`/api/reviews/${id}/edit`, { method: 'POST', body: { text } });
  },
  dismissReview: (id) => {
    if (isDemoMode()) return Promise.resolve({ ok: true });
    return request(`/api/reviews/${id}/dismiss`, { method: 'POST' });
  },
  regenerateReview: (id) => {
    if (isDemoMode()) return Promise.resolve({ draft_text: DEMO_REVIEWS.find(r => r.id === id)?.draft_text });
    return request(`/api/reviews/${id}/regenerate`, { method: 'POST' });
  },

  // Analytics
  getAnalytics: () => {
    if (isDemoMode()) return Promise.resolve(DEMO_ANALYTICS);
    return request('/api/analytics');
  },

  // Billing
  getPlans:         ()                        => request('/api/billing/plans'),
  getBillingStatus: () => {
    if (isDemoMode()) return Promise.resolve(DEMO_BILLING);
    return request('/api/billing/status');
  },
  createCheckout: (locationCount, interval) =>
    request('/api/billing/checkout', { method: 'POST', body: { locationCount, interval } }),
};
