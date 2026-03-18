import React, { useState, useEffect } from 'react';
import { api } from '../lib/api.js';
import { Toast } from '../components/ui.jsx';

function GoogleLogo() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

function BrandLogo({ slug, color, size = 24 }) {
  return (
    <img
      src={`https://cdn.simpleicons.org/${slug}/${color.replace('#', '')}`}
      width={size}
      height={size}
      alt=""
      style={{ display: 'block' }}
    />
  );
}

const PLATFORMS = [
  {
    key: 'google',
    name: 'Google Business Profile',
    description: 'Sync reviews from Google Maps and Google Search. Respond to reviews directly from reviewzhealth.',
    logoType: 'custom',
    bg: '#EBF3FE',
    border: '#A8C7FA',
    status: 'available',
    features: ['Read all reviews', 'Post owner replies', 'Real-time notifications', 'Multi-location support'],
  },
  {
    key: 'facebook',
    name: 'Facebook',
    description: 'Manage reviews and recommendations from your Facebook Business Page.',
    logoType: 'brand', slug: 'facebook', color: '#1877F2',
    bg: '#EBF3FE', border: '#A8C7FA',
    status: 'coming_soon', eta: 'Q2 2026',
    features: ['Read page reviews', 'Post owner replies', 'Recommendation tracking'],
  },
  {
    key: 'yelp',
    name: 'Yelp',
    description: 'Monitor and respond to Yelp reviews. Critical for restaurants, salons, and local businesses.',
    logoType: 'brand', slug: 'yelp', color: '#D32323',
    bg: '#FDEAEA', border: '#F5A5A5',
    status: 'coming_soon', eta: 'Q2 2026',
    features: ['Read reviews', 'Post owner replies', 'Rating trend tracking'],
  },
  {
    key: 'tripadvisor',
    name: 'Tripadvisor',
    description: 'Stay on top of Tripadvisor reviews for restaurants, hotels, and attractions.',
    logoType: 'brand', slug: 'tripadvisor', color: '#00AA6C',
    bg: '#E6F7F2', border: '#80D4B8',
    status: 'coming_soon', eta: 'Q3 2026',
    features: ['Read reviews', 'Post management responses', 'Hospitality insights'],
  },
  {
    key: 'opentable',
    name: 'OpenTable',
    description: 'Manage verified diner reviews from OpenTable reservations.',
    logoType: 'brand', slug: 'opentable', color: '#DA3743',
    bg: '#FDEAEA', border: '#F5A5A5',
    status: 'coming_soon', eta: 'Q3 2026',
    features: ['Verified diner reviews', 'Reservation-linked feedback', 'Response management'],
  },
  {
    key: 'ubereats',
    name: 'Uber Eats',
    description: 'Track your Uber Eats ratings and customer feedback across all your delivery locations.',
    logoType: 'brand', slug: 'ubereats', color: '#000000',
    bg: '#F5F5F5', border: '#CCCCCC',
    status: 'coming_soon', eta: 'Q4 2026',
    features: ['Rating monitoring', 'Delivery feedback tracking', 'Analytics dashboard'],
  },
  {
    key: 'doordash',
    name: 'DoorDash',
    description: 'Monitor DoorDash ratings and customer feedback for your delivery presence.',
    logoType: 'brand', slug: 'doordash', color: '#FF3008',
    bg: '#FFF0EE', border: '#FFBBB3',
    status: 'coming_soon', eta: 'Q4 2026',
    features: ['Rating monitoring', 'Customer feedback tracking', 'Multi-location overview'],
  },
];

function Logo({ platform, size = 24 }) {
  if (platform.logoType === 'custom') return <GoogleLogo />;
  return <BrandLogo slug={platform.slug} color={platform.color} size={size} />;
}

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
      if (!prev.includes(key)) {
        showToast(`We'll notify you when ${PLATFORMS.find(p => p.key === key)?.name} launches`);
      }
      return updated;
    });
  }

  const available = PLATFORMS.filter(p => p.status === 'available');
  const coming    = PLATFORMS.filter(p => p.status === 'coming_soon');

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

      {/* Available now */}
      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.07em',
        textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 12 }}>
        Available now
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 40 }}>
        {available.map(platform => (
          <div key={platform.key} style={{
            background: 'var(--bg-card)',
            border: `1px solid ${googleConnected ? 'var(--green-border)' : 'var(--border)'}`,
            borderRadius: 'var(--radius-lg)', padding: '20px 24px',
            boxShadow: 'var(--shadow-sm)',
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, flex: 1 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 'var(--radius-md)', flexShrink: 0,
                  background: platform.bg, border: `1px solid ${platform.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Logo platform={platform} size={26} />
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
                  <button onClick={() => window.location.href = '/dashboard/locations'} style={{
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
                    <GoogleLogo /> Connect Google
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
              position: 'relative',
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
                }}>
                  <Logo platform={platform} size={22} />
                </div>
                <div style={{ flex: 1, minWidth: 0, paddingRight: 56 }}>
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

              <button onClick={() => toggleNotify(platform.key)} style={{
                width: '100%', padding: '8px', borderRadius: 'var(--radius-md)',
                fontSize: 12, fontWeight: 500, cursor: 'pointer',
                border: `1px solid ${isNotified ? 'var(--green-border)' : 'var(--border)'}`,
                background: isNotified ? 'var(--green-bg)' : 'var(--bg)',
                color: isNotified ? 'var(--green)' : 'var(--ink-3)',
                transition: 'all 0.15s',
              }}>
                {isNotified ? '✓ Notified' : '🔔 Notify me when available'}
              </button>
            </div>
          );
        })}
      </div>

      {toast && <Toast {...toast} onDismiss={() => setToast(null)} />}
    </div>
  );
}
