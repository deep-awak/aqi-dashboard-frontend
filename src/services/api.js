import { sanitizeFilters } from '../utils/validation.js';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

class ApiClient {
  constructor(baseURL) {
    this.baseURL = baseURL.replace(/\/$/, '');
  }

  async request(endpoint, options = {}) {
    const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${this.baseURL}${normalizedEndpoint}`;
    const config = {
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options,
    };
    try {
      const response = await fetch(url, config);
      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(errorBody.error || `Erreur HTTP ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`[API] Erreur sur ${normalizedEndpoint}:`, error);
      throw error;
    }
  }

  get(endpoint, params) {
    const cleanParams = sanitizeFilters(params || {});
    const query = new URLSearchParams(cleanParams).toString();
    const url = query ? `${endpoint}?${query}` : endpoint;
    return this.request(url, { method: 'GET' });
  }

  post(endpoint, data) {
    return this.request(endpoint, { method: 'POST', body: JSON.stringify(data) });
  }
}

export const apiClient = new ApiClient(API_BASE);

export const fetchCities = (params) => apiClient.get('/cities', params);
export const fetchKPIs = (params) => apiClient.get('/kpis', params);
export const fetchTimeseries = (params) => apiClient.get('/timeseries', params);
export const fetchCitySummary = (params) => apiClient.get('/cities-summary', params);
export const fetchAQIDistribution = (params) => apiClient.get('/aqi-distribution', params);
export const fetchWeekdayDistribution = (params) => apiClient.get('/weekday-distribution', params);
export const fetchAIInsight = (messages, context) =>
  apiClient.post('/ai/chat', { messages, context });