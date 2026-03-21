import React, { useState, useEffect } from 'react';
import { api } from '../lib/api.js';
import { Spinner, Toast } from '../components/ui.jsx';

const PLATFORM_NAMES = {
  google:      'Google',
  facebook:    'Facebook',
  yelp:        'Yelp',
  tripadvisor: 'Tripadvisor',
  opentable:   'OpenTable',
  ubereats:    'Uber Eats',
  doordash:    'DoorDash',
  grubhub:     'Grubhub',
};

const PLATFORM_COLORS = {
  google:      '#4285F4',
  facebook:    '#1877F2',
  yelp:        '#D32323',
  tripadvisor: '#00AA6C',
  opentable:   '#DA3743',
  ubereats:    '#000000',
  doordash:    '#FF3008',
  grubhub:     '#FF8000',
};

function PlatformBadge({ platform }) {
  const name  = platform ? PLATFORM_NAMES[platform] ?? platform : 'Overall';
  const color = platform ? PLATFORM_COLORS[platform] ?? '#888' : '#1D9E75';
  return (
    <span style={{
      fontSize:11, fontWeight:600, padding:'2px 8px', borderRadius:99,
      background: color + '18',
      color, border:`1px solid ${color}40`,
      letterSpacing:'0.03em',
    }}>
      {name}
    </span>
  );
}

function daysUntil(deadline) {
  if (!deadline) return null;
  const days = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));
  return days;
}

