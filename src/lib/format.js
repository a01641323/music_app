/**
 * Format a number with comma separators.
 * e.g. 1234 -> "1,234", 12847 -> "12,847"
 */
export function formatNumber(num) {
  if (num == null || isNaN(num)) return "0";
  return num.toLocaleString("en-US");
}

/**
 * Format a number in compact notation.
 * e.g. 1200 -> "1.2K", 1500000 -> "1.5M"
 */
export function formatCompact(num) {
  if (num == null || isNaN(num)) return "0";

  const abs = Math.abs(num);

  if (abs >= 1_000_000) {
    const value = num / 1_000_000;
    return `${parseFloat(value.toFixed(1))}M`;
  }

  if (abs >= 1_000) {
    const value = num / 1_000;
    return `${parseFloat(value.toFixed(1))}K`;
  }

  return String(num);
}

/**
 * Format a number as a percentage string.
 * e.g. 2.4 -> "2.4%"
 */
export function formatPercentage(num, decimals = 1) {
  if (num == null || isNaN(num)) return "0%";
  return `${num.toFixed(decimals)}%`;
}

/**
 * Format seconds as a duration string.
 * e.g. 12.4 -> "12.4s"
 */
export function formatDuration(seconds) {
  if (seconds == null || isNaN(seconds)) return "0s";
  return `${parseFloat(seconds.toFixed(1))}s`;
}
