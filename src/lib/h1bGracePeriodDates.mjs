const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export function addUtcDays(isoDate, days) {
  const match = ISO_DATE.exec(isoDate);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }
  date.setUTCDate(date.getUTCDate() + days);
  const nextYear = date.getUTCFullYear();
  const nextMonth = String(date.getUTCMonth() + 1).padStart(2, '0');
  const nextDay = String(date.getUTCDate()).padStart(2, '0');
  return `${nextYear}-${nextMonth}-${nextDay}`;
}

function formatUtcDate(isoDate) {
  const match = ISO_DATE.exec(isoDate);
  if (!match) return isoDate;
  const month = MONTHS[Number(match[2]) - 1];
  return `${month} ${Number(match[3])}, ${match[1]}`;
}

export function gracePeriodEnd(lastDay, i94Date, days) {
  const sixtyDayDate = addUtcDays(lastDay, days);
  if (!sixtyDayDate || !addUtcDays(i94Date, 0)) return null;
  const end = sixtyDayDate <= i94Date ? sixtyDayDate : i94Date;
  const limit = sixtyDayDate < i94Date ? 'sixty-days' : sixtyDayDate > i94Date ? 'i94' : 'same-day';
  const endLabel = formatUtcDate(end);
  const sentence =
    limit === 'sixty-days'
      ? `The grace period ends on ${endLabel} because ${days} days after the last day of employment is earlier than the I-94 date.`
      : limit === 'i94'
        ? `The grace period ends on ${endLabel} because the I-94 date is earlier than ${days} days after the last day of employment.`
        : `The grace period ends on ${endLabel} because ${days} days after the last day of employment and the I-94 date are the same day.`;
  return { end, limit, sentence };
}
