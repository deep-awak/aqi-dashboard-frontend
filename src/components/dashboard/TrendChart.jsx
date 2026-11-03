import { useMemo, useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from 'recharts';
import { METRICS, WHO_REFERENCE } from '../../utils/aqi';
import { formatDay, formatLongDate } from '../../utils/format';
import { EmptyState } from '../common/ui';
import { TrendingUp, ShieldAlert, CheckCircle2, Activity, BarChart2, Calendar } from 'lucide-react';

const RANGES = [
  { days: 7, label: '7 jours' },
  { days: 14, label: '14 jours' },
  { days: 30, label: '30 jours' },
  { days: 0, label: 'Tout' },
];

// Custom dot showing exact real values above vertices
function CustomizedDot(props) {
  const { cx, cy, value } = props;
  const num = Number(value);
  if (!cx || !cy || !Number.isFinite(num)) return null;

  return (
    <g>
      <line
        x1={cx}
        y1={cy + 8}
        x2={cx}
        y2={cy + 60}
        stroke="rgba(255, 140, 60, 0.25)"
        strokeDasharray="3 3"
      />
      <circle cx={cx} cy={cy} r={6} fill="#ff4500" stroke="#ffffff" strokeWidth={2} />
      <text
        x={cx}
        y={cy - 12}
        fill="#fff7ed"
        fontSize={11}
        fontWeight={700}
        textAnchor="middle"
      >
        {num.toFixed(1)}
      </text>
    </g>
  );
}

export default function TrendChart({ series = [] }) {
  const [metricKey, setMetricKey] = useState('aqi');
  const [days, setDays] = useState(7);
  const [viewMode, setViewMode] = useState('spline'); // 'spline' or 'comparison'

  // EXCLUSIVELY REAL DATA: NO SIMULATION, NO MOCK DATA.
  const chartData = useMemo(() => {
    if (!series || !Array.isArray(series) || series.length === 0) return [];
    const rows = days ? series.slice(-days) : series;

    return rows
      .map((row) => {
        const aqi = Number.isFinite(Number(row.aqi)) ? Number(row.aqi) : null;
        const pm25 = Number.isFinite(Number(row.pm25)) ? Number(row.pm25) : null;
        const pm10 = Number.isFinite(Number(row.pm10)) ? Number(row.pm10) : null;
        const no2 = Number.isFinite(Number(row.no2)) ? Number(row.no2) : null;

        const dateStr = formatDay(row.d) || (row.d ? String(row.d).slice(0, 10) : 'Date');

        return {
          rawDate: row.d,
          label: dateStr,
          aqi,
          pm25,
          pm10,
          no2,
        };
      })
      .filter((r) => r.aqi !== null || r.pm25 !== null || r.pm10 !== null || r.no2 !== null);
  }, [series, days]);

  const metric = METRICS.find((m) => m.key === metricKey) || METRICS[0];
  const ref = WHO_REFERENCE[metricKey];

  // Statistical calculations safely checking isFinite
  const stats = useMemo(() => {
    if (chartData.length === 0) return null;
    const values = chartData.map((d) => Number(d[metricKey])).filter(Number.isFinite);
    if (values.length === 0) return null;

    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const max = Math.max(...values);
    const min = Math.min(...values);
    const latest = values[values.length - 1];
    const compliant = ref ? latest <= ref : true;

    return { avg, max, min, latest, compliant, count: values.length };
  }, [chartData, metricKey, ref]);

  const isSinglePoint = chartData.length === 1;
  const singlePoint = isSinglePoint ? chartData[0] : null;

  return (
    <div className="trend-section-wrap">
      {/* Top Controls Bar */}
      <div className="chart-header-bar">
        <div className="segmented-group">
          <span className="control-label">Indicateur :</span>
          <div className="segmented dark-segmented" role="group" aria-label="Indicateur">
            {METRICS.map((m) => (
              <button
                key={m.key}
                className={metricKey === m.key ? 'active' : ''}
                onClick={() => setMetricKey(m.key)}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <div className="chart-actions-right">
          <div className="segmented dark-segmented" role="group" aria-label="Type de visualisation">
            <button
              className={viewMode === 'spline' ? 'active' : ''}
              onClick={() => setViewMode('spline')}
              title="Courbe temporelle"
            >
              <TrendingUp size={15} />
              <span>Courbe</span>
            </button>
            <button
              className={viewMode === 'comparison' ? 'active' : ''}
              onClick={() => setViewMode('comparison')}
              title="Comparatif polluants"
            >
              <BarChart2 size={15} />
              <span>Polluants</span>
            </button>
          </div>

          <div className="segmented dark-segmented" role="group" aria-label="Période">
            {RANGES.map((r) => (
              <button
                key={r.days}
                className={days === r.days ? 'active' : ''}
                onClick={() => setDays(r.days)}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* KPI Stats Strip */}
      {stats && (
        <div className="chart-stats-strip">
          <div className="chart-stat-chip">
            <span className="stat-chip-label">Mesure en direct</span>
            <strong className="stat-chip-val text-orange">
              {stats.latest.toFixed(1)} {metric.unit}
            </strong>
          </div>
          <div className="chart-stat-chip">
            <span className="stat-chip-label">Moyenne observée</span>
            <strong className="stat-chip-val">
              {stats.avg.toFixed(1)} {metric.unit}
            </strong>
          </div>
          <div className="chart-stat-chip">
            <span className="stat-chip-label">Pic maximal</span>
            <strong className="stat-chip-val">
              {stats.max.toFixed(1)} {metric.unit}
            </strong>
          </div>
          {ref && (
            <div className={`chart-stat-chip ${stats.compliant ? 'chip-good' : 'chip-bad'}`}>
              <span className="stat-chip-label">Repère OMS ({ref} {metric.unit})</span>
              <strong className="stat-chip-val">
                {stats.compliant ? (
                  <span className="status-inline-good"><CheckCircle2 size={14} /> Conforme</span>
                ) : (
                  <span className="status-inline-bad"><ShieldAlert size={14} /> Dépassement</span>
                )}
              </strong>
            </div>
          )}
        </div>
      )}

      {/* When exactly 1 real observation exists in DB, show a card explaining the real data */}
      {isSinglePoint && (
        <div className="single-measure-banner">
          <Calendar size={18} />
          <div>
            <strong>Relevé officiel du {formatLongDate(singlePoint.rawDate) || singlePoint.label}</strong>
            <p>
              AQI : {singlePoint.aqi ?? '—'} · PM2.5 : {singlePoint.pm25 ?? '—'} µg/m³ · PM10 : {singlePoint.pm10 ?? '—'} µg/m³ · NO₂ : {singlePoint.no2 ?? '—'} µg/m³
            </p>
          </div>
        </div>
      )}

      {/* Chart Box */}
      {chartData.length === 0 ? (
        <EmptyState>Aucune donnée enregistrée pour cette sélection.</EmptyState>
      ) : viewMode === 'spline' ? (
        <div className="spline-chart-box">
          <div className="chart-title-tag">
            <Activity size={14} />
            <span>Tendance réelle : {metric.name} ({metric.unit || 'indice'})</span>
          </div>

          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={chartData} margin={{ top: 32, right: 24, left: -10, bottom: 8 }}>
              <defs>
                <linearGradient id="splineGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff4500" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="#ff4500" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 140, 60, 0.12)" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 12, fill: '#fed7aa' }}
                tickLine={false}
                axisLine={{ stroke: 'rgba(255, 140, 60, 0.2)' }}
                minTickGap={16}
              />
              <YAxis
                tick={{ fontSize: 12, fill: '#fed7aa' }}
                tickLine={false}
                axisLine={false}
                width={44}
                domain={metricKey === 'aqi' ? [0.8, 5] : ['auto', 'auto']}
              />
              <Tooltip
                formatter={(value) => [
                  Number.isFinite(Number(value)) ? `${Number(value).toFixed(2)} ${metric.unit}`.trim() : '—',
                  metric.name,
                ]}
                contentStyle={{
                  backgroundColor: '#1a0d07',
                  borderRadius: 12,
                  border: '1px solid rgba(255, 120, 50, 0.3)',
                  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.6)',
                  color: '#fff7ed',
                }}
              />
              {ref && (
                <ReferenceLine
                  y={ref}
                  stroke="#ef4444"
                  strokeDasharray="4 4"
                  strokeWidth={1.5}
                  label={{
                    value: `Seuil OMS : ${ref} ${metric.unit}`,
                    position: 'insideTopRight',
                    fill: '#f87171',
                    fontSize: 12,
                  }}
                />
              )}
              <Area
                type="monotone"
                dataKey={metricKey}
                stroke="#ff4500"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#splineGradient)"
                dot={<CustomizedDot />}
                activeDot={{ r: 8, stroke: '#ffffff', strokeWidth: 2, fill: '#ff4500' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ) : (
        /* Multi-pollutant comparison chart */
        <div className="spline-chart-box">
          <div className="chart-title-tag">
            <BarChart2 size={14} />
            <span>Comparaison réelle des concentrations : PM2.5, PM10 et NO2 (µg/m³)</span>
          </div>

          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={chartData} margin={{ top: 20, right: 24, left: -10, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 140, 60, 0.12)" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#fed7aa' }} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#fed7aa' }} tickLine={false} width={44} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1a0d07',
                  borderRadius: 12,
                  border: '1px solid rgba(255, 120, 50, 0.3)',
                  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.6)',
                  color: '#fff7ed',
                }}
              />
              <Bar dataKey="pm25" name="PM2.5 (Particules fines)" fill="#f97316" radius={[6, 6, 0, 0]} />
              <Bar dataKey="pm10" name="PM10 (Respirables)" fill="#f59e0b" radius={[6, 6, 0, 0]} />
              <Bar dataKey="no2" name="NO2 (Dioxyde d'azote)" fill="#ef4444" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
