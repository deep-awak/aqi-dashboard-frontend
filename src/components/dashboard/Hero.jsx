import { MapPin, Clock, Sparkles } from 'lucide-react';
import { levelOf, formatValue } from '../../utils/aqi';
import { formatLongDate } from '../../utils/format';

function Illustration() {
  return (
    <svg viewBox="0 0 240 150" className="hero-art" aria-hidden="true">
      <defs>
        <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fde68a" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#fde68a" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="176" cy="44" r="62" fill="url(#sunGlow)" />
      <circle cx="176" cy="44" r="24" fill="#fbbf24" />
      <path
        d="M30 104 Q48 70 92 80 Q108 50 146 62 Q180 58 190 88 Q212 94 210 112 Q206 116 190 116 L40 116 Q26 116 30 104 Z"
        fill="#ffffff"
      />
      <path d="M0 126 Q60 106 120 120 T240 116 L240 150 L0 150 Z" fill="#38bdf8" opacity="0.35" />
      <path d="M0 138 Q70 124 140 136 T240 134 L240 150 L0 150 Z" fill="#2563eb" opacity="0.4" />
    </svg>
  );
}

function excerpt(text, max = 280) {
  if (!text) return '';
  if (text.length <= max) return text;
  return `${text.slice(0, max).replace(/\s+\S*$/, '')} …`;
}

export default function Hero({ kpis, scopeLabel, lastDate, synthesis, onReadSynthesis }) {
  const level = levelOf(kpis?.aqi);

  return (
    <div className="card hero" id="overview">
      <div className="hero-text">
        <p className="eyebrow">
          <MapPin size={14} /> {scopeLabel}
        </p>
        <h1>Qualité de l’air à Madagascar</h1>

        <div className="hero-value">
          <span className="big-number" style={{ color: level?.color ?? 'var(--ink)' }}>
            {formatValue(kpis?.aqi)}
          </span>
          <span className="big-unit">/ 5</span>
          {level && (
            <span className="level-pill" style={{ background: level.soft, color: level.color }}>
              {level.label}
            </span>
          )}
        </div>

        <p className="hero-advice">{level ? level.advice : 'Pas encore de mesure pour cette sélection.'}</p>

        <p className="muted small">
          <Clock size={13} /> Dernière mesure : {formatLongDate(lastDate) || '—'}
          {kpis?.n ? ` · ${kpis.n.toLocaleString('fr-FR')} mesures` : ''}
        </p>
      </div>

      <div className="hero-side">
        <Illustration />
        {synthesis && (
          <div className="synthesis-mini">
            <p className="eyebrow">
              <Sparkles size={14} /> Synthèse IA
            </p>
            <p>{excerpt(synthesis.content)}</p>
            <button className="link" onClick={onReadSynthesis}>
              Lire la synthèse complète →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
