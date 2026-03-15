import { subDays, parseISO, isWithinInterval, startOfDay, endOfDay } from "date-fns";
import {
  accountMetricsDaily,
  audienceCountries,
  audienceGender,
  audienceActivity,
} from "@/data/tiktok";

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
 * Get TikTok metrics filtered to a date range.
 * Fields from CSV: follower_count (cumulative), followers_gained (daily diff),
 * play_count (views), like_count, comment_count, share_count,
 * viewers_total, viewers_new, viewers_returning.
 */
export function getTikTokMetrics({ from, to }) {
  const daily = accountMetricsDaily.filter((entry) =>
    isInRange(entry.date, from, to)
  );

  const { prevFrom, prevTo } = getPreviousPeriod(from, to);
  const previousDaily = accountMetricsDaily.filter((entry) =>
    isInRange(entry.date, prevFrom, prevTo)
  );

  // Use last non-zero follower_count (0 = missing/NA in CSV)
  const lastWithFollowers = [...daily].reverse().find((d) => d.follower_count > 0);
  const currentFollowers = lastWithFollowers?.follower_count ?? 0;
  const totalPlayCount = daily.reduce((sum, d) => sum + d.play_count, 0);
  const totalLikes = daily.reduce((sum, d) => sum + d.like_count, 0);
  const totalComments = daily.reduce((sum, d) => sum + d.comment_count, 0);
  const totalShares = daily.reduce((sum, d) => sum + d.share_count, 0);
  const totalFollowersGained = daily.reduce((sum, d) => sum + d.followers_gained, 0);
  const totalViewersNew = daily.reduce((sum, d) => sum + d.viewers_new, 0);
  const totalViewersTotal = daily.reduce((sum, d) => sum + d.viewers_total, 0);

  const prevLastWithFollowers = [...previousDaily].reverse().find((d) => d.follower_count > 0);
  const prevFollowers = prevLastWithFollowers?.follower_count ?? 0;
  const prevTotalPlayCount = previousDaily.reduce((sum, d) => sum + d.play_count, 0);
  const prevTotalLikes = previousDaily.reduce((sum, d) => sum + d.like_count, 0);
  const prevTotalShares = previousDaily.reduce((sum, d) => sum + d.share_count, 0);
  const prevTotalFollowersGained = previousDaily.reduce((sum, d) => sum + d.followers_gained, 0);
  const prevTotalViewersNew = previousDaily.reduce((sum, d) => sum + d.viewers_new, 0);

  return {
    daily,
    summary: {
      currentFollowers,
      currentFollowersChange: percentageChange(currentFollowers, prevFollowers),
      totalPlayCount,
      totalPlayCountChange: percentageChange(totalPlayCount, prevTotalPlayCount),
      totalLikes,
      totalLikesChange: percentageChange(totalLikes, prevTotalLikes),
      totalComments,
      totalShares,
      totalSharesChange: percentageChange(totalShares, prevTotalShares),
      totalFollowersGained,
      totalFollowersGainedChange: percentageChange(totalFollowersGained, prevTotalFollowersGained),
      totalViewersNew,
      totalViewersNewChange: percentageChange(totalViewersNew, prevTotalViewersNew),
      totalViewersTotal,
    },
  };
}

/**
 * Get TikTok audience data — static from CSV (no date filter).
 * Returns audienceCountries (with full names + percentages),
 * audienceGender (Male/Female/Other percentages),
 * audienceActivity (24-hour averaged profile).
 */
export function getTikTokAudience() {
  return { audienceCountries, audienceGender, audienceActivity };
}
