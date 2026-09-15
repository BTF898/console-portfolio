const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

/** '2022-03' → 'Mar 2022' */
export function formatMonth(value: string): string {
  const [y, m] = value.split('-');
  const idx = Number(m) - 1;
  return `${MONTHS[idx] ?? m} ${y}`;
}

export function formatRange(start: string, end: string | null | undefined): string {
  return `${formatMonth(start)} — ${end ? formatMonth(end) : 'Present'}`;
}
