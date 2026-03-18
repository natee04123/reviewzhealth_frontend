import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../lib/api.js';
import { Spinner } from '../components/ui.jsx';

export default function InviteAccept() {
  const { token }  = useParams();
  const navigate   = useNavigate();
  const [invite, setInvite]     = useState(null);
  const [loading, setLoading]   = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [error, setError]       = useState(null);
  const [done, setDone]         = useState(false);

  useEffect(() => {
    api.getInvite(token)
      .then(setInvite)
      .catch(() => setError('This invite link is invalid or has expired.'))
      .finally(() => setLoading(false));
  }, [token]);

  async function handleAccept() {
    setAccepting(true);
    try {
      await api.acceptInvite(token);
      setDone(true);
      setTimeout(() => {
        window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/google`;
      }, 2000);
    } catch (e) {
      setError(e.message);
      setAccepting(false);
    }
  }

  if (loading) return (
    <div style={{ display:'flex', justifyContent:'center',
      alignItems:'center', minHeight:'100vh' }}>
      <Spinner size={32}/>
    </div>
  );

  return (
    <div style={{
      minHeight:'100vh', display:'flex', alignItems:'center',
      justifyContent:'center', padding:24,
      background:'var(--bg)',
    }}>
      <div style={{
        background:'var(--bg-card)', borderRadius:'var(--radius-xl)',
        padding:'40px 48px', width:'100%', maxWidth:440,
        boxShadow:'var(--shadow-lg)', border:'1px solid var(--border)',
        textAlign:'center',
      }}>
        <div style={{ fontFamily:'var(--font-display)', fontSize:26,
          fontWeight:400, marginBottom:8, color:'var(--ink)' }}>
          reviewzhealth
        </div>

        {error ? (
          <>
            <div style={{ fontSize:40, marginBottom:16 }}>⚠</div>
            <div style={{ fontSize:18, fontWeight:500, color:'var(--ink)',
              marginBottom:8 }}>
              Invite expired
            </div>
            <p style={{ fontSize:14, color:'var(--ink-2)', lineHeight:1.6 }}>
              {error}
            </p>
            <p style={{ fontSize:13, color:'var(--ink-3)', marginTop:12 }}>
              Ask your account owner to send a new invite.
            </p>
          </>
        ) : done ? (
          <>
            <div style={{ fontSize:40, marginBottom:16 }}>✓</div>
            <div style={{ fontSize:18, fontWeight:500, color:'var(--green)',
              marginBottom:8 }}>
              Invite accepted!
            </div>
            <p style={{ fontSize:14, color:'var(--ink-2)' }}>
              Redirecting you to sign in with Google...
            </p>
            <Spinner size={20} style={{ margin:'16px auto 0' }}/>
          </>
        ) : invite ? (
          <>
            <div style={{ fontSize:14, color:'var(--ink-3)', marginBottom:24 }}>
              <strong style={{ color:'var(--ink)' }}>{invite.inviter_name ?? 'Someone'}</strong>
              {' '}has invited you to join their reviewzhealth account as a{' '}
              <strong style={{ color:'var(--ink)' }}>{invite.role}</strong>.
            </div>

            <div style={{
              background:'var(--bg-muted)', border:'1px solid var(--border)',
              borderRadius:'var(--radius-md)', padding:'12px 16px',
              fontSize:13, color:'var(--ink-2)', marginBottom:24, lineHeight:1.5,
            }}>
              You'll sign in with Google using <strong>{invite.email}</strong>.
              Make sure you use that Google account.
            </div>

            <button onClick={handleAccept} disabled={accepting} style={{
              width:'100%', padding:'13px', borderRadius:'var(--radius-md)',
              background:'var(--ink)', color:'var(--bg)',
              border:'none', fontSize:14, fontWeight:500, cursor:'pointer',
              opacity: accepting ? 0.6 : 1,
              display:'flex', alignItems:'center', justifyContent:'center', gap:8,
            }}>
              {accepting
                ? <><Spinner size={16} color="var(--bg)"/> Accepting...</>
                : 'Accept invite & sign in with Google'}
            </button>

            <p style={{ fontSize:11, color:'var(--ink-3)', marginTop:16 }}>
              This invite expires in 72 hours.
            </p>
          </>
        ) : null}
      </div>
    </div>
  );
}
