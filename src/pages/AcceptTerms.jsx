import React, { useState } from 'react';
import { api } from '../lib/api.js';
import { Spinner } from '../components/ui.jsx';

export default function AcceptTerms({ onAccepted }) {
  const [agreed, setAgreed] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  async function handleAccept() {
    if (!agreed) {
      setError('Please check the box to continue');
      return;
    }
    setSaving(true);
    try {
      await api.acceptTerms();
      onAccepted();
    } catch (e) {
      setError(e.message);
      setSaving(false);
    }
  }

  const boxStyle = {
    width: 18,
    height: 18,
    borderRadius: 4,
    flexShrink: 0,
    marginTop: 1,
    border: agreed ? '1.5px solid var(--blue)' : '1.5px solid var(--border)',
    background: agreed ? 'var(--blue)' : 'transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.15s',
  };

  const btnStyle = {
    width: '100%',
    padding: '13px',
    borderRadius: 'var(--radius-md)',
    background: agreed ? 'var(--ink)' : 'var(--bg-muted)',
    color: agreed ? 'var(--bg)' : 'var(--ink-3)',
    border: 'none',
    fontSize: 14,
    fontWeight: 500,
    cursor: agreed ? 'pointer' : 'not-allowed',
    transition: 'all 0.15s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: 'var(--bg)' }}>
      <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)', padding: '40px 48px', width: '100%', maxWidth: 480, boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border)' }}>

        <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 400, marginBottom: 24, color: 'var(--ink)', textAlign: 'center' }}>
          reviewz<span style={{ color: '#1D9E75' }}>health</span>
        </div>

        <h1 style={{ fontSize: 20, fontWeight: 500, color: 'var(--ink)', marginBottom: 8, textAlign: 'center' }}>
          Welcome!
        </h1>

        <p style={{ fontSize: 14, color: 'var(--ink-2)', textAlign: 'center', marginBottom: 32, lineHeight: 1.6 }}>
          Before you get started, please review and accept our terms of service.
        </p>

        <div style={{ background: 'var(--bg-muted)', borderRadius: 'var(--radius-md)', padding: '16px 20px', marginBottom: 24, border: '1px solid var(--border)', fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.7 }}>
          <strong style={{ color: 'var(--ink)' }}>What you are agreeing to:</strong>
          <ul style={{ margin: '8px 0 0', paddingLeft: 20 }}>
            <li>Use reviewzhealth for legitimate business purposes</li>
            <li>Review and approve AI-drafted responses before posting</li>
            <li>Monthly subscription billing per connected location</li>
            <li>We never sell your data to third parties</li>
          </ul>
        </div>

        <div onClick={() => setAgreed(v => !v)} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer', marginBottom: 24, userSelect: 'none' }}>
          <div style={boxStyle}>
            {agreed && <span style={{ color: '#fff', fontSize: 11, lineHeight: 1 }}>✓</span>}
          </div>
          <span style={{ fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.6 }}>
            I agree to the reviewzhealth <a href="/terms" target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} style={{ color: 'var(--blue)', textDecoration: 'underline' }}>Terms of Service</a> by Greenhalgh Holdings LLC.
          </span>
        </div>

        {error && <div style={{ fontSize: 12, color: 'var(--red)', marginBottom: 12 }}>{error}</div>}

        <button onClick={handleAccept} disabled={saving || !agreed} style={btnStyle}>
          {saving ? <><Spinner size={16} color="var(--bg)" /> Saving...</> : 'Accept and continue'}
        </button>

      </div>
    </div>
  );
}
