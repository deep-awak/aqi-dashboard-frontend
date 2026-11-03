import { useEffect, useState } from 'react';
import { fetchAnalyses } from '../services/api';

let cache = null;
let pending = null;

function loadOnce() {
  if (cache) return Promise.resolve(cache);
  if (!pending) {
    pending = fetchAnalyses()
      .then((data) => {
        cache = data;
        return data;
      })
      .finally(() => {
        pending = null;
      });
  }
  return pending;
}

export function useAnalyses() {
  const [analyses, setAnalyses] = useState(cache || {});
  const [loading, setLoading] = useState(!cache);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    loadOnce()
      .then((data) => alive && setAnalyses(data))
      .catch((err) => alive && setError(err.message))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  return { analyses, loading, error };
}
