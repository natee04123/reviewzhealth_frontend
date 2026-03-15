// src/pages/Locations.jsx
import React, { useState, useEffect } from 'react';
import { api } from '../lib/api.js';
import { Spinner, Toast } from '../components/ui.jsx';

export default function Locations() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [syncing, setSyncing]     = useState(false);
  const [enablingId, setEnablingId] = useState(null);
  const [toast, setToast]         = useState(null);

  useEffect(() => {
    api.getLocations()
      .then(setLocations)
      .finally(() => setLoading(false));
  }, []);

  function showToast(message, type = 'success') {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }

  async function syncLocations() {
    setSyncing(true);
    try {
      const locs = await api.syncLocations();
      setLocations(locs);
      showToast(`${locs.length} location${locs.length !== 1 ? 's' : ''} synced`);
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
      showToast('Notifications enabled — new reviews will be auto-drafted');
    } catch (e) {
      showToast(e.message, 'error');
    } finally {
      setEnablingId(null);
    }
  }

  return (
    <div style={{ padding: '40px 48px', maxWidth: 760, margin: '0 auto', width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 400, marginBottom: 6 }}>
            Locations
          </h1>
          <p style={{ color: 'var(--ink-2)', fontSize: 15 }}>
            Connect your Google Business Profile locations to start receiving AI-drafted responses.
          </p>
        </div>
        <button onClick={syncLocations} disabled={syncing} style={{
          padding: '10px 18px', borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border)', background: 'var(--bg-card)',
          fontSize: 14, color: 'var(--ink)',
          display: 'flex', alignItems: 'center', gap: 8,
          boxShadow: 'var(--shadow-sm)',
        }}>
          {syncing ? <Spinner size={14} /> : '↻'} Sync from Google
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
          <Spinner size={28} />
        </div>
      ) : locations.length === 0 ? (
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
            fontSize: 15, fontWeight: 500,
          }}>
            {syncing ? 'Syncing…' : 'Sync locations'}
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {locations.map(loc => (
            <div key={loc.id} className="anim-fade-up" style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)', padding: '20px 24px',
              display: 'flex', alignItems: 'center', gap: 16,
              boxShadow: 'var(--shadow-sm)',
            }}>
              {/* Location icon */}
              <div style={{
                width: 44, height: 44, borderRadius: 'var(--radius-md)',
                background: 'var(--bg-muted)', border: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20, flexShrink: 0,
              }}>
                ⊡
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 500, fontSize: 15, marginBottom: 3 }}>{loc.name}</div>
                {loc.address && (
                  <div style={{ fontSize: 13, color: 'var(--ink-3)' }}>{loc.address}</div>
                )}
              </div>

              {/* Status + action */}
              {loc.pubsub_registered ? (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '6px 14px', borderRadius: 99,
                  background: 'var(--green-bg)', border: '1px solid var(--green-border)',
                  fontSize: 13, color: 'var(--green)', fontWeight: 500, flexShrink: 0,
                }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%',
                    background: 'var(--green)', display: 'inline-block',
                    animation: 'pulse 2s ease infinite' }} />
                  Active
                </div>
              ) : (
                <button
                  onClick={() => enableNotifications(loc.id)}
                  disabled={enablingId === loc.id}
                  style={{
                    padding: '8px 16px', borderRadius: 'var(--radius-md)',
                    background: 'var(--ink)', color: '#F7F5F0',
                    fontSize: 13, fontWeight: 500, flexShrink: 0,
                    display: 'flex', alignItems: 'center', gap: 6,
                    opacity: enablingId === loc.id ? 0.7 : 1,
                  }}
                >
                  {enablingId === loc.id ? <Spinner size={12} color="#fff" /> : null}
                  Enable notifications
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {toast && <Toast {...toast} onDismiss={() => setToast(null)} />}
    </div>
  );
}
