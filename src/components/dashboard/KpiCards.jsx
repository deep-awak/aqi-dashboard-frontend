import { Gauge, CloudFog, Cloud, Factory, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { METRICS, WHO_REFERENCE, levelOf, formatValue, weeklyTrend } from '../../utils/aqi';

const ICONS = { aqi: Gauge, pm25: CloudFog, pm10: Cloud, no2: Factory };
const TONES = { aqi: '#f59e0b', pm25: '#f97316', pm10: '#ea580c', no2: '#ef4444' };

export default function KpiCards({ kpis, series }) {
  return (
    <div className="kpi-grid">
      {METRICS.map((metric) => {
        const Icon = ICONS[metric.key];
        const tone = TONES[metric.key];
        const value = kpis?.[metric.key];
        const trend = weeklyTrend(series, metric.key);
        const ref = WHO_REFERENCE[metric.key];
        const level = metric.key === 'aqi' ? levelOf(value) : null;
        const share = ref && Number.isFinite(value) ? (value / ref) * 100 : null;
        const worse = trend && trend.delta > 0;

        return (
          <article key={metric.key} className="card kpi">
            <div className="kpi-top">
              <span className="kpi-icon" style={{ background: `${tone}1f`, color: tone }}>
                <Icon size={20} />
              </span>
              <div>
                <p className="kpi-label">{metric.label}</p>
                <p className="muted small">{metric.name}</p>
              </div>
            </div>

            <p className="kpi-value">
              {formatValue(value)}
              {metric.unit && <span className="kpi-unit"> {metric.unit}</span>}
            </p>

            {level && (
              <span className="level-pill" style={{ background: level.soft, color: level.color }}>
                {level.label}
              </span>
            )}

            {trend && (
              <p className={`trend ${worse ? 'bad' : 'good'}`}>
                {worse ? <ArrowUpRight size={15} /> : <ArrowDownRight size={15} />}
                {Math.abs(trend.pct).toFixed(1)} % par rapport à la semaine précédente
              </p>
            )}

            {share !== null && (
              <div className="meter">
                <div className="track">
                  <span
                    style={{
                      width: `${Math.min(share, 100)}%`,
                      background: share > 100 ? '#dc2626' : tone,
                    }}
                  />
                </div>
                <small className="muted">
                  {Math.round(share)} % du repère OMS ({ref} {metric.unit})
                </small>
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}
