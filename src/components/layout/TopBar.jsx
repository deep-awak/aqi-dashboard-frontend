import React from 'react';
import { Search, RefreshCw, Bot, Filter, Layers } from 'lucide-react';
import { NAV_ITEMS } from './Sidebar';

const DAY_TYPES = [
  { key: 'all', label: 'Tous les jours' },
  { key: 'weekday', label: 'Semaine' },
  { key: 'weekend', label: 'Week-end' },
];

export default function TopBar({
  region,
  regions,
  onRegion,
  weekend,
  onWeekend,
  onRefresh,
  loading,
  activeTab,
  onSelectTab,
  onOpenAssistant,
}) {
  const currentNav = NAV_ITEMS.find((n) => n.id === activeTab) || NAV_ITEMS[0];

  return (
    <header className="topbar">
      {/* Current Active Section Badge & Quick Mobile Switcher */}
      <div className="topbar-current-section">
        <span className="section-pill">
          <currentNav.icon size={16} />
          <strong>{currentNav.label}</strong>
        </span>
      </div>

      {/* Region quick dropdown */}
      <div className="topbar-filters">
        <label className="search">
          <Search size={16} />
          <select
            value={region}
            onChange={(e) => onRegion(e.target.value)}
            aria-label="Choisir une région"
          >
            <option value="all">Tout Madagascar (22 régions)</option>
            {regions.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </label>

        {/* Day type filter */}
        <div className="segmented" role="group" aria-label="Type de jour">
          {DAY_TYPES.map((type) => (
            <button
              key={type.key}
              className={weekend === type.key ? 'active' : ''}
              onClick={() => onWeekend(type.key)}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="topbar-actions">
        <button className="ghost" onClick={onRefresh} disabled={loading} title="Actualiser les données">
          <RefreshCw size={15} className={loading ? 'spin' : ''} />
          <span>Actualiser</span>
        </button>

        <button className="ghost mobile-only" onClick={onOpenAssistant}>
          <Bot size={16} />
          <span>Assistant</span>
        </button>
      </div>
    </header>
  );
}
