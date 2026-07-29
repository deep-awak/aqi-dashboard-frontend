import test from 'node:test';
import assert from 'node:assert/strict';
import { sanitizeFilters, sanitizeDashboardPayload } from './validation.js';

test('sanitizeFilters normalizes and validates filter values', () => {
  const result = sanitizeFilters({ city: 'Paris', weekend: 'weekend', from: '2024-01-01', to: '2024-01-31', unsupported: 'x' });

  assert.equal(result.city, 'Paris');
  assert.equal(result.weekend, 'weekend');
  assert.equal(result.from, '2024-01-01');
  assert.equal(result.to, '2024-01-31');
  assert.equal(result.unsupported, undefined);
});

test('sanitizeDashboardPayload removes unsafe fields and keeps only essential data', () => {
  const payload = {
    cities: [{ id: 1, city_name: 'Paris', country: 'FR', latitude: 48.8, longitude: 2.3, token: 'secret' }],
    kpis: { aqi: 2.1, pm25: 14, pm10: 31, no2: 17, n: 3 },
    series: [{ d: '2024-01-01', aqi: 2.2, pm25: 13 }, { d: '2024-01-02', aqi: 2.4, pm25: 15 }],
    citySummary: [{ city_name: 'Paris', aqi: 2.1, lat: 48.8, lon: 2.3, token: 'x' }],
    __proto__: { polluted: true },
  };

  const result = sanitizeDashboardPayload(payload);

  assert.deepEqual(result.cities[0], { id: 1, city_name: 'Paris', country: 'FR', latitude: 48.8, longitude: 2.3 });
  assert.equal(result.kpis.aqi, 2.1);
  assert.equal(result.series.length, 2);
  assert.equal(result.citySummary[0].city_name, 'Paris');
  assert.equal(result.polluted, undefined);
});
