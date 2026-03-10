"use client";

import { useMemo } from "react";
import { Users, Eye, Heart, MousePointer } from "lucide-react";
import { useDateRange } from "@/context/date-range-context";
import { getAccountMetrics, getPostsAnalytics } from "@/services/instagram";
import { MetricCardGrid } from "@/components/metrics/metric-card-grid";
import { AreaChartCard } from "@/components/charts/area-chart-card";
import { BarChartCard } from "@/components/charts/bar-chart-card";
import { LineChartCard } from "@/components/charts/line-chart-card";
import { followerChartConfig, reachChartConfig } from "@/lib/chart-config";
import { formatNumber } from "@/lib/format";

const websiteClicksConfig = {
  websiteClicks: { label: "Website Clicks", color: "#E1306C" },
};

const engagementByTypeConfig = {
  likes: { label: "Likes", color: "#E1306C" },
  comments: { label: "Comments", color: "#833AB4" },
  saves: { label: "Saves", color: "#FCAF45" },
  shares: { label: "Shares", color: "#F77737" },
};

const dateFormatter = (value) => {
  const d = new Date(value);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

export default function OverviewPage() {
  const { dateRange } = useDateRange();

  const accountData = useMemo(
    () => getAccountMetrics(dateRange),
    [dateRange]
  );

  const postsData = useMemo(
    () => getPostsAnalytics(dateRange),
    [dateRange]
  );

  const metrics = [
    {
      title: "Total Followers",
      value: formatNumber(accountData.summary.currentFollowers),
      change: accountData.summary.currentFollowersChange,
      changeLabel: "vs prev period",
      icon: Users,
    },
    {
      title: "Accounts Reached",
      value: formatNumber(accountData.summary.totalReach),
      change: accountData.summary.totalReachChange,
      changeLabel: "vs prev period",
      icon: Eye,
    },
    {
      title: "Accounts Engaged",
      value: formatNumber(accountData.summary.totalEngaged),
      change: accountData.summary.totalEngagedChange,
      changeLabel: "vs prev period",
      icon: Heart,
    },
    {
      title: "Profile Views",
      value: formatNumber(accountData.summary.totalProfileViews),
      change: accountData.summary.totalProfileViewsChange,
      changeLabel: "vs prev period",
      icon: MousePointer,
    },
  ];

  const followerData = useMemo(
    () =>
      accountData.daily.map((d) => ({
        date: d.date,
        followers: d.followers,
      })),
    [accountData.daily]
  );

  const reachData = useMemo(
    () =>
      accountData.daily.map((d) => ({
        date: d.date,
        reach: d.reach,
        impressions: d.impressions,
      })),
    [accountData.daily]
  );

  const websiteClicksData = useMemo(
    () =>
      accountData.daily.map((d) => ({
        date: d.date,
        websiteClicks: d.websiteClicks,
      })),
    [accountData.daily]
  );

  const engagementByTypeData = useMemo(() => {
    const typeMap = {};
    for (const post of postsData.posts) {
      if (!typeMap[post.type]) {
        typeMap[post.type] = { name: post.type, likes: 0, comments: 0, saves: 0, shares: 0 };
      }
      typeMap[post.type].likes += post.likes;
      typeMap[post.type].comments += post.comments;
      typeMap[post.type].saves += post.saves;
      typeMap[post.type].shares += post.shares;
    }
    return Object.values(typeMap);
  }, [postsData.posts]);

  return (
    <div className="space-y-4">
      <MetricCardGrid metrics={metrics} />

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <AreaChartCard
          title="Follower Growth"
          description="Total followers over time"
          data={followerData}
          chartConfig={followerChartConfig}
          dataKeys={["followers"]}
          xAxisKey="date"
          xAxisFormatter={dateFormatter}
        />
        <AreaChartCard
          title="Reach vs Impressions"
          description="Daily reach and impressions"
          data={reachData}
          chartConfig={reachChartConfig}
          dataKeys={["reach", "impressions"]}
          xAxisKey="date"
          xAxisFormatter={dateFormatter}
        />
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <BarChartCard
          title="Engagement by Type"
          description="Total engagement metrics by content type"
          data={engagementByTypeData}
          chartConfig={engagementByTypeConfig}
          dataKeys={["likes", "comments", "saves", "shares"]}
          xAxisKey="name"
          stacked
          showLegend
        />
        <LineChartCard
          title="Website Clicks"
          description="Daily website clicks from profile"
          data={websiteClicksData}
          chartConfig={websiteClicksConfig}
          dataKeys={["websiteClicks"]}
          xAxisKey="date"
          xAxisFormatter={dateFormatter}
        />
      </div>
    </div>
  );
}
