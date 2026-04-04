import React, { useState, useEffect } from 'react';
import { api } from '../lib/api.js';
import { Spinner } from '../components/ui.jsx';

const PLATFORM_NAMES = {
  google:      'Google',
  ubereats:    'Uber Eats',
  doordash:    'DoorDash',
  grubhub:     'Grubhub',
  yelp:        'Yelp',
  tripadvisor: 'Tripadvisor',
  opentable:   'OpenTable',
  facebook:    'Facebook',
};

const PLATFORM_COLORS = {
  google:      '#4285F4',
  ubereats:    '#000000',
  doordash:    '#FF3008',
  grubhub:     '#FF8000',
  yelp:        '#D32323',
  tripadvisor: '#00AA6C',
  opentable:   '#DA3743',
  facebook:    '#1877F2',
};

function StarBar({ breakdown, total }) {
  if (!total) return null;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {[5, 4, 3, 2, 1].map(function(star) {
        const count = breakdown[star] ?? 0;
        const pct   = total > 0 ? Math.round((count / total) * 100) : 0;
        return (
          <div key={star} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ fontSize: 11, color: 'var(--ink-3)', width: 16, textAlign: 'right' }}>
              {star}★
            </div>
            <div style={{
              flex: 1, height: 6, background: 'var(--bg-muted)',
              borderRadius: 99, overflow: 'hidden',
            }}>
              <div style={{
                width: `${pct}%`, height: '100%', borderRadius: 99,
                background: star >= 4 ? 'var(--green)' : star === 3 ? '#E8A020' : 'var(--red)',
                transition: 'width 0.8s ease',
              }}/>
            </div>
            <div style={{ fontSize: 11, color: 'var(--ink-3)', width: 28, textAlign: 'right' }}>
              {count}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function PlatformCard({ platform, data, customTarget, onSetTarget }) {
  const color       = PLATFORM_COLORS[platform] ?? '#888';
  const name        = PLATFORM_NAMES[platform] ?? platform;
  const avg         = data.avg_rating;
  const total       = data.total_reviews;
  const target      = customTarget ?? data.next_target;
  const atMax       = avg >= 5.0;

  // Recalculate reviews needed for custom target
  const reviewsNeeded = atMax || target <= avg
    ? 0
    : Math.ceil((target * total - avg * total) / (5 - target));

  // Progress toward target
  const progress = target <= avg
    ? 100
    : Math.max(0, Math.min(100, Math.round(((avg - (target - 0.1)) / 0.1) * 100)));

  const [showStars, setShowStars] = useState(false);
  const [editingTarget, setEditingTarget] = useState(false);
  const [targetInput, setTargetInput] = useState('');

  function handleTargetSave() {
    const val = parseFloat(targetInput);
    if (!isNaN(val) && val > avg && val <= 5.0) {
      onSetTarget(platform, Math.round(val * 10) / 10);
    }
    setEditingTarget(false);
  }

  return (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)', overflow: 'hidden',
      boxShadow: 'var(--shadow-sm)',
    }}>
      {/* Header */}
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 8, height: 8, borderRadius: '50%',
            background: color, flexShrink: 0,
          }}/>
          <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink)' }}>
            {name}
          </div>
        </div>
        <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>
          {total} review{total !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Rating + target */}
      <div style={{ padding: '20px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 24, marginBottom: 16 }}>
          {/* Current */}
          <div>
            <div style={{ fontSize: 11, color: 'var(--ink-3)', marginBottom: 4 }}>Current</div>
            <div style={{
              fontSize: 40, fontFamily: 'var(--font-display)',
              color: 'var(--ink)', lineHeight: 1,
            }}>
              {avg.toFixed(1)}
            </div>
            <div style={{ fontSize: 11, color: '#E8A020', marginTop: 2 }}>
              {'★'.repeat(Math.round(avg))}{'☆'.repeat(5 - Math.round(avg))}
            </div>
          </div>

          <div style={{ fontSize: 20, color: 'var(--ink-3)', paddingBottom: 8 }}>→</div>

          {/* Target */}
          <div>
            <div style={{ fontSize: 11, color: 'var(--ink-3)', marginBottom: 4 }}>
              Target
              {!atMax && (
                <button
                  onClick={() => { setEditingTarget(true); setTargetInput(target.toString()); }}
                  style={{
                    marginLeft: 6, fontSize: 10, color: 'var(--ink-3)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    textDecoration: 'underline', padding: 0,
                  }}
                >
                  edit
                </button>
              )}
            </div>
            {editingTarget ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <input
                  type="number" min={avg + 0.1} max={5} step={0.1}
                  value={targetInput}
                  onChange={e => setTargetInput(e.target.value)}
                  style={{
                    width: 64, padding: '4px 8px', fontSize: 20,
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border)',
                    background: 'var(--bg)', color: 'var(--ink)',
                    fontFamily: 'var(--font-display)',
                  }}
                  autoFocus
                />
                <button onClick={handleTargetSave} style={{
                  padding: '4px 8px', borderRadius: 'var(--radius-md)',
                  background: 'var(--ink)', color: 'var(--bg)',
                  border: 'none', fontSize: 12, cursor: 'pointer',
                }}>✓</button>
                <button onClick={() => setEditingTarget(false)} style={{
                  padding: '4px 8px', borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-muted)', color: 'var(--ink-3)',
                  border: '1px solid var(--border)', fontSize: 12, cursor: 'pointer',
                }}>✕</button>
              </div>
            ) : (
              <>
                <div style={{
                  fontSize: 40, fontFamily: 'var(--font-display)',
                  color: color, lineHeight: 1,
                }}>
                  {atMax ? '5.0' : target.toFixed(1)}
                </div>
                <div style={{ fontSize: 11, color: '#E8A020', marginTop: 2 }}>
                  {'★'.repeat(Math.round(atMax ? 5 : target))}{'☆'.repeat(5 - Math.round(atMax ? 5 : target))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ marginBottom: 8 }}>
          <div style={{
            height: 8, background: 'var(--bg-muted)',
            borderRadius: 99, overflow: 'hidden', marginBottom: 6,
          }}>
            <div style={{
              width: `${progress}%`, height: '100%', borderRadius: 99,
              background: progress >= 100 ? 'var(--green)' : color,
              transition: 'width 1s ease',
            }}/>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--ink-3)' }}>
            <span>{progress}% of the way there</span>
            {!atMax && reviewsNeeded > 0 && (
              <span style={{ color, fontWeight: 600 }}>
                {reviewsNeeded} more 5★ reviews needed
              </span>
            )}
            {(atMax || reviewsNeeded === 0) && (
              <span style={{ color: 'var(--green)', fontWeight: 600 }}>
                ✓ Target reached!
              </span>
            )}
          </div>
        </div>

        {/* Key insight */}
        {!atMax && reviewsNeeded > 0 && (
          <div style={{
            background: 'var(--bg-muted)', borderRadius: 'var(--radius-md)',
            padding: '10px 14px', fontSize: 13, color: 'var(--ink-2)',
            lineHeight: 1.5,
          }}>
            You need <strong style={{ color: 'var(--ink)' }}>{reviewsNeeded} five-star reviews</strong> to
            go from {avg.toFixed(1)}★ to {target.toFixed(1)}★ on {name}.
          </div>
        )}
      </div>

      {/* Star breakdown toggle */}
      <div style={{ padding: '12px 20px' }}>
        <button
          onClick={() => setShowStars(v => !v)}
          style={{
            fontSize: 12, color: 'var(--ink-3)', background: 'none',
            border: 'none', cursor: 'pointer', padding: 0,
            display: 'flex', alignItems: 'center', gap: 4,
          }}
        >
          {showStars ? '▲' : '▼'} {showStars ? 'Hide' : 'Show'} star breakdown
        </button>
        {showStars && (
          <div style={{ marginTop: 12 }}>
            <StarBar breakdown={data.star_breakdown} total={total}/>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Goals() {
  const [ratings, setRatings]           = useState(null);
  const [loading, setLoading]           = useState(true);
  const [customTargets, setCustomTargets] = useState({});

  useEffect(() => {
    api.getRatings()
      .then(setRatings)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function handleSetTarget(platform, target) {
    setCustomTargets(prev => ({ ...prev, [platform]: target }));
  }

  const platforms = ratings ? Object.keys(ratings) : [];

  return (
    <div style={{ padding: '40px 48px', maxWidth: 900, margin: '0 auto', width: '100%' }}>

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 400, marginBottom: 6 }}>
            Goals
          </h1>
          <p style={{ color: 'var(--ink-2)', fontSize: 15 }}>
            Live rating breakdown by platform — see exactly how many 5★ reviews you need to hit the next milestone.
          </p>
        </div>
        <button
          onClick={() => { setLoading(true); api.getRatings().then(setRatings).finally(() => setLoading(false)); }}
          style={{
            padding: '9px 16px', borderRadius: 'var(--radius-md)',
            background: 'var(--bg-card)', color: 'var(--ink-2)',
            border: '1px solid var(--border)', fontSize: 13,
            fontWeight: 500, cursor: 'pointer', flexShrink: 0,
          }}
        >
          ↻ Refresh
        </button>
      </div>

      {loading && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
          <Spinner size={32}/>
        </div>
      )}

      {!loading && platforms.length === 0 && (
        <div style={{
          textAlign: 'center', padding: '60px 40px',
          background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border)',
        }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginBottom: 12 }}>
            No review data yet
          </div>
          <p style={{ color: 'var(--ink-2)', fontSize: 14, maxWidth: 360, margin: '0 auto' }}>
            Capture reviews using the Chrome extension or connect your Google Business Profile to see your rating goals.
          </p>
        </div>
      )}

      {!loading && platforms.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {platforms.map(function(platform) {
            return (
              <PlatformCard
                key={platform}
                platform={platform}
                data={ratings[platform]}
                customTarget={customTargets[platform] ?? null}
                onSetTarget={handleSetTarget}
              />
            );
          })}
        </div>
      )}

    </div>
  );
}
