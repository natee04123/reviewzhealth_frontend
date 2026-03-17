import React, { useState } from 'react';
import { api } from '../lib/api.js';
import { Toast } from '../components/ui.jsx';

export default function Settings() {
  const [toast, setToast] = useState(null);
  const [upgrading, setUpgrading] = useState(false);

  function showToast(message, type = 'success') {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }

  async function handleUpgrade(plan) {
    setUpgrading(plan);
    try {
      const { url } = await api.createCheckout(plan);
      window.location.href = url;
    } catch (e) {
      showToast(e.message, 'error');
      setUpgrading(false);
    }
  }

  return (
    <div style={{ padding: '40px 48px', maxWidth: 640, margin: '0 auto', width: '100%' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 400, marginBottom: 8 }}>
        Settings
      </h1>
      <p style={{ color: 'var(--ink-2)', fontSize: 15, marginBottom: 36 }}>
        Customize how reviewzhealth drafts your review responses.
      </p>

      <Section title="AI response preferences">
        <Field label="Business name" hint="Used in sign-offs and personalization">
          <input type="text" placeholder="e.g. Maple Street Cafe" style={inputStyle} />
        </Field>
        <Field label="Owner / manager name" hint="Used in sign-offs (e.g. Thanks, Sarah)">
          <input type="text" placeholder="e.g. Sarah" style={inputStyle} />
        </Field>
        <Field label="Custom sign-off" hint="Overrides the default. Leave blank to use owner name.">
          <input type="text" placeholder="e.g. The Maple Street Team" style={inputStyle} />
        </Field>
        <Field label="Topics to always mention" hint="The AI will weave these in where relevant">
          <textarea placeholder="e.g. Our loyalty card, free parking on Main St"
            rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
        </Field>
      </Section>

      <Section title="Notifications">
        <Field label="Notification email" hint="Where we send new review alerts">
          <input type="email" placeholder="you@yourbusiness.com" style={inputStyle} />
        </Field>
        <Toggle label="Email me when a new review arrives" defaultChecked />
        <Toggle label="Email me a weekly review summary" />
        <Toggle label="Notify me if a reply fails to post" defaultChecked />
      </Section>

      <Section title="Upgrade plan">
        <div style={{ padding: '20px' }}>
          <p style={{ fontSize: 14, color: 'var(--ink-2)', marginBottom: 16 }}>
            Choose a plan to unlock unlimited AI-drafted responses for your locations.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button
              onClick={() => handleUpgrade('monthly')}
              disabled={!!upgrading}
              style={{
                padding: '12px 24px', borderRadius: 'var(--radius-md)',
                background: 'var(--green)', color: '#fff',
                fontSize: 14, fontWeight: 500, border: 'none', cursor: 'pointer',
                opacity: upgrading ? 0.7 : 1,
              }}>
              {upgrading === 'monthly' ? 'Redirecting...' : 'Monthly - $29/mo'}
            </button>
            <button
              onClick={() => handleUpgrade('yearly')}
              disabled={!!upgrading}
              style={{
                padding: '12px 24px', borderRadius: 'var(--radius-md)',
                background: 'var(--ink)', color: '#F7F5F0',
                fontSize: 14, fontWeight: 500, border: 'none', cursor: 'pointer',
                opacity: upgrading ? 0.7 : 1,
              }}>
              {upgrading === 'yearly' ? 'Redirecting...' : 'Annual - $279/yr (save $69)'}
            </button>
          </div>
        </div>
      </Section>

      <Section title="Account">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 20px' }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 500 }}>Disconnect Google account</div>
            <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 2 }}>
              Removes access to your Google Business Profile
            </div>
          </div>
          <button style={{
            padding: '8px 14px', borderRadius: 'var(--radius-md)',
            border: '1px solid var(--red-border)', color: 'var(--red)',
            background: 'var(--red-bg)', fontSize: 13, cursor: 'pointer',
          }}>
            Disconnect
          </button>
        </div>
      </Section>

      <button onClick={() => showToast('Settings saved')} style={{
        padding: '12px 28px', borderRadius: 'var(--radius-md)',
        background: 'var(--ink)', color: '#F7F5F0',
        fontSize: 15, fontWeight: 500, border: 'none', cursor: 'pointer',
        marginTop: 8,
      }}>
        Save settings
      </button>

      {toast && <Toast {...toast} onDismiss={() => setToast(null)} />}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 40 }}>
      <h2 style={{ fontSize: 13, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase',
        color: 'var(--ink-3)', marginBottom: 16 }}>
        {title}
      </h2>
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        {children}
      </div>
    </div>
  );
}

function Field({ label, hint, children }) {
  return (
    <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
      <label style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 4 }}>{label}</label>
      {hint && <p style={{ fontSize: 12, color: 'var(--ink-3)', marginBottom: 8 }}>{hint}</p>}
      {children}
    </div>
  );
}

function Toggle({ label, defaultChecked }) {
  const [on, setOn] = useState(defaultChecked ?? false);
  return (
    <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <span style={{ fontSize: 14 }}>{label}</span>
      <button onClick={() => setOn(o => !o)} style={{
        width: 40, height: 22, borderRadius: 99, position: 'relative',
        background: on ? 'var(--green)' : 'var(--border-dark)',
        transition: 'background 0.2s', flexShrink: 0, border: 'none', cursor: 'pointer',
      }}>
        <span style={{
          position: 'absolute', top: 2, left: on ? 20 : 2,
          width: 18, height: 18, borderRadius: '50%', background: '#fff',
          transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        }} />
      </button>
    </div>
  );
}

const inputStyle = {
  width: '100%', padding: '9px 12px',
  borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)',
  fontSize: 14, background: 'var(--bg)', color: 'var(--ink)',
  outline: 'none', fontFamily: 'var(--font-body)',
};
