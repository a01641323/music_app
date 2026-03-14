import { subDays, parseISO, isWithinInterval, startOfDay, endOfDay } from "date-fns";
import { accountMetricsDaily, videosData, audienceCountries, audienceGendersAge } from "@/data/tiktok";

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
 * Get TikTok account metrics filtered to a date range.
 */
export function getTikTokMetrics({ from, to }) {
  const daily = accountMetricsDaily.filter((entry) =>
    isInRange(entry.date, from, to)
  );

  const { prevFrom, prevTo } = getPreviousPeriod(from, to);
  const previousDaily = accountMetricsDaily.filter((entry) =>
    isInRange(entry.date, prevFrom, prevTo)
  );

  const currentFollowers = daily.length > 0 ? daily[daily.length - 1].follower_count : 0;
  const totalPlayCount = daily.reduce((sum, d) => sum + d.play_count, 0);
  const totalVideoViews = daily.reduce((sum, d) => sum + d.video_views, 0);
  const totalReach = daily.reduce((sum, d) => sum + d.reach, 0);
  const totalLikes = daily.reduce((sum, d) => sum + d.like_count, 0);
  const totalComments = daily.reduce((sum, d) => sum + d.comment_count, 0);
  const totalShares = daily.reduce((sum, d) => sum + d.share_count, 0);
  const followersGained = daily.reduce((sum, d) => sum + d.followers_gained, 0);
  const followersLost = daily.reduce((sum, d) => sum + d.followers_lost, 0);
  const avgWatchTime =
    daily.length > 0
      ? Math.round((daily.reduce((sum, d) => sum + d.average_watch_time, 0) / daily.length) * 10) / 10
      : 0;
  const avgFullWatchRate =
    daily.length > 0
      ? Math.round((daily.reduce((sum, d) => sum + d.full_video_watched_rate, 0) / daily.length) * 10) / 10
      : 0;

  const prevFollowers = previousDaily.length > 0 ? previousDaily[previousDaily.length - 1].follower_count : 0;
  const prevTotalPlayCount = previousDaily.reduce((sum, d) => sum + d.play_count, 0);
  const prevTotalVideoViews = previousDaily.reduce((sum, d) => sum + d.video_views, 0);
  const prevTotalReach = previousDaily.reduce((sum, d) => sum + d.reach, 0);
  const prevTotalLikes = previousDaily.reduce((sum, d) => sum + d.like_count, 0);
  const prevTotalShares = previousDaily.reduce((sum, d) => sum + d.share_count, 0);
  const prevFollowersGained = previousDaily.reduce((sum, d) => sum + d.followers_gained, 0);
  const prevFollowersLost = previousDaily.reduce((sum, d) => sum + d.followers_lost, 0);

  return {
    daily,
    summary: {
      currentFollowers,
      currentFollowersChange: percentageChange(currentFollowers, prevFollowers),
      totalPlayCount,
      totalPlayCountChange: percentageChange(totalPlayCount, prevTotalPlayCount),
      totalVideoViews,
      totalVideoViewsChange: percentageChange(totalVideoViews, prevTotalVideoViews),
      totalReach,
      totalReachChange: percentageChange(totalReach, prevTotalReach),
      totalLikes,
      totalLikesChange: percentageChange(totalLikes, prevTotalLikes),
      totalComments,
      totalShares,
      totalSharesChange: percentageChange(totalShares, prevTotalShares),
      followersGained,
      followersGainedChange: percentageChange(followersGained, prevFollowersGained),
      followersLost,
      followersLostChange: percentageChange(followersLost, prevFollowersLost),
      avgWatchTime,
      avgFullWatchRate,
    },
  };
}

/**
 * Get TikTok videos filtered to a date range.
 */
export function getTikTokVideos({ from, to }) {
  const videos = videosData.filter((v) => isInRange(v.publishedAt, from, to));

  const totalVideos = videos.length;
  const totalPlays = videos.reduce((sum, v) => sum + v.play_count, 0);
  const totalLikes = videos.reduce((sum, v) => sum + v.like_count, 0);
  const totalShares = videos.reduce((sum, v) => sum + v.share_count, 0);
  const avgWatchTime =
    totalVideos > 0
      ? Math.round((videos.reduce((sum, v) => sum + v.average_watch_time, 0) / totalVideos) * 10) / 10
      : 0;
  const avgFullWatchRate =
    totalVideos > 0
      ? Math.round((videos.reduce((sum, v) => sum + v.full_video_watched_rate, 0) / totalVideos) * 10) / 10
      : 0;

  return {
    videos,
    summary: {
      totalVideos,
      totalPlays,
      totalLikes,
      totalShares,
      avgWatchTime,
      avgFullWatchRate,
    },
  };
}

/**
 * Get TikTok audience data (static, no date filtering).
 */
export function getTikTokAudience() {
  return { audienceCountries, audienceGendersAge };
}
