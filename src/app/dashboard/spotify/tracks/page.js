"use client";

import { useMemo } from "react";
import { Music, Headphones, BookmarkPlus, ListMusic } from "lucide-react";
import { useDateRange } from "@/context/date-range-context";
import { getSpotifyTracks } from "@/services/spotify";
import { MetricCardGrid } from "@/components/metrics/metric-card-grid";
import { BarChartCard } from "@/components/charts/bar-chart-card";
import { formatNumber, formatPercentage } from "@/lib/format";

const topStreamsConfig = {
  streams: { label: "Streams", color: "#1db954" },
};

const topSavesConfig = {
  saves: { label: "Saves", color: "#1ed760" },
};

const skipRateConfig = {
  skip_rate: { label: "Skip Rate (%)", color: "#ff6b35" },
};

export default function SpotifyTracksPage() {
  const { dateRange } = useDateRange();

  const data = useMemo(() => getSpotifyTracks(dateRange), [dateRange]);

  const metrics = [
    {
      title: "Tracks Released",
      value: formatNumber(data.summary.totalTracks),
      change: null,
      changeLabel: "in selected period",
      icon: Music,
    },
    {
      title: "Total Streams",
      value: formatNumber(data.summary.totalStreams),
      change: null,
      changeLabel: "in selected period",
      icon: Headphones,
    },
    {
      title: "Total Saves",
      value: formatNumber(data.summary.totalSaves),
      change: null,
      changeLabel: "in selected period",
      icon: BookmarkPlus,
    },
    {
      title: "Playlist Adds",
      value: formatNumber(data.summary.totalPlaylistAdds),
      change: null,
      changeLabel: "in selected period",
      icon: ListMusic,
    },
  ];

  const topByStreams = [...data.tracks]
    .sort((a, b) => b.streams - a.streams)
    .slice(0, 10)
    .map((t) => ({ name: t.title, streams: t.streams }));

  const topBySaves = [...data.tracks]
    .sort((a, b) => b.saves - a.saves)
    .slice(0, 10)
    .map((t) => ({ name: t.title, saves: t.saves }));

  const skipRateData = [...data.tracks]
    .sort((a, b) => a.skip_rate - b.skip_rate)
    .slice(0, 10)
    .map((t) => ({ name: t.title, skip_rate: t.skip_rate }));

  return (
    <div className="space-y-4">
      <MetricCardGrid metrics={metrics} />

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <BarChartCard
          title="Top Tracks by Streams"
          description="Most streamed tracks in the selected period"
          data={topByStreams}
          chartConfig={topStreamsConfig}
          dataKeys={["streams"]}
          xAxisKey="name"
          horizontal
          showLegend={false}
        />
        <BarChartCard
          title="Top Tracks by Saves"
          description="Most saved tracks in the selected period"
          data={topBySaves}
          chartConfig={topSavesConfig}
          dataKeys={["saves"]}
          xAxisKey="name"
          horizontal
          showLegend={false}
        />
      </div>

      <BarChartCard
        title="Skip Rate by Track"
        description="Lowest skip rate tracks (best retention)"
        data={skipRateData}
        chartConfig={skipRateConfig}
        dataKeys={["skip_rate"]}
        xAxisKey="name"
        showLegend={false}
      />
    </div>
  );
}
