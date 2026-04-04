import React, { useState, useEffect } from 'react';
import { api } from '../lib/api.js';
import { Spinner, Toast } from '../components/ui.jsx';

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

function daysUntil(deadline) {
  if (!deadline) return null;
  return Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));
}

function StarBar({ breakdown, total }) {
  if (!total) return null;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {[5, 4, 3, 2, 1].map(star => {
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

function RatingCard({ platform, data, onSetGoal }) {
  const color  = PLATFORM_COLORS[platform] ?? '#888';
  const name   = PLATFORM_NAMES[platform] ?? platform;
  const avg    = data.avg_rating;
  const total  = data.total_reviews;
  const target = data.next_target;
  const atMax  = avg >= 5.0;
  const reviewsNeeded = atMax ? 0 : data.reviews_needed;
  const progress = target <= avg
    ? 100
    : Math.max(0, Math.min(100, Math.round(((avg - (target - 0.1)) / 0.1) * 100)));

  const [showStars, setShowStars] = useState(false);

  return (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)', overflow: 'hidden',
      boxShadow: 'var(--shadow-sm)',
    }}>
      {/* Header */}
      <div style={{
        padding: '14px 18px', borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: color }}/>
          <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink)' }}>{name}</div>
        </div>
        <div style={{ fontSize: 11, color: 'var(--ink-3)' }}>{total} reviews</div>
      </div>

      {/* Rating row */}
      <div style={{ padding: '16px 18px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 20, marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 10, color: 'var(--ink-3)', marginBottom: 3 }}>Current</div>
            <div style={{ fontSize: 36, fontFamily: 'var(--font-display)', color: 'var(--ink)', lineHeight: 1 }}>
              {avg.toFixed(1)}
            </div>
            <div style={{ fontSize: 10, color: '#E8A020', marginTop: 2 }}>
              {'★'.repeat(Math.round(avg))}{'☆'.repeat(5 - Math.round(avg))}
            </div>
          </div>
          <div style={{ fontSize: 18, color: 'var(--ink-3)', paddingBottom: 6 }}>→</div>
          <div>
            <div style={{ fontSize: 10, color: 'var(--ink-3)', marginBottom: 3 }}>Next target</div>
            <div style={{ fontSize: 36, fontFamily: 'var(--font-display)', color, lineHeight: 1 }}>
              {atMax ? '5.0' : target.toFixed(1)}
            </div>
            <div style={{ fontSize: 10, color: '#E8A020', marginTop: 2 }}>
              {'★'.repeat(Math.round(atMax ? 5 : target))}{'☆'.repeat(5 - Math.round(atMax ? 5 : target))}
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ height: 6, background: 'var(--bg-muted)', borderRadius: 99, overflow: 'hidden', marginBottom: 6 }}>
          <div style={{
            width: `${progress}%`, height: '100%', borderRadius: 99,
            background: progress >= 100 ? 'var(--green)' : color,
            transition: 'width 1s ease',
          }}/>
        </div>

        {/* Insight */}
        {!atMax && reviewsNeeded > 0 && (
          <div style={{ fontSize: 12, color: 'var(--ink-2)', marginTop: 8 }}>
            <strong style={{ color: 'var(--ink)' }}>{reviewsNeeded} five-star reviews</strong> needed to reach {target.toFixed(1)}★
          </div>
        )}
        {(atMax || reviewsNeeded === 0) && (
          <div style={{ fontSize: 12, color: 'var(--green)', fontWeight: 500, marginTop: 8 }}>
            ✓ Target reached!
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ padding: '10px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button
          onClick={() => setShowStars(v => !v)}
          style={{
            fontSize: 11, color: 'var(--ink-3)', background: 'none',
            border: 'none', cursor: 'pointer', padding: 0,
          }}
        >
          {showStars ? '▲ Hide' : '▼ Show'} star breakdown
        </button>
        <button
          onClick={() => onSetGoal(platform, data)}
          style={{
            fontSize: 11, fontWeight: 500, color: color,
            background: 'none', border: `1px solid ${color}40`,
            borderRadius: 'var(--radius-md)', padding: '4px 10px',
            cursor: 'pointer',
          }}
        >
          + Set goal
        </button>
      </div>
      {showStars && (
        <div style={{ padding: '0 18px 14px' }}>
          <StarBar breakdown={data.star_breakdown} total={total}/>
        </div>
      )}
    </div>
  );
}

function GoalCard({ goal, userRole, onEdit, onDelete }) {
  const days      = daysUntil(goal.deadline);
  const isOverdue = days !== null && days < 0;
  const isUrgent  = days !== null && days <= 14 && days >= 0;
  const canEdit   = userRole === 'owner' || goal.allow_manager_edit;
  const color     = PLATFORM_COLORS[goal.platform] ?? '#1D9E75';
  const name      = goal.platform ? (PLATFORM_NAMES[goal.platform] ?? goal.platform) : 'Overall';

  const cr = parseFloat(goal.current_rating);
  const tr = parseFloat(goal.target_rating);
  const cv = parseInt(goal.current_reviews) || 0;
  const reviewsNeeded = tr > cr && tr <= 5 && cv > 0
    ? Math.max(0, Math.ceil((tr * cv - cr * cv) / (5 - tr)))
    : 0;
  const reviewsPerDay = goal.deadline && reviewsNeeded > 0 && days > 0
    ? (reviewsNeeded / days).toFixed(1)
    : null;
  const progress = tr <= cr ? 100 : Math.max(0, Math.min(100, Math.round(((cr - (tr - 1)) / 1) * 100)));

  return (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)', padding: '18px 20px',
      boxShadow: 'var(--shadow-sm)',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{
              fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 99,
              background: color + '18', color, border: `1px solid ${color}40`,
            }}>
              {name}
            </span>
            {goal.allow_manager_edit && userRole === 'owner' && (
              <span style={{
                fontSize: 10, color: 'var(--ink-3)', padding: '2px 7px',
                borderRadius: 99, border: '1px solid var(--border)',
                background: 'var(--bg-muted)',
              }}>
                managers can edit
              </span>
            )}
          </div>
          <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>{goal.location_name}</div>
        </div>
        {canEdit && (
          <div style={{ display: 'flex', gap: 6 }}>
            <button onClick={() => onEdit(goal)} style={{
              padding: '4px 10px', borderRadius: 'var(--radius-md)',
              background: 'var(--bg-muted)', color: 'var(--ink-2)',
              border: '1px solid var(--border)', fontSize: 11,
              fontWeight: 500, cursor: 'pointer',
            }}>Edit</button>
            {userRole === 'owner' && (
              <button onClick={() => onDelete(goal)} style={{
                padding: '4px 10px', borderRadius: 'var(--radius-md)',
                background: 'transparent', color: 'var(--red)',
                border: '1px solid var(--red-border)', fontSize: 11,
                fontWeight: 500, cursor: 'pointer',
              }}>Delete</button>
            )}
          </div>
        )}
      </div>

      {/* Rating */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 14 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 10, color: 'var(--ink-3)', marginBottom: 2 }}>Current</div>
          <div style={{ fontSize: 28, fontFamily: 'var(--font-display)', color: 'var(--ink)', lineHeight: 1 }}>
            {cr.toFixed(1)}★
          </div>
          <div style={{ fontSize: 10, color: 'var(--ink-3)', marginTop: 2 }}>{cv} reviews</div>
        </div>
        <div style={{ flex: 1, textAlign: 'center', fontSize: 18, color: 'var(--ink-3)' }}>→</div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 10, color: 'var(--ink-3)', marginBottom: 2 }}>Target</div>
          <div style={{ fontSize: 28, fontFamily: 'var(--font-display)', color: '#1D9E75', lineHeight: 1 }}>
            {tr.toFixed(1)}★
          </div>
          {goal.deadline && (
            <div style={{ fontSize: 10, color: 'var(--ink-3)', marginTop: 2 }}>
              by {new Date(goal.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ height: 7, background: 'var(--bg-muted)', borderRadius: 99, overflow: 'hidden', marginBottom: 5 }}>
          <div style={{
            height: '100%', borderRadius: 99, width: `${progress}%`,
            background: progress >= 80 ? '#1D9E75' : progress >= 50 ? '#EF9F27' : '#E24B4A',
            transition: 'width 1s ease',
          }}/>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--ink-3)' }}>
          <span>{progress}% there</span>
          {days !== null && (
            <span style={{ color: isOverdue ? 'var(--red)' : isUrgent ? '#BA7517' : 'var(--ink-3)' }}>
              {isOverdue ? `${Math.abs(days)}d overdue` : days === 0 ? 'Due today' : `${days}d left`}
            </span>
          )}
        </div>
      </div>

      {/* Insight */}
      <div style={{
        background: 'var(--bg-muted)', borderRadius: 'var(--radius-md)',
        padding: '10px 14px', border: '1px solid var(--border)', fontSize: 12,
      }}>
        {reviewsNeeded === 0 ? (
          <span style={{ color: '#1D9E75', fontWeight: 500 }}>✓ Goal achieved!</span>
        ) : (
          <>
            <strong style={{ color: 'var(--ink)' }}>{reviewsNeeded} five-star reviews</strong>
            <span style={{ color: 'var(--ink-2)' }}> to reach {tr.toFixed(1)}★</span>
            {reviewsPerDay && (
              <span style={{ color: 'var(--ink-3)' }}> — {reviewsPerDay}/day to hit deadline</span>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function GoalModal({ goal, locations, ratings, onSave, onClose, userRole }) {
  const isEdit = !!goal?.id;

  const [locationId,       setLocationId]       = useState(goal?.location_id ?? '');
  const [platform,         setPlatform]         = useState(goal?.platform ?? '');
  const [currentRating,    setCurrentRating]    = useState(goal?.current_rating ?? '');
  const [currentReviews,   setCurrentReviews]   = useState(goal?.current_reviews ?? '');
  const [targetRating,     setTargetRating]     = useState(goal?.target_rating ?? '');
  const [deadline,         setDeadline]         = useState(goal?.deadline?.split('T')[0] ?? '');
  const [allowManagerEdit, setAllowManagerEdit] = useState(goal?.allow_manager_edit ?? false);
  const [saving,           setSaving]           = useState(false);
  const [error,            setError]            = useState('');

  // Auto-fill from live ratings when platform changes
  useEffect(() => {
    if (!isEdit && platform && ratings?.[platform]) {
      const data = ratings[platform];
      setCurrentRating(data.avg_rating.toFixed(1));
      setCurrentReviews(data.total_reviews.toString());
    }
  }, [platform]);

  const platforms = [
    { key: '',           label: 'Overall (all platforms)' },
    { key: 'google',     label: 'Google' },
    { key: 'facebook',   label: 'Facebook' },
    { key: 'yelp',       label: 'Yelp' },
    { key: 'tripadvisor',label: 'Tripadvisor' },
    { key: 'opentable',  label: 'OpenTable' },
    { key: 'ubereats',   label: 'Uber Eats' },
    { key: 'doordash',   label: 'DoorDash' },
    { key: 'grubhub',    label: 'Grubhub' },
  ];

  const cr = parseFloat(currentRating);
  const tr = parseFloat(targetRating);
  const cv = parseInt(currentReviews);
  const preview = !isNaN(cr) && !isNaN(tr) && !isNaN(cv) && tr > cr && tr <= 5
    ? Math.max(0, Math.ceil((tr * cv - cr * cv) / (5 - tr)))
    : null;

  async function handleSave() {
    if (!locationId)   { setError('Please select a location'); return; }
    if (!currentRating){ setError('Please enter the current rating'); return; }
    if (!targetRating) { setError('Please enter the target rating'); return; }
    if (tr <= cr)      { setError('Target must be higher than current rating'); return; }
    if (tr > 5)        { setError('Target cannot exceed 5.0'); return; }
    setSaving(true);
    try {
      await onSave({
        location_id:        locationId,
        platform:           platform || null,
        current_rating:     cr,
        current_reviews:    cv || 0,
        target_rating:      tr,
        deadline:           deadline || null,
        allow_manager_edit: allowManagerEdit,
      });
    } catch (e) {
      setError(e.message);
      setSaving(false);
    }
  }

  const inputStyle = {
    width: '100%', padding: '9px 12px', fontSize: 13,
    borderRadius: 'var(--radius-md)', marginBottom: 14,
    border: '1px solid var(--border)',
    background: 'var(--bg)', color: 'var(--ink)', outline: 'none',
  };

  return (
    <div
      onClick={e => e.target === e.currentTarget && onClose()}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000, padding: 24,
      }}
    >
      <div style={{
        background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)',
        padding: '28px 32px', width: '100%', maxWidth: 500,
        boxShadow: 'var(--shadow-lg)', maxHeight: '90vh', overflowY: 'auto',
      }}>
        <div style={{ fontSize: 17, fontWeight: 500, color: 'var(--ink)', marginBottom: 4 }}>
          {isEdit ? 'Edit goal' : 'New goal'}
        </div>
        <div style={{ fontSize: 13, color: 'var(--ink-3)', marginBottom: 24 }}>
          Set a deadline-based target — we'll pre-fill your current rating from live data.
        </div>

        <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink-2)', display: 'block', marginBottom: 6 }}>
          Location
        </label>
        <select value={locationId} onChange={e => setLocationId(e.target.value)} style={inputStyle}>
          <option value="">Select a location...</option>
          {locations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
        </select>

        <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink-2)', display: 'block', marginBottom: 6 }}>
          Platform
        </label>
        <select value={platform} onChange={e => setPlatform(e.target.value)} style={inputStyle}>
          {platforms.map(p => <option key={p.key} value={p.key}>{p.label}</option>)}
        </select>

        {platform && ratings?.[platform] && !isEdit && (
          <div style={{
            background: 'var(--green-bg)', border: '1px solid var(--green-border)',
            borderRadius: 'var(--radius-md)', padding: '10px 14px',
            fontSize: 12, color: 'var(--green)', marginBottom: 14,
          }}>
            ✓ Pre-filled from your live {PLATFORM_NAMES[platform] ?? platform} data
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink-2)', display: 'block', marginBottom: 6 }}>
              Target rating
            </label>
            <input type="number" min="1" max="5" step="0.1"
              value={targetRating} onChange={e => setTargetRating(e.target.value)}
              placeholder="e.g. 4.7" style={inputStyle}/>
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink-2)', display: 'block', marginBottom: 6 }}>
              Deadline (optional)
            </label>
            <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)} style={inputStyle}/>
          </div>
        </div>

        {preview !== null && (
          <div style={{
            background: '#E1F5EE', border: '1px solid #9FE1CB',
            borderRadius: 'var(--radius-md)', padding: '12px 16px', marginBottom: 14,
          }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: '#085041' }}>
              You need <strong>{preview} five-star reviews</strong> to go from {cr.toFixed(1)} → {tr.toFixed(1)}
            </div>
          </div>
        )}

        {userRole === 'owner' && (
          <div
            onClick={() => setAllowManagerEdit(v => !v)}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 14px', borderRadius: 'var(--radius-md)',
              border: `1px solid ${allowManagerEdit ? 'var(--blue-border)' : 'var(--border)'}`,
              background: allowManagerEdit ? 'var(--blue-bg)' : 'var(--bg-muted)',
              cursor: 'pointer', marginBottom: 14,
            }}
          >
            <div style={{
              width: 18, height: 18, borderRadius: 4, flexShrink: 0,
              border: `1.5px solid ${allowManagerEdit ? 'var(--blue)' : 'var(--border)'}`,
              background: allowManagerEdit ? 'var(--blue)' : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {allowManagerEdit && <span style={{ color: '#fff', fontSize: 11 }}>✓</span>}
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink)' }}>
                Allow managers to edit this goal
              </div>
              <div style={{ fontSize: 11, color: 'var(--ink-3)' }}>
                Managers assigned to this location can update the rating and review count
              </div>
            </div>
          </div>
        )}

        {error && <div style={{ fontSize: 12, color: 'var(--red)', marginBottom: 12 }}>{error}</div>}

        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={onClose} style={{
            flex: 1, padding: '10px', borderRadius: 'var(--radius-md)',
            background: 'var(--bg-muted)', color: 'var(--ink-2)',
            border: '1px solid var(--border)', fontSize: 13, fontWeight: 500, cursor: 'pointer',
          }}>Cancel</button>
          <button onClick={handleSave} disabled={saving} style={{
            flex: 2, padding: '10px', borderRadius: 'var(--radius-md)',
            background: 'var(--ink)', color: 'var(--bg)',
            border: 'none', fontSize: 13, fontWeight: 500, cursor: 'pointer',
            opacity: saving ? 0.6 : 1,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}>
            {saving ? <><Spinner size={14} color="var(--bg)"/> Saving...</> : isEdit ? 'Save changes' : 'Create goal'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Goals() {
  const [ratings,   setRatings]   = useState(null);
  const [goals,     setGoals]     = useState([]);
  const [locations, setLocations] = useState([]);
  const [userRole,  setUserRole]  = useState('owner');
  const [loading,   setLoading]   = useState(true);
  const [modal,     setModal]     = useState(null);
  const [toast,     setToast]     = useState(null);

  useEffect(() => {
    Promise.all([api.getRatings(), api.getGoals(), api.getLocations(), api.getMe()])
      .then(([r, g, l, me]) => {
        setRatings(r);
        setGoals(g);
        setLocations(l);
        setUserRole(me?.user?.role ?? me?.role ?? 'owner');
      })
      .catch(e => showToast(e.message, 'error'))
      .finally(() => setLoading(false));
  }, []);

  function showToast(message, type = 'success') {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }

  function handleSetGoal(platform, data) {
    // Pre-seed modal with platform and live data
    setModal({ _prefill: { platform, current_rating: data.avg_rating, current_reviews: data.total_reviews } });
  }

  async function handleSave(data) {
    if (modal?.id) {
      const updated = await api.updateGoal(modal.id, data);
      setGoals(prev => prev.map(g => g.id === modal.id ? { ...g, ...updated } : g));
      showToast('Goal updated');
    } else {
      const created = await api.createGoal(data);
      setGoals(prev => [...prev, {
        ...created,
        location_name: locations.find(l => l.id === data.location_id)?.name ?? '',
      }]);
      showToast('Goal created');
    }
    setModal(null);
  }

  async function handleDelete(goal) {
    if (!window.confirm(`Delete this goal for ${goal.location_name}?`)) return;
    await api.deleteGoal(goal.id).catch(() => {});
    setGoals(prev => prev.filter(g => g.id !== goal.id));
    showToast('Goal deleted');
  }

  const platforms = ratings ? Object.keys(ratings) : [];
  const grouped   = goals.reduce((acc, g) => {
    const key = g.location_name ?? 'Unknown';
    if (!acc[key]) acc[key] = [];
    acc[key].push(g);
    return acc;
  }, {});

  // Build modal goal from prefill or existing goal
  const modalGoal = modal?.id ? modal : modal?._prefill
    ? { platform: modal._prefill.platform, current_rating: modal._prefill.current_rating, current_reviews: modal._prefill.current_reviews }
    : null;

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
      <Spinner size={32}/>
    </div>
  );

  return (
    <div style={{ padding: '40px 48px', maxWidth: 960, margin: '0 auto', width: '100%' }}>

      {/* Page header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 400, marginBottom: 6 }}>
            Goals
          </h1>
          <p style={{ color: 'var(--ink-2)', fontSize: 15 }}>
            Live ratings by platform + deadline-based goals to track your targets.
          </p>
        </div>
        {userRole === 'owner' && (
          <button onClick={() => setModal({})} style={{
            padding: '10px 20px', borderRadius: 'var(--radius-md)',
            background: 'var(--ink)', color: 'var(--bg)',
            border: 'none', fontSize: 13, fontWeight: 500, cursor: 'pointer', flexShrink: 0,
          }}>
            + New goal
          </button>
        )}
      </div>

      {/* Section 1 — Live Rating Snapshot */}
      {platforms.length > 0 && (
        <>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.07em',
            textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 14 }}>
            Live rating snapshot
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 40 }}>
            {platforms.map(platform => (
              <RatingCard
                key={platform}
                platform={platform}
                data={ratings[platform]}
                onSetGoal={handleSetGoal}
              />
            ))}
          </div>
        </>
      )}

      {/* Section 2 — Date-based Goals */}
      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.07em',
        textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 14 }}>
        Goals with deadlines
      </div>

      {goals.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '48px 40px',
          background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border)',
        }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, marginBottom: 8, color: 'var(--ink)' }}>
            No goals yet
          </div>
          <p style={{ color: 'var(--ink-2)', fontSize: 14, marginBottom: 20, maxWidth: 360, margin: '0 auto 20px' }}>
            Click "+ Set goal" on any platform card above, or create a custom goal with a deadline.
          </p>
          {userRole === 'owner' && (
            <button onClick={() => setModal({})} style={{
              padding: '10px 20px', borderRadius: 'var(--radius-md)',
              background: 'var(--ink)', color: 'var(--bg)',
              border: 'none', fontSize: 13, fontWeight: 500, cursor: 'pointer',
            }}>
              + Create your first goal
            </button>
          )}
        </div>
      ) : (
        Object.entries(grouped).map(([locationName, locationGoals]) => (
          <div key={locationName} style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em',
              textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 10 }}>
              {locationName}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {locationGoals.map(goal => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  userRole={userRole}
                  onEdit={g => setModal(g)}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </div>
        ))
      )}

      {modal !== null && (
        <GoalModal
          goal={modalGoal}
          locations={locations}
          ratings={ratings}
          userRole={userRole}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}

      {toast && <Toast {...toast} onDismiss={() => setToast(null)}/>}
    </div>
  );
}
