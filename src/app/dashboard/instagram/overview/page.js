"use client";

import { useMemo } from "react";
import { UserPlus, Eye, Play, MousePointer } from "lucide-react";
import { useDateRange } from "@/context/date-range-context";
import { getAccountMetrics } from "@/services/instagram";
import { MetricCardGrid } from "@/components/metrics/metric-card-grid";
import { AreaChartCard } from "@/components/charts/area-chart-card";
import { BarChartCard } from "@/components/charts/bar-chart-card";
import { LineChartCard } from "@/components/charts/line-chart-card";
import { formatNumber } from "@/lib/format";

const reachViewsConfig = {
  reach: { label: "Accounts Reached", color: "#E1306C" },
  videoViews: { label: "Reel Views", color: "#833AB4" },
};

const followersGainedConfig = {
  followersGained: { label: "Followers Gained", color: "#FCAF45" },
};

const websiteClicksConfig = {
  websiteClicks: { label: "Website Clicks", color: "#F77737" },
};

const dateFormatter = (value) =>
  new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" });

export default function OverviewPage() {
  const { dateRange } = useDateRange();

  const accountData = useMemo(
    () => getAccountMetrics(dateRange),
    [dateRange]
  );

  const metrics = [
    {
      title: "Followers Gained",
      value: formatNumber(accountData.summary.totalFollowersGained),
      change: accountData.summary.totalFollowersGainedChange,
      changeLabel: "vs prev period",
      icon: UserPlus,
    },
    {
      title: "Accounts Reached",
      value: formatNumber(accountData.summary.totalReach),
      change: accountData.summary.totalReachChange,
      changeLabel: "vs prev period",
      icon: Eye,
    },
    {
      title: "Reel Views",
      value: formatNumber(accountData.summary.totalVideoViews),
      change: accountData.summary.totalVideoViewsChange,
      changeLabel: "vs prev period",
      icon: Play,
    },
    {
      title: "Profile Views",
      value: formatNumber(accountData.summary.totalProfileViews),
      change: accountData.summary.totalProfileViewsChange,
      changeLabel: "vs prev period",
      icon: MousePointer,
    },
  ];

  const reachViewsData = accountData.daily.map((d) => ({
    date: d.date,
    reach: d.reach,
    videoViews: d.videoViews,
  }));

  const followersGainedData = accountData.daily.map((d) => ({
    date: d.date,
    followersGained: d.followersGained,
  }));

  const websiteClicksData = accountData.daily.map((d) => ({
    date: d.date,
    websiteClicks: d.websiteClicks,
  }));

  return (
    <div className="space-y-4">
      <MetricCardGrid metrics={metrics} />

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <AreaChartCard
          title="Reach vs Reel Views"
          description="Daily accounts reached and reel views"
          data={reachViewsData}
          chartConfig={reachViewsConfig}
          dataKeys={["reach", "videoViews"]}
          xAxisKey="date"
          xAxisFormatter={dateFormatter}
          showLegend
        />
        <BarChartCard
          title="Daily Followers Gained"
          description="Net new followers per day"
          data={followersGainedData}
          chartConfig={followersGainedConfig}
          dataKeys={["followersGained"]}
          xAxisKey="date"
          xAxisFormatter={dateFormatter}
          showLegend={false}
        />
      </div>

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
  );
}
