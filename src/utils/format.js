// Normalisation des dates API et formatage français sécurisé
export function toDay(value) {
  if (!value) return '';
  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) return '';
    return value.toISOString().slice(0, 10);
  }
  const str = String(value).trim();
  // Si chaîne ISO ou AAAA-MM-JJ
  if (/^\d{4}-\d{2}-\d{2}/.test(str)) {
    return str.slice(0, 10);
  }
  const parsed = new Date(str);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toISOString().slice(0, 10);
  }
  return str.slice(0, 10);
}

export function formatDay(value) {
  if (!value) return '';
  let date;
  if (value instanceof Date) {
    date = value;
  } else {
    const day = toDay(value);
    if (!day) return '';
    date = new Date(`${day}T12:00:00`);
    if (Number.isNaN(date.getTime())) {
      date = new Date(value);
    }
  }
  if (!date || Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

export function formatLongDate(value) {
  if (!value) return '';
  let date;
  if (value instanceof Date) {
    date = value;
  } else {
    const day = toDay(value);
    date = day ? new Date(`${day}T12:00:00`) : new Date(value);
    if (Number.isNaN(date.getTime())) {
      date = new Date(value);
    }
  }
  if (!date || Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}
