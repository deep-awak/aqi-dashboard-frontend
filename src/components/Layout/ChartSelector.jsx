import { Box, Chip, Stack, Typography } from '@mui/material';

const OPTIONS = [
  { key: 'line', label: 'Évolution' },
  { key: 'map', label: 'Carte' },
  { key: 'histogram', label: 'Histogramme' },
  { key: 'bar', label: 'Villes' },
  { key: 'donut', label: 'Répartition' },
];

export default function ChartSelector({ visibleCharts, onChange }) {
  const toggle = (key) => {
    if (visibleCharts.includes(key)) {
      onChange(visibleCharts.filter((value) => value !== key));
    } else {
      onChange([...visibleCharts, key]);
    }
  };

  return (
    <Box sx={{ mb: 2, p: 2, borderRadius: 1, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>
        Graphiques affichés
      </Typography>
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        {OPTIONS.map((option) => (
          <Chip
            key={option.key}
            clickable
            color={visibleCharts.includes(option.key) ? 'primary' : 'default'}
            label={option.label}
            onClick={() => toggle(option.key)}
          />
        ))}
      </Stack>
    </Box>
  );
}
