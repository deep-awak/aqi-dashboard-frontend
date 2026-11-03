// Échelle AQI d'OpenWeather (1 à 5) et repères de l'OMS (moyennes 24 h, lignes directrices 2021).
export const AQI_LEVELS = [
  {
    level: 1, label: 'Bon', color: '#16a34a', soft: '#dcfce7',
    advice: "L'air est pur. Aucune précaution particulière n'est nécessaire.",
  },
  {
    level: 2, label: 'Passable', color: '#84cc16', soft: '#ecfccb',
    advice: 'Qualité acceptable. Les personnes sensibles peuvent limiter les efforts prolongés.',
  },
  {
    level: 3, label: 'Modéré', color: '#eab308', soft: '#fef9c3',
    advice: 'Asthmatiques, enfants et personnes âgées : réduisez les activités intenses en extérieur.',
  },
  {
    level: 4, label: 'Mauvais', color: '#f97316', soft: '#ffedd5',
    advice: 'Limitez les activités en extérieur, surtout près des axes très fréquentés.',
  },
  {
    level: 5, label: 'Très mauvais', color: '#dc2626', soft: '#fee2e2',
    advice: "Restez à l'intérieur autant que possible et gardez les fenêtres fermées.",
  },
];

export const WHO_REFERENCE = { pm25: 15, pm10: 45, no2: 25 };

export const METRICS = [
  { key: 'aqi', label: 'AQI', unit: '', name: "Indice de qualité de l'air (1 à 5)" },
  { key: 'pm25', label: 'PM2.5', unit: 'µg/m³', name: 'Particules fines' },
  { key: 'pm10', label: 'PM10', unit: 'µg/m³', name: 'Particules en suspension' },
  { key: 'no2', label: 'NO₂', unit: 'µg/m³', name: 'Dioxyde d’azote' },
];

export function levelOf(value) {
  const n = Math.round(Number(value));
  if (!Number.isFinite(n) || n < 1) return null;
  return AQI_LEVELS[Math.min(n, 5) - 1];
}

export function formatValue(value, digits = 1) {
  const n = Number(value);
  if (!Number.isFinite(n)) return '—';
  return n.toLocaleString('fr-FR', { maximumFractionDigits: digits });
}

export function average(values) {
  const valid = values.filter(Number.isFinite);
  if (valid.length === 0) return null;
  return valid.reduce((sum, v) => sum + v, 0) / valid.length;
}

// Compare la moyenne des 7 derniers jours à celle des 7 jours précédents.
export function weeklyTrend(series, key) {
  const values = series.map((row) => row[key]).filter(Number.isFinite);
  const span = Math.min(7, Math.floor(values.length / 2));
  if (span < 1) return null;
  const recent = average(values.slice(-span));
  const previous = average(values.slice(-span * 2, -span));
  if (recent === null || previous === null || previous === 0) return null;
  return { delta: recent - previous, pct: ((recent - previous) / previous) * 100 };
}
