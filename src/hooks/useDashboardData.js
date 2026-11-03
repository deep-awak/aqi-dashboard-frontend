import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { toDay } from '../utils/format';

const num = (value) => (value === null || value === undefined || value === '' ? null : Number(value));

// L'API renvoie les moyennes sous forme de texte (PostgreSQL numeric) : on convertit ici.
const normalizers = {
  kpis: (k) => (k ? { aqi: num(k.aqi), pm25: num(k.pm25), pm10: num(k.pm10), no2: num(k.no2), n: num(k.n) ?? 0 } : null),
  series: (rows = []) =>
    rows.map((r) => ({ d: toDay(r.d), aqi: num(r.aqi), pm25: num(r.pm25), pm10: num(r.pm10), no2: num(r.no2) })),
  summary: (rows = []) =>
    rows
      .map((r) => ({
        city_name: r.city_name,
        latitude: num(r.latitude),
        longitude: num(r.longitude),
        aqi: num(r.aqi),
        pm25: num(r.pm25),
        pm10: num(r.pm10),
        no2: num(r.no2),
        n: num(r.n) ?? 0,
      }))
      .filter((r) => r.city_name),
  histo: (rows = []) => rows.map((r) => ({ aqi: num(r.aqi), n: num(r.n) ?? 0 })),
  weekday: (rows = []) =>
    rows.map((r) => ({ is_weekend: r.is_weekend === true, n: num(r.n) ?? 0, aqi_avg: num(r.aqi_avg) })),
};

const EMPTY = { kpis: null, series: [], summary: [], histo: [], weekday: [] };

// Charge toutes les données du tableau de bord. Une erreur sur un bloc n'empêche pas les autres.
export function useDashboardData({ city, weekend, refreshKey }) {
  const [state, setState] = useState({ ...EMPTY, loading: true, errors: {} });

  useEffect(() => {
    let active = true;
    setState((prev) => ({ ...prev, loading: true }));

    const tasks = {
      kpis: api.kpis({ city, weekend }),
      series: api.timeseries({ city, weekend }),
      summary: api.citySummary({ weekend }),
      histo: api.distribution({ city, weekend }),
      weekday: api.weekday({ city }),
    };
    const keys = Object.keys(tasks);

    Promise.allSettled(Object.values(tasks)).then((results) => {
      if (!active) return;
      const next = { loading: false, errors: {} };
      results.forEach((result, i) => {
        const key = keys[i];
        if (result.status === 'fulfilled') {
          next[key] = normalizers[key](result.value);
        } else {
          next[key] = EMPTY[key];
          next.errors[key] = result.reason?.message || 'Erreur inconnue';
        }
      });
      setState(next);
    });

    return () => {
      active = false;
    };
  }, [city, weekend, refreshKey]);

  return state;
}
