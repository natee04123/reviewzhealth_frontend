import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../lib/api.js';
import { Stars, StatusBadge, Avatar, Spinner, Toast } from '../components/ui.jsx';

const PLATFORM_CONFIG = {
  google: {
    name: 'Google',
    color: '#4285F4',
    canAutoPost: true,
    manageUrl: null,
  },
  facebook: {
    name: 'Facebook',
    color: '#1877F2',
    canAutoPost: false,
    manageUrl: 'https://business.facebook.com/latest/inbox/reviews',
    instruction: 'Opens Facebook Business inbox. Find the review and paste your reply.',
  },
  yelp: {
    name: 'Yelp',
    color: '#D32323',
    canAutoPost: false,
    manageUrl: 'https://biz.yelp.com/reviews',
    instruction: 'Opens Yelp for Business. Find the review and paste your reply.',
  },
  tripadvisor: {
    name: 'Tripadvisor',
    color: '#00AA6C',
    canAutoPost: false,
    manageUrl: 'https://www.tripadvisor.com/Owners',
    instruction: 'Opens Tripadvisor Management Center. Go to Reviews and paste your reply.',
  },
  opentable: {
    name: 'OpenTable',
    color: '#DA3743',
    canAutoPost: false,
    manageUrl: 'https://restaurant.opentable.com/home',
    instruction: 'Opens OpenTable for Restaurants. Find the review and paste your reply.',
  },
  ubereats: {
    name: 'Uber Eats',
    color: '#000000',
    canAutoPost: false,
    manageUrl: 'https://merchants.ubereats.com',
    instruction: 'Opens Uber Eats Manager. Find the review and paste your reply.',
  },
  doordash: {
    name: 'DoorDash',
    color: '#FF3008',
    canAutoPost: false,
    manageUrl: 'https://merchant-portal.doordash.com',
    instruction: 'Opens DoorDash Merchant Portal. Find the review and paste your reply.',
  },
};

function getPlatform(review) {
  const source = review?.source?.toLowerCase() ?? 'google';
  return PLATFORM_CONFIG[source] ?? PLATFORM_CONFIG.google;
}

