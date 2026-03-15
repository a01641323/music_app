import { subDays, parseISO, isWithinInterval, startOfDay, endOfDay } from "date-fns";
import {
  accountMetricsDaily,
  topCountries,
  topCities,
  audienceAgeGender,
} from "@/data/instagram";

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
 * Get account metrics filtered to a date range.
 * Fields from CSV: reach, videoViews (reel impressions), profileViews,
 * followersGained (daily net), accountsEngaged, websiteClicks.
 */
export function getAccountMetrics({ from, to }) {
  const daily = accountMetricsDaily.filter((entry) =>
    isInRange(entry.date, from, to)
  );

  const { prevFrom, prevTo } = getPreviousPeriod(from, to);
  const previousDaily = accountMetricsDaily.filter((entry) =>
    isInRange(entry.date, prevFrom, prevTo)
  );

  const totalReach = daily.reduce((sum, d) => sum + d.reach, 0);
  const totalVideoViews = daily.reduce((sum, d) => sum + d.videoViews, 0);
  const totalProfileViews = daily.reduce((sum, d) => sum + d.profileViews, 0);
  const totalFollowersGained = daily.reduce((sum, d) => sum + d.followersGained, 0);
  const totalAccountsEngaged = daily.reduce((sum, d) => sum + d.accountsEngaged, 0);
  const totalWebsiteClicks = daily.reduce((sum, d) => sum + d.websiteClicks, 0);

  const prevTotalReach = previousDaily.reduce((sum, d) => sum + d.reach, 0);
  const prevTotalVideoViews = previousDaily.reduce((sum, d) => sum + d.videoViews, 0);
  const prevTotalProfileViews = previousDaily.reduce((sum, d) => sum + d.profileViews, 0);
  const prevTotalFollowersGained = previousDaily.reduce((sum, d) => sum + d.followersGained, 0);
  const prevTotalAccountsEngaged = previousDaily.reduce((sum, d) => sum + d.accountsEngaged, 0);
  const prevTotalWebsiteClicks = previousDaily.reduce((sum, d) => sum + d.websiteClicks, 0);

  return {
    daily,
    summary: {
      totalReach,
      totalReachChange: percentageChange(totalReach, prevTotalReach),
      totalVideoViews,
      totalVideoViewsChange: percentageChange(totalVideoViews, prevTotalVideoViews),
      totalProfileViews,
      totalProfileViewsChange: percentageChange(totalProfileViews, prevTotalProfileViews),
      totalFollowersGained,
      totalFollowersGainedChange: percentageChange(totalFollowersGained, prevTotalFollowersGained),
      totalAccountsEngaged,
      totalAccountsEngagedChange: percentageChange(totalAccountsEngaged, prevTotalAccountsEngaged),
      totalWebsiteClicks,
      totalWebsiteClicksChange: percentageChange(totalWebsiteClicks, prevTotalWebsiteClicks),
    },
  };
}

/**
 * Get audience data — static demographics from CSV (no date filter).
 */
export function getAudienceData() {
  return { topCountries, topCities, audienceAgeGender };
}
