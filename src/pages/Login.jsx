// src/pages/Login.jsx
import React from 'react';

export default function Login() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg)', padding: 24,
    }}>
      {/* Decorative background pattern */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0,
      }}>
        {[...Array(6)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: `${200 + i * 80}px`, height: `${200 + i * 80}px`,
            borderRadius: '50%',
            border: '1px solid rgba(28,25,21,0.04)',
            top: '50%', left: '50%',
            transform: `translate(-50%, -50%)`,
          }} />
        ))}
      </div>

      <div className="anim-fade-up" style={{
        position: 'relative', zIndex: 1,
        background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)',
        padding: '52px 48px', maxWidth: 440, width: '100%',
        boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border)',
        textAlign: 'center',
      }}>
        {/* Wordmark */}
        <div style={{ marginBottom: 8 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 42, fontWeight: 400, lineHeight: 1, letterSpacing: '-0.01em' }}>
            <span style={{ color: 'var(--ink)' }}>reviewz</span><span style={{ color: '#1A6B4A' }}>health</span>
          </div>
          <div style={{
            display: 'inline-block', marginTop: 10,
            fontSize: 11, letterSpacing: '0.1em', color: 'var(--ink-3)',
            textTransform: 'uppercase',
          }}>
            Powered by Claude AI
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: 'var(--border)', margin: '28px 0' }} />

        <p style={{ color: 'var(--ink-2)', fontSize: 15, lineHeight: 1.6, marginBottom: 32 }}>
          AI drafts responses to your Google reviews. You approve, edit, and post — in seconds.
        </p>

        {/* Feature pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginBottom: 36 }}>
          {['Auto-drafted replies', 'Tone adapts to rating', 'One-click approval', 'Posts to Google'].map(f => (
            <span key={f} style={{
              padding: '5px 12px', borderRadius: 99,
              background: 'var(--bg-muted)', border: '1px solid var(--border)',
              fontSize: 12, color: 'var(--ink-2)',
            }}>{f}</span>
          ))}
        </div>

        {/* Google Sign In */}
        <a href={${import.meta.env.VITE_API_BASE_URL ?? ''}/auth/google} style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
          padding: '14px 24px', borderRadius: 'var(--radius-md)',
          background: 'var(--ink)', color: '#F7F5F0',
          fontSize: 15, fontWeight: 500,
          boxShadow: 'var(--shadow-sm)',
          transition: 'opacity 0.15s',
        }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
          <GoogleIcon />
          Sign in with Google
        </a>

        <p style={{ marginTop: 20, fontSize: 12, color: 'var(--ink-3)', lineHeight: 1.6 }}>
          We request access to your Google Business Profile<br/>to read reviews and post replies on your behalf.
        </p>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18">
      <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/>
      <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/>
      <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z"/>
      <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z"/>
    </svg>
  );
}
