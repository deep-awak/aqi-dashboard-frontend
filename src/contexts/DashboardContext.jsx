import { createContext, useContext, useMemo } from 'react';
import { useAnalytics } from '../hooks/useAnalytics';
import {
  fetchCities,
  fetchKPIs,
  fetchTimeseries,
  fetchCitySummary,
  fetchAQIDistribution,
  fetchWeekdayDistribution,
} from '../services/api';

const DashboardContext = createContext();

export function DashboardProvider({ children, filters }) {
  const { data: cities, loading: citiesLoading, error: citiesError } = useAnalytics(fetchCities, {});
  const { data: kpis, loading: kpisLoading, error: kpisError } = useAnalytics(fetchKPIs, filters);
  const { data: series, loading: seriesLoading, error: seriesError } = useAnalytics(fetchTimeseries, filters);
  const { data: citySummary, loading: citySummaryLoading, error: citySummaryError } = useAnalytics(fetchCitySummary, filters);
  const { data: histo, loading: histoLoading, error: histoError } = useAnalytics(fetchAQIDistribution, filters);
  const { data: weekdayRaw, loading: weekdayLoading, error: weekdayError } = useAnalytics(fetchWeekdayDistribution, filters);

  const isLoading = kpisLoading || seriesLoading || citySummaryLoading || histoLoading || weekdayLoading;
  const hasError = Boolean(citiesError || kpisError || seriesError || citySummaryError || histoError || weekdayError);

  const weekday = useMemo(() => {
    const wk = weekdayRaw?.find((d) => d.is_weekend === false)?.n ?? 0;
    const we = weekdayRaw?.find((d) => d.is_weekend === true)?.n ?? 0;
    return { wk, we };
  }, [weekdayRaw]);

  const contextValue = {
    cities: cities || [],
    kpis: kpis || null,
    series: series || [],
    citySummary: citySummary || [],
    histo: histo || [],
    weekday,
    weekdayRaw: weekdayRaw || [],
    isLoading,
    hasError,
    filters,
  };

  return (
    <DashboardContext.Provider value={contextValue}>
      {children}
    </DashboardContext.Provider>
  );
}

export const useDashboard = () => useContext(DashboardContext);