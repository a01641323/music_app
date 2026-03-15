"use client";

import { useMemo } from "react";
import { Music, Star, Calendar } from "lucide-react";
import { useDateRange } from "@/context/date-range-context";
import { getSpotifyTracks } from "@/services/spotify";
import { MetricCardGrid } from "@/components/metrics/metric-card-grid";
import { BarChartCard } from "@/components/charts/bar-chart-card";
import { LineChartCard } from "@/components/charts/line-chart-card";
import { formatNumber } from "@/lib/format";

// CSS-safe key from track name (spaces/accents → dashes)
function toCssKey(name) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const TRACK_COLORS = [
  "#1db954",
  "#1ed760",
  "#169c47",
  "#2bdc66",
  "#0e8f3c",
  "#22c957",
  "#30d368",
  "#12a845",
];

const totalsConfig = {
  streams: { label: "Streams", color: "#1db954" },
};

const dateFormatter = (value) =>
  new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" });

export default function SpotifyTracksPage() {
  const { dateRange } = useDateRange();

  const data = useMemo(() => getSpotifyTracks(dateRange), [dateRange]);

  const metrics = [
    {
      title: "Tracks",
      value: String(data.trackNames.length),
      change: null,
      changeLabel: "total catalog",
      icon: Music,
    },
    {
      title: "Top Track",
      value: data.totals[0]?.name ?? "—",
      change: null,
      changeLabel: `${formatNumber(data.totals[0]?.streams ?? 0)} streams`,
      icon: Star,
    },
    {
      title: "Days with Data",
      value: String(data.timeline.length),
      change: null,
      changeLabel: "in selected period",
      icon: Calendar,
    },
  ];

  // Build CSS-safe config and data for multi-line chart
  const timelineConfig = useMemo(() => {
    const cfg = {};
    data.trackNames.forEach((name, i) => {
      cfg[toCssKey(name)] = {
        label: name,
        color: TRACK_COLORS[i % TRACK_COLORS.length],
      };
    });
    return cfg;
  }, [data.trackNames]);

  const timelineData = useMemo(
    () =>
      data.timeline.map((row) => {
        const result = { date: row.date };
        data.trackNames.forEach((name) => {
          result[toCssKey(name)] = row[name] ?? 0;
        });
        return result;
      }),
    [data.timeline, data.trackNames]
  );

  const timelineKeys = useMemo(
    () => data.trackNames.map(toCssKey),
    [data.trackNames]
  );

  return (
    <div className="space-y-4">
      <MetricCardGrid metrics={metrics} />

      <BarChartCard
        title="Streams by Track"
        description="Total streams per track in the selected period"
        data={data.totals}
        chartConfig={totalsConfig}
        dataKeys={["streams"]}
        xAxisKey="name"
        horizontal
        showLegend={false}
      />

      <LineChartCard
        title="Streams Over Time"
        description="Daily streams per track"
        data={timelineData}
        chartConfig={timelineConfig}
        dataKeys={timelineKeys}
        xAxisKey="date"
        xAxisFormatter={dateFormatter}
        showLegend
      />
    </div>
  );
}
