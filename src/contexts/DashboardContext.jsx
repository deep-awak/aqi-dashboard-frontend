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
  const { data: citiesData, loading: citiesLoading, error: citiesError } = useAnalytics(fetchCities, {});
  const { data: kpisData, loading: kpisLoading, error: kpisError } = useAnalytics(fetchKPIs, filters);
  const { data: seriesData, loading: seriesLoading, error: seriesError } = useAnalytics(fetchTimeseries, filters);
  const { data: citySummaryData, loading: citySummaryLoading, error: citySummaryError } = useAnalytics(fetchCitySummary, filters);
  const { data: histoData, loading: histoLoading, error: histoError } = useAnalytics(fetchAQIDistribution, filters);
  const { data: weekdayData, loading: weekdayLoading, error: weekdayError } = useAnalytics(fetchWeekdayDistribution, filters);

  const cities = citiesData ?? [];
  const kpis = kpisData ?? null;
  const series = seriesData ?? [];
  const citySummary = citySummaryData ?? [];
  const histo = histoData ?? [];
  const weekdayRaw = weekdayData ?? [];

  const isLoading = citiesLoading || kpisLoading || seriesLoading || citySummaryLoading || histoLoading || weekdayLoading;
  const hasError = Boolean(citiesError || kpisError || seriesError || citySummaryError || histoError || weekdayError);

  const weekday = useMemo(() => {
    const wk = weekdayRaw?.find((d) => d.is_weekend === false)?.n ?? 0;
    const we = weekdayRaw?.find((d) => d.is_weekend === true)?.n ?? 0;
    return { wk, we };
  }, [weekdayRaw]);

  const contextValue = {
    cities,
    kpis,
    series,
    citySummary,
    histo,
    weekday,
    weekdayRaw,
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