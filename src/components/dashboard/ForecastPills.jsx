import React from 'react';
import { CloudSun, Sun, Wind, CloudRain, ShieldCheck } from 'lucide-react';
import { levelOf, formatValue } from '../../utils/aqi';

export default function ForecastPills({ summary = [], selected, onSelect }) {
  // Take up to 7 representative regions from summary
  const keyCities = ['Antananarivo', 'Toamasina', 'Mahajanga', 'Fianarantsoa', 'Toliara', 'Antsiranana', 'Antsirabe'];
  
  // Find matching data from summary or fallback to first 7 items
  const items = keyCities
    .map((name) => summary.find((s) => s.city_name === name))
    .filter(Boolean);

  const displayList = items.length >= 4 ? items.slice(0, 7) : summary.slice(0, 7);

  const getIcon = (aqi) => {
    if (!aqi || aqi <= 1.2) return ShieldCheck;
    if (aqi <= 2) return Sun;
    if (aqi <= 3) return CloudSun;
    if (aqi <= 4) return Wind;
    return CloudRain;
  };

  if (!displayList || displayList.length === 0) return null;

  return (
    <div className="forecast-pills-row" role="region" aria-label="Régions clés de Madagascar">
      {displayList.map((city) => {
        const isSelected = selected === city.city_name;
        const level = levelOf(city.aqi);
        const IconComponent = getIcon(city.aqi);

        return (
          <button
            key={city.city_name}
            className={`forecast-pill-btn ${isSelected ? 'active' : ''}`}
            onClick={() => onSelect(city.city_name)}
            title={`Sélectionner ${city.city_name}`}
          >
            <span className="forecast-pill-city">{city.city_name}</span>
            <span className="forecast-pill-icon-wrap" style={{ color: level?.color ?? '#f59e0b' }}>
              <IconComponent size={20} />
            </span>
            <span className="forecast-pill-val">
              AQI {formatValue(city.aqi)}
            </span>
            <span
              className="forecast-pill-dot"
              style={{ background: level?.color ?? '#10b981' }}
            />
          </button>
        );
      })}
    </div>
  );
}
