import { AQI_LEVELS, levelOf } from '../../utils/aqi';
import { EmptyState } from '../common/ui';

// Part des mesures dans chaque niveau AQI (les valeurs sont arrondies au niveau le plus proche).
export default function Distribution({ histo }) {
  const counts = AQI_LEVELS.map((l) => ({ ...l, n: 0 }));
  histo.forEach(({ aqi, n }) => {
    const level = levelOf(aqi);
    if (level) counts[level.level - 1].n += n;
  });

  const total = counts.reduce((sum, c) => sum + c.n, 0);
  if (total === 0) return <EmptyState>Pas encore de mesures pour cette sélection.</EmptyState>;

  return (
    <ul className="distribution">
      {counts.map((c) => {
        const pct = (c.n / total) * 100;
        return (
          <li key={c.level}>
            <div className="dist-head">
              <span>
                <i className="dot" style={{ background: c.color }} />
                {c.label}
              </span>
              <span>{pct.toFixed(1)} %</span>
            </div>
            <div className="bar">
              <span style={{ width: `${pct}%`, background: c.color }} />
            </div>
            <small className="muted">{c.n.toLocaleString('fr-FR')} mesures</small>
          </li>
        );
      })}
    </ul>
  );
}
