// src/components/ui.jsx
// Small, reusable presentational components.

import React from 'react';

/* ── Stars ─────────────────────────────────────────────────── */
export function Stars({ rating, size = 16 }) {
  return (
    <span style={{ display: 'inline-flex', gap: 1 }} aria-label={`${rating} out of 5 stars`}>
      {[1,2,3,4,5].map(n => (
        <svg key={n} width={size} height={size} viewBox="0 0 16 16" fill={n <= rating ? '#E8A020' : 'none'}
          stroke={n <= rating ? '#E8A020' : '#C8C2B8'} strokeWidth="1.2">
          <path d="M8 1l1.85 3.75L14 5.5l-3 2.92.71 4.13L8 10.5l-3.71 1.95L5 8.42 2 5.5l4.15-.75L8 1z"/>
        </svg>
      ))}
    </span>
  );
}

/* ── Status badge ───────────────────────────────────────────── */
const BADGE_STYLES = {
  pending:   { bg: 'var(--amber-bg)',  color: 'var(--amber)',  border: 'var(--amber-border)',  label: 'Needs review' },
  approved:  { bg: 'var(--green-bg)', color: 'var(--green)',  border: 'var(--green-border)',  label: 'Approved' },
  edited:    { bg: 'var(--blue-bg)',  color: 'var(--blue)',   border: 'var(--blue-border)',   label: 'Edited' },
  posted:    { bg: 'var(--green-bg)', color: 'var(--green)',  border: 'var(--green-border)',  label: 'Posted ✓' },
  dismissed: { bg: 'var(--bg-muted)', color: 'var(--ink-3)',  border: 'var(--border)',        label: 'Dismissed' },
};

export function StatusBadge({ status }) {
  const s = BADGE_STYLES[status] ?? BADGE_STYLES.pending;
  return (
    <span style={{
      display: 'inline-block',
      padding: '3px 10px',
      borderRadius: 99,
      fontSize: 12,
      fontWeight: 500,
      background: s.bg,
      color: s.color,
      border: `1px solid ${s.border}`,
      letterSpacing: '0.01em',
    }}>
      {s.label}
    </span>
  );
}

/* ── Spinner ────────────────────────────────────────────────── */
export function Spinner({ size = 20, color = 'var(--ink-3)' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20"
      style={{ animation: 'spin 0.8s linear infinite', display: 'block' }}>
      <circle cx="10" cy="10" r="8" fill="none" stroke={color} strokeWidth="2" strokeOpacity="0.2"/>
      <path d="M10 2 a8 8 0 0 1 8 8" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

/* ── Avatar ─────────────────────────────────────────────────── */
export function Avatar({ name, photo, size = 36 }) {
  const initials = (name ?? '?').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  if (photo) {
    return <img src={photo} alt={name} width={size} height={size}
      style={{ borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />;
  }
  const hue = [...(name ?? 'U')].reduce((h, c) => h + c.charCodeAt(0), 0) % 360;
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0,
      background: `hsl(${hue} 40% 88%)`,
      color: `hsl(${hue} 40% 32%)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.38, fontWeight: 500,
    }}>
      {initials}
    </div>
  );
}

/* ── Empty state ────────────────────────────────────────────── */
export function EmptyState({ icon, title, body }) {
  return (
    <div style={{ textAlign: 'center', padding: '60px 24px' }}>
      <div style={{ fontSize: 40, marginBottom: 16 }}>{icon}</div>
      <p style={{ fontFamily: 'var(--font-display)', fontSize: 20, marginBottom: 8 }}>{title}</p>
      <p style={{ color: 'var(--ink-2)', fontSize: 15 }}>{body}</p>
    </div>
  );
}

/* ── Toast ──────────────────────────────────────────────────── */
export function Toast({ message, type = 'success', onDismiss }) {
  const colors = {
    success: { bg: 'var(--green-bg)', border: 'var(--green-border)', color: 'var(--green)' },
    error:   { bg: 'var(--red-bg)',   border: 'var(--red-border)',   color: 'var(--red)' },
    info:    { bg: 'var(--blue-bg)',  border: 'var(--blue-border)',  color: 'var(--blue)' },
  }[type];

  return (
    <div className="anim-fade-up" style={{
      position: 'fixed', bottom: 24, right: 24, zIndex: 1000,
      padding: '12px 20px', borderRadius: 'var(--radius-md)',
      background: colors.bg, border: `1px solid ${colors.border}`,
      color: colors.color, fontSize: 14, fontWeight: 500,
      boxShadow: 'var(--shadow-lg)',
      display: 'flex', alignItems: 'center', gap: 12, maxWidth: 360,
    }}>
      <span style={{ flex: 1 }}>{message}</span>
      <button onClick={onDismiss} style={{ color: colors.color, opacity: 0.6, fontSize: 18, lineHeight: 1 }}>×</button>
    </div>
  );
}
