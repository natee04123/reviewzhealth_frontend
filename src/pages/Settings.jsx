import React, { useState, useEffect } from 'react';
import { api } from '../lib/api.js';
import { Spinner, Toast, Avatar } from '../components/ui.jsx';

function Section({ title, description, children }) {
  return (
    <div style={{ marginBottom:32 }}>
      <div style={{ marginBottom:14 }}>
        <div style={{ fontSize:13, fontWeight:600, letterSpacing:'0.07em',
          textTransform:'uppercase', color:'var(--ink-3)' }}>
          {title}
        </div>
        {description && (
          <div style={{ fontSize:13, color:'var(--ink-3)', marginTop:4 }}>
            {description}
          </div>
        )}
      </div>
      <div style={{
        background:'var(--bg-card)', border:'1px solid var(--border)',
        borderRadius:'var(--radius-lg)', overflow:'hidden',
      }}>
        {children}
      </div>
    </div>
  );
}

function Field({ label, hint, children, last }) {
  return (
    <div style={{
      padding:'16px 20px',
      borderBottom: last ? 'none' : '1px solid var(--border)',
    }}>
      <label style={{ display:'block', fontSize:14, fontWeight:500,
        color:'var(--ink)', marginBottom:4 }}>
        {label}
      </label>
      {hint && (
        <p style={{ fontSize:12, color:'var(--ink-3)', marginBottom:8, lineHeight:1.5 }}>
          {hint}
        </p>
      )}
      {children}
    </div>
  );
}

function Toggle({ label, hint, checked, onChange }) {
  return (
    <div style={{
      padding:'14px 20px', borderBottom:'1px solid var(--border)',
      display:'flex', alignItems:'center', justifyContent:'space-between', gap:16,
    }}>
      <div>
        <div style={{ fontSize:14, color:'var(--ink)' }}>{label}</div>
        {hint && (
          <div style={{ fontSize:12, color:'var(--ink-3)', marginTop:2 }}>{hint}</div>
        )}
      </div>
      <button
        onClick={() => onChange(!checked)}
        style={{
          width:40, height:22, borderRadius:99, position:'relative', flexShrink:0,
          background: checked ? 'var(--green)' : 'var(--border)',
          transition:'background 0.2s', border:'none', cursor:'pointer',
        }}
      >
        <span style={{
          position:'absolute', top:2, left: checked ? 20 : 2,
          width:18, height:18, borderRadius:'50%', background:'#fff',
          transition:'left 0.2s', boxShadow:'0 1px 3px rgba(0,0,0,0.2)',
        }}/>
      </button>
    </div>
  );
}

const inputStyle = {
  width:'100%', padding:'9px 12px',
  borderRadius:'var(--radius-md)', border:'1px solid var(--border)',
  fontSize:14, background:'var(--bg)', color:'var(--ink)',
  outline:'none', fontFamily:'inherit',
};

