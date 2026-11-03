import { useEffect, useState } from 'react';
import { api } from '../services/api';

// Les analyses changent une fois par jour : une seule requête pour toute la session.
let cache = null;
let pending = null;

function loadOnce() {
  if (cache) return Promise.resolve(cache);
  if (!pending) {
    pending = api
      .analyses()
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

// Renvoie { analyses: { cityComparison: { content, generatedAt }, ... }, loading }
export function useAnalyses() {
  const [analyses, setAnalyses] = useState(cache || {});
  const [loading, setLoading] = useState(!cache);

  useEffect(() => {
    let alive = true;
    loadOnce()
      .then((data) => alive && setAnalyses(data))
      .catch(() => alive && setAnalyses({}))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  return { analyses, loading };
}
