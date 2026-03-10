import { subDays, parseISO, isWithinInterval, startOfDay, endOfDay } from "date-fns";
import {
  accountMetricsDaily,
  postsData,
  reelsData,
  storiesData,
  audienceAgeGender,
  topCountries,
  topCities,
  activeHours,
} from "@/data/instagram";

/**
 * Helper: check if an ISO date string falls within [from, to] (inclusive, day-level).
 */
function isInRange(dateStr, from, to) {
  const date = parseISO(dateStr.split("T")[0]);
  return isWithinInterval(date, {
    start: startOfDay(from),
    end: endOfDay(to),
  });
}

/**
 * Helper: compute the previous period of the same length immediately before
 * the selected range. E.g., if from=Mar 1 and to=Mar 10 (10 days),
 * the previous period is Feb 19 - Feb 28.
 */
function getPreviousPeriod(from, to) {
  const rangeMs = to.getTime() - from.getTime();
  const rangeDays = Math.round(rangeMs / (1000 * 60 * 60 * 24));
  const prevTo = subDays(from, 1);
  const prevFrom = subDays(from, rangeDays);
  return { prevFrom, prevTo };
}

/**
 * Helper: compute percentage change between current and previous values.
 * Returns a number like 12.5 for +12.5%, or -3.2 for -3.2%.
 */
function percentageChange(current, previous) {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / Math.abs(previous)) * 100 * 10) / 10;
}

/**
 * Get account metrics filtered to a date range.
 * Returns daily entries and a summary with totals and change percentages.
 */
export function getAccountMetrics({ from, to }) {
  const daily = accountMetricsDaily.filter((entry) =>
    isInRange(entry.date, from, to)
  );

  const { prevFrom, prevTo } = getPreviousPeriod(from, to);
  const previousDaily = accountMetricsDaily.filter((entry) =>
    isInRange(entry.date, prevFrom, prevTo)
  );

  // Compute current period sums
  const currentFollowers = daily.length > 0 ? daily[daily.length - 1].followers : 0;
  const totalReach = daily.reduce((sum, d) => sum + d.reach, 0);
  const totalEngaged = daily.reduce((sum, d) => sum + d.accountsEngaged, 0);
  const totalProfileViews = daily.reduce((sum, d) => sum + d.profileViews, 0);
  const totalWebsiteClicks = daily.reduce((sum, d) => sum + d.websiteClicks, 0);
  const followersGained = daily.reduce((sum, d) => sum + d.followersGained, 0);
  const followersLost = daily.reduce((sum, d) => sum + d.followersLost, 0);

  // Compute previous period sums for change calculation
  const prevFollowers = previousDaily.length > 0 ? previousDaily[previousDaily.length - 1].followers : 0;
  const prevTotalReach = previousDaily.reduce((sum, d) => sum + d.reach, 0);
  const prevTotalEngaged = previousDaily.reduce((sum, d) => sum + d.accountsEngaged, 0);
  const prevTotalProfileViews = previousDaily.reduce((sum, d) => sum + d.profileViews, 0);
  const prevTotalWebsiteClicks = previousDaily.reduce((sum, d) => sum + d.websiteClicks, 0);
  const prevFollowersGained = previousDaily.reduce((sum, d) => sum + d.followersGained, 0);
  const prevFollowersLost = previousDaily.reduce((sum, d) => sum + d.followersLost, 0);

  return {
    daily,
    summary: {
      currentFollowers,
      currentFollowersChange: percentageChange(currentFollowers, prevFollowers),
      totalReach,
      totalReachChange: percentageChange(totalReach, prevTotalReach),
      totalEngaged,
      totalEngagedChange: percentageChange(totalEngaged, prevTotalEngaged),
      totalProfileViews,
      totalProfileViewsChange: percentageChange(totalProfileViews, prevTotalProfileViews),
      totalWebsiteClicks,
      totalWebsiteClicksChange: percentageChange(totalWebsiteClicks, prevTotalWebsiteClicks),
      followersGained,
      followersGainedChange: percentageChange(followersGained, prevFollowersGained),
      followersLost,
      followersLostChange: percentageChange(followersLost, prevFollowersLost),
    },
  };
}

