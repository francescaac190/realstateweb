const eurFormatter = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat('es-ES');

export function formatEur(value: number): string {
  return eurFormatter.format(value);
}

export function formatArea(squareMeters: number): string {
  return `${numberFormatter.format(squareMeters)} m²`;
}

export function formatNumber(value: number): string {
  return numberFormatter.format(value);
}

export function formatDate(date: Date | string, opts?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('es-ES', opts ?? { day: '2-digit', month: 'short', year: 'numeric' }).format(d);
}

export function formatTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('es-ES', { hour: '2-digit', minute: '2-digit' }).format(d);
}
