import React, { useState, useEffect } from 'react';
import { api } from '../lib/api.js';
import { Toast } from '../components/ui.jsx';

function GoogleLogo({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

function OpenTableLogo({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="24" rx="4" fill="#DA3743"/>
      <circle cx="4.5" cy="13" r="2.2" fill="white"/>
      <circle cx="14" cy="12" r="5.5" fill="white"/>
      <circle cx="14" cy="12" r="2.8" fill="#DA3743"/>
    </svg>
  );
}

function GrubhubLogo({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="24" rx="4" fill="#FF8000"/>
      <path d="M12 3.5L4.5 9.5H6V19.5H18V9.5H19.5L12 3.5Z" fill="white"/>
      <path d="M10 9.5V13.5C10 14.05 10.45 14.5 11 14.5V18H13V14.5C13.55 14.5 14 14.05 14 13.5V9.5H10Z" fill="#FF8000"/>
      <rect x="11" y="9.5" width="0.6" height="4" fill="white"/>
      <rect x="12.4" y="9.5" width="0.6" height="4" fill="white"/>
      <path d="M15.5 9.5V13C15.5 13.55 15.05 14 14.5 14V18H16V9.5H15.5Z" fill="#FF8000"/>
      <rect x="15.5" y="9.5" width="0.5" height="4.5" fill="white"/>
    </svg>
  );
}

function BrandLogo({ slug, color, size = 24 }) {
  return (
    <img
      src={`https://cdn.simpleicons.org/${slug}/${color.replace('#', '')}`}
      width={size} height={size} alt="" style={{ display:'block' }}
    />
  );
}

function Logo({ platform, size = 24 }) {
  if (platform.key === 'google')    return <GoogleLogo size={size} />;
  if (platform.key === 'opentable') return <OpenTableLogo size={size} />;
  if (platform.key === 'grubhub')   return <GrubhubLogo size={size} />;
  return <BrandLogo slug={platform.slug} color={platform.color} size={size} />;
}

const PLATFORMS = [
  {
    key: 'google',
    name: 'Google Business Profile',
    description: 'Sync reviews from Google Maps and Google Search. Respond directly from reviewzhealth.',
    bg: '#EBF3FE', border: '#A8C7FA',
    connectionType: 'oauth',
    features: ['Read all reviews', 'Post owner replies', 'Real-time notifications', 'Multi-location support'],
  },
  {
    key: 'facebook',
    name: 'Facebook',
    description: 'Manage reviews and recommendations from your Facebook Business Page.',
    slug: 'facebook', color: '#1877F2',
    bg: '#EBF3FE', border: '#A8C7FA',
    connectionType: 'url',
    urlLabel: 'Facebook Business Page URL',
    urlPlaceholder: 'https://www.facebook.com/yourbusiness',
    oauthNote: 'Full OAuth connection coming Q2 2026 — enter your page URL for now to enable deep linking.',
    features: ['Read page reviews', 'Copy & respond via Facebook', 'Recommendation tracking'],
  },
  {
    key: 'yelp',
    name: 'Yelp',
    description: 'Monitor and respond to Yelp reviews. Critical for restaurants and local businesses.',
    slug: 'yelp', color: '#D32323',
    bg: '#FDEAEA', border: '#F5A5A5',
    connectionType: 'url',
    urlLabel: 'Yelp Business Page URL',
    urlPlaceholder: 'https://www.yelp.com/biz/your-business',
    oauthNote: 'Full OAuth connection coming Q2 2026 — enter your Yelp URL for now to enable deep linking.',
    features: ['Read reviews', 'Copy & respond via Yelp', 'Rating trend tracking'],
  },
  {
    key: 'tripadvisor',
    name: 'Tripadvisor',
    description: 'Stay on top of Tripadvisor reviews for restaurants, hotels, and attractions.',
    slug: 'tripadvisor', color: '#00AA6C',
    bg: '#E6F7F2', border: '#80D4B8',
    connectionType: 'url',
    urlLabel: 'Tripadvisor Listing URL',
    urlPlaceholder: 'https://www.tripadvisor.com/Restaurant_Review-...',
    features: ['Read reviews', 'Copy & respond via Tripadvisor', 'Hospitality insights'],
  },
  {
    key: 'opentable',
    name: 'OpenTable',
    description: 'Manage verified diner reviews from OpenTable reservations.',
    bg: '#FDEAEA', border: '#F5A5A5',
    connectionType: 'url',
    urlLabel: 'OpenTable Restaurant URL',
    urlPlaceholder: 'https://www.opentable.com/r/your-restaurant',
    features: ['Verified diner reviews', 'Copy & respond via OpenTable', 'Reservation-linked feedback'],
  },
  {
    key: 'ubereats',
    name: 'Uber Eats',
    description: 'Track your Uber Eats ratings and customer feedback across all your delivery locations.',
    slug: 'ubereats', color: '#000000',
    bg: '#F5F5F5', border: '#CCCCCC',
    connectionType: 'url',
    urlLabel: 'Uber Eats Restaurant URL',
    urlPlaceholder: 'https://www.ubereats.com/store/your-restaurant',
    features: ['Rating monitoring', 'Copy & respond via Uber Eats', 'Delivery feedback tracking'],
  },
  {
    key: 'doordash',
    name: 'DoorDash',
    description: 'Monitor DoorDash ratings and customer feedback for your delivery presence.',
    slug: 'doordash', color: '#FF3008',
    bg: '#FFF0EE', border: '#FFBBB3',
    connectionType: 'url',
    urlLabel: 'DoorDash Restaurant URL',
    urlPlaceholder: 'https://www.doordash.com/store/your-restaurant',
    features: ['Rating monitoring', 'Copy & respond via DoorDash', 'Multi-location overview'],
  },
  {
    key: 'grubhub',
    name: 'Grubhub',
    description: 'Monitor Grubhub ratings and customer feedback for your delivery presence.',
    bg: '#FFF4E6', border: '#FFD199',
    connectionType: 'url',
    urlLabel: 'Grubhub Restaurant URL',
    urlPlaceholder: 'https://www.grubhub.com/restaurant/your-restaurant',
    features: ['Rating monitoring', 'Copy & respond via Grubhub', 'Delivery feedback tracking'],
  },
];

function ConnectModal({ platform, onSave, onClose }) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  function handleSave() {
    if (!url.trim()) { setError('Please enter a URL'); return; }
    try { new URL(url.trim()); } catch {
      setError('Please enter a valid URL including https://'); return;
    }
    onSave(url.trim());
  }

  return (
    <div
      onClick={e => e.target === e.currentTarget && onClose()}
      style={{
        position:'fixed', inset:0, background:'rgba(0,0,0,0.4)',
        display:'flex', alignItems:'center', justifyContent:'center',
        zIndex:1000, padding:24,
      }}
    >
      <div style={{
        background:'var(--bg-card)', borderRadius:'var(--radius-xl)',
        padding:'28px 32px', width:'100%', maxWidth:480,
        boxShadow:'var(--shadow-lg)',
      }}>
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
          <div style={{
            width:40, height:40, borderRadius:'var(--radius-md)',
            background:platform.bg, border:`1px solid ${platform.border}`,
            display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
          }}>
            <Logo platform={platform} size={22} />
          </div>
          <div>
            <div style={{ fontSize:15, fontWeight:500, color:'var(--ink)' }}>
              Connect {platform.name}
            </div>
            <div style={{ fontSize:12, color:'var(--ink-3)' }}>
              Enter your business profile URL
            </div>
          </div>
        </div>

        {platform.oauthNote && (
          <div style={{
            background:'var(--bg-muted)', border:'1px solid var(--border)',
            borderRadius:'var(--radius-md)', padding:'10px 14px',
            fontSize:12, color:'var(--ink-2)', marginBottom:16, lineHeight:1.5,
          }}>
            ℹ {platform.oauthNote}
          </div>
        )}

        <label style={{ fontSize:13, fontWeight:500, color:'var(--ink-2)',
          display:'block', marginBottom:6 }}>
          {platform.urlLabel}
        </label>
        <input
          type="url"
          value={url}
          onChange={e => { setUrl(e.target.value); setError(''); }}
          placeholder={platform.urlPlaceholder}
          onKeyDown={e => e.key === 'Enter' && handleSave()}
          autoFocus
          style={{
            width:'100%', padding:'10px 12px', fontSize:13,
            borderRadius:'var(--radius-md)',
            marginBottom: error ? 6 : 16,
            border:`1px solid ${error ? 'var(--red-border)' : 'var(--border)'}`,
            background:'var(--bg)', color:'var(--ink)', outline:'none',
          }}
        />
        {error && (
          <div style={{ fontSize:12, color:'var(--red)', marginBottom:12 }}>{error}</div>
        )}

        <div style={{ display:'flex', gap:8 }}>
          <button onClick={onClose} style={{
            flex:1, padding:'10px', borderRadius:'var(--radius-md)',
            background:'var(--bg-muted)', color:'var(--ink-2)',
            border:'1px solid var(--border)', fontSize:13, fontWeight:500, cursor:'pointer',
          }}>
            Cancel
          </button>
          <button onClick={handleSave} style={{
            flex:2, padding:'10px', borderRadius:'var(--radius-md)',
            background:'var(--ink)', color:'var(--bg)',
            border:'none', fontSize:13, fontWeight:500, cursor:'pointer',
          }}>
            Save & connect
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Integrations() {
  const [googleConnected, setGoogleConnected] = useState(false);
  const [connections, setConnections] = useState(() => {
    try { return JSON.parse(localStorage.getItem('rzh_connections') || '{}'); }
    catch { return {}; }
  });
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    api.getMe()
      .then(user => setGoogleConnected(!!user?.id))
      .catch(() => {});
  }, []);

  function showToast(message, type = 'success') {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }

  function saveConnection(key, url) {
    const updated = { ...connections, [key]: url };
    setConnections(updated);
    localStorage.setItem('rzh_connections', JSON.stringify(updated));
    setModal(null);
    showToast(`${PLATFORMS.find(p => p.key === key)?.name} connected`);
  }

  function disconnect(key) {
    if (!window.confirm(`Disconnect ${PLATFORMS.find(p => p.key === key)?.name}?`)) return;
    const updated = { ...connections };
    delete updated[key];
    setConnections(updated);
    localStorage.setItem('rzh_connections', JSON.stringify(updated));
    showToast(`${PLATFORMS.find(p => p.key === key)?.name} disconnected`, 'error');
  }

  function isConnected(platform) {
    if (platform.key === 'google') return googleConnected;
    return !!connections[platform.key];
  }

  const connected    = PLATFORMS.filter(p => isConnected(p));
  const notConnected = PLATFORMS.filter(p => !isConnected(p));

  return (
    <div style={{ padding:'40px 48px', maxWidth:900, margin:'0 auto', width:'100%' }}>

      <div style={{ marginBottom:32 }}>
        <h1 style={{ fontFamily:'var(--font-display)', fontSize:32, fontWeight:400, marginBottom:6 }}>
          Integrations
        </h1>
        <p style={{ color:'var(--ink-2)', fontSize:15 }}>
          Connect your review platforms. reviewzhealth centralizes all your customer feedback in one place.
        </p>
      </div>

      {connected.length > 0 && (
        <>
          <div style={{ fontSize:11, fontWeight:600, letterSpacing:'0.07em',
            textTransform:'uppercase', color:'var(--ink-3)', marginBottom:12 }}>
            Connected ({connected.length})
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:12, marginBottom:36 }}>
            {connected.map(platform => (
              <div key={platform.key} style={{
                background:'var(--bg-card)', border:'1px solid var(--green-border)',
                borderRadius:'var(--radius-lg)', padding:'20px 24px',
                boxShadow:'var(--shadow-sm)',
              }}>
                <div style={{ display:'flex', alignItems:'center',
                  justifyContent:'space-between', gap:16 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:14, flex:1, minWidth:0 }}>
                    <div style={{
                      width:46, height:46, borderRadius:'var(--radius-md)', flexShrink:0,
                      background:platform.bg, border:`1px solid ${platform.border}`,
                      display:'flex', alignItems:'center', justifyContent:'center',
                    }}>
                      <Logo platform={platform} size={24} />
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:2 }}>
                        <div style={{ fontSize:14, fontWeight:500, color:'var(--ink)' }}>
                          {platform.name}
                        </div>
                        <span style={{
                          fontSize:10, fontWeight:600, padding:'2px 7px', borderRadius:99,
                          background:'var(--green-bg)', color:'var(--green)',
                          border:'1px solid var(--green-border)', letterSpacing:'0.04em',
                        }}>
                          CONNECTED
                        </span>
                      </div>
                      {platform.key !== 'google' && connections[platform.key] && (
                        <div style={{ fontSize:12, color:'var(--ink-3)',
                          overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
                          maxWidth:400 }}>
                          {connections[platform.key]}
                        </div>
                      )}
                      {platform.key === 'google' && (
                        <div style={{ fontSize:12, color:'var(--ink-3)' }}>
                          Connected via Google OAuth
                        </div>
                      )}
                    </div>
                  </div>
                  <div style={{ display:'flex', gap:8, flexShrink:0 }}>
                    {platform.key === 'google' ? (
                      <button onClick={() => window.location.href = '/dashboard/locations'} style={{
                        padding:'8px 16px', borderRadius:'var(--radius-md)',
                        background:'var(--bg-muted)', color:'var(--ink-2)',
                        border:'1px solid var(--border)', fontSize:13,
                        fontWeight:500, cursor:'pointer',
                      }}>
                        Manage →
                      </button>
                    ) : (
                      <>
                        <button onClick={() => setModal(platform)} style={{
                          padding:'8px 14px', borderRadius:'var(--radius-md)',
                          background:'var(--bg-muted)', color:'var(--ink-2)',
                          border:'1px solid var(--border)', fontSize:12,
                          fontWeight:500, cursor:'pointer',
                        }}>
                          Edit URL
                        </button>
                        <button onClick={() => disconnect(platform.key)} style={{
                          padding:'8px 14px', borderRadius:'var(--radius-md)',
                          background:'transparent', color:'var(--red)',
                          border:'1px solid var(--red-border)', fontSize:12,
                          fontWeight:500, cursor:'pointer',
                        }}>
                          Disconnect
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {notConnected.length > 0 && (
        <>
          <div style={{ fontSize:11, fontWeight:600, letterSpacing:'0.07em',
            textTransform:'uppercase', color:'var(--ink-3)', marginBottom:12 }}>
            {connected.length > 0 ? `Add more (${notConnected.length})` : 'Available platforms'}
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            {notConnected.map(platform => (
              <div key={platform.key} style={{
                background:'var(--bg-card)', border:'1px solid var(--border)',
                borderRadius:'var(--radius-lg)', padding:'20px 24px',
                boxShadow:'var(--shadow-sm)',
              }}>
                <div style={{ display:'flex', alignItems:'flex-start', gap:14, marginBottom:12 }}>
                  <div style={{
                    width:42, height:42, borderRadius:'var(--radius-md)', flexShrink:0,
                    background:platform.bg, border:`1px solid ${platform.border}`,
                    display:'flex', alignItems:'center', justifyContent:'center',
                  }}>
                    <Logo platform={platform} size={22} />
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:14, fontWeight:500, color:'var(--ink)', marginBottom:4 }}>
                      {platform.name}
                    </div>
                    <p style={{ fontSize:12, color:'var(--ink-3)', lineHeight:1.5 }}>
                      {platform.description}
                    </p>
                  </div>
                </div>

                <div style={{ display:'flex', flexWrap:'wrap', gap:5, marginBottom:14 }}>
                  {platform.features.map(f => (
                    <span key={f} style={{
                      fontSize:10, padding:'2px 7px', borderRadius:99,
                      background:'var(--bg-muted)', color:'var(--ink-3)',
                      border:'1px solid var(--border)',
                    }}>
                      {f}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => {
                    if (platform.key === 'google') {
                      window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/google`;
                    } else {
                      setModal(platform);
                    }
                  }}
                  style={{
                    width:'100%', padding:'9px', borderRadius:'var(--radius-md)',
                    background:'var(--ink)', color:'var(--bg)',
                    border:'none', fontSize:13, fontWeight:500, cursor:'pointer',
                    display:'flex', alignItems:'center', justifyContent:'center', gap:7,
                  }}
                >
                  <Logo platform={platform} size={14} />
                  Connect {platform.name}
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {modal && (
        <ConnectModal
          platform={modal}
          onSave={(url) => saveConnection(modal.key, url)}
          onClose={() => setModal(null)}
        />
      )}

      {toast && <Toast {...toast} onDismiss={() => setToast(null)} />}
    </div>
  );
}
