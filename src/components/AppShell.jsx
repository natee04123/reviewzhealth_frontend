// src/components/AppShell.jsx
import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { api } from '../lib/api.js';

const NAV = [
  { to: '/dashboard',           icon: '◈', label: 'Reviews' },
  { to: '/dashboard/locations', icon: '⊡', label: 'Locations' },
  { to: '/dashboard/settings',  icon: '◎', label: 'Settings' },
];

export default function AppShell({ user }) {
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    await api.logout().catch(() => {});
    navigate('/');
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* ── Sidebar ─────────────────────────────────────────── */}
      <aside style={{
        width: 220,
        background: 'var(--ink)',
        color: '#F7F5F0',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        position: 'sticky',
        top: 0,
        height: '100vh',
      }}>
        {/* Logo */}
        <div style={{ padding: '28px 24px 20px' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, lineHeight: 1, letterSpacing: '-0.01em' }}>
            <span style={{ color: '#F7F5F0' }}>reviewz</span><span style={{ color: '#5DCAA5' }}>health</span>
          </div>
          <div style={{ fontSize: 11, color: 'rgba(247,245,240,0.35)', marginTop: 6, letterSpacing: '0.05em' }}>
            POWERED BY CLAUDE AI
          </div>
        </div>

        {/* Nav links */}
        <nav style={{ flex: 1, padding: '8px 12px' }}>
          {NAV.map(({ to, icon, label }) => (
            <NavLink key={to} to={to} end={to === '/dashboard'} style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 12px', borderRadius: 'var(--radius-md)',
              fontSize: 14, fontWeight: 400,
              color: isActive ? '#F7F5F0' : 'rgba(247,245,240,0.5)',
              background: isActive ? 'rgba(247,245,240,0.1)' : 'transparent',
              marginBottom: 2, transition: 'all 0.15s',
            })}>
              <span style={{ fontSize: 16, opacity: 0.8 }}>{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User + logout */}
        <div style={{
          padding: '16px 16px 24px',
          borderTop: '1px solid rgba(247,245,240,0.1)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            {user?.avatar_url
              ? <img src={user.avatar_url} alt="" width={32} height={32}
                  style={{ borderRadius: '50%', objectFit: 'cover' }} />
              : <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: 'rgba(247,245,240,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, color: '#F7F5F0',
                }}>
                  {(user?.name ?? 'U')[0]}
                </div>
            }
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13, color: '#F7F5F0', fontWeight: 500,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.name ?? 'Owner'}
              </div>
              <div style={{ fontSize: 11, color: 'rgba(247,245,240,0.4)',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.email}
              </div>
            </div>
          </div>
          <button onClick={handleLogout} disabled={loggingOut} style={{
            width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-sm)',
            fontSize: 13, color: 'rgba(247,245,240,0.5)',
            border: '1px solid rgba(247,245,240,0.12)',
            background: 'transparent', transition: 'all 0.15s',
          }}>
            {loggingOut ? 'Signing out…' : 'Sign out'}
          </button>
        </div>
      </aside>

      {/* ── Main content ────────────────────────────────────── */}
      <main style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <Outlet />
      </main>
    </div>
  );
}
