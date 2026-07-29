import { Card, CardContent, Typography, Stack, Chip, Box, useTheme, alpha } from '@mui/material';
import { MultiLineChart } from '../Charts.jsx';
import ChartAnalysis from '../AI/ChartAnalysis';

export default function LineChartCard({ data, series }) {
  const theme = useTheme();

  const defaultSeries = [
    { key: 'aqi', color: '#22c55e', label: 'AQI (1-5)' },
    { key: 'pm25', color: '#3b82f6', label: 'PM2.5' },
    { key: 'pm10', color: '#a855f7', label: 'PM10' },
    { key: 'no2', color: '#f5a524', label: 'NO2' },
  ];
  const finalSeries = series || defaultSeries;

  return (
    <Card
      variant="outlined"
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.paper',
        borderRadius: 1,
        borderColor: alpha(theme.palette.primary.main, 0.1),
        boxShadow: `0 4px 20px 0 ${alpha(theme.palette.text.primary, 0.03)}`,
      }}
    >
      <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 1 }}> 
        
        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          justifyContent="space-between" 
          alignItems={{ xs: 'flex-start', sm: 'center' }} 
          gap={2}
          mb={3}
        >
          <Typography variant="h6" fontWeight={700} color="text.primary" sx={{ fontSize: '1.1rem' }}>
            Évolution des indicateurs
          </Typography>
          <Stack direction="row" spacing={1.5} flexWrap="wrap" gap={1}>
            {finalSeries.map((s) => (
              <Chip
                key={s.key}
                size="medium"
                label={s.label || s.key.toUpperCase()}
                sx={{
                  bgcolor: alpha(s.color, 0.08),
                  color: s.color,
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  height: 28,
                  border: `1px solid ${alpha(s.color, 0.15)}`,
                }}
              />
            ))}
          </Stack>
        </Stack>

        <Box sx={{ 
          flex: 1, 
          minHeight: 380,
          width: '100%', 
          position: 'relative',
          mb: 2 
        }}>
          <MultiLineChart 
            data={data || []} 
            series={finalSeries} 
            height={400}
          />
        </Box>

        <Box sx={{ 
          mt: 2, 
          pt: 2, 
          borderTop: `1px dashed ${theme.palette.divider}`
        }}>
          <ChartAnalysis
            chartKey="timeseries"
            data={data}
            prompt="Interprète l'évolution des indicateurs AQI, PM2.5, PM10, NO2 sur la période affichée. Donne les tendances principales, les pics éventuels et une conclusion."
          />
        </Box>
      </CardContent>
    </Card>
  );
}
