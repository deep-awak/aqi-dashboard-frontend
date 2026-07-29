export const aqiColor = (v) =>
  v <= 1.5 ? '#22c55e' : v <= 2.5 ? '#84cc16' : v <= 3.5 ? '#f5a524' : v <= 4.5 ? '#f97316' : '#ef4444';

const scale = (val, min, max, a, b) => (max === min ? (a + b) / 2 : a + ((val - min) / (max - min)) * (b - a));

export function Sparkline({ data, color = '#22c55e' }) {
  if (!data?.length) return <svg width="100%" height="34" />;
  const vals = data.map((d) => d.v);
  const min = Math.min(...vals), max = Math.max(...vals);
  const w = 140, h = 34;
  const pts = data.map((d, i) => `${scale(i, 0, data.length - 1, 2, w - 2)},${scale(d.v, min, max, h - 4, 4)}`);
  const path = 'M' + pts.join(' L');
  const area = `${path} L${w - 2},${h} L2,${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height="34" preserveAspectRatio="none">
      <path d={area} fill={color} opacity="0.12" />
      <path d={path} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function MultiLineChart({ data, series, height = 230 }) {
  if (!data?.length) return <div className="loading">Pas de données</div>;
  const w = 700, h = height, pad = { l: 30, r: 10, t: 10, b: 24 };
  const allVals = series.flatMap((s) => data.map((d) => d[s.key] ?? 0));
  const max = Math.max(5, ...allVals);
  const x = (i) => scale(i, 0, data.length - 1, pad.l, w - pad.r);
  const y = (v) => scale(v, 0, max, h - pad.b, pad.t);
  const yTicks = 4;
  const step = Math.max(1, Math.ceil(data.length / 6));

  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={height}>
      {Array.from({ length: yTicks + 1 }).map((_, i) => {
        const v = (max / yTicks) * i;
        return (
          <g key={i}>
            <line x1={pad.l} x2={w - pad.r} y1={y(v)} y2={y(v)} stroke="#eef1f7" strokeWidth="1" />
            <text x={4} y={y(v) + 3} fontSize="9" fill="#8992a6">{Math.round(v)}</text>
          </g>
        );
      })}
      {data.map((d, i) =>
        i % step === 0 ? (
          <text key={i} x={x(i)} y={h - 6} fontSize="8.5" fill="#8992a6" textAnchor="middle">
            {d.d?.slice(5) ?? ''}
          </text>
        ) : null
      )}
      {series.map((s) => {
        const pts = data.map((d, i) => `${x(i)},${y(d[s.key] ?? 0)}`);
        return <polyline key={s.key} points={pts.join(' ')} fill="none" stroke={s.color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />;
      })}
    </svg>
  );
}

// ---- barres verticales : AQI moyen par ville ------------------------------
export function CityBarChart({ data, height = 210 }) {
  if (!data?.length) return <div className="loading">Pas de données</div>;
  const w = 360, h = height, pad = { l: 26, r: 6, t: 14, b: 26 };
  const max = Math.max(5, ...data.map((d) => d.aqi));
  const bw = (w - pad.l - pad.r) / data.length;
  const y = (v) => scale(v, 0, max, h - pad.b, pad.t);

  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={height}>
      {[0, max / 2, max].map((v, i) => (
        <line key={i} x1={pad.l} x2={w - pad.r} y1={y(v)} y2={y(v)} stroke="#eef1f7" />
      ))}
      {data.map((d, i) => {
        const bx = pad.l + i * bw + bw * 0.2;
        const bh = h - pad.b - y(d.aqi);
        return (
          <g key={d.city_name}>
            <rect x={bx} y={y(d.aqi)} width={bw * 0.6} height={bh} rx="4" fill={aqiColor(d.aqi)} />
            <text x={bx + bw * 0.3} y={y(d.aqi) - 5} fontSize="10" fontWeight="700" textAnchor="middle" fill="#1e2433">{d.aqi}</text>
            <text x={bx + bw * 0.3} y={h - 8} fontSize="9" textAnchor="middle" fill="#8992a6">{d.city_name}</text>
          </g>
        );
      })}
    </svg>
  );
}

// ---- histogramme horizontal : répartition par niveau d'AQI ---------------
export function AqiHistogram({ data, height = 210 }) {
  const labels = { 1: 'Très bon', 2: 'Bon', 3: 'Modéré', 4: 'Mauvais', 5: 'Très mauvais' };
  const full = [1, 2, 3, 4, 5].map((lvl) => ({ lvl, n: data.find((d) => Number(d.aqi) === lvl)?.n ?? 0 }));
  const max = Math.max(1, ...full.map((d) => d.n));
  const w = 340, h = height, pad = { l: 62, r: 30, t: 6, b: 6 };
  const rowH = (h - pad.t - pad.b) / full.length;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={height}>
      {full.map((d, i) => {
        const y0 = pad.t + i * rowH + rowH * 0.22;
        const bw = scale(d.n, 0, max, 0, w - pad.l - pad.r);
        return (
          <g key={d.lvl}>
            <text x={pad.l - 8} y={y0 + rowH * 0.34} fontSize="9.5" textAnchor="end" fill="#8992a6">{labels[d.lvl]}</text>
            <rect x={pad.l} y={y0} width={w - pad.l - pad.r} height={rowH * 0.56} rx="4" fill="#f2f4f9" />
            <rect x={pad.l} y={y0} width={bw} height={rowH * 0.56} rx="4" fill={aqiColor(d.lvl)} />
            <text x={pad.l + bw + 6} y={y0 + rowH * 0.34} fontSize="9" fill="#1e2433" fontWeight="600">{d.n}</text>
          </g>
        );
      })}
    </svg>
  );
}

// ---- donut : répartition semaine / week-end -------------------------------
export function Donut({ weekday, weekend, size = 150 }) {
  const total = weekday + weekend || 1;
  const r = size / 2 - 10, cx = size / 2, cy = size / 2, cThick = 16;
  const circ = 2 * Math.PI * r;
  const wdLen = (weekday / total) * circ;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f5a524" strokeWidth={cThick} />
      <circle
        cx={cx} cy={cy} r={r} fill="none" stroke="#22c55e" strokeWidth={cThick}
        strokeDasharray={`${wdLen} ${circ - wdLen}`} strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cy})`}
      />
      <text x={cx} y={cy - 4} textAnchor="middle" fontSize="11" fill="#8992a6">Total jours</text>
      <text x={cx} y={cy + 16} textAnchor="middle" fontSize="20" fontWeight="800" fill="#1e2433">{total}</text>
    </svg>
  );
}

