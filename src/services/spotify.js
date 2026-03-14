import { subDays, parseISO, isWithinInterval, startOfDay, endOfDay } from "date-fns";
import {
  accountMetricsDaily,
  tracksData,
  listenerCountries,
  listenerCities,
  audienceAgeGender,
  playlistsData,
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

/**
 * Get Spotify account metrics filtered to a date range.
 */
export function getSpotifyMetrics({ from, to }) {
  const daily = accountMetricsDaily.filter((entry) =>
    isInRange(entry.date, from, to)
  );

  const { prevFrom, prevTo } = getPreviousPeriod(from, to);
  const previousDaily = accountMetricsDaily.filter((entry) =>
    isInRange(entry.date, prevFrom, prevTo)
  );

  const currentFollowers = daily.length > 0 ? daily[daily.length - 1].followers : 0;
  const currentMonthlyListeners = daily.length > 0 ? daily[daily.length - 1].monthly_listeners : 0;
  const totalStreams = daily.reduce((sum, d) => sum + d.streams, 0);
  const totalSaves = daily.reduce((sum, d) => sum + d.saves, 0);
  const totalPlaylistAdds = daily.reduce((sum, d) => sum + d.playlist_adds, 0);
  const followersGained = daily.reduce((sum, d) => sum + d.followers_gained, 0);
  const followersLost = daily.reduce((sum, d) => sum + d.followers_lost, 0);
  const avgSkipRate =
    daily.length > 0
      ? Math.round((daily.reduce((sum, d) => sum + d.skip_rate, 0) / daily.length) * 10) / 10
      : 0;

  const prevFollowers = previousDaily.length > 0 ? previousDaily[previousDaily.length - 1].followers : 0;
  const prevMonthlyListeners = previousDaily.length > 0 ? previousDaily[previousDaily.length - 1].monthly_listeners : 0;
  const prevTotalStreams = previousDaily.reduce((sum, d) => sum + d.streams, 0);
  const prevTotalSaves = previousDaily.reduce((sum, d) => sum + d.saves, 0);
  const prevTotalPlaylistAdds = previousDaily.reduce((sum, d) => sum + d.playlist_adds, 0);
  const prevFollowersGained = previousDaily.reduce((sum, d) => sum + d.followers_gained, 0);
  const prevFollowersLost = previousDaily.reduce((sum, d) => sum + d.followers_lost, 0);

  return {
    daily,
    summary: {
      currentFollowers,
      currentFollowersChange: percentageChange(currentFollowers, prevFollowers),
      currentMonthlyListeners,
      currentMonthlyListenersChange: percentageChange(currentMonthlyListeners, prevMonthlyListeners),
      totalStreams,
      totalStreamsChange: percentageChange(totalStreams, prevTotalStreams),
      totalSaves,
      totalSavesChange: percentageChange(totalSaves, prevTotalSaves),
      totalPlaylistAdds,
      totalPlaylistAddsChange: percentageChange(totalPlaylistAdds, prevTotalPlaylistAdds),
      followersGained,
      followersGainedChange: percentageChange(followersGained, prevFollowersGained),
      followersLost,
      followersLostChange: percentageChange(followersLost, prevFollowersLost),
      avgSkipRate,
    },
  };
}

/**
 * Get Spotify tracks filtered to a date range.
 */
export function getSpotifyTracks({ from, to }) {
  const tracks = tracksData.filter((t) => isInRange(t.releasedAt, from, to));

  const totalTracks = tracks.length;
  const totalStreams = tracks.reduce((sum, t) => sum + t.streams, 0);
  const totalSaves = tracks.reduce((sum, t) => sum + t.saves, 0);
  const totalPlaylistAdds = tracks.reduce((sum, t) => sum + t.playlist_adds, 0);
  const avgSkipRate =
    totalTracks > 0
      ? Math.round((tracks.reduce((sum, t) => sum + t.skip_rate, 0) / totalTracks) * 10) / 10
      : 0;
  const avgPopularity =
    totalTracks > 0
      ? Math.round(tracks.reduce((sum, t) => sum + t.popularity, 0) / totalTracks)
      : 0;

  return {
    tracks,
    summary: {
      totalTracks,
      totalStreams,
      totalSaves,
      totalPlaylistAdds,
      avgSkipRate,
      avgPopularity,
    },
  };
}

/**
 * Get Spotify audience data (static, no date filtering).
 */
export function getSpotifyAudience() {
  return { listenerCountries, listenerCities, audienceAgeGender };
}

/**
 * Get Spotify playlist placements (static).
 */
export function getSpotifyPlaylists() {
  return { playlistsData };
}
