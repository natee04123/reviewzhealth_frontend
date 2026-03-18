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

function FacebookLogo() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#1877F2"/>
    </svg>
  );
}

function YelpLogo() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M20.16 12.73l-4.703 1.14c-.53.13-.983-.4-.783-.912l1.73-4.573c.19-.5.85-.577 1.15-.13l2.97 4.3c.2.29.05.68-.28.78l-.084.024v-.53zm-7.44 2.59l-1.05 4.669c-.12.53.37.983.882.783l4.573-1.73c.5-.19.577-.85.13-1.15l-4.3-2.97c-.29-.2-.68-.05-.78.28l-.024.084.57.034zm-2.07-1.34l-4.669-1.05c-.53-.12-.983.37-.783.882l1.73 4.573c.19.5.85.577 1.15.13l2.97-4.3c.2-.29.05-.68-.28-.78l-.084-.024-.034.57zm-.57-2.07l1.05-4.669c.12-.53-.37-.983-.882-.783L5.685 8.19c-.5.19-.577.85-.13 1.15l4.3 2.97c.29.2.68.05.78-.28l.024-.084-.57-.034zm2.64-6.94c0-.546-.443-.988-.988-.988H7.56c-.546 0-.988.442-.988.988v4.732c0 .546.442.988.988.988h4.182c.546 0 .988-.442.988-.988V4.97z" fill="#D32323"/>
    </svg>
  );
}

function TripadvisorLogo() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8z" fill="#00AA6C"/>
      <circle cx="8.5" cy="12" r="2.5" fill="#00AA6C"/>
      <circle cx="15.5" cy="12" r="2.5" fill="#00AA6C"/>
      <path d="M12 7c-1.5 0-2.9.5-4 1.3l1.4 1.4C10.2 9.3 11.1 9 12 9s1.8.3 2.6.7l1.4-1.4C14.9 7.5 13.5 7 12 7z" fill="#00AA6C"/>
    </svg>
  );
}

function OpenTableLogo() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="#DA3743"/>
      <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" fill="white"/>
      <circle cx="12" cy="12" r="2" fill="white"/>
    </svg>
  );
}

function UberEatsLogo() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="24" rx="4" fill="#000000"/>
      <path d="M5 8h2.5v5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V8H13v5c0 1.93-1.57 3.5-3.5 3.5S6 14.93 6 13V8H5zm9 0h5v1.5h-3.5v1h3v1.5h-3v1H19V16h-5V8z" fill="white"/>
    </svg>
  );
}

function DoorDashLogo() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="#FF3008"/>
      <path d="M7 10.5h6c1.1 0 2 .9 2 2s-.9 2-2 2H7v-4zm0-3h5.5c2.49 0 4.5 2.01 4.5 4.5S14.99 16.5 12.5 16.5H7v-9z" fill="white"/>
    </svg>
  );
}

const PLATFORMS = [
  {
    key: 'google',
    name: 'Google Business Profile',
    description: 'Sync reviews from Google Maps and Google Search. Respond to reviews directly from reviewzhealth.',
    Logo: GoogleLogo,
    bg: '#EBF3FE',
    border: '#A8C7FA',
    status: 'available',
    features: ['Read all reviews', 'Post owner replies', 'Real-time notifications', 'Multi-location support'],
  },
  {
    key: 'facebook',
    name: 'Facebook',
    description: 'Manage reviews and recommendations from your Facebook Business Page.',
    Logo: FacebookLogo,
    bg: '#EBF3FE',
    border: '#A8C7FA',
    status: 'coming_soon',
    eta: 'Q2 2026',
    features: ['Read page reviews', 'Post owner replies', 'Recommendation tracking'],
  },
  {
    key: 'yelp',
    name: 'Yelp',
    description: 'Monitor and respond to Yelp reviews. Critical for restaurants, salons, and local businesses.',
    Logo: YelpLogo,
    bg: '#FDEAEA',
    border: '#F5A5A5',
    status: 'coming_soon',
    eta: 'Q2 2026',
    features: ['Read reviews', 'Post owner replies', 'Rating trend tracking'],
  },
  {
    key: 'tripadvisor',
    name: 'Tripadvisor',
    description: 'Stay on top of Tripadvisor reviews for restaurants, hotels, and attractions.',
    Logo: TripadvisorLogo,
    bg: '#E6F7F2',
    border: '#80D4B8',
    status: 'coming_soon',
    eta: 'Q3 2026',
    features: ['Read reviews', 'Post management responses', 'Hospitality insights'],
  },
  {
    key: 'opentable',
    name: 'OpenTable',
    description: 'Manage verified diner reviews from OpenTable reservations.',
    Logo: OpenTableLogo,
    bg: '#FDEAEA',
    border: '#F5A5A5',
    status: 'coming_soon',
    eta: 'Q3 2026',
    features: ['Verified diner reviews', 'Reservation-linked feedback', 'Response management'],
  },
  {
    key: 'ubereats',
    name: 'Uber Eats',
    description: 'Track your Uber Eats ratings and customer feedback across all your delivery locations.',
    Logo: UberEatsLogo,
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
    Logo: DoorDashLogo,
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

      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 400, marginBottom: 6 }}>
          Integrations
        </h1>
        <p style={{ color: 'var(--ink-2)', fontSize: 15 }}>
          Connect your review platforms. reviewzhealth centralizes all your customer feedback in one place.
        </p>
      </div>

      {/* Available */}
      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.07em',
        textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 12 }}>
        Available now
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 40 }}>
        {connected.map(platform => {
          const { Logo } = platform;
          return (
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
                    <Logo />
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
                    <button onClick={() => window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/google`} style={{
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
          );
        })}
      </div>

      {/* Coming soon */}
      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.07em',
        textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 12 }}>
        Coming soon
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {coming.map(platform => {
          const { Logo } = platform;
          const isNotified = notifyList.includes(platform.key);
          return (
            <div key={platform.key} style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)', padding: '20px 24px',
              boxShadow: 'var(--shadow-sm)', opacity: 0.85,
              position: 'relative', overflow: 'hidden',
            }}>
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
                  filter: 'grayscale(20%)',
                }}>
                  <Logo />
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