export default function ReviewDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [review, setReview]             = useState(null);
  const [loading, setLoading]           = useState(true);
  const [editedText, setEditedText]     = useState('');
  const [isEditing, setIsEditing]       = useState(false);
  const [submitting, setSubmitting]     = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [copied, setCopied]             = useState(false);
  const [toast, setToast]               = useState(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    api.getReview(id)
      .then(data => {
        setReview(data);
        setEditedText(data.edited_text ?? data.draft_text ?? '');
      })
      .catch(e => showToast(e.message, 'error'))
      .finally(() => setLoading(false));
  }, [id]);

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
      showToast('Reply posted to Google');
      setIsEditing(false);
    } catch (e) {
      showToast(e.message, 'error');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleCopyAndOpen(platform) {
    const text = editedText || review?.draft_text || '';
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
      showToast(`Copied! Opening ${platform.name}...`);
      setTimeout(() => window.open(platform.manageUrl, '_blank'), 600);
    } catch {
      showToast('Copy failed — please select and copy the text manually', 'error');
      window.open(platform.manageUrl, '_blank');
    }
  }

  async function handleRegenerate() {
    setRegenerating(true);
    try {
      const result = await api.regenerateReview(id);
      const newText = result.draftText ?? result.draft_text ?? '';
      setEditedText(newText);
      setReview(r => ({ ...r, draft_text: newText }));
      showToast('Fresh draft generated');
    } catch (e) {
      showToast(e.message, 'error');
    } finally {
      setRegenerating(false);
    }
  }

  async function handleDismiss() {
    if (!window.confirm('Dismiss this review? No reply will be posted.')) return;
    await api.dismissReview(id).catch(() => {});
    navigate('/dashboard');
  }

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
      <Spinner size={32} />
    </div>
  );

  if (!review) return null;

  const platform    = getPlatform(review);
  const isPosted    = review.status === 'posted';
  const isDismissed = review.status === 'dismissed';
  const currentDraft = editedText || review.draft_text || '';
  const hasEdits    = isEditing && currentDraft !== review.draft_text;
  const canAutoPost = platform.canAutoPost;

  return (
    <div style={{ padding: '40px 48px', maxWidth: 960, margin: '0 auto', width: '100%' }}>

      {/* Breadcrumb */}
      <Link to="/dashboard" style={{ fontSize: 13, color: 'var(--ink-3)',
        display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: 28 }}>
        Back to reviews
      </Link>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start',
        justifyContent: 'space-between', marginBottom: 32, gap: 16 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28,
            fontWeight: 400, marginBottom: 6 }}>
            Review from {review.reviewer_name ?? 'Anonymous'}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Stars rating={review.star_rating ?? 0} size={16} />
            <span style={{ fontSize: 13, color: 'var(--ink-3)' }}>{review.location_name}</span>
            {review.source && review.source !== 'google' && (
              <span style={{
                fontSize: 11, fontWeight: 500, padding: '2px 8px', borderRadius: 99,
                background: 'var(--bg-muted)', color: 'var(--ink-3)',
                border: '1px solid var(--border)',
              }}>
                via {platform.name}
              </span>
            )}
            <StatusBadge status={review.status} />
          </div>
        </div>
        {!isPosted && !isDismissed && (
          <button onClick={handleDismiss} style={{
            fontSize: 13, color: 'var(--ink-3)', padding: '8px 14px',
            border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
            background: 'transparent', cursor: 'pointer',
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
          borderRadius: 'var(--radius-lg)', padding: '28px',
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
            {review.review_text ?? (
              <span style={{ color: 'var(--ink-3)' }}>No text — rating only</span>
            )}
          </blockquote>

          {review.review_time && (
            <div style={{ marginTop: 20, fontSize: 12, color: 'var(--ink-3)' }}>
              {new Date(review.review_time).toLocaleDateString('en-US', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
              })}
            </div>
          )}
        </div>

        {/* Right: the AI draft */}
        <div style={{
          background: isPosted ? 'var(--green-bg)' : 'var(--bg-card)',
          border: `1px solid ${isPosted ? 'var(--green-border)' : 'var(--border)'}`,
          borderRadius: 'var(--radius-lg)', padding: '28px',
          boxShadow: 'var(--shadow-sm)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', marginBottom: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em',
              color: isPosted ? 'var(--green)' : 'var(--ink-3)', textTransform: 'uppercase' }}>
              {isPosted ? 'Posted reply' : 'AI-drafted response'}
            </div>
            {!isPosted && !isDismissed && (
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={handleRegenerate} disabled={regenerating} style={{
                  fontSize: 12, color: 'var(--ink-3)', padding: '5px 10px',
                  border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)',
                  background: 'transparent', display: 'flex', alignItems: 'center', gap: 5,
                  cursor: 'pointer',
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
                  cursor: 'pointer',
                }}>
                  {isEditing ? 'Done editing' : '✎ Edit'}
                </button>
              </div>
            )}
          </div>

          {/* Draft text */}
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
                background: 'var(--blue-bg)', outline: 'none',
              }}
            />
          ) : (
            <p style={{ fontSize: 15, lineHeight: 1.8, color: 'var(--ink)', minHeight: 120 }}>
              {currentDraft || (
                <span style={{ color: 'var(--ink-3)', fontStyle: 'italic' }}>
                  No draft available
                </span>
              )}
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

              {canAutoPost ? (
                /* Google — post directly */
                <button onClick={handleApprove} disabled={submitting || !currentDraft} style={{
                  width: '100%', padding: '14px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--green)', color: '#fff',
                  fontSize: 15, fontWeight: 500,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  opacity: (submitting || !currentDraft) ? 0.6 : 1,
                  cursor: 'pointer', border: 'none',
                }}>
                  {submitting ? (
                    <><Spinner size={16} color="#fff" /> Posting...</>
                  ) : (
                    hasEdits ? 'Post edited reply to Google' : 'Approve & post to Google'
                  )}
                </button>
              ) : (
                /* Other platforms — copy + redirect */
                <div>
                  {/* Instruction banner */}
                  <div style={{
                    background: 'var(--bg-muted)', border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)', padding: '10px 14px',
                    fontSize: 12, color: 'var(--ink-2)', marginBottom: 10,
                    display: 'flex', alignItems: 'flex-start', gap: 8,
                  }}>
                    <span style={{ fontSize: 14, flexShrink: 0 }}>ℹ</span>
                    <span>
                      {platform.name} doesn't support direct posting yet.
                      Copy your draft and paste it on {platform.name} — takes 10 seconds.
                    </span>
                  </div>

                  {/* Copy button */}
                  <button
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(currentDraft);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 3000);
                        showToast('Draft copied to clipboard');
                      } catch {
                        showToast('Could not copy — please select the text manually', 'error');
                      }
                    }}
                    disabled={!currentDraft}
                    style={{
                      width: '100%', padding: '12px',
                      borderRadius: 'var(--radius-md)',
                      background: copied ? 'var(--green-bg)' : 'var(--bg-card)',
                      color: copied ? 'var(--green)' : 'var(--ink)',
                      border: `1px solid ${copied ? 'var(--green-border)' : 'var(--border)'}`,
                      fontSize: 14, fontWeight: 500, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      transition: 'all 0.2s', marginBottom: 8,
                    }}>
                    {copied ? '✓ Copied to clipboard' : '⎘ Copy draft to clipboard'}
                  </button>

                  {/* Open platform button */}
                  <button
                    onClick={() => handleCopyAndOpen(platform)}
                    disabled={!currentDraft}
                    style={{
                      width: '100%', padding: '12px',
                      borderRadius: 'var(--radius-md)',
                      background: platform.color, color: '#fff',
                      border: 'none', fontSize: 14, fontWeight: 500,
                      cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      opacity: !currentDraft ? 0.6 : 1,
                    }}>
                    Copy & open {platform.name} to respond →
                  </button>

                  <p style={{ fontSize: 11, color: 'var(--ink-3)', textAlign: 'center',
                    marginTop: 8, lineHeight: 1.5 }}>
                    {platform.instruction}
                  </p>
                </div>
              )}
            </div>
          )}

          {isPosted && review.posted_at && (
            <div style={{ marginTop: 16, fontSize: 12, color: 'var(--green)' }}>
              Posted {new Date(review.posted_at).toLocaleString('en-US', {
                month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
              })}
            </div>
          )}
        </div>
      </div>

      {/* Tone guide */}
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
              ? 'The AI used a warm, grateful tone matching this positive review.'
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
