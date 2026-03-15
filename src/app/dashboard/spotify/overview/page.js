"use client";

import { useMemo } from "react";
import { Headphones, Music, BookmarkPlus, UserPlus } from "lucide-react";
import { useDateRange } from "@/context/date-range-context";
import { getSpotifyMetrics } from "@/services/spotify";
import { MetricCardGrid } from "@/components/metrics/metric-card-grid";
import { AreaChartCard } from "@/components/charts/area-chart-card";
import { BarChartCard } from "@/components/charts/bar-chart-card";
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

const followersGainedConfig = {
  followers_gained: { label: "Followers Gained", color: "#1db954" },
};

const dateFormatter = (value) =>
  new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" });

export default function SpotifyOverviewPage() {
  const { dateRange } = useDateRange();

  const data = useMemo(() => getSpotifyMetrics(dateRange), [dateRange]);

  const metrics = [
    {
      title: "Followers Gained",
      value: formatNumber(data.summary.totalFollowersGained),
      change: data.summary.totalFollowersGainedChange,
      changeLabel: "vs prev period",
      icon: UserPlus,
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

  const followersGainedData = data.daily.map((d) => ({
    date: d.date,
    followers_gained: d.followers_gained,
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
        <BarChartCard
          title="Daily Followers Gained"
          description="Net new followers per day"
          data={followersGainedData}
          chartConfig={followersGainedConfig}
          dataKeys={["followers_gained"]}
          xAxisKey="date"
          xAxisFormatter={dateFormatter}
          showLegend={false}
        />
      </div>
    </div>
  );
}
