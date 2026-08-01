import { useEffect, useMemo, useState } from 'react';
import { Title } from 'react-admin';
import {
  Box, Fade, CircularProgress, Grid, Stack, Typography, Chip, Alert, useTheme,
  Badge, IconButton,
} from '@mui/material';
import { Chat } from '@mui/icons-material';
import { DashboardProvider, useDashboard } from '../contexts/DashboardContext';
import DashboardHeader from '../components/Layout/DashboardHeader';
import KPIList from '../components/KPI/KPIList';
import LineChartCard from '../components/Charts/LineChartCard';
import MapCard from '../components/Charts/MapCard';
import HistogramCard from '../components/Charts/HistogramCard';
import BarChartCard from '../components/Charts/BarChartCard';
import DonutCard from '../components/Charts/DonutCard';
import RecommendationsCard from '../components/AI/RecommendationsCard';
import AssistantDrawer from '../components/AI/AssistantDrawer';
import ChartSelector from '../components/Layout/ChartSelector';

const DEFAULT_VISIBLE = ['line', 'map', 'histogram', 'bar', 'donut'];

export default function Dashboard({ themeMode, onToggleTheme }) {
  const [city, setCity] = useState('all');
  const [weekend, setWeekend] = useState('all');
  const [range, setRange] = useState({ from: '', to: '' });
  const [visibleCharts, setVisibleCharts] = useState(DEFAULT_VISIBLE);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const filters = useMemo(() => ({ city, weekend, ...range }), [city, weekend, range]);

  return (
    <DashboardProvider filters={filters}>
      <DashboardContent
        city={city}
        setCity={setCity}
        weekend={weekend}
        setWeekend={setWeekend}
        range={range}
        setRange={setRange}
        visibleCharts={visibleCharts}
        setVisibleCharts={setVisibleCharts}
        assistantOpen={assistantOpen}
        setAssistantOpen={setAssistantOpen}
        themeMode={themeMode}
        onToggleTheme={onToggleTheme}
      />
    </DashboardProvider>
  );
}

function DashboardContent({
  city,
  setCity,
  weekend,
  setWeekend,
  range,
  setRange,
  visibleCharts,
  setVisibleCharts,
  assistantOpen,
  setAssistantOpen,
  themeMode,
  onToggleTheme,
}) {
  const theme = useTheme();
  const { cities, isLoading, hasError, kpis, series, citySummary, histo, weekday } = useDashboard();

  const applyActions = (actions) => {
    actions.forEach((action) => {
      switch (action.type) {
        case 'setFilter':
          if (action.key === 'city') setCity(action.value);
          if (action.key === 'weekend') setWeekend(action.value);
          if (action.key === 'from') setRange((prev) => ({ ...prev, from: action.value }));
          if (action.key === 'to') setRange((prev) => ({ ...prev, to: action.value }));
          break;
        case 'setVisibleChart':
          if (action.chart && typeof action.visible === 'boolean') {
            setVisibleCharts((prev) =>
              action.visible ? [...prev, action.chart] : prev.filter((c) => c !== action.chart)
            );
          }
          break;
        case 'setCharts':
          if (Array.isArray(action.charts)) {
            setVisibleCharts(action.charts);
          }
          break;
        default:
          console.warn('Action inconnue:', action);
      }
    });
  };

  useEffect(() => {
    document.body.style.background = theme.palette.background.default;
    return () => { document.body.style.background = ''; };
  }, [theme.palette.background.default]);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', color: 'text.primary', p: { xs: 1.5, md: 3 } }}>
      <Title title="Tableau de Bord : Qualité de l'Air" />

      <DashboardHeader
        city={city}
        setCity={setCity}
        weekend={weekend}
        setWeekend={setWeekend}
        range={range}
        setRange={setRange}
        cities={cities || []}
      />

      <ChartSelector visibleCharts={visibleCharts} onChange={setVisibleCharts} />

      {isLoading ? (
        <Box textAlign="center" py={8}>
          <CircularProgress size={28} />
        </Box>
      ) : (
        <Fade in timeout={500}>
          <Box>
            {hasError && (
              <Alert severity="warning" sx={{ mb: 2 }}>
                Certaines données n'ont pas pu être chargées. Le tableau de bord utilise des valeurs de secours et reste exploitable.
              </Alert>
            )}

            <KPIList kpis={kpis} />

            <Grid container spacing={2} sx={{ mb: 2 }}>
              {visibleCharts.includes('line') && (
                <Grid item xs={12} md={7} sx={{ display: 'flex' }}>
                  <LineChartCard data={series} />
                </Grid>
              )}
              {visibleCharts.includes('map') && (
                <Grid item xs={12} md={5} sx={{ display: 'flex' }}>
                  <MapCard data={citySummary} />
                </Grid>
              )}
            </Grid>

            <Grid container spacing={2} sx={{ mb: 2 }}>
              {visibleCharts.includes('histogram') && (
                <Grid item xs={12} md={4} sx={{ display: 'flex' }}>
                  <HistogramCard data={histo} />
                </Grid>
              )}
              {visibleCharts.includes('bar') && (
                <Grid item xs={12} md={4} sx={{ display: 'flex' }}>
                  <BarChartCard data={citySummary} />
                </Grid>
              )}
              {visibleCharts.includes('donut') && (
                <Grid item xs={12} md={4} sx={{ display: 'flex' }}>
                  <DonutCard weekday={weekday} />
                </Grid>
              )}
            </Grid>

            <RecommendationsCard />
          </Box>
        </Fade>
      )}

      <Box sx={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1000 }}>
        <Badge badgeContent="IA" color="secondary">
          <IconButton
            onClick={() => setAssistantOpen(true)}
            sx={{
              bgcolor: '#7c3aed',
              color: 'white',
              width: 56,
              height: 56,
              boxShadow: '0 4px 20px rgba(124, 58, 237, 0.4)',
              '&:hover': { bgcolor: '#6d28d9' },
              transition: 'transform 0.2s',
              transform: 'scale(1)',
              '&:hover': { transform: 'scale(1.05)' },
            }}
          >
            <Chat />
          </IconButton>
        </Badge>
      </Box>

     <AssistantDrawer open={assistantOpen} onClose={() => setAssistantOpen(false)} />
    </Box>
  );
}