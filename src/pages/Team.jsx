import React, { useState, useEffect } from 'react';
import { api } from '../lib/api.js';
import { Spinner, Toast, Avatar } from '../components/ui.jsx';

const ROLE_LABELS = { owner: 'Owner', manager: 'Manager' };
const ROLE_COLORS = {
  owner:   { bg:'var(--blue-bg)',  border:'var(--blue-border)',  color:'var(--blue)'  },
  manager: { bg:'var(--bg-muted)', border:'var(--border)',       color:'var(--ink-3)' },
};

function RoleBadge({ role }) {
  const c = ROLE_COLORS[role] ?? ROLE_COLORS.manager;
  return (
    <span style={{
      fontSize:10, fontWeight:600, padding:'2px 8px', borderRadius:99,
      background:c.bg, color:c.color, border:`1px solid ${c.border}`,
      letterSpacing:'0.04em',
    }}>
      {ROLE_LABELS[role] ?? role}
    </span>
  );
}

function InviteModal({ locations, onSend, onClose }) {
  const [email, setEmail]             = useState('');
  const [role, setRole]               = useState('manager');
  const [selectedLocs, setSelectedLocs] = useState([]);
  const [sending, setSending]         = useState(false);
  const [error, setError]             = useState('');

  function toggleLoc(id) {
    setSelectedLocs(prev =>
      prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id]
    );
  }

  async function handleSend() {
    if (!email.trim()) { setError('Email is required'); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setError('Please enter a valid email'); return; }
    setSending(true);
    try {
      await onSend({ email: email.trim(), role, location_ids: selectedLocs });
    } catch (e) {
      setError(e.message);
      setSending(false);
    }
  }

  return (
    <div
      onClick={e => e.target === e.currentTarget && onClose()}
      style={{
        position:'fixed', inset:0, background:'rgba(0,0,0,0.4)',
        display:'flex', alignItems:'center', justifyContent:'center',
        zIndex:1000, padding:24,
      }}
    >
      <div style={{
        background:'var(--bg-card)', borderRadius:'var(--radius-xl)',
        padding:'28px 32px', width:'100%', maxWidth:480,
        boxShadow:'var(--shadow-lg)',
      }}>
        <div style={{ fontSize:18, fontWeight:500, color:'var(--ink)', marginBottom:4 }}>
          Invite team member
        </div>
        <div style={{ fontSize:13, color:'var(--ink-3)', marginBottom:24 }}>
          They'll receive an email with a link to join your account.
        </div>

        <label style={{ fontSize:13, fontWeight:500, color:'var(--ink-2)',
          display:'block', marginBottom:6 }}>
          Email address
        </label>
        <input
          type="email"
          value={email}
          onChange={e => { setEmail(e.target.value); setError(''); }}
          placeholder="manager@restaurant.com"
          autoFocus
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          style={{
            width:'100%', padding:'10px 12px', fontSize:13,
            borderRadius:'var(--radius-md)', marginBottom:16,
            border:`1px solid ${error ? 'var(--red-border)' : 'var(--border)'}`,
            background:'var(--bg)', color:'var(--ink)', outline:'none',
          }}
        />

        <label style={{ fontSize:13, fontWeight:500, color:'var(--ink-2)',
          display:'block', marginBottom:6 }}>
          Role
        </label>
        <div style={{ display:'flex', gap:8, marginBottom:20 }}>
          {['manager'].map(r => (
            <button key={r} onClick={() => setRole(r)} style={{
              flex:1, padding:'9px', borderRadius:'var(--radius-md)',
              fontSize:13, fontWeight:500, cursor:'pointer',
              background: role === r ? 'var(--ink)' : 'var(--bg-muted)',
              color: role === r ? 'var(--bg)' : 'var(--ink-2)',
              border: role === r ? 'none' : '1px solid var(--border)',
            }}>
              Manager
            </button>
          ))}
        </div>

        {locations.length > 0 && (
          <>
            <label style={{ fontSize:13, fontWeight:500, color:'var(--ink-2)',
              display:'block', marginBottom:6 }}>
              Assign locations
              <span style={{ fontSize:11, color:'var(--ink-3)', fontWeight:400,
                marginLeft:6 }}>
                (leave empty for all locations)
              </span>
            </label>
            <div style={{
              border:'1px solid var(--border)', borderRadius:'var(--radius-md)',
              overflow:'hidden', marginBottom:20,
            }}>
              {locations.map((loc, i) => (
                <div
                  key={loc.id}
                  onClick={() => toggleLoc(loc.id)}
                  style={{
                    display:'flex', alignItems:'center', gap:10,
                    padding:'10px 14px', cursor:'pointer',
                    background: selectedLocs.includes(loc.id)
                      ? 'var(--blue-bg)' : 'var(--bg-card)',
                    borderBottom: i < locations.length - 1
                      ? '1px solid var(--border)' : 'none',
                    transition:'background 0.1s',
                  }}
                >
                  <div style={{
                    width:16, height:16, borderRadius:4, flexShrink:0,
                    border:`1.5px solid ${selectedLocs.includes(loc.id) ? 'var(--blue)' : 'var(--border)'}`,
                    background: selectedLocs.includes(loc.id) ? 'var(--blue)' : 'transparent',
                    display:'flex', alignItems:'center', justifyContent:'center',
                  }}>
                    {selectedLocs.includes(loc.id) && (
                      <span style={{ color:'#fff', fontSize:10, lineHeight:1 }}>✓</span>
                    )}
                  </div>
                  <span style={{ fontSize:13, color:'var(--ink)' }}>{loc.name}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {error && (
          <div style={{ fontSize:12, color:'var(--red)', marginBottom:12 }}>{error}</div>
        )}

        <div style={{ display:'flex', gap:8 }}>
          <button onClick={onClose} style={{
            flex:1, padding:'10px', borderRadius:'var(--radius-md)',
            background:'var(--bg-muted)', color:'var(--ink-2)',
            border:'1px solid var(--border)', fontSize:13, fontWeight:500, cursor:'pointer',
          }}>
            Cancel
          </button>
          <button onClick={handleSend} disabled={sending} style={{
            flex:2, padding:'10px', borderRadius:'var(--radius-md)',
            background:'var(--ink)', color:'var(--bg)',
            border:'none', fontSize:13, fontWeight:500, cursor:'pointer',
            opacity: sending ? 0.6 : 1,
            display:'flex', alignItems:'center', justifyContent:'center', gap:8,
          }}>
            {sending ? <><Spinner size={14} color="var(--bg)"/> Sending...</> : 'Send invite'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Team() {
  const [members, setMembers]     = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [showInvite, setShowInvite] = useState(false);
  const [toast, setToast]         = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editLocs, setEditLocs]   = useState([]);

  useEffect(() => {
    Promise.all([api.getTeam(), api.getLocations()])
      .then(([team, locs]) => {
        setMembers(team);
        setLocations(locs.filter(l => l.is_active));
      })
      .catch(e => showToast(e.message, 'error'))
      .finally(() => setLoading(false));
  }, []);

  function showToast(message, type = 'success') {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }

  async function handleInvite(data) {
    await api.inviteTeamMember(data);
    setShowInvite(false);
    showToast(`Invite sent to ${data.email}`);
  }

  async function handleRemove(member) {
    if (!window.confirm(`Remove ${member.name ?? member.email} from your team?`)) return;
    await api.removeTeamMember(member.id).catch(() => {});
    setMembers(prev => prev.filter(m => m.id !== member.id));
    showToast('Team member removed');
  }

  async function handleSaveLocations(memberId) {
    await api.updateTeamMember(memberId, { location_ids: editLocs });
    setMembers(prev => prev.map(m =>
      m.id === memberId ? { ...m, location_ids: editLocs } : m
    ));
    setEditingId(null);
    showToast('Locations updated');
  }

  if (loading) return (
    <div style={{ display:'flex', justifyContent:'center', padding:80 }}>
      <Spinner size={32}/>
    </div>
  );

  return (
    <div style={{ padding:'40px 48px', maxWidth:860, margin:'0 auto', width:'100%' }}>

      <div style={{ display:'flex', alignItems:'flex-start',
        justifyContent:'space-between', marginBottom:32 }}>
        <div>
          <h1 style={{ fontFamily:'var(--font-display)', fontSize:32,
            fontWeight:400, marginBottom:6 }}>
            Team
          </h1>
          <p style={{ color:'var(--ink-2)', fontSize:15 }}>
            Invite managers to respond to reviews at their assigned locations.
          </p>
        </div>
        <button onClick={() => setShowInvite(true)} style={{
          padding:'10px 20px', borderRadius:'var(--radius-md)',
          background:'var(--ink)', color:'var(--bg)',
          border:'none', fontSize:13, fontWeight:500, cursor:'pointer',
          display:'flex', alignItems:'center', gap:6, flexShrink:0,
        }}>
          + Invite member
        </button>
      </div>

      {members.length === 0 ? (
        <div style={{
          textAlign:'center', padding:'60px 40px',
          background:'var(--bg-card)', borderRadius:'var(--radius-xl)',
          border:'1px solid var(--border)',
        }}>
          <div style={{ fontFamily:'var(--font-display)', fontSize:22,
            marginBottom:10, color:'var(--ink)' }}>
            No team members yet
          </div>
          <p style={{ color:'var(--ink-2)', fontSize:14, marginBottom:24 }}>
            Invite managers to help respond to reviews at their locations.
          </p>
          <button onClick={() => setShowInvite(true)} style={{
            padding:'10px 20px', borderRadius:'var(--radius-md)',
            background:'var(--ink)', color:'var(--bg)',
            border:'none', fontSize:13, fontWeight:500, cursor:'pointer',
          }}>
            + Invite your first team member
          </button>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {members.map(member => {
            const isEditing = editingId === member.id;
            const assignedLocs = locations.filter(l =>
              member.location_ids?.includes(l.id) ||
              member.location_ids?.includes(String(l.id))
            );
            return (
              <div key={member.id} style={{
                background:'var(--bg-card)', border:'1px solid var(--border)',
                borderRadius:'var(--radius-lg)', padding:'20px 24px',
                boxShadow:'var(--shadow-sm)',
              }}>
                <div style={{ display:'flex', alignItems:'center',
                  justifyContent:'space-between', gap:16 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:12, flex:1, minWidth:0 }}>
                    <Avatar name={member.name ?? member.email} size={40}/>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:2 }}>
                        <span style={{ fontSize:14, fontWeight:500, color:'var(--ink)' }}>
                          {member.name ?? member.email}
                        </span>
                        <RoleBadge role={member.role}/>
                      </div>
                      <div style={{ fontSize:12, color:'var(--ink-3)' }}>
                        {member.email}
                        {member.user_id ? '' : ' · Invite pending'}
                      </div>
                    </div>
                  </div>

                  {member.role !== 'owner' && (
                    <div style={{ display:'flex', gap:8, flexShrink:0 }}>
                      <button
                        onClick={() => {
                          if (isEditing) {
                            setEditingId(null);
                          } else {
                            setEditingId(member.id);
                            setEditLocs(member.location_ids?.map(String) ?? []);
                          }
                        }}
                        style={{
                          padding:'7px 14px', borderRadius:'var(--radius-md)',
                          background:'var(--bg-muted)', color:'var(--ink-2)',
                          border:'1px solid var(--border)', fontSize:12,
                          fontWeight:500, cursor:'pointer',
                        }}
                      >
                        {isEditing ? 'Cancel' : 'Edit locations'}
                      </button>
                      <button onClick={() => handleRemove(member)} style={{
                        padding:'7px 14px', borderRadius:'var(--radius-md)',
                        background:'transparent', color:'var(--red)',
                        border:'1px solid var(--red-border)', fontSize:12,
                        fontWeight:500, cursor:'pointer',
                      }}>
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                {!isEditing && assignedLocs.length > 0 && (
                  <div style={{ marginTop:12, display:'flex', flexWrap:'wrap', gap:6 }}>
                    {assignedLocs.map(loc => (
                      <span key={loc.id} style={{
                        fontSize:11, padding:'3px 9px', borderRadius:99,
                        background:'var(--bg-muted)', color:'var(--ink-3)',
                        border:'1px solid var(--border)',
                      }}>
                        {loc.name}
                      </span>
                    ))}
                  </div>
                )}

                {!isEditing && member.role === 'manager' && assignedLocs.length === 0 && (
                  <div style={{ marginTop:10, fontSize:12, color:'var(--ink-3)' }}>
                    Access to all locations
                  </div>
                )}

                {isEditing && (
                  <div style={{ marginTop:16 }}>
                    <div style={{ fontSize:12, fontWeight:500, color:'var(--ink-2)',
                      marginBottom:8 }}>
                      Assign locations
                      <span style={{ fontSize:11, color:'var(--ink-3)',
                        fontWeight:400, marginLeft:6 }}>
                        (empty = all locations)
                      </span>
                    </div>
                    <div style={{
                      border:'1px solid var(--border)', borderRadius:'var(--radius-md)',
                      overflow:'hidden', marginBottom:12,
                    }}>
                      {locations.map((loc, i) => {
                        const selected = editLocs.includes(String(loc.id));
                        return (
                          <div
                            key={loc.id}
                            onClick={() => setEditLocs(prev =>
                              selected
                                ? prev.filter(id => id !== String(loc.id))
                                : [...prev, String(loc.id)]
                            )}
                            style={{
                              display:'flex', alignItems:'center', gap:10,
                              padding:'9px 14px', cursor:'pointer',
                              background: selected ? 'var(--blue-bg)' : 'var(--bg-card)',
                              borderBottom: i < locations.length - 1
                                ? '1px solid var(--border)' : 'none',
                            }}
                          >
                            <div style={{
                              width:15, height:15, borderRadius:3, flexShrink:0,
                              border:`1.5px solid ${selected ? 'var(--blue)' : 'var(--border)'}`,
                              background: selected ? 'var(--blue)' : 'transparent',
                              display:'flex', alignItems:'center', justifyContent:'center',
                            }}>
                              {selected && (
                                <span style={{ color:'#fff', fontSize:9, lineHeight:1 }}>✓</span>
                              )}
                            </div>
                            <span style={{ fontSize:13, color:'var(--ink)' }}>{loc.name}</span>
                          </div>
                        );
                      })}
                    </div>
                    <button onClick={() => handleSaveLocations(member.id)} style={{
                      padding:'8px 20px', borderRadius:'var(--radius-md)',
                      background:'var(--ink)', color:'var(--bg)',
                      border:'none', fontSize:13, fontWeight:500, cursor:'pointer',
                    }}>
                      Save locations
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {showInvite && (
        <InviteModal
          locations={locations}
          onSend={handleInvite}
          onClose={() => setShowInvite(false)}
        />
      )}

      {toast && <Toast {...toast} onDismiss={() => setToast(null)}/>}
    </div>
  );
}
