import { LayoutDashboard, TrendingUp, Map as MapIcon, BarChart3, Sparkles, Wind, Bot } from 'lucide-react';
import GaugeArc from '../common/GaugeArc';
import { levelOf, formatValue } from '../../utils/aqi';

const NAV = [
  { href: '#overview', label: "Vue d'ensemble", icon: LayoutDashboard },
  { href: '#tendances', label: 'Tendances', icon: TrendingUp },
  { href: '#carte', label: 'Carte', icon: MapIcon },
  { href: '#regions', label: 'Régions', icon: BarChart3 },
  { href: '#synthese', label: 'Analyses IA', icon: Sparkles },
];

export default function Sidebar({ kpis, scopeLabel, regions, selected, onSelect, onOpenAssistant }) {
  const level = levelOf(kpis?.aqi);

  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand-icon">
          <Wind size={20} />
        </span>
        <div>
          <strong>AirMada</strong>
          <small>Qualité de l'air</small>
        </div>
      </div>

      <nav className="nav">
        {NAV.map(({ href, label, icon: Icon }) => (
          <a key={href} href={href}>
            <Icon size={18} />
            {label}
          </a>
        ))}
      </nav>

      <div className="card status-card">
        <p className="muted small">Statut · {scopeLabel}</p>
        <GaugeArc value={kpis?.aqi} />
        <div className="status-value">
          <span className="level-bubble" style={{ background: level?.color ?? '#94a3b8' }}>
            {level?.label ?? 'Indisponible'}
          </span>
          <strong>{formatValue(kpis?.aqi)} / 5</strong>
        </div>
      </div>

      <div className="regions">
        <p className="eyebrow">Choisir une région</p>
        <button
          className={`region-btn ${selected === 'all' ? 'active' : ''}`}
          onClick={() => onSelect('all')}
        >
          Tout Madagascar
        </button>
        {regions.map((r) => {
          const lv = levelOf(r.aqi);
          return (
            <button
              key={r.city_name}
              className={`region-btn ${selected === r.city_name ? 'active' : ''}`}
              onClick={() => onSelect(r.city_name)}
            >
              <span>{r.city_name}</span>
              <span className="dot-value">
                <i className="dot" style={{ background: lv?.color ?? '#cbd5e1' }} />
                {formatValue(r.aqi)}
              </span>
            </button>
          );
        })}
      </div>

      <button className="assistant-btn" onClick={onOpenAssistant}>
        <Bot size={18} />
        Assistant IA
      </button>
    </aside>
  );
}
