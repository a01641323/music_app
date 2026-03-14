"use client";

import { useMemo } from "react";
import { Users, Play, Eye, TrendingUp } from "lucide-react";
import { useDateRange } from "@/context/date-range-context";
import { getTikTokMetrics } from "@/services/tiktok";
import { MetricCardGrid } from "@/components/metrics/metric-card-grid";
import { AreaChartCard } from "@/components/charts/area-chart-card";
import { BarChartCard } from "@/components/charts/bar-chart-card";
import { LineChartCard } from "@/components/charts/line-chart-card";
import { formatNumber } from "@/lib/format";

const followerConfig = {
  follower_count: { label: "Followers", color: "#25f4ee" },
};

const playsViewsConfig = {
  play_count: { label: "Plays", color: "#25f4ee" },
  video_views: { label: "Video Views", color: "#fe2c55" },
};

const engagementConfig = {
  like_count: { label: "Likes", color: "#fe2c55" },
  comment_count: { label: "Comments", color: "#25f4ee" },
  share_count: { label: "Shares", color: "#ffffff" },
};

const dateFormatter = (value) =>
  new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" });

export default function TikTokOverviewPage() {
  const { dateRange } = useDateRange();

  const data = useMemo(() => getTikTokMetrics(dateRange), [dateRange]);

  const metrics = [
    {
      title: "Followers",
      value: formatNumber(data.summary.currentFollowers),
      change: data.summary.currentFollowersChange,
      changeLabel: "vs prev period",
      icon: Users,
    },
    {
      title: "Total Plays",
      value: formatNumber(data.summary.totalPlayCount),
      change: data.summary.totalPlayCountChange,
      changeLabel: "vs prev period",
      icon: Play,
    },
    {
      title: "Video Views",
      value: formatNumber(data.summary.totalVideoViews),
      change: data.summary.totalVideoViewsChange,
      changeLabel: "vs prev period",
      icon: Eye,
    },
    {
      title: "Reach",
      value: formatNumber(data.summary.totalReach),
      change: data.summary.totalReachChange,
      changeLabel: "vs prev period",
      icon: TrendingUp,
    },
  ];

  const followerData = data.daily.map((d) => ({
    date: d.date,
    follower_count: d.follower_count,
  }));

  const playsViewsData = data.daily.map((d) => ({
    date: d.date,
    play_count: d.play_count,
    video_views: d.video_views,
  }));

  const engagementData = data.daily.map((d) => ({
    date: d.date,
    like_count: d.like_count,
    comment_count: d.comment_count,
    share_count: d.share_count,
  }));

  return (
    <div className="space-y-4">
      <MetricCardGrid metrics={metrics} />

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <AreaChartCard
          title="Follower Growth"
          description="Total followers over time"
          data={followerData}
          chartConfig={followerConfig}
          dataKeys={["follower_count"]}
          xAxisKey="date"
          xAxisFormatter={dateFormatter}
        />
        <AreaChartCard
          title="Plays vs Video Views"
          description="Daily plays and video views"
          data={playsViewsData}
          chartConfig={playsViewsConfig}
          dataKeys={["play_count", "video_views"]}
          xAxisKey="date"
          xAxisFormatter={dateFormatter}
        />
      </div>

      <LineChartCard
        title="Engagement Over Time"
        description="Daily likes, comments, and shares"
        data={engagementData}
        chartConfig={engagementConfig}
        dataKeys={["like_count", "comment_count", "share_count"]}
        xAxisKey="date"
        xAxisFormatter={dateFormatter}
        showLegend
      />
    </div>
  );
}
