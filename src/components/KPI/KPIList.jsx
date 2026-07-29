import { Grid } from '@mui/material';
import AnimatedMetric from './AnimatedMetric';
import { KPI_ICONS } from '../../utils/constants';

export default function KPIList({ kpis }) {
  return (
    <Grid container spacing={1} sx={{ mb: 1 }}>
      {Array.from(KPI_ICONS.entries()).map(([key, meta]) => (
        <Grid item xs={12} sm={15} md={3} key={key} sx={{ display: 'flex' }}>
          <AnimatedMetric
            value={kpis?.[key]}
            label={meta.label}
            icon={meta.Icon}
            color={meta.color}
            bg={meta.bg}
            sparkData={kpis?.spark || []}
            kpiKey={key}
            totalMeasurements={kpis?.n}
          />
        </Grid>
      ))}
    </Grid>
  );
}