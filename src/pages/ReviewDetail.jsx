// src/pages/ReviewDetail.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../lib/api.js';
import { Stars, StatusBadge, Avatar, Spinner, Toast } from '../components/ui.jsx';

export default function ReviewDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [review, setReview]           = useState(null);
  const [loading, setLoading]         = useState(true);
  const [editedText, setEditedText]   = useState('');
  const [isEditing, setIsEditing]     = useState(false);
  const [submitting, setSubmitting]   = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [toast, setToast]             = useState(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    api.getReview(id)
      .then(data => {
        setReview(data);
        setEditedText(data.edited_text ?? data.draft_text ?? '');
      })
      .catch(e => setToast({ message: e.message, type: 'error' }))
      .finally(() => setLoading(false));
  }, [id]);

  // Auto-resize textarea
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
      textareaRef.current.focus();
    }
  }, [isEditing, editedText]);

  function showToast(message, type = 'success') {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }

  async function handleApprove() {
    setSubmitting(true);
    try {
      const finalText = isEditing ? editedText.trim() : null;
      await api.approveReview(id, finalText || undefined);
      setReview(r => ({ ...r, status: 'posted', posted_at: new Date().toISOString() }));
      showToast('Reply posted to Google ✓');
      setIsEditing(false);
    } catch (e) {
      showToast(e.message, 'error');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleRegenerate() {
    setRegenerating(true);
    try {
      const { draftText } = await api.regenerate(id);
      setEditedText(draftText);
      setReview(r => ({ ...r, draft_text: draftText }));
      showToast('Fresh draft generated', 'info');
    } catch (e) {
      showToast(e.message, 'error');
    } finally {
      setRegenerating(false);
    }
  }

  async function handleDismiss() {
    if (!window.confirm('Dismiss this review? No reply will be posted.')) return;
    await api.dismiss(id).catch(() => {});
    navigate('/dashboard');
  }

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
      <Spinner size={32} />
    </div>
  );

  if (!review) return null;

  const isPosted    = review.status === 'posted';
  const isDismissed = review.status === 'dismissed';
  const currentDraft = editedText || review.draft_text || '';
  const hasEdits = isEditing && currentDraft !== review.draft_text;

  return (
    <div style={{ padding: '40px 48px', maxWidth: 960, margin: '0 auto', width: '100%' }}>
      {/* Breadcrumb */}
      <Link to="/dashboard" style={{ fontSize: 13, color: 'var(--ink-3)', display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: 28 }}>
        ← Back to reviews
      </Link>

      {/* Page header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 32, gap: 16 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 400, marginBottom: 6 }}>
            Review from {review.reviewer_name ?? 'Anonymous'}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Stars rating={review.star_rating ?? 0} size={16} />
            <span style={{ fontSize: 13, color: 'var(--ink-3)' }}>{review.location_name}</span>
            <StatusBadge status={review.status} />
          </div>
        </div>
        {!isPosted && !isDismissed && (
          <button onClick={handleDismiss} style={{
            fontSize: 13, color: 'var(--ink-3)', padding: '8px 14px',
            border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
            background: 'transparent',
          }}>
            Dismiss
          </button>
        )}
      </div>

      {/* Two-column layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start' }}>

        {/* Left: the review */}
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)', padding: '28px 28px',
          boxShadow: 'var(--shadow-sm)',
        }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em',
            color: 'var(--ink-3)', textTransform: 'uppercase', marginBottom: 20 }}>
            Customer review
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <Avatar name={review.reviewer_name} photo={review.reviewer_photo} size={44} />
            <div>
              <div style={{ fontWeight: 500, fontSize: 15 }}>
                {review.reviewer_name ?? 'Anonymous'}
              </div>
              <Stars rating={review.star_rating ?? 0} size={15} />
            </div>
          </div>

          <blockquote style={{
            fontFamily: 'var(--font-display)', fontSize: 16, fontStyle: 'italic',
            lineHeight: 1.7, color: 'var(--ink)',
            borderLeft: '3px solid var(--border)', paddingLeft: 20, margin: 0,
          }}>
            {review.review_text ?? <span style={{ color: 'var(--ink-3)' }}>No text — rating only</span>}
          </blockquote>

          {review.review_time && (
            <div style={{ marginTop: 20, fontSize: 12, color: 'var(--ink-3)' }}>
              {new Date(review.review_time).toLocaleDateString('en-US', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
              })}
            </div>
          )}
        </div>

        {/* Right: the AI draft */}
        <div style={{
          background: isPosted ? 'var(--green-bg)' : 'var(--bg-card)',
          border: `1px solid ${isPosted ? 'var(--green-border)' : 'var(--border)'}`,
          borderRadius: 'var(--radius-lg)', padding: '28px 28px',
          boxShadow: 'var(--shadow-sm)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em',
              color: isPosted ? 'var(--green)' : 'var(--ink-3)', textTransform: 'uppercase' }}>
              {isPosted ? 'Posted reply ✓' : 'AI-drafted response'}
            </div>
            {!isPosted && !isDismissed && (
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={handleRegenerate} disabled={regenerating} style={{
                  fontSize: 12, color: 'var(--ink-3)', padding: '5px 10px',
                  border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)',
                  background: 'transparent', display: 'flex', alignItems: 'center', gap: 5,
                }}>
                  {regenerating ? <Spinner size={12} /> : '↺'} Regenerate
                </button>
                <button onClick={() => setIsEditing(e => !e)} style={{
                  fontSize: 12,
                  color: isEditing ? 'var(--blue)' : 'var(--ink-3)',
                  padding: '5px 10px',
                  border: `1px solid ${isEditing ? 'var(--blue-border)' : 'var(--border)'}`,
                  borderRadius: 'var(--radius-sm)',
                  background: isEditing ? 'var(--blue-bg)' : 'transparent',
                }}>
                  {isEditing ? 'Done editing' : '✎ Edit'}
                </button>
              </div>
            )}
          </div>

          {/* Draft text — view or edit */}
          {isEditing && !isPosted ? (
            <textarea
              ref={textareaRef}
              value={editedText}
              onChange={e => setEditedText(e.target.value)}
              style={{
                width: '100%', minHeight: 160, resize: 'vertical',
                fontSize: 15, lineHeight: 1.7, color: 'var(--ink)',
                padding: '14px 16px', borderRadius: 'var(--radius-md)',
                border: '1.5px solid var(--blue-border)',
                background: 'var(--blue-bg)',
                outline: 'none',
              }}
            />
          ) : (
            <p style={{
              fontSize: 15, lineHeight: 1.8, color: 'var(--ink)',
              minHeight: 120,
              fontStyle: isPosted ? 'normal' : 'normal',
            }}>
              {currentDraft || <span style={{ color: 'var(--ink-3)', fontStyle: 'italic' }}>No draft available</span>}
            </p>
          )}

          {hasEdits && (
            <div style={{ marginTop: 10, fontSize: 12, color: 'var(--blue)', fontStyle: 'italic' }}>
              Edited — your changes will be posted
            </div>
          )}

          {/* Action buttons */}
          {!isPosted && !isDismissed && (
            <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button onClick={handleApprove} disabled={submitting || !currentDraft} style={{
                width: '100%', padding: '14px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--green)', color: '#fff',
                fontSize: 15, fontWeight: 500,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                transition: 'opacity 0.15s',
                opacity: (submitting || !currentDraft) ? 0.6 : 1,
              }}>
                {submitting ? <><Spinner size={16} color="#fff" /> Posting…</> : (
                  hasEdits ? '✓ Post edited reply' : '✓ Approve & post'
                )}
              </button>
            </div>
          )}

          {isPosted && review.posted_at && (
            <div style={{ marginTop: 16, fontSize: 12, color: 'var(--green)' }}>
              Posted {new Date(review.posted_at).toLocaleString('en-US', {
                month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
              })}
            </div>
          )}
        </div>
      </div>

      {/* Sentiment hint */}
      {!isPosted && review.star_rating && (
        <div style={{
          marginTop: 20, padding: '12px 20px',
          borderRadius: 'var(--radius-md)',
          background: 'var(--bg-muted)', border: '1px solid var(--border)',
          fontSize: 13, color: 'var(--ink-2)',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span style={{ fontSize: 16 }}>
            {review.star_rating >= 4 ? '😊' : review.star_rating <= 2 ? '😔' : '😐'}
          </span>
          <span>
            <strong>Tone guide:</strong>{' '}
            {review.star_rating >= 4
              ? 'The AI used a warm, grateful tone matching the positive review.'
              : review.star_rating <= 2
              ? 'The AI used an empathetic, solution-focused tone for this critical review.'
              : 'The AI used a balanced, professional tone for this mixed review.'}
          </span>
        </div>
      )}

      {toast && <Toast {...toast} onDismiss={() => setToast(null)} />}
    </div>
  );
}
