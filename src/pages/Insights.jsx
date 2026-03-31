import React, { useState, useEffect } from 'react';
import { api } from '../lib/api.js';
import { Spinner } from '../components/ui.jsx';

function UrgencyBadge({ urgency }) {
  const config = {
    high:   { label: 'High priority', bg: 'var(--red-bg)',   color: 'var(--red)',   border: 'var(--red-border)' },
    medium: { label: 'Medium',        bg: 'var(--amber-bg)', color: 'var(--amber)', border: 'var(--amber-border)' },
    low:    { label: 'Low',           bg: 'var(--bg-muted)', color: 'var(--ink-3)', border: 'var(--border)' },
  };
  const c = config[urgency] ?? config.low;
  return (
    <span style={{
      padding: '2px 8px', borderRadius: 99, fontSize: 10,
      fontWeight: 600, letterSpacing: '0.04em',
      background: c.bg, color: c.color, border: `1px solid ${c.border}`,
    }}>
      {c.label.toUpperCase()}
    </span>
  );
}

function InsightCard({ icon, title, children, accentColor }) {
  return (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)', overflow: 'hidden',
      boxShadow: 'var(--shadow-sm)', marginBottom: 24,
    }}>
      <div style={{
        padding: '14px 20px', borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', gap: 10,
        background: 'var(--bg-muted)',
      }}>
        <span style={{ fontSize: 18 }}>{icon}</span>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)',
          letterSpacing: '0.04em', textTransform: 'uppercase' }}>
          {title}
        </div>
      </div>
      <div style={{ padding: '4px 0' }}>
        {children}
      </div>
    </div>
  );
}

