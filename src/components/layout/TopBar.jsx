import { Search, RefreshCw, Bot } from 'lucide-react';

const DAY_TYPES = [
  { key: 'all', label: 'Tous les jours' },
  { key: 'weekday', label: 'Semaine' },
  { key: 'weekend', label: 'Week-end' },
];

export default function TopBar({ region, regions, onRegion, weekend, onWeekend, onRefresh, loading, onOpenAssistant }) {
  return (
    <header className="topbar">
      <label className="search">
        <Search size={18} />
        <select value={region} onChange={(e) => onRegion(e.target.value)} aria-label="Choisir une région">
          <option value="all">Tout Madagascar</option>
          {regions.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </label>

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

      <div className="topbar-actions">
        <button className="ghost" onClick={onRefresh} disabled={loading}>
          <RefreshCw size={16} className={loading ? 'spin' : ''} />
          Actualiser
        </button>
        <button className="ghost mobile-only" onClick={onOpenAssistant}>
          <Bot size={16} />
          Assistant
        </button>
      </div>
    </header>
  );
}
