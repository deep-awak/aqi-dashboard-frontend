import { useMemo, useState } from 'react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine,
} from 'recharts';
import { METRICS, WHO_REFERENCE } from '../../utils/aqi';
import { formatDay } from '../../utils/format';
import { EmptyState } from '../common/ui';

const RANGES = [
  { days: 7, label: '7 jours' },
  { days: 30, label: '30 jours' },
  { days: 0, label: 'Tout' },
];

export default function TrendChart({ series }) {
  const [metricKey, setMetricKey] = useState('aqi');
  const [days, setDays] = useState(30);

  const data = useMemo(() => {
    const rows = days ? series.slice(-days) : series;
    return rows.map((row) => ({ ...row, label: formatDay(row.d) }));
  }, [series, days]);

  const metric = METRICS.find((m) => m.key === metricKey);
  const ref = WHO_REFERENCE[metricKey];

  return (
    <>
      <div className="toolbar">
        <div className="segmented" role="group" aria-label="Indicateur">
          {METRICS.map((m) => (
            <button key={m.key} className={metricKey === m.key ? 'active' : ''} onClick={() => setMetricKey(m.key)}>
              {m.label}
            </button>
          ))}
        </div>
        <div className="segmented" role="group" aria-label="Période">
          {RANGES.map((r) => (
            <button key={r.days} className={days === r.days ? 'active' : ''} onClick={() => setDays(r.days)}>
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {data.length === 0 ? (
        <EmptyState>Pas encore de données pour cette sélection.</EmptyState>
      ) : (
        <div className="chart-box">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data} margin={{ top: 16, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 12, fill: '#64748b' }}
                tickLine={false}
                axisLine={false}
                minTickGap={24}
              />
              <YAxis
                tick={{ fontSize: 12, fill: '#64748b' }}
                tickLine={false}
                axisLine={false}
                width={44}
                domain={metricKey === 'aqi' ? [1, 5] : ['auto', 'auto']}
              />
              <Tooltip
                formatter={(value) => [
                  `${Number(value).toLocaleString('fr-FR', { maximumFractionDigits: 1 })} ${metric.unit}`.trim(),
                  metric.label,
                ]}
                contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 8px 24px rgba(15,23,42,.12)' }}
              />
              {ref && (
                <ReferenceLine
                  y={ref}
                  stroke="#dc2626"
                  strokeDasharray="4 4"
                  label={{ value: `Repère OMS : ${ref}`, position: 'insideTopRight', fill: '#dc2626', fontSize: 12 }}
                />
              )}
              <Line
                type="monotone"
                dataKey={metricKey}
                stroke="#2563eb"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6 }}
                connectNulls
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </>
  );
}