function GoalCard({ goal, userRole, onEdit, onDelete }) {
  const days        = daysUntil(goal.deadline);
  const isOverdue   = days !== null && days < 0;
  const isUrgent    = days !== null && days <= 14 && days >= 0;
  const canEdit     = userRole === 'owner' || goal.allow_manager_edit;
  const progress    = Math.min(100, Math.max(0, goal.progress_pct ?? 0));

  return (
    <div style={{
      background:'var(--bg-card)', border:'1px solid var(--border)',
      borderRadius:'var(--radius-lg)', padding:'20px 24px',
      boxShadow:'var(--shadow-sm)',
    }}>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'flex-start',
        justifyContent:'space-between', marginBottom:16 }}>
        <div>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
            <PlatformBadge platform={goal.platform}/>
            {goal.allow_manager_edit && userRole === 'owner' && (
              <span style={{
                fontSize:10, color:'var(--ink-3)', padding:'2px 7px',
                borderRadius:99, border:'1px solid var(--border)',
                background:'var(--bg-muted)',
              }}>
                managers can edit
              </span>
            )}
          </div>
          <div style={{ fontSize:13, color:'var(--ink-3)' }}>
            {goal.location_name}
          </div>
        </div>
        {canEdit && (
          <div style={{ display:'flex', gap:6 }}>
            <button onClick={() => onEdit(goal)} style={{
              padding:'5px 12px', borderRadius:'var(--radius-md)',
              background:'var(--bg-muted)', color:'var(--ink-2)',
              border:'1px solid var(--border)', fontSize:12,
              fontWeight:500, cursor:'pointer',
            }}>
              Edit
            </button>
            {userRole === 'owner' && (
              <button onClick={() => onDelete(goal)} style={{
                padding:'5px 12px', borderRadius:'var(--radius-md)',
                background:'transparent', color:'var(--red)',
                border:'1px solid var(--red-border)', fontSize:12,
                fontWeight:500, cursor:'pointer',
              }}>
                Delete
              </button>
            )}
          </div>
        )}
      </div>

      {/* Rating target */}
      <div style={{ display:'flex', alignItems:'baseline',
        gap:12, marginBottom:16 }}>
        <div style={{ textAlign:'center' }}>
          <div style={{ fontSize:11, color:'var(--ink-3)', marginBottom:2 }}>Current</div>
          <div style={{ fontSize:32, fontWeight:500,
            fontFamily:'var(--font-display)', color:'var(--ink)', lineHeight:1 }}>
            {parseFloat(goal.current_rating).toFixed(1)}★
          </div>
          <div style={{ fontSize:11, color:'var(--ink-3)', marginTop:2 }}>
            {goal.current_reviews} reviews
          </div>
        </div>
        <div style={{ flex:1, textAlign:'center' }}>
          <div style={{ fontSize:20, color:'var(--ink-3)' }}>→</div>
        </div>
        <div style={{ textAlign:'center' }}>
          <div style={{ fontSize:11, color:'var(--ink-3)', marginBottom:2 }}>Target</div>
          <div style={{ fontSize:32, fontWeight:500,
            fontFamily:'var(--font-display)', color:'#1D9E75', lineHeight:1 }}>
            {parseFloat(goal.target_rating).toFixed(1)}★
          </div>
          {goal.deadline && (
            <div style={{ fontSize:11, color:'var(--ink-3)', marginTop:2 }}>
              by {new Date(goal.deadline).toLocaleDateString('en-US',
                { month:'short', day:'numeric', year:'numeric' })}
            </div>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ marginBottom:16 }}>
        <div style={{ height:8, background:'var(--bg-muted)',
          borderRadius:99, overflow:'hidden', marginBottom:6 }}>
          <div style={{
            height:'100%', borderRadius:99,
            width:`${progress}%`,
            background: progress >= 80 ? '#1D9E75' : progress >= 50 ? '#EF9F27' : '#E24B4A',
            transition:'width 1s ease',
          }}/>
        </div>
        <div style={{ display:'flex', justifyContent:'space-between',
          fontSize:11, color:'var(--ink-3)' }}>
          <span>{progress}% of the way there</span>
          {days !== null && (
            <span style={{ color: isOverdue ? 'var(--red)' : isUrgent ? '#BA7517' : 'var(--ink-3)' }}>
              {isOverdue
                ? `${Math.abs(days)} days overdue`
                : days === 0 ? 'Due today'
                : `${days} days left`}
            </span>
          )}
        </div>
      </div>

      {/* Key insight */}
      <div style={{
        background:'var(--bg-muted)', borderRadius:'var(--radius-md)',
        padding:'12px 16px', border:'1px solid var(--border)',
      }}>
        {goal.reviews_needed === 0 ? (
          <div style={{ fontSize:13, color:'#1D9E75', fontWeight:500 }}>
            ✓ Goal achieved! You've reached your target rating.
          </div>
        ) : (
          <>
            <div style={{ fontSize:13, fontWeight:500, color:'var(--ink)', marginBottom:4 }}>
              You need <span style={{ color:'#1D9E75' }}>{goal.reviews_needed} more 5★ reviews</span> to reach {parseFloat(goal.target_rating).toFixed(1)}
            </div>
            {goal.reviews_per_day && goal.deadline && (
              <div style={{ fontSize:12, color:'var(--ink-3)' }}>
                That's {goal.reviews_per_day} five-star reviews per day to hit your deadline.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function GoalModal({ goal, locations, onSave, onClose, userRole }) {
  const isEdit = !!goal?.id;
  const [locationId, setLocationId]         = useState(goal?.location_id ?? '');
  const [platform, setPlatform]             = useState(goal?.platform ?? '');
  const [currentRating, setCurrentRating]   = useState(goal?.current_rating ?? '');
  const [currentReviews, setCurrentReviews] = useState(goal?.current_reviews ?? '');
  const [targetRating, setTargetRating]     = useState(goal?.target_rating ?? '');
  const [deadline, setDeadline]             = useState(goal?.deadline?.split('T')[0] ?? '');
  const [allowManagerEdit, setAllowManagerEdit] = useState(goal?.allow_manager_edit ?? false);
  const [saving, setSaving]                 = useState(false);
  const [error, setError]                   = useState('');

  const platforms = [
    { key: '', label: 'Overall (all platforms)' },
    { key: 'google',      label: 'Google' },
    { key: 'facebook',    label: 'Facebook' },
    { key: 'yelp',        label: 'Yelp' },
    { key: 'tripadvisor', label: 'Tripadvisor' },
    { key: 'opentable',   label: 'OpenTable' },
    { key: 'ubereats',    label: 'Uber Eats' },
    { key: 'doordash',    label: 'DoorDash' },
    { key: 'grubhub',     label: 'Grubhub' },
  ];

  // Live math preview
  const cr = parseFloat(currentRating);
  const tr = parseFloat(targetRating);
  const cv = parseInt(currentReviews);
  let preview = null;
  if (!isNaN(cr) && !isNaN(tr) && !isNaN(cv) && tr > cr && tr <= 5) {
    const needed = Math.ceil((tr * cv - cr * cv) / (5 - tr));
    preview = Math.max(0, needed);
  }

  async function handleSave() {
    if (!locationId) { setError('Please select a location'); return; }
    if (!currentRating) { setError('Please enter the current rating'); return; }
    if (!targetRating) { setError('Please enter the target rating'); return; }
    if (parseFloat(targetRating) <= parseFloat(currentRating)) {
      setError('Target rating must be higher than current rating'); return;
    }
    if (parseFloat(targetRating) > 5) {
      setError('Target rating cannot exceed 5.0'); return;
    }
    setSaving(true);
    try {
      await onSave({
        location_id:        locationId,
        platform:           platform || null,
        current_rating:     parseFloat(currentRating),
        current_reviews:    parseInt(currentReviews) || 0,
        target_rating:      parseFloat(targetRating),
        deadline:           deadline || null,
        allow_manager_edit: allowManagerEdit,
      });
    } catch (e) {
      setError(e.message);
      setSaving(false);
    }
  }

  const inputStyle = {
    width:'100%', padding:'9px 12px', fontSize:13,
    borderRadius:'var(--radius-md)', marginBottom:14,
    border:'1px solid var(--border)',
    background:'var(--bg)', color:'var(--ink)', outline:'none',
  };

  return (
    <div
      onClick={e => e.target === e.currentTarget && onClose()}
      style={{
        position:'fixed', inset:0, background:'rgba(0,0,0,0.4)',
        display:'flex', alignItems:'center', justifyContent:'center',
        zIndex:1000, padding:24,
      }}
    >
      <div style={{
        background:'var(--bg-card)', borderRadius:'var(--radius-xl)',
        padding:'28px 32px', width:'100%', maxWidth:500,
        boxShadow:'var(--shadow-lg)', maxHeight:'90vh', overflowY:'auto',
      }}>
        <div style={{ fontSize:18, fontWeight:500, color:'var(--ink)', marginBottom:4 }}>
          {isEdit ? 'Edit goal' : 'New goal'}
        </div>
        <div style={{ fontSize:13, color:'var(--ink-3)', marginBottom:24 }}>
          Set a rating target and we'll tell you exactly how many 5★ reviews you need.
        </div>

        <label style={{ fontSize:13, fontWeight:500, color:'var(--ink-2)',
          display:'block', marginBottom:6 }}>Location</label>
        <select value={locationId} onChange={e => setLocationId(e.target.value)}
          style={{ ...inputStyle }}>
          <option value="">Select a location...</option>
          {locations.map(l => (
            <option key={l.id} value={l.id}>{l.name}</option>
          ))}
        </select>

        <label style={{ fontSize:13, fontWeight:500, color:'var(--ink-2)',
          display:'block', marginBottom:6 }}>Platform</label>
        <select value={platform} onChange={e => setPlatform(e.target.value)}
          style={{ ...inputStyle }}>
          {platforms.map(p => (
            <option key={p.key} value={p.key}>{p.label}</option>
          ))}
        </select>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          <div>
            <label style={{ fontSize:13, fontWeight:500, color:'var(--ink-2)',
              display:'block', marginBottom:6 }}>Current rating</label>
            <input type="number" min="1" max="5" step="0.1"
              value={currentRating}
              onChange={e => setCurrentRating(e.target.value)}
              placeholder="e.g. 4.4"
              style={{ ...inputStyle }}/>
          </div>
          <div>
            <label style={{ fontSize:13, fontWeight:500, color:'var(--ink-2)',
              display:'block', marginBottom:6 }}>Total reviews</label>
            <input type="number" min="0"
              value={currentReviews}
              onChange={e => setCurrentReviews(e.target.value)}
              placeholder="e.g. 89"
              style={{ ...inputStyle }}/>
          </div>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          <div>
            <label style={{ fontSize:13, fontWeight:500, color:'var(--ink-2)',
              display:'block', marginBottom:6 }}>Target rating</label>
            <input type="number" min="1" max="5" step="0.1"
              value={targetRating}
              onChange={e => setTargetRating(e.target.value)}
              placeholder="e.g. 4.5"
              style={{ ...inputStyle }}/>
          </div>
          <div>
            <label style={{ fontSize:13, fontWeight:500, color:'var(--ink-2)',
              display:'block', marginBottom:6 }}>Deadline (optional)</label>
            <input type="date"
              value={deadline}
              onChange={e => setDeadline(e.target.value)}
              style={{ ...inputStyle }}/>
          </div>
        </div>

        {/* Live preview */}
        {preview !== null && (
          <div style={{
            background:'#E1F5EE', border:'1px solid #9FE1CB',
            borderRadius:'var(--radius-md)', padding:'12px 16px',
            marginBottom:14,
          }}>
            <div style={{ fontSize:13, fontWeight:500, color:'#085041' }}>
              You need <strong>{preview} five-star reviews</strong> to go from {parseFloat(currentRating).toFixed(1)} → {parseFloat(targetRating).toFixed(1)}
            </div>
          </div>
        )}

        {userRole === 'owner' && (
          <div
            onClick={() => setAllowManagerEdit(v => !v)}
            style={{
              display:'flex', alignItems:'center', gap:10,
              padding:'10px 14px', borderRadius:'var(--radius-md)',
              border:`1px solid ${allowManagerEdit ? 'var(--blue-border)' : 'var(--border)'}`,
              background: allowManagerEdit ? 'var(--blue-bg)' : 'var(--bg-muted)',
              cursor:'pointer', marginBottom:14,
            }}
          >
            <div style={{
              width:18, height:18, borderRadius:4, flexShrink:0,
              border:`1.5px solid ${allowManagerEdit ? 'var(--blue)' : 'var(--border)'}`,
              background: allowManagerEdit ? 'var(--blue)' : 'transparent',
              display:'flex', alignItems:'center', justifyContent:'center',
            }}>
              {allowManagerEdit && (
                <span style={{ color:'#fff', fontSize:11, lineHeight:1 }}>✓</span>
              )}
            </div>
            <div>
              <div style={{ fontSize:13, fontWeight:500, color:'var(--ink)' }}>
                Allow managers to edit this goal
              </div>
              <div style={{ fontSize:11, color:'var(--ink-3)' }}>
                Managers assigned to this location can update the current rating and reviews
              </div>
            </div>
          </div>
        )}

        {error && (
          <div style={{ fontSize:12, color:'var(--red)', marginBottom:12 }}>{error}</div>
        )}

        <div style={{ display:'flex', gap:8 }}>
          <button onClick={onClose} style={{
            flex:1, padding:'10px', borderRadius:'var(--radius-md)',
            background:'var(--bg-muted)', color:'var(--ink-2)',
            border:'1px solid var(--border)', fontSize:13,
            fontWeight:500, cursor:'pointer',
          }}>
            Cancel
          </button>
          <button onClick={handleSave} disabled={saving} style={{
            flex:2, padding:'10px', borderRadius:'var(--radius-md)',
            background:'var(--ink)', color:'var(--bg)',
            border:'none', fontSize:13, fontWeight:500,
            cursor:'pointer', opacity: saving ? 0.6 : 1,
            display:'flex', alignItems:'center', justifyContent:'center', gap:8,
          }}>
            {saving ? <><Spinner size={14} color="var(--bg)"/> Saving...</> : isEdit ? 'Save changes' : 'Create goal'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Goals() {
  const [goals, setGoals]         = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [modal, setModal]         = useState(null);
  const [toast, setToast]         = useState(null);
  const [userRole, setUserRole]   = useState('owner');

  useEffect(() => {
    Promise.all([api.getGoals(), api.getLocations(), api.getMe()])
      .then(([g, l, me]) => {
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
        reviews_needed: Math.ceil(
          (data.target_rating * data.current_reviews - data.current_rating * data.current_reviews) /
          (5 - data.target_rating)
        ),
        progress_pct: 0,
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

  const grouped = goals.reduce((acc, g) => {
    const key = g.location_name;
    if (!acc[key]) acc[key] = [];
    acc[key].push(g);
    return acc;
  }, {});

  if (loading) return (
    <div style={{ display:'flex', justifyContent:'center', padding:80 }}>
      <Spinner size={32}/>
    </div>
  );

  return (
    <div style={{ padding:'40px 48px', maxWidth:900, margin:'0 auto', width:'100%' }}>

      <div style={{ display:'flex', alignItems:'flex-start',
        justifyContent:'space-between', marginBottom:32 }}>
        <div>
          <h1 style={{ fontFamily:'var(--font-display)', fontSize:32,
            fontWeight:400, marginBottom:6 }}>
            Goals
          </h1>
          <p style={{ color:'var(--ink-2)', fontSize:15 }}>
            Set rating targets and track exactly how many 5★ reviews you need to get there.
          </p>
        </div>
        {userRole === 'owner' && (
          <button onClick={() => setModal({})} style={{
            padding:'10px 20px', borderRadius:'var(--radius-md)',
            background:'var(--ink)', color:'var(--bg)',
            border:'none', fontSize:13, fontWeight:500,
            cursor:'pointer', flexShrink:0,
          }}>
            + New goal
          </button>
        )}
      </div>

      {goals.length === 0 ? (
        <div style={{
          textAlign:'center', padding:'60px 40px',
          background:'var(--bg-card)', borderRadius:'var(--radius-xl)',
          border:'1px solid var(--border)',
        }}>
          <div style={{ fontFamily:'var(--font-display)', fontSize:22,
            marginBottom:10, color:'var(--ink)' }}>
            No goals yet
          </div>
          <p style={{ color:'var(--ink-2)', fontSize:14, marginBottom:24, maxWidth:360, margin:'0 auto 24px' }}>
            Set a rating target for any location and platform — we'll calculate exactly how many 5★ reviews you need.
          </p>
          {userRole === 'owner' && (
            <button onClick={() => setModal({})} style={{
              padding:'10px 20px', borderRadius:'var(--radius-md)',
              background:'var(--ink)', color:'var(--bg)',
              border:'none', fontSize:13, fontWeight:500, cursor:'pointer',
            }}>
              + Create your first goal
            </button>
          )}
        </div>
      ) : (
        Object.entries(grouped).map(([locationName, locationGoals]) => (
          <div key={locationName} style={{ marginBottom:32 }}>
            <div style={{ fontSize:11, fontWeight:600, letterSpacing:'0.07em',
              textTransform:'uppercase', color:'var(--ink-3)', marginBottom:12 }}>
              {locationName}
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
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
          goal={modal?.id ? modal : null}
          locations={locations}
          userRole={userRole}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}

      {toast && <Toast {...toast} onDismiss={() => setToast(null)}/>}
    </div>
  );
}
