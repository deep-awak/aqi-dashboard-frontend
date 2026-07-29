export function buildFallbackDashboardData() {
  return {
    cities: [
      { id: 1, city_name: 'Paris', country: 'FR', latitude: 48.8566, longitude: 2.3522 },
      { id: 2, city_name: 'Lyon', country: 'FR', latitude: 45.7640, longitude: 4.8357 },
      { id: 3, city_name: 'Marseille', country: 'FR', latitude: 43.2965, longitude: 5.3698 },
    ],
    kpis: {
      aqi: 2.6,
      pm25: 18.4,
      pm10: 31.2,
      no2: 22.1,
      n: 248,
      spark: [2.4, 2.5, 2.6, 2.7, 2.8, 2.5, 2.4],
    },
    series: [
      { d: '2024-01-01', aqi: 2.4, pm25: 17.1, pm10: 29.5, no2: 18.7 },
      { d: '2024-01-02', aqi: 2.5, pm25: 16.8, pm10: 30.1, no2: 19.4 },
      { d: '2024-01-03', aqi: 2.7, pm25: 19.2, pm10: 32.4, no2: 21.6 },
      { d: '2024-01-04', aqi: 2.6, pm25: 18.5, pm10: 30.9, no2: 20.8 },
      { d: '2024-01-05', aqi: 2.3, pm25: 15.7, pm10: 27.8, no2: 17.3 },
    ],
    citySummary: [
      { city_name: 'Paris', country: 'FR', latitude: 48.8566, longitude: 2.3522, aqi: 2.4, n: 82 },
      { city_name: 'Lyon', country: 'FR', latitude: 45.7640, longitude: 4.8357, aqi: 2.7, n: 79 },
      { city_name: 'Marseille', country: 'FR', latitude: 43.2965, longitude: 5.3698, aqi: 2.8, n: 87 },
    ],
    histo: [
      { aqi: 1, n: 32 },
      { aqi: 2, n: 64 },
      { aqi: 3, n: 93 },
      { aqi: 4, n: 41 },
      { aqi: 5, n: 18 },
    ],
    weekday: [
      { is_weekend: false, n: 5, aqi_avg: 2.4 },
      { is_weekend: true, n: 2, aqi_avg: 2.7 },
    ],
  };
}
