// La date renvoyée par l'API peut contenir l'heure : on ne garde que AAAA-MM-JJ.
export function toDay(value) {
  return String(value ?? '').slice(0, 10);
}

export function formatDay(value) {
  const day = toDay(value);
  if (!day) return '';
  return new Date(`${day}T12:00:00`).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

export function formatLongDate(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}
