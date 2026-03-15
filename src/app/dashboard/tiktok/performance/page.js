"use client";

import { useMemo } from "react";
import { Play, Heart, Share2, UserPlus } from "lucide-react";
import { useDateRange } from "@/context/date-range-context";
import { getTikTokMetrics } from "@/services/tiktok";
import { MetricCardGrid } from "@/components/metrics/metric-card-grid";
import { AreaChartCard } from "@/components/charts/area-chart-card";
import { formatNumber } from "@/lib/format";

const playsConfig = {
  play_count: { label: "Plays", color: "#25f4ee" },
};

const engagementConfig = {
  like_count: { label: "Likes", color: "#fe2c55" },
  share_count: { label: "Shares", color: "#25f4ee" },
};

const dateFormatter = (value) =>
  new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" });

export default function TikTokPerformancePage() {
  const { dateRange } = useDateRange();

  const data = useMemo(() => getTikTokMetrics(dateRange), [dateRange]);

  const metrics = [
    {
      title: "Total Plays",
      value: formatNumber(data.summary.totalPlayCount),
      change: data.summary.totalPlayCountChange,
      changeLabel: "vs prev period",
      icon: Play,
    },
    {
      title: "Total Likes",
      value: formatNumber(data.summary.totalLikes),
      change: data.summary.totalLikesChange,
      changeLabel: "vs prev period",
      icon: Heart,
    },
    {
      title: "Total Shares",
      value: formatNumber(data.summary.totalShares),
      change: data.summary.totalSharesChange,
      changeLabel: "vs prev period",
      icon: Share2,
    },
    {
      title: "Followers Gained",
      value: formatNumber(data.summary.totalFollowersGained),
      change: data.summary.totalFollowersGainedChange,
      changeLabel: "vs prev period",
      icon: UserPlus,
    },
  ];

  const playsData = data.daily.map((d) => ({
    date: d.date,
    play_count: d.play_count,
  }));

  const engagementData = data.daily.map((d) => ({
    date: d.date,
    like_count: d.like_count,
    share_count: d.share_count,
  }));

  return (
    <div className="space-y-4">
      <MetricCardGrid metrics={metrics} />

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <AreaChartCard
          title="Daily Plays"
          description="Play count over the selected period"
          data={playsData}
          chartConfig={playsConfig}
          dataKeys={["play_count"]}
          xAxisKey="date"
          xAxisFormatter={dateFormatter}
        />
        <AreaChartCard
          title="Likes & Shares"
          description="Daily likes and shares"
          data={engagementData}
          chartConfig={engagementConfig}
          dataKeys={["like_count", "share_count"]}
          xAxisKey="date"
          xAxisFormatter={dateFormatter}
          showLegend
        />
      </div>
    </div>
  );
}
