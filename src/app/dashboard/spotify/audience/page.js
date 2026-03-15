"use client";

import { useMemo } from "react";
import { Radio, Star } from "lucide-react";
import { useDateRange } from "@/context/date-range-context";
import { getSpotifyMetrics } from "@/services/spotify";
import { MetricCardGrid } from "@/components/metrics/metric-card-grid";
import { LineChartCard } from "@/components/charts/line-chart-card";
import { formatNumber } from "@/lib/format";

const activeVsSuperConfig = {
  monthly_active_listeners: { label: "Active Listeners", color: "#1db954" },
  super_listeners: { label: "Super Listeners", color: "#1ed760" },
};

const dateFormatter = (value) =>
  new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" });

export default function SpotifyAudiencePage() {
  const { dateRange } = useDateRange();

  const data = useMemo(() => getSpotifyMetrics(dateRange), [dateRange]);

  const metrics = [
    {
      title: "Active Listeners",
      value: formatNumber(data.summary.currentMonthlyActive),
      change: data.summary.currentMonthlyActiveChange,
      changeLabel: "vs prev period",
      icon: Radio,
    },
    {
      title: "Super Listeners",
      value: formatNumber(data.summary.currentSuperListeners),
      change: data.summary.currentSuperListenersChange,
      changeLabel: "vs prev period",
      icon: Star,
    },
  ];

  const activeVsSuperData = data.daily.map((d) => ({
    date: d.date,
    monthly_active_listeners: d.monthly_active_listeners,
    super_listeners: d.super_listeners,
  }));

  return (
    <div className="space-y-4">
      <MetricCardGrid metrics={metrics} />

      <LineChartCard
        title="Active vs Super Listeners"
        description="Monthly active listeners and super listeners over time"
        data={activeVsSuperData}
        chartConfig={activeVsSuperConfig}
        dataKeys={["monthly_active_listeners", "super_listeners"]}
        xAxisKey="date"
        xAxisFormatter={dateFormatter}
        showLegend
      />
    </div>
  );
}
