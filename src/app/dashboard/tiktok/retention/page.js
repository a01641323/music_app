"use client";

import { useMemo } from "react";
import { Clock, BarChart2, Video, Play } from "lucide-react";
import { useDateRange } from "@/context/date-range-context";
import { getTikTokMetrics, getTikTokVideos } from "@/services/tiktok";
import { MetricCardGrid } from "@/components/metrics/metric-card-grid";
import { AreaChartCard } from "@/components/charts/area-chart-card";
import { BarChartCard } from "@/components/charts/bar-chart-card";
import { formatNumber, formatDuration, formatPercentage } from "@/lib/format";

const watchTimeConfig = {
  average_watch_time: { label: "Avg Watch Time (s)", color: "#25f4ee" },
};

const fullWatchConfig = {
  full_video_watched_rate: { label: "Full Watch Rate (%)", color: "#fe2c55" },
};

const videoWatchConfig = {
  average_watch_time: { label: "Avg Watch Time (s)", color: "#25f4ee" },
  full_video_watched_rate: { label: "Full Watch Rate (%)", color: "#fe2c55" },
};

const dateFormatter = (value) =>
  new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" });

export default function TikTokRetentionPage() {
  const { dateRange } = useDateRange();

  const data = useMemo(() => getTikTokMetrics(dateRange), [dateRange]);
  const videosData = useMemo(() => getTikTokVideos(dateRange), [dateRange]);

  const metrics = [
    {
      title: "Avg Watch Time",
      value: formatDuration(data.summary.avgWatchTime),
      change: null,
      changeLabel: "avg across period",
      icon: Clock,
    },
    {
      title: "Full Watch Rate",
      value: formatPercentage(data.summary.avgFullWatchRate),
      change: null,
      changeLabel: "avg across period",
      icon: BarChart2,
    },
    {
      title: "Videos Published",
      value: formatNumber(videosData.summary.totalVideos),
      change: null,
      changeLabel: "in selected period",
      icon: Video,
    },
    {
      title: "Total Plays",
      value: formatNumber(videosData.summary.totalPlays),
      change: null,
      changeLabel: "in selected period",
      icon: Play,
    },
  ];

  const watchTimeData = data.daily.map((d) => ({
    date: d.date,
    average_watch_time: d.average_watch_time,
  }));

  const fullWatchData = data.daily.map((d) => ({
    date: d.date,
    full_video_watched_rate: d.full_video_watched_rate,
  }));

  const topVideoRetention = [...videosData.videos]
    .sort((a, b) => b.full_video_watched_rate - a.full_video_watched_rate)
    .slice(0, 10)
    .map((v) => ({
      name: v.caption.slice(0, 20),
      average_watch_time: v.average_watch_time,
      full_video_watched_rate: v.full_video_watched_rate,
    }));

  return (
    <div className="space-y-4">
      <MetricCardGrid metrics={metrics} />

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <AreaChartCard
          title="Avg Watch Time"
          description="Daily average watch time in seconds"
          data={watchTimeData}
          chartConfig={watchTimeConfig}
          dataKeys={["average_watch_time"]}
          xAxisKey="date"
          xAxisFormatter={dateFormatter}
        />
        <AreaChartCard
          title="Full Video Watch Rate"
          description="Percentage of viewers who watched to the end"
          data={fullWatchData}
          chartConfig={fullWatchConfig}
          dataKeys={["full_video_watched_rate"]}
          xAxisKey="date"
          xAxisFormatter={dateFormatter}
        />
      </div>

      <BarChartCard
        title="Top Videos by Retention"
        description="Videos with highest full-watch rates"
        data={topVideoRetention}
        chartConfig={videoWatchConfig}
        dataKeys={["average_watch_time", "full_video_watched_rate"]}
        xAxisKey="name"
        showLegend
      />
    </div>
  );
}