function ThemeRow({ theme, description, count, example, urgency, positive }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div
      onClick={() => setExpanded(e => !e)}
      style={{
        padding: '14px 20px', borderBottom: '1px solid var(--border)',
        cursor: 'pointer', transition: 'background 0.1s',
      }}
      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-muted)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      <div style={{ display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
          <div style={{
            width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
            background: positive ? 'var(--green)' : urgency === 'high'
              ? 'var(--red)' : urgency === 'medium' ? 'var(--amber)' : 'var(--ink-3)',
          }}/>
          <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink)' }}>
            {theme}
          </div>
          {urgency && <UrgencyBadge urgency={urgency}/>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
          <span style={{
            fontSize: 12, color: 'var(--ink-3)',
            background: 'var(--bg-muted)', border: '1px solid var(--border)',
            padding: '2px 8px', borderRadius: 99,
          }}>
            {count} reviews
          </span>
          <span style={{ color: 'var(--ink-3)', fontSize: 12 }}>
            {expanded ? '▲' : '▼'}
          </span>
        </div>
      </div>

      {expanded && (
        <div style={{ marginTop: 12, paddingLeft: 18 }}>
          <p style={{ fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.6,
            margin: '0 0 10px' }}>
            {description}
          </p>
          {example && (
            <div style={{
              borderLeft: '3px solid var(--border)', paddingLeft: 12,
              fontSize: 13, color: 'var(--ink-3)', fontStyle: 'italic',
            }}>
              "{example}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function OpportunityCard({ title, description, index }) {
  return (
    <div style={{
      padding: '16px 20px', borderBottom: '1px solid var(--border)',
      display: 'flex', gap: 14,
    }}>
      <div style={{
        width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
        background: 'rgba(29,158,117,0.1)', border: '1px solid rgba(29,158,117,0.25)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 13, fontWeight: 600, color: '#1D9E75',
      }}>
        {index + 1}
      </div>
      <div>
        <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink)',
          marginBottom: 4 }}>
          {title}
        </div>
        <p style={{ fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.6, margin: 0 }}>
          {description}
        </p>
      </div>
    </div>
  );
}

export default function Insights() {
  const [insights, setInsights]       = useState(null);
  const [generatedAt, setGeneratedAt] = useState(null);
  const [loading, setLoading]         = useState(true);
  const [generating, setGenerating]   = useState(false);
  const [error, setError]             = useState(null);

  useEffect(() => {
    loadInsights();
  }, []);

  async function loadInsights() {
    setLoading(true);
    try {
      const data = await api.getInsights();
      if (data?.insights) {
        setInsights(data.insights);
        setGeneratedAt(data.generated_at);
      } else {
        // No insights yet — auto-generate
        await handleGenerate();
        return;
      }

      // Auto-regenerate if older than 7 days
      if (data?.generated_at) {
        const age = Date.now() - new Date(data.generated_at).getTime();
        const sevenDays = 7 * 24 * 60 * 60 * 1000;
        if (age > sevenDays) {
          await handleGenerate();
          return;
        }
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleGenerate() {
    setGenerating(true);
    setError(null);
    try {
      const data = await api.generateInsights();
      setInsights(data.insights);
      setGeneratedAt(data.generated_at);
    } catch (e) {
      setError(e.message);
    } finally {
      setGenerating(false);
      setLoading(false);
    }
  }

  function formatDate(dateStr) {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'long', day: 'numeric', year: 'numeric',
      hour: 'numeric', minute: '2-digit',
    });
  }

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
      <Spinner size={32}/>
    </div>
  );

  return (
    <div style={{ padding: '40px 48px', maxWidth: 860, margin: '0 auto', width: '100%' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start',
        justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32,
            fontWeight: 400, marginBottom: 6 }}>
            AI Insights
          </h1>
          <p style={{ color: 'var(--ink-2)', fontSize: 15 }}>
            What your customers are really saying — across all locations.
          </p>
          {generatedAt && (
            <p style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 4 }}>
              Last updated {formatDate(generatedAt)}
            </p>
          )}
        </div>
        <button
          onClick={handleGenerate}
          disabled={generating}
          style={{
            padding: '10px 18px', borderRadius: 'var(--radius-md)',
            background: 'var(--ink)', color: 'var(--bg)',
            border: 'none', fontSize: 14, fontWeight: 500,
            cursor: generating ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', gap: 8,
            opacity: generating ? 0.6 : 1, flexShrink: 0,
          }}
        >
          {generating ? <><Spinner size={14} color="var(--bg)"/> Analyzing...</> : '↻ Refresh insights'}
        </button>
      </div>

      {error && (
        <div style={{
          padding: '14px 18px', borderRadius: 'var(--radius-lg)',
          background: 'var(--red-bg)', border: '1px solid var(--red-border)',
          color: 'var(--red)', fontSize: 14, marginBottom: 24,
        }}>
          {error}
        </div>
      )}

      {generating && !insights && (
        <div style={{
          textAlign: 'center', padding: '60px 40px',
          background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border)',
        }}>
          <Spinner size={32}/>
          <div style={{ marginTop: 16, fontSize: 15, color: 'var(--ink-2)' }}>
            Claude is reading your reviews...
          </div>
          <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 6 }}>
            This takes about 10 seconds
          </div>
        </div>
      )}

      {insights && (
        <>
          {/* Summary banner */}
          <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)', padding: '20px 24px',
            marginBottom: 24, boxShadow: 'var(--shadow-sm)',
            display: 'flex', gap: 16, alignItems: 'flex-start',
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
              background: 'rgba(29,158,117,0.1)', border: '1px solid rgba(29,158,117,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20,
            }}>
              ✦
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#1D9E75',
                letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6 }}>
                Summary · {insights.review_count} reviews analyzed
              </div>
              <p style={{ fontSize: 14, color: 'var(--ink)', lineHeight: 1.7, margin: 0 }}>
                {insights.summary}
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <div>
              {/* Positives */}
              <InsightCard icon="★" title="What customers love">
                {insights.positives?.map(function(p) {
                  return (
                    <ThemeRow
                      key={p.theme}
                      theme={p.theme}
                      description={p.description}
                      count={p.count}
                      example={p.example}
                      positive={true}
                    />
                  );
                })}
              </InsightCard>

              {/* Location spotlight */}
              <InsightCard icon="◎" title="Location spotlight">
                {insights.location_spotlight?.map(function(loc) {
                  return (
                    <div key={loc.location} style={{
                      padding: '14px 20px', borderBottom: '1px solid var(--border)',
                    }}>
                      <div style={{ fontSize: 13, fontWeight: 500,
                        color: 'var(--ink)', marginBottom: 4 }}>
                        {loc.location}
                      </div>
                      <p style={{ fontSize: 12, color: 'var(--ink-2)',
                        lineHeight: 1.6, margin: 0 }}>
                        {loc.note}
                      </p>
                    </div>
                  );
                })}
              </InsightCard>
            </div>

            <div>
              {/* Negatives */}
              <InsightCard icon="⚠" title="Areas for improvement">
                {insights.negatives?.map(function(n) {
                  return (
                    <ThemeRow
                      key={n.theme}
                      theme={n.theme}
                      description={n.description}
                      count={n.count}
                      example={n.example}
                      urgency={n.urgency}
                      positive={false}
                    />
                  );
                })}
              </InsightCard>

              {/* Opportunities */}
              <InsightCard icon="→" title="Opportunities">
                {insights.opportunities?.map(function(opp, i) {
                  return (
                    <OpportunityCard
                      key={opp.title}
                      title={opp.title}
                      description={opp.description}
                      index={i}
                    />
                  );
                })}
              </InsightCard>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
