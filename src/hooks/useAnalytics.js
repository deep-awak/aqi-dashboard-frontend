import { useState, useEffect } from 'react';

export function useAnalytics(fetcher, params) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    fetcher(params)
      .then((result) => {
        if (!mounted) return;
        setData(result);
        setError(null);
      })
      .catch((err) => {
        if (!mounted) return;
        console.error('Analytics failed:', err);
        setError(err.message || 'Impossible de charger les données.');
        setData(null);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => { mounted = false; };
  }, [fetcher, JSON.stringify(params)]);

  return { data, error, loading };
}