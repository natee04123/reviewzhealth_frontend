import React, { useState, useEffect } from 'react';
import { api } from '../lib/api.js';
import { Toast, Spinner } from '../components/ui.jsx';

const TIERS = [
  { key: 'starter',    label: 'Starter',    range: '1–3 locations',   monthly: 29,  yearly: 290,  color: 'var(--ink)' },
  { key: 'growth',     label: 'Growth',     range: '4–9 locations',   monthly: 19,  yearly: 190,  color: 'var(--green)', popular: true },
  { key: 'agency',     label: 'Agency',     range: '10–24 locations', monthly: 15,  yearly: 150,  color: 'var(--ink)' },
  { key: 'enterprise', label: 'Enterprise', range: '25+ locations',   monthly: 12,  yearly: 120,  color: 'var(--ink)' },
];

function getTierForCount(count) {
  if (count <= 3)  return 'starter';
  if (count <= 9)  return 'growth';
  if (count <= 24) return 'agency';
  return 'enterprise';
}

export default function Settings() {
  const [toast, setToast]           = useState(null);
  const [upgrading, setUpgrading]   = useState(false);
  const [interval, setInterval]     = useState('monthly');
  const [locationCount, setCount]   = useState(1);
  const [billing, setBilling]       = useState(null);
  const [loadingBilling, setLoading] = useState(true);

  useEffect(() => {
    api.getBillingStatus()
      .then(setBilling)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function showToast(message, type = 'success') {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }

  async function handleUpgrade() {
    setUpgrading(true);
    try {
      const { url } = await api.createCheckout(locationCount, interval);
      window.location.href = url;
    } catch (e) {
      showToast(e.message, 'error');
      setUpgrading(false);
    }
  }

  const currentPlan = billing?.plan ?? 'free';
  const activeTierKey = getTierForCount(locationCount);
  const activeTier = TIERS.find(t => t.key === activeTierKey);
  const pricePerLoc = activeTier ? (interval === 'yearly' ? activeTier.yearly : activeTier.monthly) : 0;
  const totalPrice = pricePerLoc * locationCount;
  const yearlySaving = locationCount > 0 ? (activeTier?.monthly ?? 0) * locationCount * 2 : 0;

  return (
    <div style={{ padding: '40px 48px', maxWidth: 800, margin: '0 auto', width: '100%' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 400, marginBottom: 8 }}>
        Settings
      </h1>
      <p style={{ color: 'var(--ink-2)', fontSize: 15, marginBottom: 36 }}>
        Manage your plan and account preferences.
      </p>

      {/* Current plan status */}
      {!loadingBilling && billing && currentPlan !== 'free' && (
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
              {billing.locationCount} location{billing.locationCount !== 1 ? 's' : ''} active
              · ${billing.monthlyTotal}/mo
            </div>
          </div>
          <div style={{
            padding: '4px 12px', borderRadius: 99,
            background: 'var(--green)', color: '#fff',
            fontSize: 12, fontWeight: 500,
          }}>Active</div>
        </div>
      )}

{/* Billing link */}
      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)', padding: '16px 20px', marginBottom: 32,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink)' }}>Plan & billing</div>
          <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 2 }}>
            {billing?.plan !== 'free'
              ? `${billing?.plan?.charAt(0).toUpperCase() + billing?.plan?.slice(1)} plan · ${billing?.locationCount} location${billing?.locationCount !== 1 ? 's' : ''} · $${billing?.monthlyTotal}/mo`
              : 'Free plan — upgrade to connect locations'}
          </div>
        </div>
        <button onClick={() => window.location.href = '/dashboard/billing'} style={{
          padding: '8px 16px', borderRadius: 'var(--radius-md)',
          background: 'var(--ink)', color: '#F7F5F0',
          fontSize: 13, fontWeight: 500, border: 'none', cursor: 'pointer',
        }}>
          Manage billing →
        </button>
      </div>

        {/* Location count input */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink)', display: 'block', marginBottom: 8 }}>
            How many locations do you want to connect?
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={() => setCount(c => Math.max(1, c - 1))} style={{
              width: 36, height: 36, borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)', background: 'var(--bg)',
              fontSize: 18, cursor: 'pointer', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
            }}>−</button>
            <input
              type="number" min="1" max="999"
              value={locationCount}
              onChange={e => setCount(Math.max(1, parseInt(e.target.value) || 1))}
              style={{
                width: 80, textAlign: 'center', padding: '8px',
                border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
                fontSize: 18, fontWeight: 500, color: 'var(--ink)',
                background: 'var(--bg)',
              }}
            />
            <button onClick={() => setCount(c => c + 1)} style={{
              width: 36, height: 36, borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)', background: 'var(--bg)',
              fontSize: 18, cursor: 'pointer', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
            }}>+</button>
            <div style={{ fontSize: 13, color: 'var(--ink-3)', marginLeft: 4 }}>
              locations
            </div>
          </div>
        </div>

        {/* Tier indicators */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginBottom: 20 }}>
          {TIERS.map(tier => {
            const isActive = activeTierKey === tier.key;
            return (
              <div key={tier.key} style={{
                padding: '10px 12px', borderRadius: 'var(--radius-md)',
                border: `${isActive ? '2px' : '1px'} solid ${isActive ? 'var(--green)' : 'var(--border)'}`,
                background: isActive ? 'var(--green-bg)' : 'var(--bg)',
                transition: 'all 0.2s',
              }}>
                <div style={{ fontSize: 12, fontWeight: 500, color: isActive ? 'var(--green)' : 'var(--ink-2)', marginBottom: 2 }}>
                  {tier.label}
                </div>
                <div style={{ fontSize: 11, color: isActive ? 'var(--green)' : 'var(--ink-3)', marginBottom: 4 }}>
                  {tier.range}
                </div>
                <div style={{ fontSize: 16, fontWeight: 500, color: isActive ? 'var(--green)' : 'var(--ink)' }}>
                  ${interval === 'yearly' ? tier.yearly : tier.monthly}
                  <span style={{ fontSize: 10, fontWeight: 400, color: isActive ? 'var(--green)' : 'var(--ink-3)' }}>/loc</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Billing interval toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{
            display: 'flex', gap: 2, background: 'var(--bg-muted)',
            borderRadius: 'var(--radius-md)', padding: 3,
          }}>
            {['monthly', 'yearly'].map(i => (
              <button key={i} onClick={() => setInterval(i)} style={{
                padding: '6px 16px', borderRadius: 6, fontSize: 13,
                fontWeight: interval === i ? 500 : 400,
                background: interval === i ? 'var(--bg-card)' : 'transparent',
                color: interval === i ? 'var(--ink)' : 'var(--ink-3)',
                border: 'none', cursor: 'pointer',
                boxShadow: interval === i ? 'var(--shadow-sm)' : 'none',
              }}>
                {i === 'yearly' ? 'Annual' : 'Monthly'}
              </button>
            ))}
          </div>
          {interval === 'yearly' && (
            <span style={{
              fontSize: 12, padding: '3px 10px', borderRadius: 99,
              background: 'var(--green-bg)', color: 'var(--green)',
              border: '1px solid var(--green-border)', fontWeight: 500,
            }}>
              Save ${yearlySaving.toLocaleString()} vs monthly
            </span>
          )}
        </div>

        {/* Price summary */}
        <div style={{
          background: 'var(--ink)', borderRadius: 'var(--radius-lg)',
          padding: '20px 24px', marginBottom: 16,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontSize: 13, color: 'rgba(247,245,240,0.5)', marginBottom: 4 }}>
              {locationCount} location{locationCount !== 1 ? 's' : ''} × ${pricePerLoc}/{interval === 'yearly' ? 'yr' : 'mo'} · {activeTier?.label} tier
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, color: '#F7F5EF', lineHeight: 1 }}>
              ${totalPrice.toLocaleString()}
              <span style={{ fontSize: 15, fontWeight: 300, color: 'rgba(247,245,240,0.5)' }}>
                /{interval === 'yearly' ? 'yr' : 'mo'}
              </span>
            </div>
            {interval === 'yearly' && (
              <div style={{ fontSize: 12, color: 'rgba(247,245,240,0.4)', marginTop: 4 }}>
                ${Math.round(totalPrice / 12).toLocaleString()}/mo billed annually
              </div>
            )}
          </div>
          <button
            onClick={handleUpgrade}
            disabled={upgrading}
            style={{
              padding: '12px 28px', borderRadius: 'var(--radius-md)',
              background: 'var(--green)', color: '#fff',
              fontSize: 15, fontWeight: 500, border: 'none', cursor: 'pointer',
              opacity: upgrading ? 0.7 : 1, flexShrink: 0,
            }}>
            {upgrading ? 'Redirecting...' : currentPlan === 'free' ? 'Get started' : 'Update plan'}
          </button>
        </div>

        <p style={{ fontSize: 12, color: 'var(--ink-3)', textAlign: 'center' }}>
          No setup fees · Cancel any time · Add or remove locations at any time
        </p>
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
          }}>Disconnect</button>
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
