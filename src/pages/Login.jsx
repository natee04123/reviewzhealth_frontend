import React, { useState } from 'react';

const BASE = import.meta.env.VITE_API_BASE_URL ?? '';

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18">
      <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/>
      <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/>
      <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z"/>
      <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z"/>
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="8" fill="#1D9E75" fillOpacity="0.12"/>
      <path d="M4.5 8l2.5 2.5 4.5-4.5" stroke="#1D9E75" strokeWidth="1.5"
        strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

const FEATURES = [
  { title: 'AI-drafted responses',     body: 'Claude reads each review and writes a personalized reply in seconds — matching tone to star rating automatically.' },
  { title: 'One-click approval',       body: 'Review the draft, edit if needed, and post directly to Google with one click. No copy-pasting.' },
  { title: 'Multi-platform coverage',  body: 'Google, Yelp, Tripadvisor, OpenTable, DoorDash, Uber Eats, Grubhub — all in one dashboard.' },
  { title: 'Review health score',      body: 'See your overall reputation at a glance with a health score, rating trends, and platform breakdown.' },
  { title: 'Goals and tracking',       body: 'Set rating targets and see exactly how many 5-star reviews you need to get there.' },
  { title: 'Multi-location support',   body: 'Manage every location from one account. Invite managers and assign them to specific locations.' },
];

const PRICING = [
  { tier: 'Starter',    locations: '1–3 locations',   monthly: 29, yearly: 290,  color: '#1D9E75' },
  { tier: 'Growth',     locations: '4–9 locations',   monthly: 19, yearly: 190,  color: '#185FA5', popular: true },
  { tier: 'Agency',     locations: '10–24 locations', monthly: 15, yearly: 150,  color: '#534AB7' },
  { tier: 'Enterprise', locations: '25+ locations',   monthly: 12, yearly: 120,  color: '#993C1D' },
];

