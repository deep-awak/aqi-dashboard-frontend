import {
  LayoutDashboard,
  TrendingUp,
  Map as MapIcon,
  BarChart3,
  Sparkles,
  Wind,
  Bot,
  MapPin,
  CalendarDays,
} from 'lucide-react';
import { levelOf, formatValue } from '../../utils/aqi';

export const NAV_ITEMS = [
  { id: 'overview', label: "Vue d'ensemble", icon: LayoutDashboard },
  { id: 'tendances', label: 'Tendances & Évolution', icon: TrendingUp },
  { id: 'carte', label: 'Carte interactive', icon: MapIcon },
  { id: 'regions', label: 'Classement des régions', icon: BarChart3 },
  { id: 'repartition', label: 'Répartition & Semaine', icon: CalendarDays },
  { id: 'synthese', label: 'Analyses IA', icon: Sparkles },
];

export default function Sidebar({
  kpis,
  scopeLabel,
  regions = [],
  selected,
  onSelect,
  activeTab = 'overview',
  onSelectTab,
  onOpenAssistant,
}) {
  const level = levelOf(kpis?.aqi);

  return (
    <aside className="sidebar no-scroll-sidebar">
      {/* Brand */}
      <div className="brand">
        <span className="brand-icon">
          <Wind size={22} />
        </span>
        <div>
          <strong>AirMada</strong>
          <small>Qualité de l'air à Madagascar</small>
        </div>
      </div>

      {/* Navigation (drives which graphs appear) */}
      <nav className="nav" aria-label="Menu principal">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              className={`nav-tab-btn ${isActive ? 'active' : ''}`}
              onClick={() => onSelectTab(id)}
            >
              <Icon size={18} />
              <span>{label}</span>
              {isActive && <span className="nav-active-pill" />}
            </button>
          );
        })}
      </nav>

      {/* Region Selector Select Dropdown (replaces long scrolling list) */}
      <div className="sidebar-region-box">
        <label htmlFor="sidebar-region-select" className="sidebar-box-label">
          <MapPin size={14} />
          <span>Région active</span>
        </label>
        
        <div className="select-wrapper">
          <select
            id="sidebar-region-select"
            className="sidebar-select"
            value={selected}
            onChange={(e) => onSelect(e.target.value)}
          >
            <option value="all">Madagascar (Global)</option>
            {regions.map((r) => (
              <option key={r.city_name} value={r.city_name}>
                {r.city_name} {r.aqi ? `(AQI ${formatValue(r.aqi)})` : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Compact status pill for active selection */}
        <div className="sidebar-status-pill">
          <span className="status-dot" style={{ background: level?.color ?? '#10b981' }} />
          <span className="status-text">{level?.label ?? 'Modéré'}</span>
          <span className="status-val">{formatValue(kpis?.aqi)} / 5</span>
        </div>
      </div>

      {/* Assistant AI Button at bottom */}
      <button className="assistant-btn" onClick={onOpenAssistant}>
        <Bot size={18} />
        <span>Assistant IA Mada</span>
      </button>
    </aside>
  );
}
