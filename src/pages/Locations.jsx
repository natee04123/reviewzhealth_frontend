import React, { useState, useEffect } from 'react';
import { api } from '../lib/api.js';
import { Toast, Spinner } from '../components/ui.jsx';

export default function Locations() {
  const [locations, setLocations]   = useState([]);
  const [billing, setBilling]       = useState(null);
  const [loading, setLoading]       = useState(true);
  const [syncing, setSyncing]       = useState(false);
  const [enablingId, setEnablingId] = useState(null);
  const [toast, setToast]           = useState(null);

  useEffect(() => {
    Promise.all([api.getLocations(), api.getBillingStatus()])
      .then(([locs, bill]) => { setLocations(locs); setBilling(bill); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function showToast(message, type = 'success') {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }

  async function syncLocations() {
    setSyncing(true);
    try {
      const result = await api.syncLocations();
      const locs = Array.isArray(result) ? result : result.locations ?? [];
      setLocations(locs);
      if (result.warning) showToast(result.warning, 'info');
      else showToast(`${locs.length} location${locs.length !== 1 ? 's' : ''} synced`);
      const bill = await api.getBillingStatus();
      setBilling(bill);
    } catch (e) {
      showToast(e.message, 'error');
    } finally {
      setSyncing(false);
    }
  }

  async function enableNotifications(id) {
    setEnablingId(id);
    try {
      await api.enableNotifications(id);
      setLocations(locs => locs.map(l => l.id === id ? { ...l, pubsub_registered: true } : l));
      const bill = await api.getBillingStatus();
      setBilling(bill);
      showToast('Notifications enabled — new reviews will be auto-drafted');
    } catch (e) {
      showToast(e.message, 'error');
    } finally {
      setEnablingId(null);
    }
  }

  const plan = billing?.plan ?? 'free';
  const maxLocations = billing?.maxLocations ?? 0;
  const activeCount = locations.filter(l => l.pubsub_registered).length;
  const usagePct = maxLocations > 0 && maxLocations < 999
    ? Math.round((activeCount / maxLocations) * 100)
    : 0;

  const planLabel = plan.charAt(0).toUpperCase() + plan.slice(1);

  return (
    <div style={{ padding: '40px 48px', maxWidth: 860, margin: '0 auto', width: '100%' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 400, marginBottom: 6 }}>
            Locations
          </h1>
          <p style={{ color: 'var(--ink-2)', fontSize: 15 }}>
            Manage your connected Google Business Profile locations.
          </p>
        </div>
        <button onClick={syncLocations} disabled={syncing} style={{
          padding: '10px 18px', borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border)', background: 'var(--bg-card)',
          fontSize: 14, color: 'var(--ink)', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 8,
          boxShadow: 'var(--shadow-sm)', flexShrink: 0,
        }}>
          {syncing ? <Spinner size={14} /> : '↻'} Sync from Google
        </button>
      </div>

      {/* Plan usage banner */}
      {billing && plan !== 'free' && (
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)', padding: '14px 18px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 20, boxShadow: 'var(--shadow-sm)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{
              padding: '3px 10px', borderRadius: 99,
              fontSize: 11, fontWeight: 600, letterSpacing: '0.03em',
              background: 'var(--green-bg)', color: 'var(--green)',
              border: '1px solid var(--green-border)',
            }}>
              {planLabel.toUpperCase()}
            </span>
            <div>
              <div style={{ fontSize: 13, color: 'var(--ink-2)' }}>
                <strong style={{ color: 'var(--ink)' }}>
                  {activeCount} of {maxLocations === 999 ? 'unlimited' : maxLocations} locations
                </strong> active
              </div>
              {maxLocations < 999 && (
                <div style={{
                  width: 120, height: 5, background: 'var(--bg-muted)',
                  borderRadius: 99, overflow: 'hidden', marginTop: 5,
                }}>
                  <div style={{
                    width: `${usagePct}%`, height: '100%', borderRadius: 99,
                    background: usagePct >= 100 ? '#E24B4A' : 'var(--green)',
                    transition: 'width 0.5s ease',
                  }} />
                </div>
              )}
            </div>
          </div>
          {maxLocations < 999 && activeCount >= maxLocations && (
            <button onClick={() => window.location.href = '/dashboard/settings'} style={{
              padding: '8px 14px', borderRadius: 'var(--radius-md)',
              background: 'var(--ink)', color: '#F7F5F0',
              fontSize: 13, fontWeight: 500, border: 'none', cursor: 'pointer',
            }}>
              Upgrade plan →
            </button>
          )}
        </div>
      )}

      {/* Free plan warning */}
      {billing && plan === 'free' && (
        <div style={{
          background: 'var(--amber-bg)', border: '1px solid var(--amber-border)',
          borderRadius: 'var(--radius-lg)', padding: '14px 18px',
          marginBottom: 20, fontSize: 14, color: 'var(--amber)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span>You need an active plan to enable location notifications.</span>
          <button onClick={() => window.location.href = '/dashboard/settings'} style={{
            padding: '7px 14px', borderRadius: 'var(--radius-md)',
            background: 'var(--amber)', color: '#fff',
            fontSize: 13, fontWeight: 500, border: 'none', cursor: 'pointer',
          }}>
            View plans →
          </button>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
          <Spinner size={28} />
        </div>
      )}

      {/* Empty state */}
      {!loading && locations.length === 0 && (
        <div style={{
          textAlign: 'center', padding: '60px 40px',
          background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border)',
        }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginBottom: 12 }}>
            No locations yet
          </div>
          <p style={{ color: 'var(--ink-2)', fontSize: 15, marginBottom: 24 }}>
            Click "Sync from Google" to pull in your Google Business Profile locations.
          </p>
          <button onClick={syncLocations} disabled={syncing} style={{
            padding: '12px 24px', borderRadius: 'var(--radius-md)',
            background: 'var(--ink)', color: '#F7F5F0',
            fontSize: 15, fontWeight: 500, border: 'none', cursor: 'pointer',
          }}>
            {syncing ? 'Syncing…' : 'Sync locations'}
          </button>
        </div>
      )}

      {/* Location cards */}
      {!loading && locations.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {locations.map((loc, i) => {
            const isActive = loc.pubsub_registered;
            const isOverLimit = !isActive && maxLocations < 999 && activeCount >= maxLocations;
            const isEnabling = enablingId === loc.id;

            return (
              <div key={loc.id} className="anim-fade-up" style={{
                background: isOverLimit ? 'var(--bg-muted)' : 'var(--bg-card)',
                border: `1px ${isOverLimit ? 'dashed' : 'solid'} ${isActive ? 'var(--green-border)' : 'var(--border)'}`,
                borderRadius: 'var(--radius-lg)', padding: '16px 18px',
                opacity: isOverLimit ? 0.75 : 1,
                boxShadow: isActive ? 'none' : 'var(--shadow-sm)',
                animationDelay: `${i * 0.05}s`,
              }}>
                {/* Top row */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: isActive ? 14 : 0 }}>
                  <div style={{
                    width: 42, height: 42, borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-muted)', border: '1px solid var(--border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 20, flexShrink: 0,
                  }}>
                    ⊡
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink)', marginBottom: 2 }}>
                      {loc.name}
                    </div>
                    {loc.address && (
                      <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>{loc.address}</div>
                    )}
                    <div style={{ fontSize: 10, color: 'var(--ink-3)', marginTop: 2, fontFamily: 'monospace' }}>
                      {loc.google_location_id?.split('/').slice(-2).join('/')}
                    </div>
                  </div>

                  {/* Status */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                    {isActive ? (
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: 5,
                        padding: '4px 10px', borderRadius: 99,
                        background: 'var(--green-bg)', border: '1px solid var(--green-border)',
                        fontSize: 11, color: 'var(--green)', fontWeight: 500,
                      }}>
                        <span style={{
                          width: 5, height: 5, borderRadius: '50%',
                          background: 'var(--green)', display: 'inline-block',
                          animation: 'pulse 2s ease infinite',
                        }}/>
                        Active
                      </div>
                    ) : isOverLimit ? (
                      <span style={{
                        padding: '3px 8px', borderRadius: 99,
                        fontSize: 10, fontWeight: 500,
                        background: 'var(--amber-bg)', color: 'var(--amber)',
                        border: '1px solid var(--amber-border)',
                      }}>
                        🔒 Upgrade to activate
                      </span>
                    ) : (
                      <>
                        <span style={{
                          padding: '4px 10px', borderRadius: 99,
                          background: 'var(--bg-muted)', border: '1px solid var(--border)',
                          fontSize: 11, color: 'var(--ink-3)', fontWeight: 500,
                        }}>
                          Not active
                        </span>
                        <button
                          onClick={() => enableNotifications(loc.id)}
                          disabled={isEnabling}
                          style={{
                            padding: '6px 12px', borderRadius: 'var(--radius-md)',
                            background: 'var(--ink)', color: '#F7F5F0',
                            fontSize: 12, fontWeight: 500, border: 'none', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: 5,
                            opacity: isEnabling ? 0.7 : 1,
                          }}>
                          {isEnabling ? <Spinner size={11} color="#fff" /> : null}
                          Enable
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Stats row — only for active locations */}
                {isActive && (
                  <div style={{
                    display: 'flex', gap: 20,
                    paddingTop: 12,
                    borderTop: '1px solid var(--border)',
                  }}>
                    {[
                      { label: 'Avg rating', value: loc.avg_rating ? `${loc.avg_rating} ★` : '—', color: '#E8A020' },
                      { label: 'Total reviews', value: loc.total_reviews ?? 0, color: 'var(--ink)' },
                      { label: 'Pending replies', value: loc.pending_replies ?? 0, color: loc.pending_replies > 0 ? '#BA7517' : 'var(--green)' },
                      { label: 'Response rate', value: loc.response_rate ? `${loc.response_rate}%` : '—', color: 'var(--green)' },
                    ].map(stat => (
                      <div key={stat.label} style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 16, fontWeight: 500, color: stat.color, lineHeight: 1 }}>
                          {stat.value}
                        </div>
                        <div style={{ fontSize: 10, color: 'var(--ink-3)', marginTop: 3 }}>
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {toast && <Toast {...toast} onDismiss={() => setToast(null)} />}
    </div>
  );
}