export default function Login() {
  const [annual, setAnnual] = useState(false);

  return (
    <div style={{ background:'var(--bg)', minHeight:'100vh',
      fontFamily:'var(--font-sans)' }}>

      {/* Nav */}
      <nav style={{
        display:'flex', alignItems:'center', justifyContent:'space-between',
        padding:'20px 48px', borderBottom:'1px solid var(--border)',
        background:'var(--bg-card)', position:'sticky', top:0, zIndex:10,
      }}>
        <div style={{ fontFamily:'var(--font-display)', fontSize:22,
          fontWeight:400, color:'var(--ink)' }}>
          reviewz<span style={{ color:'#1D9E75' }}>health</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:24 }}>
          <a href="#features" style={{ fontSize:14, color:'var(--ink-2)',
            textDecoration:'none' }}>Features</a>
          <a href="#pricing" style={{ fontSize:14, color:'var(--ink-2)',
            textDecoration:'none' }}>Pricing</a>
          <a href={`${BASE}/auth/google?plan=${p.tier.toLowerCase()}`} style={{
            padding:'8px 20px', borderRadius:'var(--radius-md)',
            background:'var(--ink)', color:'var(--bg)',
            fontSize:14, fontWeight:500, textDecoration:'none',
            display:'flex', alignItems:'center', gap:8,
          }}>
            <GoogleIcon/> Sign in
          </a>
        </div>
      </nav>

      {/* Hero */}
      <div style={{
        maxWidth:900, margin:'0 auto', padding:'80px 48px 60px',
        textAlign:'center',
      }}>
        <div style={{
          display:'inline-flex', alignItems:'center', gap:6,
          padding:'5px 14px', borderRadius:99,
          background:'rgba(29,158,117,0.1)', border:'1px solid rgba(29,158,117,0.25)',
          fontSize:12, fontWeight:600, color:'#1D9E75',
          letterSpacing:'0.05em', marginBottom:24,
          textTransform:'uppercase',
        }}>
          Powered by Claude AI
        </div>

        <h1 style={{
          fontFamily:'var(--font-display)', fontSize:56, fontWeight:400,
          color:'var(--ink)', lineHeight:1.1, marginBottom:20,
          letterSpacing:'-0.02em',
        }}>
          Your restaurant reviews,<br/>
          <span style={{ color:'#1D9E75' }}>actually responded to.</span>
        </h1>

        <p style={{
          fontSize:18, color:'var(--ink-2)', lineHeight:1.7,
          maxWidth:560, margin:'0 auto 40px',
        }}>
          reviewzhealth uses AI to draft personalized responses to every customer review — across every platform — so you can approve and post in seconds, not hours.
        </p>

        <div style={{ display:'flex', alignItems:'center',
          justifyContent:'center', gap:12, flexWrap:'wrap' }}>
          <a href={BASE + '/auth/google'} style={{
            padding:'14px 32px', borderRadius:'var(--radius-md)',
            background:'var(--ink)', color:'var(--bg)',
            fontSize:16, fontWeight:500, textDecoration:'none',
            display:'inline-flex', alignItems:'center', gap:10,
            boxShadow:'var(--shadow-md)',
          }}>
            <GoogleIcon/> Get started free
          </a>
          <a href="#features" style={{
            padding:'14px 32px', borderRadius:'var(--radius-md)',
            background:'transparent', color:'var(--ink)',
            fontSize:16, fontWeight:500, textDecoration:'none',
            border:'1px solid var(--border)',
          }}>
            See how it works
          </a>
        </div>

        <p style={{ fontSize:13, color:'var(--ink-3)', marginTop:16 }}>
          No credit card required · Free trial · Cancel anytime
        </p>
      </div>

      {/* Stats strip */}
      <div style={{
        background:'var(--ink)', padding:'32px 48px',
        display:'flex', justifyContent:'center', gap:80, flexWrap:'wrap',
      }}>
        {[
          { stat: '8',      label: 'Review platforms' },
          { stat: '< 30s',  label: 'To approve a response' },
          { stat: '80%',    label: 'Avg response rate' },
          { stat: '$15/mo', label: 'Per location at scale' },
        ].map(s => (
          <div key={s.stat} style={{ textAlign:'center' }}>
            <div style={{ fontFamily:'var(--font-display)', fontSize:36,
              color:'#F7F5EF', fontWeight:400, lineHeight:1 }}>
              {s.stat}
            </div>
            <div style={{ fontSize:13, color:'rgba(247,245,240,0.45)',
              marginTop:4 }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Features */}
      <div id="features" style={{ maxWidth:900, margin:'0 auto',
        padding:'80px 48px' }}>
        <div style={{ textAlign:'center', marginBottom:48 }}>
          <h2 style={{ fontFamily:'var(--font-display)', fontSize:36,
            fontWeight:400, color:'var(--ink)', marginBottom:12 }}>
            Everything you need to manage your reputation
          </h2>
          <p style={{ fontSize:16, color:'var(--ink-2)', maxWidth:500,
            margin:'0 auto' }}>
            Built specifically for restaurants and multi-location food businesses.
          </p>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:20 }}>
          {FEATURES.map(f => (
            <div key={f.title} style={{
              background:'var(--bg-card)', border:'1px solid var(--border)',
              borderRadius:'var(--radius-lg)', padding:'24px',
              boxShadow:'var(--shadow-sm)',
            }}>
              <div style={{ display:'flex', alignItems:'center', gap:8,
                marginBottom:10 }}>
                <CheckIcon/>
                <div style={{ fontSize:14, fontWeight:500, color:'var(--ink)' }}>
                  {f.title}
                </div>
              </div>
              <p style={{ fontSize:13, color:'var(--ink-2)', lineHeight:1.6,
                margin:0 }}>
                {f.body}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div style={{
        background:'var(--bg-card)', borderTop:'1px solid var(--border)',
        borderBottom:'1px solid var(--border)', padding:'80px 48px',
      }}>
        <div style={{ maxWidth:900, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:48 }}>
            <h2 style={{ fontFamily:'var(--font-display)', fontSize:36,
              fontWeight:400, color:'var(--ink)', marginBottom:12 }}>
              How it works
            </h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr',
            gap:24 }}>
            {[
              { step:'1', title:'Connect', body:'Link your Google Business Profile and other review platforms in minutes.' },
              { step:'2', title:'Review comes in', body:'A customer leaves a review. reviewzhealth detects it instantly.' },
              { step:'3', title:'AI drafts a reply', body:'Claude generates a personalized response matching the tone and star rating.' },
              { step:'4', title:'You approve', body:'Edit if needed, then post directly to the platform with one click.' },
            ].map(s => (
              <div key={s.step} style={{ textAlign:'center' }}>
                <div style={{
                  width:48, height:48, borderRadius:'50%',
                  background:'rgba(29,158,117,0.1)',
                  border:'1px solid rgba(29,158,117,0.25)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  margin:'0 auto 16px',
                  fontFamily:'var(--font-display)', fontSize:20,
                  color:'#1D9E75',
                }}>
                  {s.step}
                </div>
                <div style={{ fontSize:15, fontWeight:500, color:'var(--ink)',
                  marginBottom:8 }}>
                  {s.title}
                </div>
                <p style={{ fontSize:13, color:'var(--ink-2)', lineHeight:1.6,
                  margin:0 }}>
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div id="pricing" style={{ maxWidth:900, margin:'0 auto',
        padding:'80px 48px' }}>
        <div style={{ textAlign:'center', marginBottom:40 }}>
          <h2 style={{ fontFamily:'var(--font-display)', fontSize:36,
            fontWeight:400, color:'var(--ink)', marginBottom:12 }}>
            Simple, per-location pricing
          </h2>
          <p style={{ fontSize:16, color:'var(--ink-2)', marginBottom:24 }}>
            One price per location. No per-user fees. No platform fees.
          </p>
          <div style={{
            display:'inline-flex', alignItems:'center',
            background:'var(--bg-muted)', borderRadius:99,
            padding:4, border:'1px solid var(--border)',
          }}>
            {['Monthly', 'Annual'].map(t => (
              <button key={t} onClick={() => setAnnual(t === 'Annual')} style={{
                padding:'6px 20px', borderRadius:99, fontSize:13,
                fontWeight:500, cursor:'pointer', border:'none',
                background: (t === 'Annual') === annual
                  ? 'var(--ink)' : 'transparent',
                color: (t === 'Annual') === annual
                  ? 'var(--bg)' : 'var(--ink-2)',
                transition:'all 0.15s',
              }}>
                {t}{t === 'Annual' && (
                  <span style={{ marginLeft:6, fontSize:10,
                    color: annual ? '#1D9E75' : 'var(--ink-3)',
                    fontWeight:600 }}>
                    SAVE 17%
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)',
          gap:16 }}>
          {PRICING.map(p => (
            <div key={p.tier} style={{
              background:'var(--bg-card)',
              border: p.popular
                ? '2px solid #185FA5'
                : '1px solid var(--border)',
              borderRadius:'var(--radius-lg)', padding:'24px 20px',
              position:'relative', boxShadow:'var(--shadow-sm)',
              textAlign:'center',
            }}>
              {p.popular && (
                <div style={{
                  position:'absolute', top:-12, left:'50%',
                  transform:'translateX(-50%)',
                  background:'#185FA5', color:'#fff',
                  fontSize:10, fontWeight:600, padding:'3px 12px',
                  borderRadius:99, letterSpacing:'0.05em',
                  whiteSpace:'nowrap',
                }}>
                  MOST POPULAR
                </div>
              )}
              <div style={{ fontSize:15, fontWeight:500,
                color:'var(--ink)', marginBottom:4 }}>
                {p.tier}
              </div>
              <div style={{ fontSize:12, color:'var(--ink-3)',
                marginBottom:20 }}>
                {p.locations}
              </div>
              <div style={{ fontFamily:'var(--font-display)',
                fontSize:36, color:p.color, fontWeight:400,
                lineHeight:1, marginBottom:4 }}>
                ${annual ? p.yearly : p.monthly}
              </div>
              <div style={{ fontSize:11, color:'var(--ink-3)',
                marginBottom:24 }}>
                per location / {annual ? 'year' : 'month'}
              </div>
              <a href={BASE + '/auth/google'} style={{
                display:'block', padding:'10px',
                borderRadius:'var(--radius-md)',
                background: p.popular ? '#185FA5' : 'var(--ink)',
                color:'#fff', fontSize:13, fontWeight:500,
                textDecoration:'none', transition:'opacity 0.15s',
              }}>
                Get started
              </a>
            </div>
          ))}
        </div>

        <p style={{ textAlign:'center', fontSize:13, color:'var(--ink-3)',
          marginTop:24 }}>
          All plans include a free trial. No credit card required to start.
        </p>
      </div>

      {/* CTA */}
      <div style={{
        background:'var(--ink)', padding:'80px 48px',
        textAlign:'center',
      }}>
        <h2 style={{ fontFamily:'var(--font-display)', fontSize:36,
          fontWeight:400, color:'#F7F5EF', marginBottom:16 }}>
          Ready to respond to every review?
        </h2>
        <p style={{ fontSize:16, color:'rgba(247,245,240,0.55)',
          marginBottom:32, maxWidth:480, margin:'0 auto 32px' }}>
          Join restaurants across Utah using reviewzhealth to build their reputation, one reply at a time.
        </p>
        <a href={BASE + '/auth/google'} style={{
          display:'inline-flex', alignItems:'center', gap:10,
          padding:'14px 32px', borderRadius:'var(--radius-md)',
          background:'#1D9E75', color:'#fff',
          fontSize:16, fontWeight:500, textDecoration:'none',
        }}>
          <GoogleIcon/> Get started free
        </a>
      </div>

      {/* Footer */}
      <div style={{
        borderTop:'1px solid var(--border)', padding:'24px 48px',
        display:'flex', alignItems:'center', justifyContent:'space-between',
        fontSize:12, color:'var(--ink-3)',
      }}>
        <div style={{ fontFamily:'var(--font-display)', fontSize:16,
          color:'var(--ink)' }}>
          reviewz<span style={{ color:'#1D9E75' }}>health</span>
        </div>
        <div style={{ display:'flex', gap:24 }}>
          <a href="/terms" style={{ color:'var(--ink-3)',
            textDecoration:'none' }}>Terms of Service</a>
          <a href="mailto:nathan@reviewzhealth.com" style={{ color:'var(--ink-3)',
            textDecoration:'none' }}>Contact</a>
        </div>
        <div>© 2026 Greenhalgh Holdings LLC</div>
      </div>

    </div>
  );
}
