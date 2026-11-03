import React from 'react';
import { MapPin, Sun, CloudSun, ChevronLeft, ChevronRight, Wind } from 'lucide-react';
import { levelOf, formatValue } from '../../utils/aqi';
import { formatLongDate } from '../../utils/format';

export default function Hero({ kpis, selected, regions = [], onSelect, lastDate }) {
  const level = levelOf(kpis?.aqi);
  const isAll = selected === 'all';
  const regionName = isAll ? 'Madagascar' : selected;

  // Find index of current region in regions list
  const currentIndex = regions.findIndex((r) => r.city_name === selected);

  const handlePrev = () => {
    if (regions.length === 0) return;
    if (isAll) {
      onSelect(regions[regions.length - 1].city_name);
    } else if (currentIndex <= 0) {
      onSelect('all');
    } else {
      onSelect(regions[currentIndex - 1].city_name);
    }
  };

  const handleNext = () => {
    if (regions.length === 0) return;
    if (isAll) {
      onSelect(regions[0].city_name);
    } else if (currentIndex >= regions.length - 1) {
      onSelect('all');
    } else {
      onSelect(regions[currentIndex + 1].city_name);
    }
  };

  // 3 visible quick pills (prev, current, next)
  const quickPills = [];
  if (regions.length > 0) {
    if (!isAll && currentIndex > 0) {
      quickPills.push(regions[currentIndex - 1]);
    }
    const currentObj = regions.find((r) => r.city_name === selected) || {
      city_name: 'Madagascar',
      aqi: kpis?.aqi,
    };
    quickPills.push(currentObj);
    if (!isAll && currentIndex < regions.length - 1) {
      quickPills.push(regions[currentIndex + 1]);
    } else if (isAll && regions.length >= 2) {
      quickPills.push(regions[0], regions[1]);
    }
  }

  return (
    <div className="hero-weather-card">
      <div className="hero-top-row">
        <div className="hero-location-badge">
          <MapPin size={16} />
          <span>{regionName}</span>
        </div>
        <div className="hero-updated-text">
          {lastDate ? `Mise à jour : ${formatLongDate(lastDate)}` : 'Données récentes'}
        </div>
      </div>

      <div className="hero-main-content">
        <div className="hero-weather-icon-wrap">
          {Number(kpis?.aqi) <= 2 ? (
            <div className="weather-icon-sun">
              <Sun size={48} />
              <div className="weather-cloud-overlay">
                <CloudSun size={32} />
              </div>
            </div>
          ) : (
            <div className="weather-icon-sun">
              <Wind size={48} />
            </div>
          )}
        </div>

        <div className="hero-digits-wrap">
          <div className="hero-aqi-number">
            {formatValue(kpis?.aqi)}
            <span className="hero-aqi-scale">AQI</span>
          </div>
          <div className="hero-condition-text">
            {level?.label ?? 'Qualité de l’air mesurée'} · {level?.advice ? level.advice.split('.')[0] : 'Air sain'}
          </div>
        </div>

        {/* 4 dots indicator on the right in fire flame colors */}
        <div className="hero-dots-indicator" aria-hidden="true">
          <span className="dot-circle active" style={{ background: '#ffffff' }} />
          <span className="dot-circle" style={{ background: '#fde047' }} />
          <span className="dot-circle" style={{ background: '#fb923c' }} />
          <span className="dot-circle" style={{ background: '#ef4444' }} />
        </div>
      </div>

      {/* Region switcher carousel pills at bottom */}
      <div className="hero-bottom-carousel">
        <button
          className="hero-nav-arrow"
          onClick={handlePrev}
          aria-label="Région précédente"
          title="Précédent"
        >
          <ChevronLeft size={16} />
        </button>

        <div className="hero-quick-pills">
          <button
            className={`quick-pill-btn ${isAll ? 'active' : ''}`}
            onClick={() => onSelect('all')}
          >
            <span className="quick-pill-name">Tout Mada</span>
            <span className="quick-pill-val">{formatValue(kpis?.aqi)}</span>
          </button>

          {quickPills.slice(0, 2).map((item) => {
            const isItemActive = selected === item.city_name;
            return (
              <button
                key={item.city_name}
                className={`quick-pill-btn ${isItemActive ? 'active' : ''}`}
                onClick={() => onSelect(item.city_name)}
              >
                <span className="quick-pill-name">{item.city_name}</span>
                <span className="quick-pill-val">{formatValue(item.aqi)}</span>
              </button>
            );
          })}
        </div>

        <button
          className="hero-nav-arrow"
          onClick={handleNext}
          aria-label="Région suivante"
          title="Suivant"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
