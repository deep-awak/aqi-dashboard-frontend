import { Briefcase, Sun } from 'lucide-react';
import { levelOf, formatValue } from '../../utils/aqi';
import { EmptyState } from '../common/ui';

function DayCard({ label, icon: Icon, data }) {
  const level = levelOf(data.aqi_avg);
  return (
    <div className="wk-item">
      <span className="icon-bubble">
        <Icon size={18} />
      </span>
      <p className="muted small">{label}</p>
      <p className="wk-value" style={{ color: level?.color }}>
        {formatValue(data.aqi_avg)}
      </p>
      {level && (
        <span className="level-pill" style={{ background: level.soft, color: level.color }}>
          {level.label}
        </span>
      )}
      <small className="muted">{data.n} jours mesurés</small>
    </div>
  );
}

export default function WeekdayCompare({ weekday }) {
  const weekdays = weekday.find((d) => !d.is_weekend);
  const weekend = weekday.find((d) => d.is_weekend);

  if (!weekdays || !weekend || weekdays.aqi_avg === null || weekend.aqi_avg === null) {
    return <EmptyState>Pas assez de données pour comparer la semaine et le week-end.</EmptyState>;
  }

  const diff = ((weekend.aqi_avg - weekdays.aqi_avg) / weekdays.aqi_avg) * 100;
  let verdict = 'Le niveau de pollution est quasiment le même en semaine et le week-end.';
  if (Math.abs(diff) >= 0.5) {
    verdict = `Le week-end est ${Math.abs(diff).toFixed(1)} % ${diff > 0 ? 'plus pollué' : 'moins pollué'} que la semaine (AQI moyen).`;
  }

  return (
    <>
      <div className="wk-grid">
        <DayCard label="Jours de semaine" icon={Briefcase} data={weekdays} />
        <DayCard label="Week-end" icon={Sun} data={weekend} />
      </div>
      <p className="wk-verdict">{verdict}</p>
    </>
  );
}
