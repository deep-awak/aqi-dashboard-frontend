import { Card, CardContent, Typography, Box } from '@mui/material';
import { CityBarChart } from '../Charts.jsx';
import ChartAnalysis from '../AI/ChartAnalysis';

export default function BarChartCard({ data }) {
  return (
    <Card variant="outlined" sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="subtitle1" fontWeight={700} mb={1}>Comparaison des villes</Typography>
        <Box sx={{ flex: 1, minHeight: 200 }}>
          <CityBarChart data={data || []} />
        </Box>
        <ChartAnalysis chartKey="cityComparison" data={data} prompt="Analyse la comparaison des villes..." />
      </CardContent>
    </Card>
  );
}