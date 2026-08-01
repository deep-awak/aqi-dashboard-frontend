

export const aqiQualityLabel = (aqi) =>
  aqi == null ? '—' : aqi <= 1.5 ? "Bonne qualité de l'air" : aqi <= 2.5 ? 'Qualité correcte'
  : aqi <= 3.5 ? 'Qualité modérée' : aqi <= 4.5 ? "Qualité dégradée" : 'Qualité très mauvaise';

const avg = (arr) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : null);

export function trendOf(series, key) {
  const vals = (series || []).map((d) => Number(d[key])).filter((v) => !Number.isNaN(v));
  if (vals.length < 4) return null;
  const mid = Math.floor(vals.length / 2);
  const a = avg(vals.slice(0, mid));
  const b = avg(vals.slice(mid));
  if (a == null || b == null || a === 0) return null;
  const pct = ((b - a) / a) * 100;
  const direction = pct > 5 ? 'hausse' : pct < -5 ? 'baisse' : 'stable';
  return { pct: Math.round(Math.abs(pct)), direction, from: Math.round(a * 100) / 100, to: Math.round(b * 100) / 100 };
}

export function bestWorstCity(citySummary) {
  const withVal = (citySummary || []).filter((c) => c.aqi != null);
  if (withVal.length < 2) return null;
  const sorted = [...withVal].sort((a, b) => a.aqi - b.aqi);
  return { best: sorted[0], worst: sorted[sorted.length - 1] };
}

export function dominantPollutant(kpis) {
  if (!kpis) return null;
  const candidates = [
    { key: 'PM2.5', value: kpis.pm25, ratio: kpis.pm25 != null ? kpis.pm25 / 15 : null },
    { key: 'PM10', value: kpis.pm10, ratio: kpis.pm10 != null ? kpis.pm10 / 45 : null },
    { key: 'NO2', value: kpis.no2, ratio: kpis.no2 != null ? kpis.no2 / 25 : null },
  ].filter((c) => c.ratio != null);
  if (!candidates.length) return null;
  candidates.sort((a, b) => b.ratio - a.ratio);
  return candidates[0];
}

export function weekendComparison(weekday) {
  const wk = weekday?.find((d) => d.is_weekend === false);
  const we = weekday?.find((d) => d.is_weekend === true);
  if (!wk?.aqi_avg || !we?.aqi_avg) return null;
  const diff = Number(we.aqi_avg) - Number(wk.aqi_avg);
  return { weekdayAqi: Number(wk.aqi_avg), weekendAqi: Number(we.aqi_avg), diff, higher: diff > 0 ? 'week-end' : diff < 0 ? 'semaine' : null };
}

export function lineChartNote(series) {
  const t = trendOf(series, 'aqi');
  if (!t) return null;
  if (t.direction === 'stable') return `Interprétation : l'AQI moyen reste stable sur la période (${t.from} → ${t.to}).`;
  return `Interprétation : l'AQI moyen est en ${t.direction} de ${t.pct}% sur la période (${t.from} → ${t.to}).`;
}

export function mapNote(citySummary) {
  const bw = bestWorstCity(citySummary);
  if (!bw) return null;
  return `À retenir : ${bw.best.city_name} a la meilleure qualité de l'air mesurée (AQI ${bw.best.aqi}), ${bw.worst.city_name} la moins bonne (AQI ${bw.worst.aqi}).`;
}

export function barChartNote(citySummary) {
  if (!citySummary?.length) return null;
  const n = citySummary.reduce((s, c) => s + Number(c.n || 0), 0);
  return `Lecture : plus la barre est basse, meilleure est la qualité de l'air — ${n.toLocaleString('fr-FR')} mesures agrégées sur ${citySummary.length} ville(s).`;
}

// -- recommandations : chaque item est déclenché par une condition sur les données --
export function buildRecommendations({ kpis, series, citySummary, weekday }) {
  const items = [];

  if (kpis?.aqi != null) {
    if (kpis.aqi <= 2)
      items.push({ icon: '🚴', text: `AQI moyen à ${kpis.aqi} : ${aqiQualityLabel(kpis.aqi).toLowerCase()}, les activités extérieures ne présentent pas de risque particulier.` });
    else if (kpis.aqi <= 3.5)
      items.push({ icon: '⚠️', text: `AQI moyen à ${kpis.aqi} : les personnes sensibles peuvent limiter les efforts prolongés en extérieur.` });
    else
      items.push({ icon: '🚫', text: `AQI moyen à ${kpis.aqi} : qualité de l'air dégradée, limitez les activités extérieures prolongées.` });
  }

  const dom = dominantPollutant(kpis);
  if (dom) {
    const t = trendOf(series, dom.key === 'PM2.5' ? 'pm25' : dom.key === 'PM10' ? 'pm10' : 'no2');
    const trendTxt = t && t.direction !== 'stable' ? `, en ${t.direction} de ${t.pct}% sur la période` : '';
    items.push({ icon: '📈', text: `${dom.key} est le polluant relativement le plus élevé (${dom.value} µg/m³, ${Math.round(dom.ratio * 100)}% du seuil indicatif OMS 24h)${trendTxt}.` });
  }

  const bw = bestWorstCity(citySummary);
  if (bw) items.push({ icon: '🏙️', text: `${bw.best.city_name} affiche la meilleure qualité de l'air (AQI ${bw.best.aqi}), à l'opposé de ${bw.worst.city_name} (AQI ${bw.worst.aqi}).` });

  const wc = weekendComparison(weekday);
  if (wc && wc.higher) {
    items.push({
      icon: '📅',
      text: `L'AQI moyen est plus élevé le ${wc.higher} (semaine : ${wc.weekdayAqi} · week-end : ${wc.weekendAqi}).`,
    });
  } else if (wc) {
    items.push({ icon: '📅', text: `L'AQI moyen est comparable semaine (${wc.weekdayAqi}) et week-end (${wc.weekendAqi}).` });
  }

  return items;
}
