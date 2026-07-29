import { Card, CardContent, Typography, Box } from '@mui/material';
import WorldMap from '../WorldMap.jsx';
import ChartAnalysis from '../AI/ChartAnalysis';

export default function MapCard({ data }) {
  return (
    <Card variant="outlined" sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="subtitle1" fontWeight={700} mb={1}>Qualité de l'air par ville</Typography>
        <Box sx={{ flex: 1, minHeight: 250 }}>
          <WorldMap cities={data || []} />
        </Box>
        <ChartAnalysis chartKey="map" data={data} prompt="Donne une analyse géographique..." />
      </CardContent>
    </Card>
  );
}