import React from 'react';
import CircularGauge from '../common/CircularGauge';
import { levelOf, formatValue } from '../../utils/aqi';

export default function AirQualityOverview({ kpis, scopeLabel }) {
  const level = levelOf(kpis?.aqi);

  // Pollutant list with colors and values
  const pollutants = [
    {
      key: 'pm10',
      label: 'PM10',
      name: 'Particules respirables',
      val: kpis?.pm10,
      unit: 'µg/m³',
      color: '#facc15', // yellow
      ref: 45,
    },
    {
      key: 'pm25',
      label: 'PM2.5',
      name: 'Particules fines',
      val: kpis?.pm25,
      unit: 'µg/m³',
      color: '#fb923c', // orange
      ref: 15,
    },
    {
      key: 'no2',
      label: 'NO2',
      name: 'Dioxyde d’azote',
      val: kpis?.no2,
      unit: 'µg/m³',
      color: '#ef4444', // crimson flame
      ref: 25,
    },
    {
      key: 'aqi',
      label: 'Indice AQI',
      name: 'Qualité globale',
      val: kpis?.aqi,
      unit: '/ 5',
      color: level?.color ?? '#10b981',
      ref: 5,
    },
  ];

  return (
    <div className="card air-overview-card">
      <div className="card-header-clean">
        <div>
          <h3>Aperçu de la qualité de l'air</h3>
          <p className="muted small">Mesure consolidée · {scopeLabel}</p>
        </div>
        <span className="overview-tag">Temps réel</span>
      </div>

      <div className="overview-grid">
        <div className="overview-gauge-col">
          <CircularGauge value={kpis?.aqi} size={160} />
          <p className="overview-advice">
            {level?.advice || 'Air propre et respirable, profitez des activités extérieures sans restriction.'}
          </p>
        </div>

        <div className="overview-pollutants-col">
          <div className="pollutants-grid">
            {pollutants.map((p) => {
              const formatted = formatValue(p.val);
              return (
                <div key={p.key} className="pollutant-item">
                  <div className="pollutant-header">
                    <span className="pollutant-dot" style={{ background: p.color }} />
                    <span className="pollutant-val">{formatted}</span>
                    <span className="pollutant-unit">{p.unit}</span>
                  </div>
                  <div className="pollutant-meta">
                    <strong className="pollutant-code">{p.label}</strong>
                    <span className="pollutant-name">{p.name}</span>
                  </div>
                  {p.ref && p.val && (
                    <div className="pollutant-bar">
                      <div
                        className="pollutant-bar-fill"
                        style={{
                          width: `${Math.min((p.val / p.ref) * 100, 100)}%`,
                          background: p.color,
                        }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
