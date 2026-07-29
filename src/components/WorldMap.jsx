import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Popup, CircleMarker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Typography } from '@mui/material';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const getAqiColor = (aqi) => {
  const colors = ['#22c55e', '#facc15', '#f97316', '#ef4444', '#7f1d1d'];
  const index = Math.min(Math.max(Math.round(aqi) - 1, 0), 4);
  return colors[index];
};

const aqiQualityLabel = (aqi) => {
  const levels = ['Bonne', 'Moyenne', 'Dégradée', 'Mauvaise', 'Très mauvaise'];
  return levels[Math.min(Math.max(Math.round(aqi) - 1, 0), 4)] || 'Inconnue';
};

export default function WorldMap({ cities }) {
  const validCities = cities?.filter(
    (city) =>
      city.latitude != null && city.longitude != null &&
      !isNaN(city.latitude) && !isNaN(city.longitude)
  ) || [];

  if (validCities.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
        Aucune donnée géographique disponible pour ces filtres.
      </Typography>
    );
  }

  const centerLat = validCities.reduce((sum, c) => sum + c.latitude, 0) / validCities.length;
  const centerLon = validCities.reduce((sum, c) => sum + c.longitude, 0) / validCities.length;
  const center = [centerLat || 48.8566, centerLon || 2.3522];

  const mapRef = useRef();

  useEffect(() => {
    if (mapRef.current && validCities.length > 1) {
      const group = L.featureGroup(
        validCities.map((city) => L.marker([city.latitude, city.longitude]))
      );
      mapRef.current.fitBounds(group.getBounds().pad(0.2));
    }
  }, [validCities]);

  return (
    <MapContainer
      ref={mapRef}
      center={center}
      zoom={4}
      style={{ height: 400, width: '100%', borderRadius: 8 }}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {validCities.map((city) => {
        const aqiNum = parseFloat(city.aqi) || 0;
        return (
          <CircleMarker
            key={city.city_name}
            center={[city.latitude, city.longitude]}
            radius={12}
            fillColor={getAqiColor(aqiNum)}
            fillOpacity={0.8}
            stroke={false}
          >
            <Popup>
              <strong>{city.city_name}</strong><br />
              AQI : {aqiNum.toFixed(1)}<br />
              Qualité : {aqiQualityLabel(aqiNum)}
            </Popup>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}