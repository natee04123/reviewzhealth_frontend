// src/components/ReviewCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Stars, StatusBadge, Avatar } from './ui.jsx';

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins  < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days  <  7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function ReviewCard({ review, style }) {
  const navigate = useNavigate();
  const isPending = review.status === 'pending';

  return (
    <div
      onClick={() => navigate(`/dashboard/reviews/${review.id}`)}
      className="anim-fade-up"
      style={{
        background: 'var(--bg-card)',
        border: `1px solid ${isPending ? 'var(--amber-border)' : 'var(--border)'}`,
        borderRadius: 'var(--radius-lg)',
        padding: '20px 24px',
        cursor: 'pointer',
        transition: 'box-shadow 0.15s, transform 0.15s, border-color 0.15s',
        boxShadow: 'var(--shadow-sm)',
        ...style,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
        e.currentTarget.style.transform = 'translateY(-1px)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
        <Avatar name={review.reviewer_name} photo={review.reviewer_photo} size={38} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 500, fontSize: 14 }}>
              {review.reviewer_name ?? 'Anonymous'}
            </span>
            <Stars rating={review.star_rating ?? 0} size={13} />
            <span style={{ fontSize: 12, color: 'var(--ink-3)', marginLeft: 'auto' }}>
              {timeAgo(review.review_time ?? review.received_at)}
            </span>
          </div>
          <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2 }}>
            {review.location_name}
          </div>
        </div>
      </div>

      {/* Review text */}
      <p style={{
        fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.6,
        marginBottom: 14,
        display: '-webkit-box', WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical', overflow: 'hidden',
      }}>
        {review.review_text ?? <em style={{ color: 'var(--ink-3)' }}>No text — rating only</em>}
      </p>

      {/* Footer row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <StatusBadge status={review.status ?? 'pending'} />
        {isPending && (
          <span style={{
            fontSize: 12, color: 'var(--amber)', fontWeight: 500,
            display: 'flex', alignItems: 'center', gap: 4,
          }}>
            <span style={{ fontSize: 8, background: 'var(--amber)', borderRadius: '50%',
              width: 6, height: 6, display: 'inline-block', animation: 'pulse 1.5s ease infinite' }}/>
            Response ready
          </span>
        )}
        {review.status === 'posted' && (
          <span style={{ fontSize: 12, color: 'var(--green)', fontWeight: 500 }}>
            Reply posted ✓
          </span>
        )}
      </div>
    </div>
  );
}
