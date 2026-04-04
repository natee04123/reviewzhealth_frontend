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
        {!atMax && reviewsNeeded
