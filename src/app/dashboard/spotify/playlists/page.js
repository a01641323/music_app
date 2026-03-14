"use client";

import { useMemo } from "react";
import { ListMusic, Music, BookmarkPlus, Headphones } from "lucide-react";
import { useDateRange } from "@/context/date-range-context";
import { getSpotifyMetrics, getSpotifyPlaylists } from "@/services/spotify";
import { MetricCardGrid } from "@/components/metrics/metric-card-grid";
import { BarChartCard } from "@/components/charts/bar-chart-card";
import { formatNumber } from "@/lib/format";

const playlistStreamsConfig = {
  streams: { label: "Streams", color: "#1db954" },
};

const playlistFollowersConfig = {
  followers: { label: "Playlist Followers", color: "#1ed760" },
};

const playlistAddsConfig = {
  playlist_adds: { label: "Playlist Adds", color: "#1db954" },
  saves: { label: "Saves", color: "#1ed760" },
};

export default function SpotifyPlaylistsPage() {
  const { dateRange } = useDateRange();

  const data = useMemo(() => getSpotifyMetrics(dateRange), [dateRange]);
  const { playlistsData } = useMemo(() => getSpotifyPlaylists(), []);

  const metrics = [
    {
      title: "Playlist Placements",
      value: formatNumber(playlistsData.length),
      change: null,
      changeLabel: "active placements",
      icon: ListMusic,
    },
    {
      title: "Total Playlist Adds",
      value: formatNumber(data.summary.totalPlaylistAdds),
      change: data.summary.totalPlaylistAddsChange,
      changeLabel: "vs prev period",
      icon: Music,
    },
    {
      title: "Total Saves",
      value: formatNumber(data.summary.totalSaves),
      change: data.summary.totalSavesChange,
      changeLabel: "vs prev period",
      icon: BookmarkPlus,
    },
    {
      title: "Total Streams",
      value: formatNumber(data.summary.totalStreams),
      change: data.summary.totalStreamsChange,
      changeLabel: "vs prev period",
      icon: Headphones,
    },
  ];

  const topByStreams = [...playlistsData]
    .sort((a, b) => b.streams - a.streams)
    .slice(0, 10)
    .map((p) => ({ name: p.playlist_name, streams: p.streams }));

  const topByFollowers = [...playlistsData]
    .sort((a, b) => b.followers - a.followers)
    .slice(0, 10)
    .map((p) => ({ name: p.playlist_name, followers: p.followers }));

  const savesAddsData = [...playlistsData]
    .sort((a, b) => b.saves + b.playlist_adds - (a.saves + a.playlist_adds))
    .slice(0, 8)
    .map((p) => ({
      name: p.playlist_name,
      saves: p.saves,
      playlist_adds: p.playlist_adds,
    }));

  return (
    <div className="space-y-4">
      <MetricCardGrid metrics={metrics} />

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <BarChartCard
          title="Streams by Playlist"
          description="Streams generated from each playlist placement"
          data={topByStreams}
          chartConfig={playlistStreamsConfig}
          dataKeys={["streams"]}
          xAxisKey="name"
          horizontal
          showLegend={false}
        />
        <BarChartCard
          title="Playlist Size"
          description="Number of followers for each playlist"
          data={topByFollowers}
          chartConfig={playlistFollowersConfig}
          dataKeys={["followers"]}
          xAxisKey="name"
          horizontal
          showLegend={false}
        />
      </div>

      <BarChartCard
        title="Saves & Adds by Playlist"
        description="Saves and playlist adds per placement"
        data={savesAddsData}
        chartConfig={playlistAddsConfig}
        dataKeys={["saves", "playlist_adds"]}
        xAxisKey="name"
        stacked
        showLegend
      />
    </div>
  );
}
