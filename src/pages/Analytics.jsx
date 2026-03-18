import React, { useState, useEffect, useRef } from 'react';
import { api } from '../lib/api.js';
import { Spinner } from '../components/ui.jsx';

const COLORS = { google:'#4285F4', yelp:'#FF6B35', facebook:'#1877F2' };

function ScoreRing({ score }) {
  const radius = 54;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (score / 100) * circ;
  const color = score >= 80 ? '#1D9E75' : score >= 60 ? '#EF9F27' : '#E24B4A';
  const label = score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : 'Needs work';
  return (
    <div style={{ position:'relative', width:128, height:128, flexShrink:0 }}>
      <svg width="128" height="128" viewBox="0 0 128 128" style={{ transform:'rotate(-90deg)' }}>
        <circle cx="64" cy="64" r={radius} fill="none" stroke="rgba(247,245,240,0.1)" strokeWidth="10"/>
        <circle cx="64" cy="64" r={radius} fill="none" stroke={color} strokeWidth="10"
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition:'stroke-dashoffset 1s ease' }}/>
      </svg>
      <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column',
        alignItems:'center', justifyContent:'center' }}>
        <div style={{ fontSize:28, fontWeight:500, color:'#F7F5EF', lineHeight:1 }}>{score}</div>
        <div style={{ fontSize:11, color:'rgba(247,245,240,0.5)', marginTop:2 }}>{label}</div>
      </div>
    </div>
  );
}

function MiniBar({ pct, color }) {
  return (
    <div style={{ flex:1, height:4, background:'var(--bg-muted)', borderRadius:99, overflow:'hidden' }}>
      <div style={{ width:`${pct}%`, height:'100%', background:color, borderRadius:99,
        transition:'width 1s ease' }}/>
    </div>
  );
}

