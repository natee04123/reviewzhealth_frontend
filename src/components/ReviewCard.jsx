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

const PLATFORM_LOGOS = {
  google: (
    <svg width="14" height="14" viewBox="0 0 24 24" style={{ display:'block' }}>
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  ),
  opentable: (
    <svg width="14" height="14" viewBox="0 0 24 24" style={{ display:'block' }}>
      <rect width="24" height="24" rx="4" fill="#DA3743"/>
      <circle cx="4.5" cy="13" r="2.2" fill="white"/>
      <circle cx="14" cy="12" r="5.5" fill="white"/>
      <circle cx="14" cy="12" r="2.8" fill="#DA3743"/>
    </svg>
  ),
};

function PlatformLogo({ source }) {
  if (!source || source === 'google') return PLATFORM_LOGOS.google;
  if (source === 'opentable') return PLATFORM_LOGOS.opentable;
  const slugMap = {
    facebook:    { slug: 'facebook',    color: '1877F2' },
    yelp:        { slug: 'yelp',        color: 'D32323' },
    tripadvisor: { slug: 'tripadvisor', color: '00AA6C' },
    ubereats:    { slug: 'ubereats',    color: '000000' },
    doordash:    { slug: 'doordash',    color: 'FF3008' },
  };
  const config = slugMap[source];
  if (!config) return null;
  return (
    <img
      src={`https://cdn.simpleicons.org/${config.slug}/${config.color}`}
      width="14" height="14"
      alt={source}
      style={{ display:'block' }}
    />
  );
}

const PLATFORM_NAMES = {
  google:      'Google',
  facebook:    'Facebook',
  yelp:        'Yelp',
  tripadvisor: 'Tripadvisor',
  opentable:   'OpenTable',
  ubereats:    'Uber Eats',
  doordash:    'DoorDash',
};

export default function ReviewCard({ review, style }) {
  const navigate = useNavigate();
  const isPending = review.draft_status === 'pending' || review.status === 'pending';
  const source = review.source ?? 'google';
  const platformName = PLATFORM_NAMES[source] ?? source;

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
      <div style={{ display:'flex', alignItems:'flex-start', gap:12, marginBottom:12 }}>
        <Avatar name={review.reviewer_name} photo={review.reviewer_photo} size={38} />
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
            <span style={{ fontWeight:500, fontSize:14 }}>
              {review.reviewer_name ?? 'Anonymous'}
            </span>
            <Stars rating={review.star_rating ?? 0} size={13} />
            <span style={{ fontSize:12, color:'var(--ink-3)', marginLeft:'auto' }}>
              {timeAgo(review.review_time ?? review.received_at)}
            </span>
          </div>
          <div style={{ fontSize:12, color:'var(--ink-3)', marginTop:2 }}>
            {review.location_name}
          </div>
        </div>
      </div>

      {/* Review text */}
      <p style={{
        fontSize:14, color:'var(--ink-2)', lineHeight:1.6,
        marginBottom:14,
        display:'-webkit-box', WebkitLineClamp:3,
        WebkitBoxOrient:'vertical', overflow:'hidden',
      }}>
        {review.review_text ?? <em style={{ color:'var(--ink-3)' }}>No text — rating only</em>}
      </p>

      {/* Footer row */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <StatusBadge status={review.draft_status ?? review.status ?? 'pending'} />
          {/* Platform badge */}
          <div style={{
            display:'flex', alignItems:'center', gap:4,
            padding:'2px 7px', borderRadius:99,
            background:'var(--bg-muted)', border:'1px solid var(--border)',
            fontSize:11, color:'var(--ink-3)',
          }}>
            <PlatformLogo source={source} />
            <span>{platformName}</span>
          </div>
        </div>
        {isPending && (
          <span style={{
            fontSize:12, color:'var(--amber)', fontWeight:500,
            display:'flex', alignItems:'center', gap:4,
          }}>
            <span style={{
              fontSize:8, background:'var(--amber)', borderRadius:'50%',
              width:6, height:6, display:'inline-block',
              animation:'pulse 1.5s ease infinite',
            }}/>
            Response ready
          </span>
        )}
        {(review.draft_status === 'posted' || review.status === 'posted') && (
          <span style={{ fontSize:12, color:'var(--green)', fontWeight:500 }}>
            Reply posted ✓
          </span>
        )}
      </div>
    </div>
  );
}
