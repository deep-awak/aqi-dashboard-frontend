const ALLOWED_FILTERS = ['city', 'weekend', 'from', 'to'];
const VALID_WEEKEND_VALUES = new Set(['all', 'weekday', 'weekend']);
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export function sanitizeFilters(filters = {}) {
  const next = {};

  if (typeof filters.city === 'string' && filters.city.trim()) {
    next.city = filters.city.trim();
  }

  if (typeof filters.weekend === 'string' && VALID_WEEKEND_VALUES.has(filters.weekend)) {
    next.weekend = filters.weekend;
  } else if (!filters.weekend) {
    next.weekend = 'all';
  }

  if (typeof filters.from === 'string' && DATE_PATTERN.test(filters.from)) {
    next.from = filters.from;
  }

  if (typeof filters.to === 'string' && DATE_PATTERN.test(filters.to)) {
    next.to = filters.to;
  }

  return next;
}

function sanitizeRecord(record) {
  if (!record || typeof record !== 'object') return null;
  return Object.fromEntries(Object.entries(record).filter(([key]) => !key.startsWith('__')));
}

function sanitizeCityList(items) {
  return (Array.isArray(items) ? items : [])
    .map((item) => sanitizeRecord(item))
    .filter(Boolean)
    .map(({ id, city_name, country, latitude, longitude }) => ({
      id,
      city_name,
      country,
      latitude: Number(latitude),
      longitude: Number(longitude),
    }))
    .filter((city) => Number.isFinite(city.latitude) && Number.isFinite(city.longitude));
}

function sanitizeSeries(items) {
  return (Array.isArray(items) ? items : [])
    .map((item) => sanitizeRecord(item))
    .filter(Boolean)
    .map((entry) => ({
      d: entry.d,
      aqi: Number(entry.aqi),
      pm25: Number(entry.pm25),
      pm10: Number(entry.pm10),
      no2: Number(entry.no2),
    }));
}

function sanitizeSummary(items) {
  return (Array.isArray(items) ? items : [])
    .map((item) => sanitizeRecord(item))
    .filter(Boolean)
    .map(({ city_name, country, latitude, longitude, aqi, n }) => ({
      city_name,
      country,
      latitude: Number(latitude),
      longitude: Number(longitude),
      aqi: Number(aqi),
      n: Number(n) || 0,
    }))
    .filter((entry) => entry.city_name);
}

export function sanitizeDashboardPayload(payload = {}) {
  if (Array.isArray(payload)) {
    return sanitizeCityList(payload);
  }

  const safeCities = sanitizeCityList(payload.cities);

  const safeKpis = payload.kpis && typeof payload.kpis === 'object' ? {
    aqi: Number(payload.kpis.aqi),
    pm25: Number(payload.kpis.pm25),
    pm10: Number(payload.kpis.pm10),
    no2: Number(payload.kpis.no2),
    n: Number(payload.kpis.n) || 0,
    spark: Array.isArray(payload.kpis.spark) ? payload.kpis.spark : [],
  } : {};

  const safeSeries = sanitizeSeries(payload.series);
  const safeSummary = sanitizeSummary(payload.citySummary);

  return {
    cities: safeCities,
    kpis: safeKpis,
    series: safeSeries,
    citySummary: safeSummary,
    weekday: Array.isArray(payload.weekday) ? payload.weekday : [],
    histo: Array.isArray(payload.histo) ? payload.histo : [],
  };
}
