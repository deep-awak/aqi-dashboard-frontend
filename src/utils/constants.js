import { Air, Grain, Cloud, BubbleChart } from '@mui/icons-material';

export const KPI_ICONS = new Map([
  ['aqi', { Icon: Air, color: '#22c55e', bg: '#e9f9ef', label: 'Indice AQI Moyen (1-5)' }],
  ['pm25', { Icon: BubbleChart, color: '#3b82f6', bg: '#eaf1ff', label: 'Particules Fines PM2.5 (µg/m³)' }],
  ['pm10', { Icon: Grain, color: '#a855f7', bg: '#f4ebff', label: 'Particules PM10 (µg/m³)' }],
  ['no2', { Icon: Cloud, color: '#f5a524', bg: '#fff4e0', label: "Dioxyde d'Azote NO2 (µg/m³)" }],
]);