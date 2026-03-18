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
      if (params.status === 'pending') {
        reviews = reviews.filter(r => r.draft_status === 'pending');
      } else if (params.status === 'posted') {
        reviews = reviews.filter(r => r.draft_status === 'posted');
      } else if (params.status === 'dismissed') {
        reviews = reviews.filter(r => r.draft_status === 'dismissed');
      }
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
    if (isDemoMode()) {
      const alternatives = {
        r1: "Sarah, thank you for the kind words! Our green chile is made fresh every single day and it means so much to hear it shows. The carne adovada plate is definitely one of our favorites too. We look forward to seeing you again soon! — The Mesa Group Downtown Team",
        r2: "James, we are truly sorry for your experience and want to make this right. A 40-minute wait with no communication is unacceptable regardless of how busy we are. We have shared your feedback with our Sugarhouse management team directly. Please email us at sugarhouse@mesagrouputah.com and we will take care of you personally on your next visit. — Mesa Group",
        r3: "Thank you Emily! We are so glad the enchiladas were a hit. The green chile sauce really is something special. We appreciate the parking feedback — we are looking at ways to make the lunch experience smoother. Hope to see you back soon! — The Mesa Group Provo Team",
        r5: "Rachel, we are so sorry. A wrong order AND unreachable phones is a failure on our part and we own it completely. Please contact us at sugarhouse@mesagrouputah.com with your details and we will issue a full refund and make sure your next visit is on us. Thank you for the patience. — Mesa Group",
      };
      return Promise.resolve({ draft_text: alternatives[id] ?? 'We appreciate your feedback and look forward to serving you again soon. — The Mesa Group Team' });
    }
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