export default function Settings() {
  const [user, setUser]             = useState(null);
  const [loading, setLoading]       = useState(true);
  const [saving, setSaving]         = useState(false);
  const [billing, setBilling]       = useState(null);
  const [toast, setToast]           = useState(null);

  const [businessName, setBusinessName]           = useState('');
  const [ownerName, setOwnerName]                 = useState('');
  const [aiTopics, setAiTopics]                   = useState('');
  const [notificationEmail, setNotificationEmail] = useState('');
  const [notifyNewReview, setNotifyNewReview]     = useState(true);
  const [notifyWeekly, setNotifyWeekly]           = useState(false);

  useEffect(() => {
    Promise.all([api.getMe(), api.getBillingStatus()])
      .then(([data, bill]) => {
        const u = data?.user ?? data;
        setUser(u);
        setBilling(bill);
        setBusinessName(u?.business_name ?? '');
        setOwnerName(u?.owner_display_name ?? '');
        setAiTopics(u?.ai_topics ?? '');
        setNotificationEmail(u?.notification_email ?? u?.email ?? '');
        setNotifyNewReview(u?.notify_new_review ?? true);
        setNotifyWeekly(u?.notify_weekly_summary ?? false);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function showToast(message, type = 'success') {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }

  async function handleSave() {
    setSaving(true);
    try {
      await api.updateMe({
        business_name:         businessName || null,
        owner_display_name:    ownerName || null,
        ai_topics:             aiTopics || null,
        notification_email:    notificationEmail || null,
        notify_new_review:     notifyNewReview,
        notify_weekly_summary: notifyWeekly,
      });
      showToast('Settings saved');
    } catch (e) {
      showToast(e.message, 'error');
    } finally {
      setSaving(false);
    }
  }

  async function handleDisconnect() {
    if (!window.confirm(
      'Disconnect your Google account? This will remove access to your Google Business Profile and sign you out.'
    )) return;
    await api.logout().catch(() => {});
    localStorage.removeItem('rzh_token');
    window.location.href = '/';
  }

  if (loading) return (
    <div style={{ display:'flex', justifyContent:'center', padding:80 }}>
      <Spinner size={32}/>
    </div>
  );

  const currentPlan = billing?.plan ?? 'free';
  const planLabel   = currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1);

  return (
    <div style={{ padding:'40px 48px', maxWidth:680, margin:'0 auto', width:'100%' }}>

      <div style={{ marginBottom:32 }}>
        <h1 style={{ fontFamily:'var(--font-display)', fontSize:32,
          fontWeight:400, marginBottom:6 }}>
          Settings
        </h1>
        <p style={{ color:'var(--ink-2)', fontSize:15 }}>
          Manage your account preferences and AI response settings.
        </p>
      </div>

      {/* Account info */}
      <Section title="Your account">
        <div style={{
          padding:'20px', display:'flex', alignItems:'center', gap:16,
          borderBottom:'1px solid var(--border)',
        }}>
          {user?.avatar_url ? (
            <img src={user.avatar_url} width={52} height={52} alt=""
              style={{ borderRadius:'50%', objectFit:'cover', flexShrink:0 }}/>
          ) : (
            <Avatar name={user?.name} size={52}/>
          )}
          <div>
            <div style={{ fontSize:15, fontWeight:500, color:'var(--ink)' }}>
              {user?.name}
            </div>
            <div style={{ fontSize:13, color:'var(--ink-3)', marginTop:2 }}>
              {user?.email}
            </div>
            <div style={{
              display:'inline-flex', alignItems:'center', gap:5, marginTop:6,
              padding:'2px 8px', borderRadius:99, fontSize:10, fontWeight:600,
              background:'var(--green-bg)', color:'var(--green)',
              border:'1px solid var(--green-border)', letterSpacing:'0.04em',
            }}>
              {planLabel.toUpperCase()} PLAN
            </div>
          </div>
          <button
            onClick={() => window.location.href = '/dashboard/billing'}
            style={{
              marginLeft:'auto', padding:'8px 16px', borderRadius:'var(--radius-md)',
              background:'var(--bg-muted)', color:'var(--ink-2)',
              border:'1px solid var(--border)', fontSize:13,
              fontWeight:500, cursor:'pointer', flexShrink:0,
            }}
          >
            Manage billing →
          </button>
        </div>
        <div style={{ padding:'14px 20px', display:'flex', alignItems:'center',
          justifyContent:'space-between' }}>
          <div>
            <div style={{ fontSize:14, color:'var(--ink)', fontWeight:500 }}>
              {billing?.locationCount ?? 0} of {billing?.maxLocations === 999
                ? 'unlimited' : billing?.maxLocations ?? 0} locations active
            </div>
            <div style={{ fontSize:12, color:'var(--ink-3)', marginTop:2 }}>
              {currentPlan === 'free'
                ? 'Upgrade to connect locations'
                : 'Manage your locations in the Locations page'}
            </div>
          </div>
          <button
            onClick={() => window.location.href = '/dashboard/locations'}
            style={{
              padding:'8px 16px', borderRadius:'var(--radius-md)',
              background:'var(--bg-muted)', color:'var(--ink-2)',
              border:'1px solid var(--border)', fontSize:13,
              fontWeight:500, cursor:'pointer',
            }}
          >
            View locations →
          </button>
        </div>
      </Section>

      {/* AI preferences */}
      <Section
        title="AI response preferences"
        description="These details help Claude write more personalized, on-brand responses."
      >
        <Field label="Business name" hint="Used in sign-offs and personalization. e.g. Chubby's Cafe">
          <input
            type="text"
            value={businessName}
            onChange={e => setBusinessName(e.target.value)}
            placeholder="e.g. Maple Street Cafe"
            style={inputStyle}
          />
        </Field>
        <Field label="Owner / manager name" hint="Used in sign-offs. e.g. Thanks, — Nathan">
          <input
            type="text"
            value={ownerName}
            onChange={e => setOwnerName(e.target.value)}
            placeholder="e.g. Nathan"
            style={inputStyle}
          />
        </Field>
        <Field
          label="Topics to always mention"
          hint="The AI will weave these in where relevant — loyalty program, parking, specials etc."
          last
        >
          <textarea
            value={aiTopics}
            onChange={e => setAiTopics(e.target.value)}
            placeholder="e.g. We have a loyalty card — ask your server! Free parking behind the building."
            rows={3}
            style={{ ...inputStyle, resize:'vertical' }}
          />
        </Field>
      </Section>

      {/* Notifications */}
      <Section title="Notifications">
        <Field label="Notification email" hint="Where we send new review alerts">
          <input
            type="email"
            value={notificationEmail}
            onChange={e => setNotificationEmail(e.target.value)}
            placeholder="you@yourbusiness.com"
            style={inputStyle}
          />
        </Field>
        <Toggle
          label="Email me when a new review arrives"
          hint="Get notified immediately with the AI draft ready to approve"
          checked={notifyNewReview}
          onChange={setNotifyNewReview}
        />
        <Toggle
          label="Weekly review summary"
          hint="A digest of your review health every Monday morning"
          checked={notifyWeekly}
          onChange={setNotifyWeekly}
        />
      </Section>

      {/* Save button */}
      <button
        onClick={handleSave}
        disabled={saving}
        style={{
          padding:'12px 32px', borderRadius:'var(--radius-md)',
          background:'var(--ink)', color:'var(--bg)',
          fontSize:15, fontWeight:500, border:'none', cursor:'pointer',
          marginBottom:32, opacity: saving ? 0.6 : 1,
          display:'flex', alignItems:'center', gap:8,
        }}
      >
        {saving ? <><Spinner size={16} color="var(--bg)"/> Saving...</> : 'Save settings'}
      </button>

      {/* Danger zone */}
      <Section title="Danger zone">
        <div style={{
          padding:'20px', display:'flex', alignItems:'center',
          justifyContent:'space-between', gap:16,
        }}>
          <div>
            <div style={{ fontSize:14, fontWeight:500, color:'var(--ink)' }}>
              Disconnect Google account
            </div>
            <div style={{ fontSize:13, color:'var(--ink-3)', marginTop:2 }}>
              Removes access to your Google Business Profile and signs you out.
              Your review history and settings are preserved.
            </div>
          </div>
          <button
            onClick={handleDisconnect}
            style={{
              padding:'8px 16px', borderRadius:'var(--radius-md)',
              border:'1px solid var(--red-border)', color:'var(--red)',
              background:'var(--red-bg)', fontSize:13, fontWeight:500,
              cursor:'pointer', flexShrink:0,
            }}
          >
            Disconnect
          </button>
        </div>
      </Section>

      {toast && <Toast {...toast} onDismiss={() => setToast(null)}/>}
    </div>
  );
}
