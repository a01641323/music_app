import { format as fnsFormat, isWithinInterval, parseISO } from "date-fns";

/**
 * Wrapper around date-fns format.
 * @param {Date|string} date - The date to format
 * @param {string} formatStr - The format string (date-fns tokens)
 * @returns {string}
 */
export function formatDate(date, formatStr) {
  const d = typeof date === "string" ? parseISO(date) : date;
  return fnsFormat(d, formatStr);
}

/**
 * Format a date range as a human-readable string.
 * e.g. "Mar 1 - Mar 10, 2026"
 * If both dates share the same year, the year is shown only at the end.
 */
export function formatDateRange(from, to) {
  if (!from || !to) return "";

  const fromDate = typeof from === "string" ? parseISO(from) : from;
  const toDate = typeof to === "string" ? parseISO(to) : to;

  const fromYear = fromDate.getFullYear();
  const toYear = toDate.getFullYear();

  if (fromYear === toYear) {
    return `${fnsFormat(fromDate, "MMM d")} - ${fnsFormat(toDate, "MMM d, yyyy")}`;
  }

  return `${fnsFormat(fromDate, "MMM d, yyyy")} - ${fnsFormat(toDate, "MMM d, yyyy")}`;
}

/**
 * Returns an array of date range presets.
 */
export function getDatePresets() {
  return [
    { label: "7d", value: "7d", days: 7 },
    { label: "30d", value: "30d", days: 30 },
    { label: "90d", value: "90d", days: 90 },
    { label: "1y", value: "1y", days: 365 },
  ];
}

/**
 * Checks if an ISO date string falls within a given date range (inclusive).
 * @param {string} dateStr - ISO date string (e.g. "2026-03-01")
 * @param {Date} from - Start of the range
 * @param {Date} to - End of the range
 * @returns {boolean}
 */
export function isWithinDateRange(dateStr, from, to) {
  if (!dateStr || !from || !to) return false;
  const date = parseISO(dateStr);
  return isWithinInterval(date, { start: from, end: to });
}
