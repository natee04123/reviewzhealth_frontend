import React, { useState, useEffect } from 'react';
import { api } from '../lib/api.js';
import ReviewCard from '../components/ReviewCard.jsx';
import { Spinner, EmptyState } from '../components/ui.jsx';

const PLATFORMS = [
  { key: '', label: 'All platforms' },
  { key: 'google', label: 'Google' },
  { key: 'ubereats', label: 'Uber Eats' },
  { key: 'doordash', label: 'DoorDash' },
  { key: 'yelp', label: 'Yelp' },
  { key: 'tripadvisor', label: 'Tripadvisor' },
  { key: 'opentable', label: 'OpenTable' },
  { key: 'grubhub', label: 'Grubhub' },
  { key: 'facebook', label: 'Facebook' },
];

const STARS = [
  { key: '', label: 'All stars' },
  { key: '5', label: '★★★★★' },
  { key: '4', label: '★★★★' },
  { key: '3', label: '★★★' },
  { key: '2', label: '★★' },
  { key: '1', label: '★' },
];

const SORTS = [
  { key: 'newest', label: 'Newest first' },
  { key: 'oldest', label: 'Oldest first' },
  { key: 'highest', label: 'Highest rated' },
  { key: 'lowest', label: 'Lowest rated' },
];

const TABS = [
  { key: 'pending',   label: 'Needs attention' },
  { key: '',          label: 'All reviews' },
  { key: 'posted',    label: 'Posted' },
  { key: 'dismissed', label: 'Dismissed' },
];

const selectStyle = {
  padding: '7px 10px', fontSize: 13,
  borderRadius: 'var(--radius-md)',
  border: '1px solid var(--border)',
  background: 'var(--bg-card)', color: 'var(--ink)',
  cursor: 'pointer', outline: 'none',
};

