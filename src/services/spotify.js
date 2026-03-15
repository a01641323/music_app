import { subDays, parseISO, isWithinInterval, startOfDay, endOfDay } from "date-fns";
import {
  accountMetricsDaily,
  songsTimeline,
  trackNames,
} from "@/data/spotify";

function isInRange(dateStr, from, to) {
  const date = parseISO(dateStr.split("T")[0]);
  return isWithinInterval(date, {
    start: startOfDay(from),
    end: endOfDay(to),
  });
}

function getPreviousPeriod(from, to) {
  const rangeMs = to.getTime() - from.getTime();
  const rangeDays = Math.round(rangeMs / (1000 * 60 * 60 * 24));
  const prevTo = subDays(from, 1);
  const prevFrom = subDays(from, rangeDays);
  return { prevFrom, prevTo };
}

function percentageChange(current, previous) {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / Math.abs(previous)) * 100 * 10) / 10;
}

// Pre-compute followers_gained (day-over-day diff) across the full dataset.
// followers is cumulative in the CSV, so we diff consecutive rows.
const allDailyWithGained = accountMetricsDaily.map((d, i) => ({
  ...d,
  followers_gained: i === 0 ? 0 : d.followers - accountMetricsDaily[i - 1].followers,
}));

/**
 * Get Spotify account metrics filtered to a date range.
 * Fields from CSV: listeners, monthly_listeners, monthly_active_listeners,
 * super_listeners, streams, playlist_adds, saves, followers.
 * Computed: followers_gained (day-over-day diff of cumulative followers).
 */
export function getSpotifyMetrics({ from, to }) {
  const daily = allDailyWithGained.filter((entry) =>
    isInRange(entry.date, from, to)
  );

  const { prevFrom, prevTo } = getPreviousPeriod(from, to);
  const previousDaily = allDailyWithGained.filter((entry) =>
    isInRange(entry.date, prevFrom, prevTo)
  );

  // Snapshot values — take last entry in range
  const last = daily.length > 0 ? daily[daily.length - 1] : {};
  const prevLast = previousDaily.length > 0 ? previousDaily[previousDaily.length - 1] : {};

  const currentMonthlyListeners = last.monthly_listeners ?? 0;
  const currentMonthlyActive = last.monthly_active_listeners ?? 0;
  const currentSuperListeners = last.super_listeners ?? 0;

  const prevMonthlyListeners = prevLast.monthly_listeners ?? 0;
  const prevMonthlyActive = prevLast.monthly_active_listeners ?? 0;
  const prevSuperListeners = prevLast.super_listeners ?? 0;

  // Cumulative values — sum over the range
  const totalStreams = daily.reduce((sum, d) => sum + d.streams, 0);
  const totalSaves = daily.reduce((sum, d) => sum + d.saves, 0);
  const totalPlaylistAdds = daily.reduce((sum, d) => sum + d.playlist_adds, 0);
  const totalFollowersGained = daily.reduce((sum, d) => sum + d.followers_gained, 0);

  const prevTotalStreams = previousDaily.reduce((sum, d) => sum + d.streams, 0);
  const prevTotalSaves = previousDaily.reduce((sum, d) => sum + d.saves, 0);
  const prevTotalPlaylistAdds = previousDaily.reduce((sum, d) => sum + d.playlist_adds, 0);
  const prevTotalFollowersGained = previousDaily.reduce((sum, d) => sum + d.followers_gained, 0);

  return {
    daily,
    summary: {
      totalFollowersGained,
      totalFollowersGainedChange: percentageChange(totalFollowersGained, prevTotalFollowersGained),
      currentMonthlyListeners,
      currentMonthlyListenersChange: percentageChange(currentMonthlyListeners, prevMonthlyListeners),
      currentMonthlyActive,
      currentMonthlyActiveChange: percentageChange(currentMonthlyActive, prevMonthlyActive),
      currentSuperListeners,
      currentSuperListenersChange: percentageChange(currentSuperListeners, prevSuperListeners),
      totalStreams,
      totalStreamsChange: percentageChange(totalStreams, prevTotalStreams),
      totalSaves,
      totalSavesChange: percentageChange(totalSaves, prevTotalSaves),
      totalPlaylistAdds,
      totalPlaylistAddsChange: percentageChange(totalPlaylistAdds, prevTotalPlaylistAdds),
    },
  };
}

/**
 * Get Spotify tracks data filtered to a date range.
 * Uses songsTimeline (one row per day, one column per track).
 * Returns:
 *   timeline  — filtered daily rows (for multi-line chart)
 *   totals    — per-track stream totals in the period, sorted desc
 *   trackNames — ordered list of track names
 */
export function getSpotifyTracks({ from, to }) {
  const timeline = songsTimeline.filter((row) =>
    isInRange(row.date, from, to)
  );

  // Compute per-track totals within the selected date range
  const totals = trackNames
    .map((name) => ({
      name,
      streams: timeline.reduce((sum, row) => sum + (row[name] ?? 0), 0),
    }))
    .sort((a, b) => b.streams - a.streams);

  return { timeline, totals, trackNames };
}
