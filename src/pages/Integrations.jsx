import React, { useState, useEffect } from 'react';
import { api } from '../lib/api.js';
import { Toast } from '../components/ui.jsx';

const PLATFORMS = [
  {
    key: 'google',
    name: 'Google Business Profile',
    description: 'Sync reviews from Google Maps and Google Search. Respond to reviews directly from reviewzhealth.',
    icon: '🔵',
    color: '#4285F4',
    bg: '#EBF3FE',
    border: '#A8C7FA',
    status: 'available',
    features: ['Read all reviews', 'Post owner replies', 'Real-time notifications via Pub/Sub', 'Multi-location support'],
  },
  {
    key: 'facebook',
    name: 'Facebook',
    description: 'Manage reviews and recommendations from your Facebook Business Page.',
    icon: '🔷',
    color: '#1877F2',
    bg: '#EBF3FE',
    border: '#A8C7FA',
    status: 'coming_soon',
    eta: 'Q2 2026',
    features: ['Read page reviews', 'Post owner replies', 'Recommendation tracking'],
  },
  {
    key: 'yelp',
    name: 'Yelp',
    description: 'Monitor and respond to Yelp reviews. Critical for restaurants, salons, and local service businesses.',
    icon: '🔴',
    color: '#D32323',
    bg: '#FDEAEA',
    border: '#F5A5A5',
    status: 'coming_soon',
    eta: 'Q2 2026',
    features: ['Read reviews', 'Post owner replies via Yelp Partner API', 'Rating trend tracking'],
  },
  {
    key: 'tripadvisor',
    name: 'Tripadvisor',
    description: 'Stay on top of Tripadvisor reviews for restaurants, hotels, and attractions.',
    icon: '🟢',
    color: '#00AA6C',
    bg: '#E6F7F2',
    border: '#80D4B8',
    status: 'coming_soon',
    eta: 'Q3 2026',
    features: ['Read reviews', 'Post management responses', 'Hospitality-focused insights'],
  },
  {
    key: 'opentable',
    name: 'OpenTable',
    description: 'Manage verified diner reviews from OpenTable reservations.',
    icon: '🟠',
    color: '#DA3743',
    bg: '#FDEAEA',
    border: '#F5A5A5',
    status: 'coming_soon',
    eta: 'Q3 2026',
    features: ['Verified diner reviews only', 'Reservation-linked feedback', 'Response management'],
  },
  {
    key: 'ubereats',
    name: 'Uber Eats',
    description: 'Track your Uber Eats ratings and customer feedback across all your delivery locations.',
    icon: '⬛',
    color: '#000000',
    bg: '#F5F5F5',
    border: '#CCCCCC',
    status: 'coming_soon',
    eta: 'Q4 2026',
    features: ['Rating monitoring', 'Delivery feedback tracking', 'Analytics dashboard'],
  },
  {
    key: 'doordash',
    name: 'DoorDash',
    description: 'Monitor DoorDash ratings and customer feedback for your delivery presence.',
    icon: '🔴',
    color: '#FF3008',
    bg: '#FFF0EE',
    border: '#FFBBB3',
    status: 'coming_soon',
    eta: 'Q4 2026',
    features: ['Rating monitoring', 'Customer feedback tracking', 'Multi-location overview'],
  },
];