export default function Dashboard() {
  const [activeTab, setActiveTab]       = useState('pending');
  const [reviews, setReviews]           = useState([]);
  const [allReviews, setAllReviews]     = useState([]);
  const [locations, setLocations]       = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [platform, setPlatform]         = useState('');
  const [starRating, setStarRating]     = useState('');
  const [sort, setSort]                 = useState('newest');
  const [locationId, setLocationId]     = useState('');
  const [showPlanPrompt, setShowPlanPrompt] = useState(
    !!localStorage.getItem('rzh_signup_plan')
  );

  const signupPlan = localStorage.getItem('rzh_signup_plan');

  function dismissPlanPrompt() {
    localStorage.removeItem('rzh_signup_plan');
    setShowPlanPrompt(false);
  }

  useEffect(() => {
    api.getLocations().then(locs => setLocations(locs ?? [])).catch(() => {});
    api.getReviews({}).then(setAllReviews).catch(() => {});
  }, []);

  useEffect(() => {
    loadReviews();
  }, [activeTab, platform, starRating, sort, locationId]);

  async function loadReviews() {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (activeTab) params.status = activeTab;
      if (platform) params.platform = platform;
      if (starRating) params.star_rating = starRating;
      if (sort !== 'newest') params.sort = sort;
      if (locationId) params.location_id = locationId;
      const data = await api.getReviews(params);
      setReviews(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  function reload() {
    loadReviews();
    api.getReviews({}).then(setAllReviews).catch(() => {});
  }

  function resetFilters() {
    setPlatform('');
    setStarRating('');
    setSort('newest');
    setLocationId('');
  }

  const hasFilters = platform || starRating || sort !== 'newest' || locationId;

  const pendingCount  = allReviews.filter(r => (r.draft_status ?? r.status) === 'pending').length;
  const postedCount   = allReviews.filter(r => (r.draft_status ?? r.status) === 'posted').length;
  const totalCount    = allReviews.length;

  return (
    <div style={{ padding:'40px 48px', maxWidth:900, margin:'0 auto', width:'100%' }}>

      {showPlanPrompt && signupPlan && (
        <div style={{
          background:'var(--blue-bg)', border:'1px solid var(--blue-border)',
          borderRadius:'var(--radius-lg)', padding:'16px 20px',
          display:'flex', alignItems:'center', justifyContent:'space-between',
          marginBottom:24, gap:16,
        }}>
          <div>
            <div style={{ fontSize:14, fontWeight:500, color:'var(--ink)', marginBottom:2 }}>
              Complete your setup
            </div>
            <div style={{ fontSize:13, color:'var(--ink-2)' }}>
              You selected the <strong style={{ textTransform:'capitalize' }}>{signupPlan}</strong> plan.
              Add your billing info to activate your account after the free trial.
            </div>
          </div>
          <div style={{ display:'flex', gap:8, flexShrink:0 }}>
            <button onClick={dismissPlanPrompt} style={{
              padding:'8px 14px', borderRadius:'var(--radius-md)',
              background:'transparent', color:'var(--ink-3)',
              border:'1px solid var(--border)', fontSize:12,
              fontWeight:500, cursor:'pointer',
            }}>
              Later
            </button>
            <a href="/dashboard/billing" onClick={dismissPlanPrompt} style={{
              padding:'8px 16px', borderRadius:'var(--radius-md)',
              background:'var(--blue)', color:'#fff',
              border:'none', fontSize:12, fontWeight:500,
              cursor:'pointer', textDecoration:'none',
              display:'inline-flex', alignItems:'center',
            }}>
              Set up billing →
            </a>
          </div>
        </div>
      )}

      {/* Page header */}
      <div style={{ marginBottom:24 }}>
        <h1 style={{ fontFamily:'var(--font-display)', fontSize:32,
          fontWeight:400, marginBottom:6 }}>
          Reviews
        </h1>
        <p style={{ color:'var(--ink-2)', fontSize:15 }}>
          AI drafts are ready for your approval. Tap any review to approve or edit.
        </p>
      </div>

      {/* Stat strip */}
      <div style={{ display:'flex', gap:16, marginBottom:24 }}>
        <StatCard
          label="Needs attention"
          value={pendingCount}
          accent="var(--amber)"
          onClick={() => { setActiveTab('pending'); resetFilters(); }}
          active={activeTab === 'pending'}
        />
        <StatCard
          label="Posted replies"
          value={postedCount}
          accent="var(--green)"
          onClick={() => { setActiveTab('posted'); resetFilters(); }}
          active={activeTab === 'posted'}
        />
        <StatCard
          label="Total reviews"
          value={totalCount}
          accent="var(--blue)"
          onClick={() => { setActiveTab(''); resetFilters(); }}
          active={activeTab === ''}
        />
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:4, marginBottom:0,
        borderBottom:'1px solid var(--border)', paddingBottom:0 }}>
        {TABS.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
            padding:'8px 16px', fontSize:14, fontWeight:500,
            color: activeTab === tab.key ? 'var(--ink)' : 'var(--ink-3)',
            borderBottom:`2px solid ${activeTab === tab.key ? 'var(--ink)' : 'transparent'}`,
            marginBottom:-1, transition:'all 0.15s',
            background:'transparent', border:'none',
            cursor:'pointer',
          }}>
            {tab.label}
            {tab.key === 'pending' && pendingCount > 0 && (
              <span style={{
                marginLeft:6, background:'var(--amber)', color:'#fff',
                borderRadius:99, fontSize:11, padding:'1px 6px', fontWeight:600,
              }}>
                {pendingCount}
              </span>
            )}
          </button>
        ))}
        <div style={{ flex:1 }}/>
        <button onClick={reload} style={{
          fontSize:13, color:'var(--ink-3)', padding:'8px 4px',
          background:'transparent', border:'none', cursor:'pointer',
        }}>
          ↻ Refresh
        </button>
      </div>

      {/* Filters */}
      <div style={{
        display:'flex', gap:8, flexWrap:'wrap', alignItems:'center',
        padding:'12px 0', borderBottom:'1px solid var(--border)',
        marginBottom:16,
      }}>
        <select value={platform} onChange={e => setPlatform(e.target.value)} style={selectStyle}>
          {PLATFORMS.map(p => (
            <option key={p.key} value={p.key}>{p.label}</option>
          ))}
        </select>

        <select value={starRating} onChange={e => setStarRating(e.target.value)} style={selectStyle}>
          {STARS.map(s => (
            <option key={s.key} value={s.key}>{s.label}</option>
          ))}
        </select>

        <select value={locationId} onChange={e => setLocationId(e.target.value)} style={selectStyle}>
          <option value="">All locations</option>
          {locations.map(function(loc) {
            return <option key={loc.id} value={loc.id}>{loc.name}</option>;
          })}
        </select>

        <select value={sort} onChange={e => setSort(e.target.value)} style={selectStyle}>
          {SORTS.map(s => (
            <option key={s.key} value={s.key}>{s.label}</option>
          ))}
        </select>

        {hasFilters && (
          <button onClick={resetFilters} style={{
            padding:'7px 12px', borderRadius:'var(--radius-md)',
            background:'transparent', color:'var(--ink-3)',
            border:'1px solid var(--border)', fontSize:12,
            fontWeight:500, cursor:'pointer',
          }}>
            ✕ Reset
          </button>
        )}

        <div style={{ marginLeft:'auto', fontSize:12, color:'var(--ink-3)' }}>
          {reviews.length} review{reviews.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Content */}
      {loading && (
        <div style={{ display:'flex', justifyContent:'center', padding:60 }}>
          <Spinner size={28}/>
        </div>
      )}

      {error && (
        <div style={{
          padding:20, borderRadius:'var(--radius-md)',
          background:'var(--red-bg)', border:'1px solid var(--red-border)',
          color:'var(--red)', fontSize:14,
        }}>
          {error}
        </div>
      )}

      {!loading && !error && reviews.length === 0 && (
        <EmptyState
          icon={activeTab === 'pending' ? '✓' : '◎'}
          title={activeTab === 'pending' ? 'All caught up!' : 'No reviews here'}
          body={activeTab === 'pending'
            ? 'No reviews need attention right now.'
            : 'No reviews match your current filters.'}
        />
      )}

      {!loading && !error && reviews.length > 0 && (
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {reviews.map(function(review, i) {
            return (
              <ReviewCard
                key={review.id}
                review={review}
                style={{ animationDelay:`${i * 0.04}s` }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, accent, onClick, active }) {
  return (
    <div
      onClick={onClick}
      style={{
        flex:1, padding:'16px 20px', borderRadius:'var(--radius-lg)',
        background:'var(--bg-card)',
        border:`${active ? '2px' : '1px'} solid ${active ? accent : 'var(--border)'}`,
        boxShadow:'var(--shadow-sm)', cursor:'pointer',
        transition:'all 0.15s',
      }}
    >
      <div style={{ fontSize:28, fontFamily:'var(--font-display)',
        color:accent, lineHeight:1 }}>
        {value}
      </div>
      <div style={{ fontSize:12, color:'var(--ink-3)', marginTop:4 }}>{label}</div>
    </div>
  );
}
