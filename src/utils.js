// Small helper functions used on many pages.

/** Returns a date as "YYYY-MM-DD", moved forward by `daysFromToday` days (local time). */
export function isoDate(daysFromToday = 0) {
  const d = new Date();
  d.setDate(d.getDate() + daysFromToday);
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${month}-${day}`;
}

/** 4500 -> "₹4,500" */
export function money(amount) {
  return '₹' + Number(amount || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 });
}

/** Number of nights between two "YYYY-MM-DD" strings. */
export function nightsBetween(checkIn, checkOut) {
  const ms = new Date(checkOut) - new Date(checkIn);
  return Math.max(0, Math.round(ms / (1000 * 60 * 60 * 24)));
}
