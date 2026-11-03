import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet';
import { AQI_LEVELS, levelOf, formatValue } from '../../utils/aqi';

const CENTER = [-19.2, 46.7];

// Carte réelle (OpenStreetMap) : un point par région, à la position de son chef-lieu.
export default function MadagascarMap({ summary, selected, onSelect }) {
  const points = summary.filter((r) => Number.isFinite(r.latitude) && Number.isFinite(r.longitude));

  return (
    <div className="map-wrap">
      <MapContainer center={CENTER} zoom={5} scrollWheelZoom={false} className="map">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        {points.map((r) => {
          const level = levelOf(r.aqi);
          const isSelected = selected === r.city_name;
          return (
            <CircleMarker
              key={r.city_name}
              center={[r.latitude, r.longitude]}
              radius={isSelected ? 14 : 10}
              pathOptions={{
                color: isSelected ? '#0f172a' : '#ffffff',
                weight: 3,
                fillColor: level?.color ?? '#94a3b8',
                fillOpacity: 0.92,
              }}
              eventHandlers={{ click: () => onSelect(r.city_name) }}
            >
              <Tooltip direction="top" offset={[0, -8]}>
                <strong>{r.city_name}</strong>
                <br />
                AQI {formatValue(r.aqi)} · {level?.label ?? '—'}
              </Tooltip>
            </CircleMarker>
          );
        })}
      </MapContainer>

      <div className="map-legend">
        {AQI_LEVELS.map((l) => (
          <span key={l.level}>
            <i style={{ background: l.color }} />
            {l.label}
          </span>
        ))}
      </div>
    </div>
  );
}
