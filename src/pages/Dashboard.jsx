// src/pages/Dashboard.jsx
import React, { useState } from 'react';
import { useReviews } from '../hooks/useReviews.js';
import ReviewCard from '../components/ReviewCard.jsx';
import { Spinner, EmptyState } from '../components/ui.jsx';

const TABS = [
  { key: 'pending',  label: 'Needs attention' },
  { key: '',         label: 'All reviews' },
  { key: 'posted',   label: 'Posted' },
  { key: 'dismissed',label: 'Dismissed' },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('pending');
  const { reviews, loading, error, reload } = useReviews(activeTab);

  const pendingCount = reviews.filter(r => r.status === 'pending').length;

  return (
    <div style={{ padding: '40px 48px', maxWidth: 860, margin: '0 auto', width: '100%' }}>
      {/* Page header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 400, marginBottom: 6 }}>
          Reviews
        </h1>
        <p style={{ color: 'var(--ink-2)', fontSize: 15 }}>
          AI drafts are ready for your approval. Tap any review to approve or edit.
        </p>
      </div>

      {/* Stat strip */}
      {!loading && (
        <div style={{ display: 'flex', gap: 16, marginBottom: 28 }} className="anim-fade-in">
          <StatCard label="Needs attention" value={reviews.filter(r => r.status === 'pending').length}  accent="var(--amber)" />
          <StatCard label="Posted this week"  value={reviews.filter(r => r.status === 'posted').length}  accent="var(--green)" />
          <StatCard label="Total reviews"     value={reviews.length}                                      accent="var(--blue)" />
        </div>
      )}

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 20, borderBottom: '1px solid var(--border)', paddingBottom: 0 }}>
        {TABS.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
            padding: '8px 16px',
            fontSize: 14, fontWeight: 500,
            color: activeTab === tab.key ? 'var(--ink)' : 'var(--ink-3)',
            borderBottom: `2px solid ${activeTab === tab.key ? 'var(--ink)' : 'transparent'}`,
            marginBottom: -1, borderRadius: 0, transition: 'all 0.15s',
          }}>
            {tab.label}
            {tab.key === 'pending' && pendingCount > 0 && (
              <span style={{
                marginLeft: 6, background: 'var(--amber)', color: '#fff',
                borderRadius: 99, fontSize: 11, padding: '1px 6px', fontWeight: 600,
              }}>
                {pendingCount}
              </span>
            )}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <button onClick={reload} style={{ fontSize: 13, color: 'var(--ink-3)', padding: '8px 4px' }}>
          ↻ Refresh
        </button>
      </div>

      {/* Content */}
      {loading && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
          <Spinner size={28} />
        </div>
      )}

      {error && (
        <div style={{
          padding: 20, borderRadius: 'var(--radius-md)',
          background: 'var(--red-bg)', border: '1px solid var(--red-border)',
          color: 'var(--red)', fontSize: 14,
        }}>
          {error}
        </div>
      )}

      {!loading && !error && reviews.length === 0 && (
        <EmptyState
          icon={activeTab === 'pending' ? '✓' : '◎'}
          title={activeTab === 'pending' ? 'All caught up!' : 'No reviews yet'}
          body={activeTab === 'pending'
            ? 'No reviews need attention right now. We\'ll notify you when new ones arrive.'
            : 'Reviews will appear here once customers leave feedback on Google.'}
        />
      )}

      {!loading && !error && reviews.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {reviews.map((review, i) => (
            <ReviewCard key={review.id} review={review}
              style={{ animationDelay: `${i * 0.04}s` }} />
          ))}
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, accent }) {
  return (
    <div style={{
      flex: 1, padding: '16px 20px', borderRadius: 'var(--radius-lg)',
      background: 'var(--bg-card)', border: '1px solid var(--border)',
      boxShadow: 'var(--shadow-sm)',
    }}>
      <div style={{ fontSize: 28, fontFamily: 'var(--font-display)', color: accent, lineHeight: 1 }}>
        {value}
      </div>
      <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 4 }}>{label}</div>
    </div>
  );
}
