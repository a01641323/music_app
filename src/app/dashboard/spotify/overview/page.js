"use client";

import { useMemo } from "react";
import { Users, Headphones, Music, BookmarkPlus } from "lucide-react";
import { useDateRange } from "@/context/date-range-context";
import { getSpotifyMetrics } from "@/services/spotify";
import { MetricCardGrid } from "@/components/metrics/metric-card-grid";
import { AreaChartCard } from "@/components/charts/area-chart-card";
import { LineChartCard } from "@/components/charts/line-chart-card";
import { formatNumber } from "@/lib/format";

const listenersConfig = {
  monthly_listeners: { label: "Monthly Listeners", color: "#1db954" },
};

const streamsConfig = {
  streams: { label: "Streams", color: "#1db954" },
};

const savesPlaylistConfig = {
  saves: { label: "Saves", color: "#1db954" },
  playlist_adds: { label: "Playlist Adds", color: "#1ed760" },
};

const activeVsSuperConfig = {
  monthly_active_listeners: { label: "Active Listeners", color: "#1db954" },
  super_listeners: { label: "Super Listeners", color: "#1ed760" },
};

const dateFormatter = (value) =>
  new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" });

export default function SpotifyOverviewPage() {
  const { dateRange } = useDateRange();

  const data = useMemo(() => getSpotifyMetrics(dateRange), [dateRange]);

  const metrics = [
    {
      title: "Followers",
      value: formatNumber(data.summary.currentFollowers),
      change: data.summary.currentFollowersChange,
      changeLabel: "vs prev period",
      icon: Users,
    },
    {
      title: "Monthly Listeners",
      value: formatNumber(data.summary.currentMonthlyListeners),
      change: data.summary.currentMonthlyListenersChange,
      changeLabel: "vs prev period",
      icon: Headphones,
    },
    {
      title: "Total Streams",
      value: formatNumber(data.summary.totalStreams),
      change: data.summary.totalStreamsChange,
      changeLabel: "vs prev period",
      icon: Music,
    },
    {
      title: "Saves",
      value: formatNumber(data.summary.totalSaves),
      change: data.summary.totalSavesChange,
      changeLabel: "vs prev period",
      icon: BookmarkPlus,
    },
  ];

  const listenersData = data.daily.map((d) => ({
    date: d.date,
    monthly_listeners: d.monthly_listeners,
  }));

  const streamsData = data.daily.map((d) => ({
    date: d.date,
    streams: d.streams,
  }));

  const savesPlaylistData = data.daily.map((d) => ({
    date: d.date,
    saves: d.saves,
    playlist_adds: d.playlist_adds,
  }));

  const activeVsSuperData = data.daily.map((d) => ({
    date: d.date,
    monthly_active_listeners: d.monthly_active_listeners,
    super_listeners: d.super_listeners,
  }));

  return (
    <div className="space-y-4">
      <MetricCardGrid metrics={metrics} />

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <AreaChartCard
          title="Monthly Listeners"
          description="Monthly listener count over time"
          data={listenersData}
          chartConfig={listenersConfig}
          dataKeys={["monthly_listeners"]}
          xAxisKey="date"
          xAxisFormatter={dateFormatter}
        />
        <AreaChartCard
          title="Daily Streams"
          description="Total streams per day"
          data={streamsData}
          chartConfig={streamsConfig}
          dataKeys={["streams"]}
          xAxisKey="date"
          xAxisFormatter={dateFormatter}
        />
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <LineChartCard
          title="Saves & Playlist Adds"
          description="Daily saves and playlist additions"
          data={savesPlaylistData}
          chartConfig={savesPlaylistConfig}
          dataKeys={["saves", "playlist_adds"]}
          xAxisKey="date"
          xAxisFormatter={dateFormatter}
        />
        <LineChartCard
          title="Active vs Super Listeners"
          description="Monthly active listeners and super listeners over time"
          data={activeVsSuperData}
          chartConfig={activeVsSuperConfig}
          dataKeys={["monthly_active_listeners", "super_listeners"]}
          xAxisKey="date"
          xAxisFormatter={dateFormatter}
        />
      </div>
    </div>
  );
}