// ---- carte du monde simplifiée + marqueurs villes -------------------------
const lon2x = (lon, w) => ((lon + 180) / 360) * w;
const lat2y = (lat, h) => ((90 - lat) / 180) * h;
const CONTINENTS = [
  { cx: 210, cy: 130, rx: 95, ry: 65 },   // Amérique du Nord
  { cx: 300, cy: 300, rx: 55, ry: 95 },   // Amérique du Sud
  { cx: 520, cy: 110, rx: 45, ry: 32 },   // Europe
  { cx: 545, cy: 240, rx: 65, ry: 100 },  // Afrique
  { cx: 740, cy: 130, rx: 165, ry: 95 },  // Asie
  { cx: 860, cy: 320, rx: 55, ry: 38 },   // Océanie
];

export function WorldMap({ cities, width = 700, height = 340 }) {
  return (
    <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height}>
      <rect x="0" y="0" width={width} height={height} fill="#fafbfd" rx="8" />
      {CONTINENTS.map((c, i) => (
        <ellipse key={i} cx={(c.cx / 1000) * width} cy={(c.cy / 500) * height} rx={(c.rx / 1000) * width} ry={(c.ry / 500) * height} fill="#e9ecf5" />
      ))}
      {cities.map((c) => {
        const x = lon2x(c.longitude, width);
        const y = lat2y(c.latitude, height);
        const color = aqiColor(c.aqi);
        return (
          <g key={c.city_name}>
            <circle cx={x} cy={y} r="15" fill={color} opacity="0.18" />
            <circle cx={x} cy={y} r="7" fill={color} stroke="#fff" strokeWidth="2" />
            <text x={x} y={y - 14} textAnchor="middle" fontSize="10" fontWeight="700" fill="#1e2433">{c.city_name}</text>
            <text x={x} y={y + 24} textAnchor="middle" fontSize="9.5" fill="#586179">{c.aqi}</text>
          </g>
        );
      })}
    </svg>
  );
}
