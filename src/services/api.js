// En développement, /api est redirigé vers l'API Render (vite.config.js).
// En production, définissez VITE_API_URL, par exemple https://votre-api.onrender.com/api
const API_BASE = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');

async function request(path, { method = 'GET', body, params } = {}) {
  let url = `${API_BASE}${path}`;
  if (params) {
    const query = new URLSearchParams(
      Object.entries(params).filter(([, value]) => value !== undefined && value !== '')
    ).toString();
    if (query) url += `?${query}`;
  }

  const res = await fetch(url, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.error || `Erreur HTTP ${res.status}`);
  return data;
}

// 'all' signifie « pas de filtre » : on n'envoie rien à l'API dans ce cas.
const cityParam = (city) => (city && city !== 'all' ? city : undefined);
const weekendParam = (weekend) => (weekend && weekend !== 'all' ? weekend : undefined);

export const api = {
  kpis: ({ city, weekend }) => request('/kpis', { params: { city: cityParam(city), weekend: weekendParam(weekend) } }),
  timeseries: ({ city, weekend }) => request('/timeseries', { params: { city: cityParam(city), weekend: weekendParam(weekend) } }),
  citySummary: ({ weekend }) => request('/cities-summary', { params: { weekend: weekendParam(weekend) } }),
  distribution: ({ city, weekend }) => request('/aqi-distribution', { params: { city: cityParam(city), weekend: weekendParam(weekend) } }),
  weekday: ({ city }) => request('/weekday-distribution', { params: { city: cityParam(city) } }),
  analyses: () => request('/analyses'),
  chat: ({ messages, context, provider, apiKey }) =>
    request('/ai/chat', { method: 'POST', body: { messages, context, provider, apiKey } }),
};
