import React, { useState, useEffect } from 'react';
import { api } from '../lib/api.js';
import ReviewCard from '../components/ReviewCard.jsx';
import { Spinner, EmptyState } from '../components/ui.jsx';

const TABS = [
  { key: 'pending',   label: 'Needs attention' },
  { key: '',          label: 'All reviews' },
  { key: 'posted',    label: 'Posted' },
  { key: 'dismissed', label: 'Dismissed' },
];

export default function Dashboard() {
  const [activeTab, setActiveTab]       = useState('pending');
  const [reviews, setReviews]           = useState([]);
  const [allReviews, setAllReviews]     = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [showPlanPrompt, setShowPlanPrompt] = useState(
    !!localStorage.getItem('rzh_signup_plan')
  );

  const signupPlan = localStorage.getItem('rzh_signup_plan');

  function dismissPlanPrompt() {
    localStorage.removeItem('rzh_signup_plan');
    setShowPlanPrompt(false);
  }

  useEffect(() => {
    loadReviews(activeTab);
  }, [activeTab]);

  useEffect(() => {
    api.getReviews({}).then(setAllReviews).catch(() => {});
  }, []);

  async function loadReviews(tab) {
    setLoading(true);
    setError(null);
    try {
      const params = tab ? { status: tab } : {};
      const data = await api.getReviews(params);
      setReviews(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  function reload() {
    loadReviews(activeTab);
    api.getReviews({}).then(setAllReviews).catch(() => {});
  }

  const pendingCount = allReviews.filter(r => (r.draft_status ?? r.status) === 'pending').length;
  const postedCount  = allReviews.filter(r => (r.draft_status ?? r.status) === 'posted').length;
  const totalCount   = allReviews.length;

  return (
    <div style={{ padding:'40px 48px', maxWidth:860, margin:'0 auto', width:'100%' }}>

      {showPlanPrompt && signupPlan && (
        <div style={{
          background:'var(--blue-bg)', border:'1px solid var(--blue-border)',
          borderRadius:'var(--radius-lg)', padding:'16px 20px',
          display:'flex', alignItems:'center', justifyContent:'space-between',
          marginBottom:24, gap:16,
        }}>
          <div>
            <div style={{ fontSize:14, fontWeight:500, color:'var(--ink)', marginBottom:2 }}>
              Complete your setup
            </div>
            <div style={{ fontSize:13, color:'var(--ink-2)' }}>
              You selected the{' '}
              <strong style={{ textTransform:'capitalize' }}>{signupPlan}</strong> plan.
              Add your billing info to activate your account after the free trial.
            </div>
          </div>
          <div style={{ display:'flex', gap:8, flexShrink:0 }}>
            <button onClick={dismissPlanPrompt} style={{
              padding:'8px 14px', borderRadius:'var(--radius-md)',
              background:'transparent', color:'var(--ink-3)',
              border:'1px solid var(--border)', fontSize:12,
              fontWeight:500, cursor:'pointer',
            }}>
              Later
            </button>
            <a href="/dashboard/billing" onClick={dismissPlanPrompt} style={{
              padding:'8px 16px', borderRadius:'var(--radius-md)',
              background:'var(--blue)', color:'#fff',
              border:'none', fontSize:12, fontWeight:500,
              cursor:'pointer', textDecoration:'none',
              display:'inline-flex', alignItems:'center',
            }}>
              Set up billing →
            </a>
          </div>
        </div>
      )}

      {/* Page header */}
      <div style={{ marginBottom:32 }}>
        <h1 style={{ fontFamily:'var(--font-display)', fontSize:32,
          fontWeight:400, marginBottom:6 }}>
          Reviews
        </h1>
        <p style={{ color:'var(--ink-2)', fontSize:15 }}>
          AI drafts are ready for your approval. Tap any review to approve or edit.
        </p>
      </div>

      {/* Stat strip */}
      <div style={{ display:'flex', gap:16, marginBottom:28 }}>
        <StatCard
          label="Needs attention"
          value={pendingCount}
          accent="var(--amber)"
          onClick={() => setActiveTab('pending')}
          active={activeTab === 'pending'}
        />
        <StatCard
          label="Posted replies"
          value={postedCount}
          accent="var(--green)"
          onClick={() => setActiveTab('posted')}
          active={activeTab === 'posted'}
        />
        <StatCard
          label="Total reviews"
          value={totalCount}
          accent="var(--blue)"
          onClick={() => setActiveTab('')}
          active={activeTab === ''}
        />
      </div>

      {/* Filter tabs */}
      <div style={{ display:'flex', gap:4, marginBottom:20,
        borderBottom:'1px solid var(--border)', paddingBottom:0 }}>
        {TABS.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
            padding:'8px 16px', fontSize:14, fontWeight:500,
            color: activeTab === tab.key ? 'var(--ink)' : 'var(--ink-3)',
            border
