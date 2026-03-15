// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { api } from './lib/api.js';
import AppShell     from './components/AppShell.jsx';
import Login        from './pages/Login.jsx';
import Dashboard    from './pages/Dashboard.jsx';
import ReviewDetail from './pages/ReviewDetail.jsx';
import Locations    from './pages/Locations.jsx';
import Settings     from './pages/Settings.jsx';
import { Spinner }  from './components/ui.jsx';

export default function App() {
  const [user, setUser]       = useState(undefined); // undefined = loading
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    api.getMe()
      .then(data => setUser(data.userId ? data : null))
      .catch(() => setUser(null))
      .finally(() => setChecking(false));
  }, []);

  if (checking) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <Spinner size={32} />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />

        {/* Protected dashboard routes */}
        <Route path="/dashboard" element={
          user ? <AppShell user={user} /> : <Navigate to="/" replace />
        }>
          <Route index          element={<Dashboard />} />
          <Route path="reviews/:id" element={<ReviewDetail />} />
          <Route path="locations"   element={<Locations />} />
          <Route path="settings"    element={<Settings />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
