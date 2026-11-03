import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, LabelList } from 'recharts';
import { levelOf, formatValue } from '../../utils/aqi';
import { EmptyState } from '../common/ui';

export default function RegionRanking({ summary, selected, onSelect }) {
  const rows = summary.filter((r) => Number.isFinite(r.aqi)).sort((a, b) => b.aqi - a.aqi);
  if (rows.length === 0) return <EmptyState>Pas encore de données par région.</EmptyState>;

  const worst = rows[0];
  const best = rows[rows.length - 1];

  return (
    <>
      <div className="ranking-summary">
        <div>
          <span className="muted small">Région la plus exposée</span>
          <strong style={{ color: levelOf(worst.aqi)?.color }}>{worst.city_name}</strong>
          <span className="small">AQI {formatValue(worst.aqi)}</span>
        </div>
        <div>
          <span className="muted small">Région la moins exposée</span>
          <strong style={{ color: levelOf(best.aqi)?.color }}>{best.city_name}</strong>
          <span className="small">AQI {formatValue(best.aqi)}</span>
        </div>
      </div>

      <div className="chart-box" style={{ height: Math.max(320, rows.length * 26 + 24) }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={rows} layout="vertical" margin={{ top: 0, right: 44, left: 0, bottom: 0 }}>
            <XAxis type="number" domain={[1, 5]} hide />
            <YAxis
              type="category"
              dataKey="city_name"
              width={130}
              tick={{ fontSize: 12, fill: '#334155' }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip formatter={(value) => [formatValue(value), 'AQI moyen']} />
            <Bar
              dataKey="aqi"
              barSize={14}
              radius={[0, 8, 8, 0]}
              cursor="pointer"
              onClick={(entry) => onSelect((entry?.payload ?? entry).city_name)}
            >
              {rows.map((r) => (
                <Cell
                  key={r.city_name}
                  fill={levelOf(r.aqi)?.color ?? '#94a3b8'}
                  opacity={!selected || selected === 'all' || selected === r.city_name ? 1 : 0.35}
                />
              ))}
              <LabelList dataKey="aqi" position="right" formatter={(v) => formatValue(v)} style={{ fontSize: 12, fill: '#334155' }} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="muted small">Cliquez sur une barre pour afficher la région.</p>
    </>
  );
}
