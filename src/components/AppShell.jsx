import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { api } from '../lib/api.js';
import { isDemoMode, enableDemoMode, disableDemoMode } from '../demo.js';

const NAV = [
  { to: '/dashboard',              icon: '◈', label: 'Reviews',      roles: ['owner', 'manager'] },
  { to: '/dashboard/analytics',    icon: '◉', label: 'Health',       roles: ['owner', 'manager'] },
  { to: '/dashboard/goals',        icon: '◎', label: 'Goals',        roles: ['owner', 'manager'] },
  { to: '/dashboard/locations',    icon: '⊡', label: 'Locations',    roles: ['owner', 'manager'] },
  { to: '/dashboard/team',         icon: '◎', label: 'Team',         roles: ['owner'] },
  { to: '/dashboard/billing',      icon: '◎', label: 'Billing',      roles: ['owner'] },
  { to: '/dashboard/integrations', icon: '⬡', label: 'Integrations', roles: ['owner'] },
  { to: '/dashboard/settings',     icon: '◌', label: 'Settings',     roles: ['owner'] },
];

export default function AppShell({ user }) {
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);
  const demo = isDemoMode();

  const role = demo ? 'owner' : (user?.member_role ?? user?.role ?? 'owner');
  const visibleNav = NAV.filter(item => item.roles.includes(role));

 async function handleLogout() {
    setLoggingOut(true);
    if (demo) {
      disableDemoMode();
      navigate('/');
      return;
    }
    try {
      await api.logout();
    } catch {}
    localStorage.removeItem('rzh_token');
    window.location.href = '/';
  }

  function toggleDemo() {
    if (demo) disableDemoMode(); else enableDemoMode();
    window.location.reload();
  }

  const displayUser = demo
    ? { name: 'Mesa Group', email: 'Demo account' }
    : user;

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'var(--bg)' }}>

      {/* Sidebar */}
      <aside style={{
        width:224, background:'var(--ink)', color:'#F7F5F0',
        display:'flex', flexDirection:'column', flexShrink:0,
        position:'sticky', top:0, height:'100vh',
        borderRight:'1px solid rgba(247,245,240,0.06)',
      }}>

        {/* Wordmark */}
        <div style={{ padding:'28px 20px 20px', borderBottom:'1px solid rgba(247,245,240,0.06)' }}>
         <svg height="28" viewBox="0 0 440 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="44" cy="50" r="36" fill="#F7F5EF"/>
            <circle cx="44" cy="50" r="28" fill="none" stroke="#1D9E75" strokeWidth="1.5" opacity="0.5"/>
            <polyline points="20,50 30,50 36,34 42,66 48,42 54,58 60,50 68,50"
              fill="none" stroke="#1D9E75" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <text x="92" y="62" fontFamily="Georgia, serif" fontSize="42" fontWeight="400" fill="#F7F5EF" letterSpacing="-0.5">reviewz<tspan fill="#1D9E75">health</tspan></text>
          </svg>
          {demo && (
            <div style={{
              marginTop:6, display:'inline-flex', alignItems:'center', gap:5,
              padding:'2px 8px', borderRadius:99,
              background:'rgba(29,158,117,0.15)', border:'1px solid rgba(29,158,117,0.3)',
              fontSize:10, fontWeight:600, color:'#1D9E75', letterSpacing:'0.05em',
            }}>
              ◉ DEMO
            </div>
          )}
          {!demo && role === 'manager' && (
            <div style={{
              marginTop:6, display:'inline-flex', alignItems:'center', gap:5,
              padding:'2px 8px', borderRadius:99,
              background:'rgba(247,245,240,0.08)', border:'1px solid rgba(247,245,240,0.12)',
              fontSize:10, fontWeight:600, color:'rgba(247,245,240,0.45)',
              letterSpacing:'0.05em',
            }}>
              MANAGER
            </div>
          )}
        </div>

        {/* Nav */}
        <nav style={{ flex:1, padding:'10px 10px', overflowY:'auto' }}>
          {visibleNav.map(({ to, icon, label }) => (
            <NavLink key={to} to={to} end={to === '/dashboard'}
              style={({ isActive }) => ({
                display:'flex', alignItems:'center', gap:10,
                padding:'9px 12px', borderRadius:'var(--radius-md)',
                fontSize:13, fontWeight: isActive ? 500 : 400,
                color: isActive ? '#F7F5EF' : 'rgba(247,245,240,0.45)',
                background: isActive ? 'rgba(247,245,240,0.09)' : 'transparent',
                marginBottom:1, transition:'all 0.12s', textDecoration:'none',
              })}>
              <span style={{ fontSize:15, lineHeight:1, flexShrink:0 }}>{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Demo toggle — owner only */}
        {role === 'owner' && (
          <div style={{ padding:'10px 10px 0' }}>
            <button onClick={toggleDemo} style={{
              width:'100%', padding:'8px 12px', borderRadius:'var(--radius-md)',
              fontSize:12, fontWeight:500, cursor:'pointer', textAlign:'left',
              display:'flex', alignItems:'center', gap:8,
              border:`1px solid ${demo ? 'rgba(29,158,117,0.4)' : 'rgba(247,245,240,0.1)'}`,
              background: demo ? 'rgba(29,158,117,0.12)' : 'transparent',
              color: demo ? '#1D9E75' : 'rgba(247,245,240,0.35)',
              transition:'all 0.15s',
            }}>
              <span style={{ fontSize:13 }}>{demo ? '◉' : '◎'}</span>
              {demo ? 'Exit demo mode' : 'Demo mode'}
            </button>
          </div>
        )}

        {/* User + logout */}
        <div style={{ padding:'12px 10px 20px', marginTop:6 }}>
          <div style={{
            display:'flex', alignItems:'center', gap:10,
            padding:'10px 12px', borderRadius:'var(--radius-md)',
            background:'rgba(247,245,240,0.05)',
            marginBottom:6,
          }}>
            {!demo && user?.avatar_url
              ? <img src={user.avatar_url} alt="" width={30} height={30}
                  style={{ borderRadius:'50%', objectFit:'cover', flexShrink:0 }}/>
              : <div style={{
                  width:30, height:30, borderRadius:'50%', flexShrink:0,
                  background: demo ? 'rgba(29,158,117,0.3)' : 'rgba(247,245,240,0.12)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:12, fontWeight:600,
                  color: demo ? '#1D9E75' : '#F7F5EF',
                }}>
                  {(displayUser?.name ?? 'U')[0].toUpperCase()}
                </div>
            }
            <div style={{ minWidth:0, flex:1 }}>
              <div style={{
                fontSize:12, fontWeight:500, color:'#F7F5EF',
                overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
              }}>
                {displayUser?.name ?? 'Owner'}
              </div>
              <div style={{
                fontSize:11, color:'rgba(247,245,240,0.35)',
                overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
              }}>
                {displayUser?.email}
              </div>
            </div>
          </div>

          <button onClick={handleLogout} disabled={loggingOut} style={{
            width:'100%', padding:'7px 12px', borderRadius:'var(--radius-md)',
            fontSize:12, color:'rgba(247,245,240,0.35)',
            border:'1px solid rgba(247,245,240,0.08)',
            background:'transparent', cursor:'pointer',
            transition:'all 0.15s', textAlign:'center',
          }}>
            {loggingOut ? 'Signing out…' : 'Sign out'}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={{
        flex:1, minWidth:0,
        display:'flex', flexDirection:'column',
        background:'var(--bg)',
      }}>
        {demo && (
          <div style={{
            background:'rgba(29,158,117,0.08)',
            borderBottom:'1px solid rgba(29,158,117,0.2)',
            padding:'8px 24px',
            display:'flex', alignItems:'center', gap:8,
            fontSize:12, color:'#1D9E75', fontWeight:500,
          }}>
            <span>◉</span>
            Demo mode active — showing Mesa Group sample data. This is not real customer data.
            <button onClick={toggleDemo} style={{
              marginLeft:'auto', fontSize:11, color:'#1D9E75',
              background:'none', border:'none', cursor:'pointer',
              textDecoration:'underline', fontWeight:500,
            }}>
              Exit demo
            </button>
          </div>
        )}
        <Outlet />
      </main>
    </div>
  );
}
