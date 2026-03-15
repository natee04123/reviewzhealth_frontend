// src/hooks/useReviews.js
import { useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api.js';

export function useReviews(statusFilter) {
  const [reviews, setReviews]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getReviews(statusFilter);
      setReviews(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => { load(); }, [load]);

  return { reviews, loading, error, reload: load, setReviews };
}
