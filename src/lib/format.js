const BYTE_UNITS = ['B', 'KB', 'MB', 'GB'];

export const formatBytes = (bytes) => {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 B';
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), BYTE_UNITS.length - 1);
  return `${(bytes / 1024 ** index).toFixed(index === 0 ? 0 : 1)} ${BYTE_UNITS[index]}`;
};

export const formatDate = (value) => (value ? new Intl.DateTimeFormat('en-AU', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value)) : '—');

export const initialsOf = (name, fallback = '?') => (name?.trim() ? name.trim().split(/\s+/).slice(0, 2).map((part) => part[0].toUpperCase()).join('') : fallback);