/**
 * Get posts analytics filtered to a date range.
 * Returns filtered posts, a summary, and a content type breakdown.
 */
export function getPostsAnalytics({ from, to }) {
  const posts = postsData.filter((post) =>
    isInRange(post.publishedAt, from, to)
  );

  const totalPosts = posts.length;
  const avgEngagementRate =
    totalPosts > 0
      ? Math.round(
          (posts.reduce((sum, p) => sum + p.engagementRate, 0) / totalPosts) * 100
        ) / 100
      : 0;
  const totalReach = posts.reduce((sum, p) => sum + p.reach, 0);
  const totalSaves = posts.reduce((sum, p) => sum + p.saves, 0);

  // Content type breakdown
  const typeCounts = {};
  for (const post of posts) {
    typeCounts[post.type] = (typeCounts[post.type] || 0) + 1;
  }

  const contentBreakdown = Object.entries(typeCounts).map(([type, count]) => ({
    type,
    count,
    percentage: totalPosts > 0 ? Math.round((count / totalPosts) * 100 * 10) / 10 : 0,
  }));

  return {
    posts,
    summary: {
      totalPosts,
      avgEngagementRate,
      totalReach,
      totalSaves,
    },
    contentBreakdown,
  };
}

/**
 * Get reels analytics filtered to a date range.
 * Returns filtered reels and a summary.
 */
export function getReelsAnalytics({ from, to }) {
  const reels = reelsData.filter((reel) =>
    isInRange(reel.publishedAt, from, to)
  );

  const totalReels = reels.length;
  const totalPlays = reels.reduce((sum, r) => sum + r.plays, 0);
  const avgEngagementRate =
    totalReels > 0
      ? Math.round(
          (reels.reduce((sum, r) => sum + r.engagementRate, 0) / totalReels) * 100
        ) / 100
      : 0;
  const totalReach = reels.reduce((sum, r) => sum + r.reach, 0);
  const totalLikes = reels.reduce((sum, r) => sum + r.likes, 0);
  const totalComments = reels.reduce((sum, r) => sum + r.comments, 0);
  const totalSaves = reels.reduce((sum, r) => sum + r.saves, 0);
  const totalShares = reels.reduce((sum, r) => sum + r.shares, 0);
  const avgWatchTime =
    totalReels > 0
      ? Math.round(
          (reels.reduce((sum, r) => sum + r.avgWatchTime, 0) / totalReels) * 10
        ) / 10
      : 0;

  return {
    reels,
    summary: {
      totalReels,
      totalPlays,
      avgEngagementRate,
      totalReach,
      totalLikes,
      totalComments,
      totalSaves,
      totalShares,
      avgWatchTime,
    },
  };
}

/**
 * Get stories analytics filtered to a date range.
 * Returns filtered stories and a summary.
 */
export function getStoriesAnalytics({ from, to }) {
  const stories = storiesData.filter((story) =>
    isInRange(story.publishedAt, from, to)
  );

  const totalStories = stories.length;
  const totalImpressions = stories.reduce((sum, s) => sum + s.impressions, 0);
  const totalReach = stories.reduce((sum, s) => sum + s.reach, 0);
  const totalTapsForward = stories.reduce((sum, s) => sum + s.tapsForward, 0);
  const totalTapsBack = stories.reduce((sum, s) => sum + s.tapsBack, 0);
  const totalExits = stories.reduce((sum, s) => sum + s.exits, 0);
  const totalReplies = stories.reduce((sum, s) => sum + s.replies, 0);
  const avgCompletionRate =
    totalStories > 0
      ? Math.round(
          (stories.reduce((sum, s) => sum + s.completionRate, 0) / totalStories) *
            10
        ) / 10
      : 0;

  return {
    stories,
    summary: {
      totalStories,
      totalImpressions,
      totalReach,
      totalTapsForward,
      totalTapsBack,
      totalExits,
      totalReplies,
      avgCompletionRate,
    },
  };
}

/**
 * Get audience data. No date filtering needed -- returns static demographic data.
 */
export function getAudienceData() {
  return {
    audienceAgeGender,
    topCountries,
    topCities,
    activeHours,
  };
}
