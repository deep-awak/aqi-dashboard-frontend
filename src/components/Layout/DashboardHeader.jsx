import { Box, Stack, Typography, Paper, FormControl, InputLabel, Select, MenuItem, TextField, Chip, alpha, useTheme } from '@mui/material';
import { Air, LocationOn, Weekend, CalendarToday, DateRange } from '@mui/icons-material';

export default function DashboardHeader({ city, setCity, weekend, setWeekend, range, setRange, cities }) {
  const theme = useTheme();
  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, md: 3 },
        mb: 3,
        borderRadius: 1,
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(theme.palette.secondary.main, 0.04)} 100%)`,
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Stack direction={{ xs: 'column', lg: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', lg: 'center' }} spacing={3}>
        <Box>
          <Stack direction="row" alignItems="center" spacing={1.5} flexWrap="wrap">
            <Air sx={{ fontSize: 32, color: 'primary.main', background: alpha(theme.palette.primary.main, 0.12), p: 1, borderRadius: 2 }} />
            <Typography variant="h4" fontWeight={800} letterSpacing="-0.5px">Tableau de Bord</Typography>
          </Stack>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 0.5, ml: 6, fontWeight: 400 }}>
            Surveillez la qualité de l’air en temps réel
            <Chip label="Données métier" size="small" sx={{ ml: 2, fontWeight: 500 }} />
          </Typography>
        </Box>

        <Stack direction={{ xs: 'column', xl: 'row' }} spacing={1.5} flexWrap="wrap" useFlexGap sx={{ flexShrink: 0 }}>
          <FormControl size="small" sx={{ minWidth: 170 }}>
            <InputLabel>Ville</InputLabel>
            <Select label="Ville" value={city} onChange={(e) => setCity(e.target.value)} startAdornment={<LocationOn sx={{ ml: 1, mr: 0.5, fontSize: 18, color: 'action.active' }} />}>
              <MenuItem value="all">Toutes les villes</MenuItem>
              {cities?.map((c) => <MenuItem key={c.id} value={c.city_name}>{c.city_name}</MenuItem>)}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 170 }}>
            <InputLabel>Période</InputLabel>
            <Select label="Période" value={weekend} onChange={(e) => setWeekend(e.target.value)} startAdornment={<Weekend sx={{ ml: 1, mr: 0.5, fontSize: 18, color: 'action.active' }} />}>
              <MenuItem value="all">Tous (week‑end inclus)</MenuItem>
              <MenuItem value="weekday">Semaine uniquement</MenuItem>
              <MenuItem value="weekend">Week‑end uniquement</MenuItem>
            </Select>
          </FormControl>

          <TextField size="small" label="Du" type="date" InputLabelProps={{ shrink: true }} value={range.from} onChange={(e) => setRange((r) => ({ ...r, from: e.target.value }))} InputProps={{ startAdornment: <CalendarToday sx={{ mr: 1, fontSize: 16, color: 'action.active' }} /> }} sx={{ minWidth: 150 }} />
          <TextField size="small" label="Au" type="date" InputLabelProps={{ shrink: true }} value={range.to} onChange={(e) => setRange((r) => ({ ...r, to: e.target.value }))} InputProps={{ startAdornment: <DateRange sx={{ mr: 1, fontSize: 16, color: 'action.active' }} /> }} sx={{ minWidth: 150 }} />
        </Stack>
      </Stack>
    </Paper>
  );
}