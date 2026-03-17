import React, { useState, useEffect } from 'react';
import { api } from '../lib/api.js';
import { Toast, Spinner } from '../components/ui.jsx';

const TIERS = [
  { key: 'starter',    label: 'Starter',    range: '1–3 locations',   monthly: 29,  yearly: 290,  features: ['Up to 3 locations', 'Unlimited AI responses', 'Email notifications', 'Review health dashboard', 'Approve / edit / dismiss'] },
  { key: 'growth',     label: 'Growth',     range: '4–9 locations',   monthly: 19,  yearly: 190,  popular: true, features: ['Up to 9 locations', 'Everything in Starter', 'Priority support', 'Response analytics', 'Custom tone settings'] },
  { key: 'agency',     label: 'Agency',     range: '10–24 locations', monthly: 15,  yearly: 150,  features: ['Up to 24 locations', 'Everything in Growth', 'White-label options', 'Bulk onboarding', 'Dedicated support'] },
  { key: 'enterprise', label: 'Enterprise', range: '25+ locations',   monthly: 12,  yearly: 120,  features: ['Unlimited locations', 'Everything in Agency', 'Custom contract', 'SLA guarantee', 'Account manager'] },
];

function getTierForCount(count) {
  if (count <= 3)  return 'starter';
  if (count <= 9)  return 'growth';
  if (count <= 24) return 'agency';
  return 'enterprise';
}