export default function Integrations() {
  const [googleConnected, setGoogleConnected] = useState(false);
  const [toast, setToast] = useState(null);
  const [notifyList, setNotifyList] = useState(() => {
    try { return JSON.parse(localStorage.getItem('rzh_notify') || '[]'); }
    catch { return []; }
  });

  useEffect(() => {
    api.getMe()
      .then(user => setGoogleConnected(!!user?.id))
      .catch(() => {});
  }, []);

  function showToast(message, type = 'success') {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }

  function toggleNotify(key) {
    setNotifyList(prev => {
      const updated = prev.includes(key)
        ? prev.filter(k => k !== key)
        : [...prev, key];
      localStorage.setItem('rzh_notify', JSON.stringify(updated));
      if (!prev.includes(key)) showToast(`We'll notify you when ${PLATFORMS.find(p => p.key === key)?.name} launches`);
      return updated;
    });
  }

  const connected = PLATFORMS.filter(p => p.status === 'available');
  const coming = PLATFORMS.filter(p => p.status === 'coming_soon');

  return (
    <div style={{ padding: '40px 48px', maxWidth: 900, margin: '0 auto', width: '100%' }}>

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 400, marginBottom: 6 }}>
          Integrations
        </h1>
        <p style={{ color: 'var(--ink-2)', fontSize: 15 }}>
          Connect your review platforms. reviewzhealth centralizes all your customer feedback in one place.
        </p>
      </div>

      {/* Connected platforms */}
      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.07em',
        textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 12 }}>
        Available now
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 40 }}>
        {connected.map(platform => (
          <div key={platform.key} style={{
            background: 'var(--bg-card)', border: `1px solid ${googleConnected ? 'var(--green-border)' : 'var(--border)'}`,
            borderRadius: 'var(--radius-lg)', padding: '20px 24px',
            boxShadow: 'var(--shadow-sm)',
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, flex: 1 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 'var(--radius-md)', flexShrink: 0,
                  background: platform.bg, border: `1px solid ${platform.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
                }}>
                  {platform.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--ink)' }}>
                      {platform.name}
                    </div>
                    {googleConnected && (
                      <span style={{
                        fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 99,
                        background: 'var(--green-bg)', color: 'var(--green)',
                        border: '1px solid var(--green-border)', letterSpacing: '0.04em',
                      }}>
                        CONNECTED
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--ink-2)', marginBottom: 12, lineHeight: 1.5 }}>
                    {platform.description}
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {platform.features.map(f => (
                      <span key={f} style={{
                        fontSize: 11, padding: '3px 9px', borderRadius: 99,
                        background: 'var(--bg-muted)', color: 'var(--ink-3)',
                        border: '1px solid var(--border)',
                      }}>
                        ✓ {f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div style={{ flexShrink: 0 }}>
                {googleConnected ? (
                  <button
                    onClick={() => window.location.href = '/dashboard/locations'}
                    style={{
                      padding: '9px 18px', borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-muted)', color: 'var(--ink-2)',
                      fontSize: 13, fontWeight: 500,
                      border: '1px solid var(--border)', cursor: 'pointer',
                    }}>
                    Manage →
                  </button>
                ) : (
                  <button
                    onClick={() => window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/google`}
                    style={{
                      padding: '9px 18px', borderRadius: 'var(--radius-md)',
                      background: '#4285F4', color: '#fff',
                      fontSize: 13, fontWeight: 500,
                      border: 'none', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: 8,
                    }}>
                    <span style={{ fontSize: 15 }}>G</span> Connect Google
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Coming soon */}
      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.07em',
        textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 12 }}>
        Coming soon
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {coming.map(platform => {
          const isNotified = notifyList.includes(platform.key);
          return (
            <div key={platform.key} style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)', padding: '20px 24px',
              boxShadow: 'var(--shadow-sm)', opacity: 0.85,
              position: 'relative', overflow: 'hidden',
            }}>
              {/* ETA badge */}
              <div style={{
                position: 'absolute', top: 14, right: 14,
                fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 99,
                background: 'var(--bg-muted)', color: 'var(--ink-3)',
                border: '1px solid var(--border)', letterSpacing: '0.04em',
              }}>
                {platform.eta}
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 12 }}>
                <div style={{
                  width: 42, height: 42, borderRadius: 'var(--radius-md)', flexShrink: 0,
                  background: platform.bg, border: `1px solid ${platform.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 20, filter: 'grayscale(30%)',
                }}>
                  {platform.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0, paddingRight: 60 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink)', marginBottom: 4 }}>
                    {platform.name}
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--ink-3)', lineHeight: 1.5 }}>
                    {platform.description}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 14 }}>
                {platform.features.map(f => (
                  <span key={f} style={{
                    fontSize: 10, padding: '2px 7px', borderRadius: 99,
                    background: 'var(--bg-muted)', color: 'var(--ink-3)',
                    border: '1px solid var(--border)',
                  }}>
                    {f}
                  </span>
                ))}
              </div>

              <button
                onClick={() => toggleNotify(platform.key)}
                style={{
                  width: '100%', padding: '8px', borderRadius: 'var(--radius-md)',
                  fontSize: 12, fontWeight: 500, cursor: 'pointer',
                  border: `1px solid ${isNotified ? 'var(--green-border)' : 'var(--border)'}`,
                  background: isNotified ? 'var(--green-bg)' : 'var(--bg)',
                  color: isNotified ? 'var(--green)' : 'var(--ink-3)',
                  transition: 'all 0.15s',
                }}>
                {isNotified ? '✓ Notify me when available' : '🔔 Notify me when available'}
              </button>
            </div>
          );
        })}
      </div>

      {toast && <Toast {...toast} onDismiss={() => setToast(null)} />}
    </div>
  );
}
