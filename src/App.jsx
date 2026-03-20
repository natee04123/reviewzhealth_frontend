import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useSearchParams } from 'react-router-dom';
import { api } from './lib/api.js';
import AppShell     from './components/AppShell.jsx';
import Login        from './pages/Login.jsx';
import Dashboard    from './pages/Dashboard.jsx';
import ReviewDetail from './pages/ReviewDetail.jsx';
import Locations    from './pages/Locations.jsx';
import Settings     from './pages/Settings.jsx';
import Analytics    from './pages/Analytics.jsx';
import Billing      from './pages/Billing.jsx';
import { Spinner }  from './components/ui.jsx';
import Integrations from './pages/Integrations.jsx';
import Team         from './pages/Team.jsx';
import InviteAccept from './pages/InviteAccept.jsx';

function TokenCapture({ onToken }) {
  const [searchParams, setSearchParams] = useSearchParams();
  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      localStorage.setItem('rzh_token', token);
      searchParams.delete('token');
      setSearchParams(searchParams, { replace: true });
      onToken();
    }
  }, []);
  return null;
}

export default function App() {
  const [user, setUser]         = useState(undefined);
  const [checking, setChecking] = useState(true);

  async function checkAuth() {
    try {
      const data = await api.getMe();
      setUser(data?.user ?? null);
    } catch {
      setUser(null);
    } finally {
      setChecking(false);
    }
  }

  useEffect(() => { checkAuth(); }, []);

  async function handleLogout() {
    await api.logout().catch(() => {});
    localStorage.removeItem('rzh_token');
    setUser(null);
    window.location.href = '/';
  }

  if (checking) {
    return (
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh' }}>
        <Spinner size={32} />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <TokenCapture onToken={checkAuth} />
      <Routes>
        <Route path="/invite/:token" element={<InviteAccept />} />
        <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
        <Route path="/dashboard" element={
          user ? <AppShell user={user} onLogout={handleLogout} /> : <Navigate to="/" replace />
        }>
          <Route index              element={<Dashboard />} />
          <Route path="reviews/:id" element={<ReviewDetail />} />
          <Route path="locations"   element={<Locations />} />
          <Route path="analytics"   element={<Analytics />} />
          <Route path="billing"     element={<Billing />} />
          <Route path="settings"    element={<Settings />} />
          <Route path="integrations" element={<Integrations />} />
          <Route path="team"        element={<Team />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
