import React, { useState, useEffect } from 'react';
import { api } from '../lib/api.js';
import ReviewCard from '../components/ReviewCard.jsx';
import { Spinner, EmptyState } from '../components/ui.jsx';

const TABS = [
  { key: 'pending',   label: 'Needs attention' },
  { key: '',          label: 'All reviews' },
  { key: 'posted',    label: 'Posted' },
  { key: 'dismissed', label: 'Dismissed' },
];

export default function Dashboard() {
  const [activeTab, setActiveTab]   = useState('pending');
  const [reviews, setReviews]       = useState([]);
  const [allReviews, setAllReviews] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);

  useEffect(() => {
    loadReviews(activeTab);
  }, [activeTab]);

  useEffect(() => {
    api.getReviews({}).then(setAllReviews).catch(() => {});
  }, []);

  async function loadReviews(tab) {
    setLoading(true);
    setError(null);
    try {
      const params = tab ? { status: tab } : {};
      const data = await api.getReviews(params);
      setReviews(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  function reload() {
    loadReviews(activeTab);
    api.getReviews({}).then(setAllReviews).catch(() => {});
  }

  const pendingCount  = allReviews.filter(r => (r.draft_status ?? r.status) === 'pending').length;
  const postedCount   = allReviews.filter(r => (r.draft_status ?? r.status) === 'posted').length;
  const totalCount    = allReviews.length;

  return (
    <div style={{ padding:'40px 48px', maxWidth:860, margin:'0 auto', width:'100%' }}>

      {/* Page header */}
      <div style={{ marginBottom:32 }}>
        <h1 style={{ fontFamily:'var(--font-display)', fontSize:32, fontWeight:400, marginBottom:6 }}>
          Reviews
        </h1>
        <p style={{ color:'var(--ink-2)', fontSize:15 }}>
          AI drafts are ready for your approval. Tap any review to approve or edit.
        </p>
      </div>

      {/* Stat strip */}
      <div style={{ display:'flex', gap:16, marginBottom:28 }}>
        <StatCard
          label="Needs attention"
          value={pendingCount}
          accent="var(--amber)"
          onClick={() => setActiveTab('pending')}
          active={activeTab === 'pending'}
        />
        <StatCard
          label="Posted replies"
          value={postedCount}
          accent="var(--green)"
          onClick={() => setActiveTab('posted')}
          active={activeTab === 'posted'}
        />
        <StatCard
          label="Total reviews"
          value={totalCount}
          accent="var(--blue)"
          onClick={() => setActiveTab('')}
          active={activeTab === ''}
        />
      </div>

      {/* Filter tabs */}
      <div style={{ display:'flex', gap:4, marginBottom:20,
        borderBottom:'1px solid var(--border)', paddingBottom:0 }}>
        {TABS.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
            padding:'8px 16px', fontSize:14, fontWeight:500,
            color: activeTab === tab.key ? 'var(--ink)' : 'var(--ink-3)',
            borderBottom:`2px solid ${activeTab === tab.key ? 'var(--ink)' : 'transparent'}`,
            marginBottom:-1, borderRadius:0, transition:'all 0.15s',
            background:'transparent', border:'none',
            borderBottom:`2px solid ${activeTab === tab.key ? 'var(--ink)' : 'transparent'}`,
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
            ? 'No reviews need attention right now. We\'ll notify you when new ones arrive.'
            : 'No reviews in this category yet.'}
        />
      )}

      {!loading && !error && reviews.length > 0 && (
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {reviews.map((review, i) => (
            <ReviewCard
              key={review.id}
              review={review}
              style={{ animationDelay:`${i * 0.04}s` }}
            />
          ))}
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
        background: active ? 'var(--bg-card)' : 'var(--bg-card)',
        border:`${active ? '2px' : '1px'} solid ${active ? accent : 'var(--border)'}`,
        boxShadow:'var(--shadow-sm)', cursor:'pointer',
        transition:'all 0.15s',
      }}
    >
      <div style={{ fontSize:28, fontFamily:'var(--font-display)', color:accent, lineHeight:1 }}>
        {value}
      </div>
      <div style={{ fontSize:12, color:'var(--ink-3)', marginTop:4 }}>{label}</div>
    </div>
  );
}