export default function Billing() {
  const [toast, setToast]         = useState(null);
  const [upgrading, setUpgrading] = useState(false);
  const [interval, setInterval]   = useState('monthly');
  const [locationCount, setCount] = useState(1);
  const [billing, setBilling]     = useState(null);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    api.getBillingStatus()
      .then(data => { setBilling(data); setCount(Math.max(1, data.locationCount || 1)); })
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

  const currentPlan   = billing?.plan ?? 'free';
  const activeTierKey = getTierForCount(locationCount);
  const activeTier    = TIERS.find(t => t.key === activeTierKey);
  const pricePerLoc   = activeTier ? (interval === 'yearly' ? activeTier.yearly : activeTier.monthly) : 0;
  const totalPrice    = pricePerLoc * locationCount;
  const yearlySaving  = (activeTier?.monthly ?? 0) * locationCount * 2;

  return (
    <div style={{ padding: '40px 48px', maxWidth: 900, margin: '0 auto', width: '100%' }}>

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 400, marginBottom: 6 }}>
          Billing & plan
        </h1>
        <p style={{ color: 'var(--ink-2)', fontSize: 15 }}>
          Simple per-location pricing. The more locations you manage, the lower your rate.
        </p>
      </div>

      {/* Current plan banner */}
      {!loading && currentPlan !== 'free' && (
        <div style={{
          background: 'var(--ink)', borderRadius: 'var(--radius-lg)',
          padding: '18px 24px', marginBottom: 32,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontSize: 12, color: 'rgba(247,245,240,0.45)', marginBottom: 4,
              letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 500 }}>
              Current plan
            </div>
            <div style={{ fontSize: 18, fontWeight: 500, color: '#F7F5EF' }}>
              {currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)} · {billing.locationCount} location{billing.locationCount !== 1 ? 's' : ''} · ${billing.monthlyTotal}/mo
            </div>
          </div>
          <div style={{
            padding: '5px 14px', borderRadius: 99,
            background: '#1D9E75', color: '#fff',
            fontSize: 12, fontWeight: 600, letterSpacing: '0.04em',
          }}>ACTIVE</div>
        </div>
      )}

      {loading && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
          <Spinner size={28} />
        </div>
      )}

      {!loading && (
        <>
          {/* Billing interval toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <span style={{ fontSize: 14, color: 'var(--ink-2)' }}>Billing period:</span>
            <div style={{
              display: 'flex', gap: 2, background: 'var(--bg-muted)',
              borderRadius: 'var(--radius-md)', padding: 3,
            }}>
              {['monthly', 'yearly'].map(i => (
                <button key={i} onClick={() => setInterval(i)} style={{
                  padding: '7px 18px', borderRadius: 6, fontSize: 13,
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
            {interval === 'yearly' && locationCount > 0 && (
              <span style={{
                fontSize: 12, padding: '4px 12px', borderRadius: 99,
                background: 'var(--green-bg)', color: 'var(--green)',
                border: '1px solid var(--green-border)', fontWeight: 500,
              }}>
                Save ${yearlySaving.toLocaleString()}/yr vs monthly
              </span>
            )}
          </div>

          {/* Tier cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 32 }}>
            {TIERS.map(tier => {
              const isActive = activeTierKey === tier.key;
              const isCurrent = currentPlan === tier.key;
              const price = interval === 'yearly' ? tier.yearly : tier.monthly;

              return (
                <div key={tier.key} onClick={() => {
                  const midpoint = { starter: 2, growth: 6, agency: 15, enterprise: 30 };
                  setCount(midpoint[tier.key]);
                }} style={{
                  background: 'var(--bg-card)',
                  border: `${isActive ? '2px' : '1px'} solid ${isActive ? 'var(--green)' : 'var(--border)'}`,
                  borderRadius: 'var(--radius-lg)', padding: '18px 16px',
                  position: 'relative', cursor: 'pointer',
                  boxShadow: isActive ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                  transition: 'all 0.15s',
                }}>
                  {tier.popular && (
                    <div style={{
                      position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)',
                      background: 'var(--green)', color: '#fff',
                      fontSize: 9, fontWeight: 700, padding: '3px 10px',
                      borderRadius: 99, whiteSpace: 'nowrap', letterSpacing: '0.05em',
                    }}>MOST POPULAR</div>
                  )}
                  {isCurrent && (
                    <div style={{
                      position: 'absolute', top: 10, right: 10,
                      background: 'var(--green-bg)', color: 'var(--green)',
                      fontSize: 9, fontWeight: 600, padding: '2px 7px',
                      borderRadius: 99, letterSpacing: '0.04em',
                    }}>CURRENT</div>
                  )}
                  <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink)', marginBottom: 2 }}>
                    {tier.label}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--ink-3)', marginBottom: 12 }}>
                    {tier.range}
                  </div>
                  <div style={{ marginBottom: 14 }}>
                    <span style={{ fontSize: 26, fontWeight: 500, fontFamily: 'var(--font-display)', color: isActive ? 'var(--green)' : 'var(--ink)' }}>
                      ${price}
                    </span>
                    <span style={{ fontSize: 11, color: 'var(--ink-3)' }}>/loc/{interval === 'yearly' ? 'yr' : 'mo'}</span>
                  </div>
                  <ul style={{ listStyle: 'none' }}>
                    {tier.features.map(f => (
                      <li key={f} style={{ fontSize: 11, color: 'var(--ink-2)', padding: '2px 0',
                        display: 'flex', alignItems: 'flex-start', gap: 5 }}>
                        <span style={{ color: 'var(--green)', flexShrink: 0, marginTop: 1 }}>✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          {/* Location count + price summary */}
          <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-xl)', padding: '28px 32px',
            boxShadow: 'var(--shadow-md)', marginBottom: 16,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 32, flexWrap: 'wrap' }}>
              {/* Location count */}
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink)', marginBottom: 12 }}>
                  Number of locations
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <button onClick={() => setCount(c => Math.max(1, c - 1))} style={{
                    width: 40, height: 40, borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border)', background: 'var(--bg)',
                    fontSize: 20, cursor: 'pointer',
                  }}>−</button>
                  <input
                    type="number" min="1" max="999"
                    value={locationCount}
                    onChange={e => setCount(Math.max(1, parseInt(e.target.value) || 1))}
                    style={{
                      width: 90, textAlign: 'center', padding: '10px',
                      border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
                      fontSize: 22, fontWeight: 500, color: 'var(--ink)', background: 'var(--bg)',
                    }}
                  />
                  <button onClick={() => setCount(c => c + 1)} style={{
                    width: 40, height: 40, borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border)', background: 'var(--bg)',
                    fontSize: 20, cursor: 'pointer',
                  }}>+</button>
                </div>
                <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 8 }}>
                  Tier: <strong style={{ color: 'var(--ink)' }}>{activeTier?.label}</strong> · ${pricePerLoc}/location/{interval === 'yearly' ? 'yr' : 'mo'}
                </div>
              </div>

              {/* Divider */}
              <div style={{ width: 1, height: 80, background: 'var(--border)', flexShrink: 0 }} />

              {/* Price */}
              <div style={{ flex: 1, minWidth: 160 }}>
                <div style={{ fontSize: 13, color: 'var(--ink-3)', marginBottom: 4 }}>
                  Total {interval === 'yearly' ? 'annual' : 'monthly'} cost
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 40, fontWeight: 400,
                  color: 'var(--ink)', lineHeight: 1 }}>
                  ${totalPrice.toLocaleString()}
                  <span style={{ fontSize: 16, fontWeight: 300, color: 'var(--ink-3)' }}>
                    /{interval === 'yearly' ? 'yr' : 'mo'}
                  </span>
                </div>
                {interval === 'yearly' && (
                  <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 4 }}>
                    ${Math.round(totalPrice / 12).toLocaleString()}/mo billed annually
                  </div>
                )}
              </div>

              {/* CTA */}
              <button
                onClick={handleUpgrade}
                disabled={upgrading}
                style={{
                  padding: '14px 32px', borderRadius: 'var(--radius-md)',
                  background: 'var(--green)', color: '#fff',
                  fontSize: 16, fontWeight: 500, border: 'none', cursor: 'pointer',
                  opacity: upgrading ? 0.7 : 1, flexShrink: 0,
                  boxShadow: 'var(--shadow-md)',
                }}>
                {upgrading ? 'Redirecting...' : currentPlan === 'free' ? 'Get started' : 'Update plan'}
              </button>
            </div>
          </div>

          <p style={{ fontSize: 12, color: 'var(--ink-3)', textAlign: 'center' }}>
            No setup fees · Cancel any time · Billed by Stripe · Secure payments
          </p>
        </>
      )}

      {toast && <Toast {...toast} onDismiss={() => setToast(null)} />}
    </div>
  );
}
