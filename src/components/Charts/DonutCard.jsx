import { Card, CardContent, Typography, Stack, Chip, Box } from '@mui/material';
import { Donut } from '../Charts.jsx';

export default function DonutCard({ weekday }) {
  const { wk, we } = weekday || { wk: 0, we: 0 };
  return (
    <Card variant="outlined" sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="subtitle1" fontWeight={700} alignSelf="flex-start" mb={1}>Répartition par jour</Typography>
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <Donut weekday={wk} weekend={we} />
        </Box>
        <Stack direction="row" spacing={2} mt={1}>
          <Chip size="small" label={`Semaine · ${wk} j`} sx={{ bgcolor: '#22c55e22', color: '#166534', fontWeight: 700 }} />
          <Chip size="small" label={`Week-end · ${we} j`} sx={{ bgcolor: '#f5a52422', color: '#92400e', fontWeight: 700 }} />
        </Stack>
      </CardContent>
    </Card>
  );
}