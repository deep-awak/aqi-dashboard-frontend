import { Card, CardContent, Typography, Box } from '@mui/material';
import { AqiHistogram } from '../Charts.jsx';
import ChartAnalysis from '../AI/ChartAnalysis';

export default function HistogramCard({ data }) {
  return (
    <Card variant="outlined" sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="subtitle1" fontWeight={700} mb={1}>Répartition par niveau d'AQI</Typography>
        <Box sx={{ flex: 1, minHeight: 200 }}>
          <AqiHistogram data={data || []} />
        </Box>
        <ChartAnalysis chartKey="histogram" data={data} prompt="Interprète la répartition..." />
      </CardContent>
    </Card>
  );
}