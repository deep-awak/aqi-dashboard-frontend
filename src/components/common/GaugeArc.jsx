import { levelOf } from '../../utils/aqi';

// Jauge en demi-cercle de 1 à 5 : l'aiguille indique le niveau AQI actuel.
export default function GaugeArc({ value, max = 5 }) {
  const cx = 100;
  const cy = 100;
  const r = 80;
  const ratio = Number.isFinite(Number(value)) ? Math.min(Math.max((Number(value) - 1) / (max - 1), 0), 1) : 0;
  const pointAt = (p) => {
    const angle = Math.PI * (1 - p);
    return [cx + r * Math.cos(angle), cy - r * Math.sin(angle)];
  };

  const [sx, sy] = pointAt(0);
  const [ex, ey] = pointAt(1);
  const [px, py] = pointAt(ratio);
  const track = `M ${sx} ${sy} A ${r} ${r} 0 0 1 ${ex} ${ey}`;
  const progress = `M ${sx} ${sy} A ${r} ${r} 0 0 1 ${px} ${py}`;
  const color = levelOf(value)?.color ?? '#cbd5e1';

  return (
    <svg viewBox="0 0 200 118" className="gauge" role="img" aria-label={`Jauge AQI : ${value ?? 'non disponible'}`}>
      <path d={track} fill="none" stroke="#e2e8f0" strokeWidth="14" strokeLinecap="round" />
      <path d={progress} fill="none" stroke={color} strokeWidth="14" strokeLinecap="round" />
      <circle cx={px} cy={py} r="9" fill="#ffffff" stroke={color} strokeWidth="4" />
    </svg>
  );
}
