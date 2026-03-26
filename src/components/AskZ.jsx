import React, { useState, useRef, useEffect } from 'react';

const BASE = import.meta.env.VITE_API_BASE_URL || 'https://reviewzhealthbackend-production.up.railway.app';

function PulseLogo({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="38" fill="#1A1A18"/>
      <circle cx="40" cy="40" r="28" fill="none" stroke="#1D9E75" strokeWidth="1.5" opacity="0.4"/>
      <polyline
        points="10,40 22,40 30,22 38,58 45,30 52,50 60,40 70,40"
        fill="none" stroke="#1D9E75" strokeWidth="3"
        strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  );
}

function TypingIndicator() {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:4, padding:'10px 14px' }}>
      {[0,1,2].map(i => (
        <div key={i} style={{
          width:6, height:6, borderRadius:'50%',
          background:'var(--ink-3)',
          animation:`askz-bounce 1.2s ease infinite`,
          animationDelay:`${i * 0.2}s`,
        }}/>
      ))}
    </div>
  );
}

const SUGGESTIONS = [
  'How do I invite a manager?',
  'How does billing work?',
  'What platforms do you support?',
  'How do I set a rating goal?',
  'What is the QR code for?',
];

export default function AskZ() {
  const [open, setOpen]         = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const bottomRef               = useRef(null);
  const inputRef                = useRef(null);

  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior:'smooth' });
  }, [messages, loading]);

  async function sendMessage(text) {
    const userMsg = text || input.trim();
    if (!userMsg || loading) return;

    setInput('');
    setShowSuggestions(false);
    setMessages(prev => [...prev, { role:'user', content: userMsg }]);
    setLoading(true);

    const history = [...messages, { role:'user', content: userMsg }];

    try {
      const res = await fetch(`${BASE}/api/support/chat`, {
        method: 'POST',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify({
          messages: history.map(m => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok) throw new Error('Failed to get response');

      const reader  = res.body.getReader();
      const decoder = new TextDecoder();
      let assistantText = '';

      setMessages(prev => [...prev, { role:'assistant', content:'' }]);
      setLoading(false);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          try {
            const data = JSON.parse(line.slice(6));
            if (data.text) {
              assistantText += data.text;
              setMessages(prev => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                  role: 'assistant',
                  content: assistantText,
                };
                return updated;
              });
            }
          } catch {}
        }
      }
    } catch (e) {
      setLoading(false);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, something went wrong. Please try again or email nathan@reviewzhealth.com.',
      }]);
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <>
      <style>{`
        @keyframes askz-bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-6px); opacity: 1; }
        }
        @keyframes askz-fade-in {
          from { opacity: 0; transform: translateY(12px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .askz-msg-user { background: var(--ink); color: var(--bg); }
        .askz-msg-assistant { background: var(--bg-muted); color: var(--ink); }
        .askz-bubble:hover { transform: scale(1.06); }
        .askz-suggestion:hover { background: var(--bg-card) !important; border-color: var(--border) !important; }
      `}</style>

      {/* Chat window */}
      {open && (
        <div style={{
          position:'fixed', bottom:88, right:24, zIndex:9999,
          width:360, height:520,
          background:'var(--bg-card)', borderRadius:16,
          border:'1px solid var(--border)',
          boxShadow:'0 8px 40px rgba(0,0,0,0.18)',
          display:'flex', flexDirection:'column',
          animation:'askz-fade-in 0.2s ease',
          overflow:'hidden',
        }}>

          {/* Header */}
          <div style={{
            padding:'14px 16px',
            borderBottom:'1px solid var(--border)',
            display:'flex', alignItems:'center', gap:10,
            background:'var(--ink)', flexShrink:0,
          }}>
            <PulseLogo size={28}/>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:14, fontWeight:600, color:'#F7F5EF' }}>
                Ask Z
              </div>
              <div style={{ fontSize:11, color:'rgba(247,245,240,0.5)' }}>
                reviewzhealth support
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{
                width:28, height:28, borderRadius:'50%',
                background:'rgba(247,245,240,0.1)', border:'none',
                color:'rgba(247,245,240,0.6)', fontSize:16,
                cursor:'pointer', display:'flex', alignItems:'center',
                justifyContent:'center', flexShrink:0,
              }}
            >
              ×
            </button>
          </div>

          {/* Messages */}
          <div style={{
            flex:1, overflowY:'auto', padding:'16px',
            display:'flex', flexDirection:'column', gap:10,
          }}>

            {/* Welcome message */}
            {messages.length === 0 && (
              <div style={{
                background:'var(--bg-muted)', borderRadius:12,
                padding:'12px 14px', fontSize:13, color:'var(--ink)',
                lineHeight:1.6, border:'1px solid var(--border)',
              }}>
                <strong>Hi! I'm Ask Z</strong> — reviewzhealth's support assistant. 
                Ask me anything about the platform and I'll help you out instantly.
              </div>
            )}

            {/* Suggestions */}
            {showSuggestions && messages.length === 0 && (
              <div style={{ display:'flex', flexDirection:'column', gap:6, marginTop:4 }}>
                <div style={{ fontSize:11, color:'var(--ink-3)', fontWeight:600,
                  letterSpacing:'0.06em', textTransform:'uppercase' }}>
                  Common questions
                </div>
                {SUGGESTIONS.map(s => (
                  <button
                    key={s}
                    className="askz-suggestion"
                    onClick={() => sendMessage(s)}
                    style={{
                      padding:'8px 12px', borderRadius:8, textAlign:'left',
                      background:'var(--bg-muted)',
                      border:'1px solid var(--border)',
                      fontSize:12, color:'var(--ink-2)', cursor:'pointer',
                      transition:'all 0.15s',
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Message history */}
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  display:'flex',
                  justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                <div
                  className={msg.role === 'user' ? 'askz-msg-user' : 'askz-msg-assistant'}
                  style={{
                    maxWidth:'85%', padding:'9px 13px',
                    borderRadius: msg.role === 'user'
                      ? '12px 12px 2px 12px'
                      : '12px 12px 12px 2px',
                    fontSize:13, lineHeight:1.6,
                    whiteSpace:'pre-wrap',
                  }}
                >
                  {msg.content || (msg.role === 'assistant' && <TypingIndicator/>)}
                </div>
              </div>
            ))}

            {loading && (
              <div style={{ display:'flex', justifyContent:'flex-start' }}>
                <div className="askz-msg-assistant" style={{
                  borderRadius:'12px 12px 12px 2px', overflow:'hidden',
                }}>
                  <TypingIndicator/>
                </div>
              </div>
            )}

            <div ref={bottomRef}/>
          </div>

          {/* Input */}
          <div style={{
            padding:'12px', borderTop:'1px solid var(--border)',
            display:'flex', gap:8, flexShrink:0,
            background:'var(--bg-card)',
          }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question..."
              disabled={loading}
              style={{
                flex:1, padding:'9px 12px', fontSize:13,
                borderRadius:8, border:'1px solid var(--border)',
                background:'var(--bg)', color:'var(--ink)',
                outline:'none',
              }}
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              style={{
                width:36, height:36, borderRadius:8, flexShrink:0,
                background: input.trim() && !loading ? 'var(--ink)' : 'var(--bg-muted)',
                color: input.trim() && !loading ? 'var(--bg)' : 'var(--ink-3)',
                border:'none', cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:16, transition:'all 0.15s',
              }}
            >
              ↑
            </button>
          </div>
        </div>
      )}

      {/* Floating bubble */}
      <button
        className="askz-bubble"
        onClick={() => setOpen(o => !o)}
        style={{
          position:'fixed', bottom:24, right:24, zIndex:9999,
          width:56, height:56, borderRadius:'50%',
          background:'var(--ink)', border:'2px solid #1D9E75',
          cursor:'pointer', boxShadow:'0 4px 20px rgba(0,0,0,0.25)',
          display:'flex', alignItems:'center', justifyContent:'center',
          transition:'transform 0.15s',
        }}
      >
        {open ? (
          <span style={{ color:'#F7F5EF', fontSize:20, lineHeight:1 }}>×</span>
        ) : (
          <PulseLogo size={32}/>
        )}
      </button>
    </>
  );
}
