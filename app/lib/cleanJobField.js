export function cleanJobField(value) {
  if (value === null || value === undefined) return '';
  if (typeof value !== 'string') return String(value).trim();
  const text = value.trim();
  if (!text) return '';
  const lower = text.toLowerCase();
  if (['n/a', 'na', 'none', 'null', 'unknown', 'not available', 'not disclosed', 'tbd'].includes(lower)) {
    return '';
  }
  return text;
}

export function cleanJobSkills(value) {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.map(cleanJobField).filter(Boolean);
  }
  if (typeof value === 'string') {
    return value.split(',').map(cleanJobField).filter(Boolean);
  }
  return [];
}
