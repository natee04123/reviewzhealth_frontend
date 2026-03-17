import React, { useState, useEffect } from 'react';
import { api } from '../lib/api.js';
import { Toast, Spinner } from '../components/ui.jsx';

const PLANS = [
  {
    key: 'starter',
    name: 'Starter',
    monthlyPrice: 29,
    yearlyPrice: 290,
    locations: '1–3 locations',
    maxLocations: 3,
    features: ['Up to 3 locations', 'Unlimited AI responses', 'Email notifications', 'Review health dashboard', 'Approve / edit / dismiss'],
  },
  {
    key: 'growth',
    name: 'Growth',
    monthlyPrice: 79,
    yearlyPrice: 790,
    locations: '4–9 locations',
    maxLocations: 9,
    features: ['Up to 9 locations', 'Everything in Starter', 'Priority support', 'Response analytics', 'Custom tone settings'],
    popular: true,
  },
  {
    key: 'agency',
    name: 'Agency',
    monthlyPrice: 149,
    yearlyPrice: 1490,
    locations: '10+ locations',
    maxLocations: 999,
    features: ['Unlimited locations', 'Everything in Growth', 'White-label options', 'Bulk location onboarding', 'Dedicated support'],
  },
];

export default function Settings() {
  const [toast, setToast]           = useState(null);
  const [upgrading, setUpgrading]   = useState(null);
  const [interval, setIntervalVal]  = useState('monthly');
  const [billingStatus, setBilling] = useState(null);
  const [loadingBilling, setLoadingBilling] = useState(true);

  useEffect(() => {
    api.getBillingStatus()
      .then(setBilling)
      .catch(() => {})
      .finally(() => setLoadingBilling(false));
  }, []);

  function showToast(message, type = 'success') {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }

  async function handleUpgrade(planKey) {
    setUpgrading(planKey);
    try {
      const { url } = await api.createCheckout(planKey, interval);
      window.location.href = url;
    } catch (e) {
      showToast(e.message, 'error');
      setUpgrading(null);
    }
  }

  const currentPlan = billingStatus?.plan ?? 'free';

  return (
    <div style={{ padding: '40px 48px', maxWidth: 800, margin: '0 auto', width: '100%' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 400, marginBottom: 8 }}>
        Settings
      </h1>
      <p style={{ color: 'var(--ink-2)', fontSize: 15, marginBottom: 36 }}>
        Manage your plan and account preferences.
      </p>

      {/* Current plan status */}
      {!loadingBilling && billingStatus && (
        <div style={{
          background: 'var(--green-bg)', border: '1px solid var(--green-border)',
          borderRadius: 'var(--radius-lg)', padding: '16px 20px', marginBottom: 28,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--green)' }}>
              Current plan: {currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)}
            </div>
            <div style={{ fontSize: 13, color: 'var(--ink-2)', marginTop: 2 }}>
              {billingStatus.locationCount} of {billingStatus.maxLocations === 999 ? 'unlimited' : billingStatus.maxLocations} locations used
            </div>
          </div>
          <div style={{
            padding: '4px 12px', borderRadius: 99,
            background: 'var(--green)', color: '#fff',
            fontSize: 12, fontWeight: 500,
          }}>
            Active
          </div>
        </div>
      )}

      {/* Billing interval toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <span style={{ fontSize: 14, color: 'var(--ink-2)' }}>Billing:</span>
        <div style={{
          display: 'flex', gap: 2, background: 'var(--bg-muted)',
          borderRadius: 'var(--radius-md)', padding: 3,
        }}>
          {['monthly', 'yearly'].map(i => (
            <button key={i} onClick={() => setIntervalVal(i)} style={{
              padding: '6px 16px', borderRadius: 6, fontSize: 13,
              fontWeight: interval === i ? 500 : 400,
              background: interval === i ? 'var(--bg-card)' : 'transparent',
              color: interval === i ? 'var(--ink)' : 'var(--ink-3)',
              border: 'none', cursor: 'pointer',
              boxShadow: interval === i ? 'var(--shadow-sm)' : 'none',
            }}>
              {i === 'yearly' ? 'Annual (save ~20%)' : 'Monthly'}
            </button>
          ))}
        </div>
      </div>

      {/* Plan cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 32 }}>
        {PLANS.map(plan => {
          const isCurrent = currentPlan === plan.key;
          const price = interval === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;
          const perMonth = interval === 'yearly' ? Math.round(plan.yearlyPrice / 12) : plan.monthlyPrice;

          return (
            <div key={plan.key} style={{
              background: 'var(--bg-card)',
              border: `${plan.popular ? '2px' : '1px'} solid ${plan.popular ? 'var(--green)' : 'var(--border)'}`,
              borderRadius: 'var(--radius-lg)', padding: '20px',
              position: 'relative',
              boxShadow: plan.popular ? 'var(--shadow-md)' : 'var(--shadow-sm)',
            }}>
              {plan.popular && (
                <div style={{
                  position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)',
                  background: 'var(--green)', color: '#fff',
                  fontSize: 10, fontWeight: 600, padding: '3px 10px',
                  borderRadius: 99, whiteSpace: 'nowrap', letterSpacing: '0.04em',
                }}>
                  MOST POPULAR
                </div>
              )}

              <div style={{ marginBottom: 4, fontSize: 13, fontWeight: 500, color: 'var(--ink)' }}>
                {plan.name}
              </div>
              <div style={{ fontSize: 11, color: 'var(--ink-3)', marginBottom: 14 }}>
                {plan.locations}
              </div>

              <div style={{ marginBottom: 16 }}>
                <span style={{ fontSize: 28, fontWeight: 500, fontFamily: 'var(--font-display)', color: 'var(--ink)' }}>
                  ${perMonth}
                </span>
                <span style={{ fontSize: 13, color: 'var(--ink-3)' }}>/mo</span>
                {interval === 'yearly' && (
                  <div style={{ fontSize: 11, color: 'var(--ink-3)' }}>
                    Billed ${price}/yr
                  </div>
                )}
              </div>

              <ul style={{ listStyle: 'none', marginBottom: 18 }}>
                {plan.features.map(f => (
                  <li key={f} style={{
                    fontSize: 12, color: 'var(--ink-2)', padding: '3px 0',
                    display: 'flex', alignItems: 'flex-start', gap: 6,
                  }}>
                    <span style={{ color: 'var(--green)', flexShrink: 0, marginTop: 1 }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              {isCurrent ? (
                <div style={{
                  width: '100%', padding: '9px', borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-muted)', color: 'var(--ink-3)',
                  fontSize: 13, textAlign: 'center', border: '1px solid var(--border)',
                }}>
                  Current plan
                </div>
              ) : (
                <button
                  onClick={() => handleUpgrade(plan.key)}
                  disabled={!!upgrading}
                  style={{
                    width: '100%', padding: '9px',
                    borderRadius: 'var(--radius-md)',
                    background: plan.popular ? 'var(--green)' : 'var(--ink)',
                    color: '#fff', fontSize: 13, fontWeight: 500,
                    border: 'none', cursor: 'pointer',
                    opacity: upgrading ? 0.7 : 1,
                  }}>
                  {upgrading === plan.key ? 'Redirecting...' : `Upgrade to ${plan.name}`}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Account preferences */}
      <Section title="AI response preferences">
        <Field label="Business name" hint="Used in sign-offs and personalization">
          <input type="text" placeholder="e.g. Maple Street Cafe" style={inputStyle} />
        </Field>
        <Field label="Owner / manager name" hint="Used in sign-offs (e.g. Thanks, Sarah)">
          <input type="text" placeholder="e.g. Sarah" style={inputStyle} />
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
      </Section>

      <Section title="Account">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px' }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 500 }}>Disconnect Google account</div>
            <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 2 }}>Removes access to your Google Business Profile</div>
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
        fontSize: 15, fontWeight: 500, border: 'none', cursor: 'pointer', marginTop: 8,
      }}>
        Save settings
      </button>

      {toast && <Toast {...toast} onDismiss={() => setToast(null)} />}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <h2 style={{ fontSize: 13, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase',
        color: 'var(--ink-3)', marginBottom: 14 }}>{title}</h2>
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