export default function Analytics() {
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);
  const [tab, setTab]       = useState('90');
  const chartRef            = useRef(null);
  const chartInstance       = useRef(null);

  useEffect(() => {
    api.getAnalytics()
      .then(setData)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  // Draw chart when data loads
useEffect(() => {
    if (!data) return;
    if (window.Chart) {
      setTimeout(() => drawChart(), 50);
      return;
    }
    const existing = document.querySelector('script[data-chartjs]');
    if (existing) {
      existing.addEventListener('load', () => setTimeout(() => drawChart(), 50));
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.0/chart.umd.min.js';
    script.setAttribute('data-chartjs', 'true');
    script.onload = () => setTimeout(() => drawChart(), 50);
    document.head.appendChild(script);
  }, [data, tab]);

  function drawChart() {
    if (!chartRef.current || !data?.trend?.length) return;
    if (chartInstance.current) chartInstance.current.destroy();
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const gridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
    const tickColor = isDark ? 'rgba(255,255,255,0.4)'  : 'rgba(0,0,0,0.4)';
    chartInstance.current = new window.Chart(chartRef.current, {
      type: 'line',
      data: {
        labels: data.trend.map(t => t.month),
        datasets: [{
          label: 'Avg rating',
          data: data.trend.map(t => parseFloat(t.avg_rating)),
          borderColor: '#1D9E75', backgroundColor: 'rgba(29,158,117,0.08)',
          tension: 0.4, pointRadius: 4, pointBackgroundColor: '#1D9E75', borderWidth: 2,
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display:false } },
        scales: {
          x: { grid: { color:gridColor }, ticks: { color:tickColor, font:{ size:11 } } },
          y: { min:1, max:5, grid: { color:gridColor }, ticks: { color:tickColor, font:{ size:11 }, stepSize:1 } }
        }
      }
    });
  }

  if (loading) return (
    <div style={{ display:'flex', justifyContent:'center', padding:80 }}>
      <Spinner size={32}/>
    </div>
  );

  if (error) return (
    <div style={{ padding:'40px 48px' }}>
      <div style={{ padding:16, background:'var(--red-bg)', border:'1px solid var(--red-border)',
        borderRadius:'var(--radius-md)', color:'var(--red)', fontSize:14 }}>{error}</div>
    </div>
  );

  const { healthScore, avgRating, totalReviews, responseRate,
          sentiment, distribution, pendingResponses } = data;

  const scoreLabel = healthScore >= 80 ? 'Excellent' : healthScore >= 60 ? 'Good' : 'Needs work';
  const scoreColor = healthScore >= 80 ? '#1D9E75' : healthScore >= 60 ? '#EF9F27' : '#E24B4A';

  // Generate insights
  const insights = [];
  if (avgRating >= 4.5) insights.push({ type:'good', text:`Your average rating is ${avgRating} ★ — that puts you in the top tier of businesses on reviewzhealth.` });
  if (pendingResponses > 0) insights.push({ type:'warn', text:`You have ${pendingResponses} review${pendingResponses>1?'s':''} waiting for a response. Replying within 24 hours improves your Google ranking.` });
  if (responseRate >= 80) insights.push({ type:'good', text:`Your ${responseRate}% response rate is well above the industry average of 52%. Keep it up!` });
  if (responseRate < 50) insights.push({ type:'warn', text:`Your response rate is ${responseRate}%. Aim for 80%+ — businesses that respond consistently get more repeat customers.` });
  if (sentiment?.positive >= 70) insights.push({ type:'good', text:`${sentiment.positive}% of your reviews are positive. Customers frequently mention what they love — keep doing it.` });

  return (
    <div style={{ padding:'40px 48px', maxWidth:900, margin:'0 auto', width:'100%' }}>
      <div style={{ marginBottom:28 }}>
        <h1 style={{ fontFamily:'var(--font-display)', fontSize:32, fontWeight:400, marginBottom:6 }}>
          Review health
        </h1>
        <p style={{ color:'var(--ink-2)', fontSize:15 }}>
          Your overall reputation across all connected platforms.
        </p>
      </div>

      {/* Health score card */}
      <div style={{
        background:'var(--ink)', borderRadius:'var(--radius-xl)', padding:'28px 32px',
        display:'flex', alignItems:'center', gap:32, marginBottom:20,
        boxShadow:'var(--shadow-lg)',
      }}>
        <ScoreRing score={healthScore}/>
        <div>
          <div style={{ fontSize:13, color:'rgba(247,245,240,0.45)', marginBottom:6,
            letterSpacing:'0.06em', textTransform:'uppercase', fontWeight:500 }}>
            Health score
          </div>
          <div style={{ fontFamily:'var(--font-display)', fontSize:36, color:'#F7F5EF',
            fontWeight:400, lineHeight:1.1, marginBottom:8 }}>
            {scoreLabel} — {healthScore}/100
          </div>
          <div style={{ fontSize:14, color:'rgba(247,245,240,0.5)', lineHeight:1.6, maxWidth:420 }}>
            Based on your average rating, response rate, review volume, and sentiment across all platforms.
          </div>
        </div>
      </div>

      {/* Stat strip */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:20 }}>
        {[
          { label:'Avg rating', value:`${avgRating} ★`, color:'#E8A020' },
          { label:'Total reviews', value:totalReviews, color:'var(--ink)' },
          { label:'Response rate', value:`${responseRate}%`, color: responseRate>=80?'#1D9E75':'#EF9F27' },
          { label:'Pending replies', value:pendingResponses, color:pendingResponses>0?'#BA7517':'#1D9E75' },
        ].map(s => (
          <div key={s.label} style={{
            background:'var(--bg-card)', border:'1px solid var(--border)',
            borderRadius:'var(--radius-lg)', padding:'16px 20px',
            boxShadow:'var(--shadow-sm)',
          }}>
            <div style={{ fontSize:12, color:'var(--ink-3)', marginBottom:6 }}>{s.label}</div>
            <div style={{ fontSize:26, fontFamily:'var(--font-display)', color:s.color, lineHeight:1 }}>
              {s.value}
            </div>
          </div>
        ))}
      </div>

      {/* Trend chart */}
      <div style={{
        background:'var(--bg-card)', border:'1px solid var(--border)',
        borderRadius:'var(--radius-lg)', padding:'20px 24px', marginBottom:20,
        boxShadow:'var(--shadow-sm)',
      }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
          <div style={{ fontSize:15, fontWeight:500, color:'var(--ink)' }}>Rating trend</div>
        </div>
        {data.trend?.length > 0 ? (
          <div style={{ height:180 }}>
            <canvas ref={chartRef} style={{ width:'100%', height:'100%' }}/>
          </div>
        ) : (
          <div style={{ height:180, display:'flex', alignItems:'center', justifyContent:'center',
            color:'var(--ink-3)', fontSize:14 }}>
            Not enough data yet — your trend will appear after your first reviews come in.
          </div>
        )}
      </div>

      {/* Rating distribution */}
      <div style={{
        background:'var(--bg-card)', border:'1px solid var(--border)',
        borderRadius:'var(--radius-lg)', padding:'20px 24px', marginBottom:20,
        boxShadow:'var(--shadow-sm)',
      }}>
        <div style={{ fontSize:15, fontWeight:500, color:'var(--ink)', marginBottom:16 }}>
          Rating distribution
        </div>
        {distribution.map(d => (
          <div key={d.star} style={{ display:'flex', alignItems:'center', gap:12, marginBottom:8 }}>
            <div style={{ fontSize:13, color:'var(--ink-2)', width:32, textAlign:'right', flexShrink:0 }}>
              {d.star} ★
            </div>
            <div style={{ flex:1, height:8, background:'var(--bg-muted)',
              borderRadius:99, overflow:'hidden' }}>
              <div style={{
                width:`${d.pct}%`, height:'100%', borderRadius:99,
                background: d.star>=4?'#3B6D11':d.star===3?'#EF9F27':'#E24B4A',
                transition:'width 1s ease',
              }}/>
            </div>
            <div style={{ fontSize:12, color:'var(--ink-3)', width:48, textAlign:'right', flexShrink:0 }}>
              {d.pct}% ({d.count})
            </div>
          </div>
        ))}
      </div>

      {/* Sentiment */}
      <div style={{
        display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:20,
      }}>
        {[
          { label:'Positive', pct:sentiment?.positive||0, color:'#3B6D11', bg:'var(--green-bg)', border:'var(--green-border)' },
          { label:'Neutral',  pct:sentiment?.neutral||0,  color:'#854F0B', bg:'var(--amber-bg)', border:'var(--amber-border)' },
          { label:'Critical', pct:sentiment?.negative||0, color:'#9B2626', bg:'var(--red-bg)',   border:'var(--red-border)' },
        ].map(s => (
          <div key={s.label} style={{
            background:s.bg, border:`1px solid ${s.border}`,
            borderRadius:'var(--radius-lg)', padding:'16px 20px', textAlign:'center',
          }}>
            <div style={{ fontSize:32, fontWeight:500, color:s.color, lineHeight:1 }}>{s.pct}%</div>
            <div style={{ fontSize:12, color:'var(--ink-2)', marginTop:4 }}>{s.label}</div>
            <div style={{ height:4, background:'rgba(0,0,0,0.08)', borderRadius:99,
              marginTop:10, overflow:'hidden' }}>
              <div style={{ width:`${s.pct}%`, height:'100%', background:s.color,
                borderRadius:99, transition:'width 1s ease' }}/>
            </div>
          </div>
        ))}
      </div>

      {/* Insights */}
      {insights.length > 0 && (
        <>
          <div style={{ fontSize:11, fontWeight:600, letterSpacing:'0.07em',
            textTransform:'uppercase', color:'var(--ink-3)', marginBottom:12 }}>
            AI insights
          </div>
          {insights.map((insight, i) => (
            <div key={i} style={{
              background: insight.type==='good' ? 'var(--green-bg)' : 'var(--amber-bg)',
              border: `1px solid ${insight.type==='good' ? 'var(--green-border)' : 'var(--amber-border)'}`,
              borderRadius:'var(--radius-md)', padding:'12px 16px',
              display:'flex', gap:10, marginBottom:8,
            }}>
              <span style={{ fontSize:14, flexShrink:0 }}>
                {insight.type==='good' ? '◉' : '◎'}
              </span>
              <p style={{ fontSize:13, color:'var(--ink)', lineHeight:1.6 }}>{insight.text}</p>
            </div>
          ))}
        </>
      )}

      {totalReviews === 0 && (
        <div style={{
          textAlign:'center', padding:'60px 40px',
          background:'var(--bg-card)', borderRadius:'var(--radius-xl)',
          border:'1px solid var(--border)',
        }}>
          <div style={{ fontFamily:'var(--font-display)', fontSize:24, marginBottom:12 }}>
            No review data yet
          </div>
          <p style={{ color:'var(--ink-2)', fontSize:15 }}>
            Connect your Google Business Profile and sync your locations to start seeing your review health.
          </p>
        </div>
      )}
    </div>
    {/* Platform breakdown — shows when data has platformBreakdown */}
      {data.platformBreakdown?.length > 0 && (
        <>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.07em',
            textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 12 }}>
            By platform
          </div>
          <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)', overflow: 'hidden',
            marginBottom: 20, boxShadow: 'var(--shadow-sm)',
          }}>
            {data.platformBreakdown.map((p, i) => (
              <div key={p.platform} style={{
                display: 'grid', gridTemplateColumns: '120px 1fr 80px 80px',
                alignItems: 'center', gap: 16,
                padding: '12px 20px',
                borderBottom: i < data.platformBreakdown.length - 1
                  ? '1px solid var(--border)' : 'none',
              }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink)' }}>
                  {p.platform}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{
                    flex: 1, height: 6, background: 'var(--bg-muted)',
                    borderRadius: 99, overflow: 'hidden',
                  }}>
                    <div style={{
                      width: `${(p.avgRating / 5) * 100}%`, height: '100%',
                      background: p.avgRating >= 4.5 ? '#3B6D11'
                        : p.avgRating >= 4.0 ? '#639922'
                        : p.avgRating >= 3.5 ? '#EF9F27' : '#E24B4A',
                      borderRadius: 99, transition: 'width 1s ease',
                    }}/>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 500,
                    color: 'var(--ink)', width: 28, flexShrink: 0 }}>
                    {p.avgRating}★
                  </span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--ink-3)', textAlign: 'right' }}>
                  {p.reviewCount} reviews
                </div>
                <div style={{
                  fontSize: 12, textAlign: 'right', fontWeight: 500,
                  color: p.responseRate >= 80 ? 'var(--green)'
                    : p.responseRate >= 50 ? '#BA7517' : 'var(--red)',
                }}>
                  {p.responseRate}% replied
                </div>
              </div>
            ))}
          </div>
        </>
      )}
  );
}
