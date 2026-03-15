"use client";

import { useMemo } from "react";
import { Eye } from "lucide-react";
import { useDateRange } from "@/context/date-range-context";
import { getTikTokMetrics, getTikTokAudience } from "@/services/tiktok";
import { MetricCardGrid } from "@/components/metrics/metric-card-grid";
import { BarChartCard } from "@/components/charts/bar-chart-card";
import { formatNumber } from "@/lib/format";

const countryConfig = {
  percentage: { label: "Audience %", color: "#25f4ee" },
};

const genderConfig = {
  percentage: { label: "Percentage", color: "#fe2c55" },
};

const activeHoursConfig = {
  activeFollowers: { label: "Active Followers", color: "#25f4ee" },
};

const hourFormatter = (h) => {
  const period = h >= 12 ? "PM" : "AM";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}${period}`;
};

export default function TikTokAudiencePage() {
  const { dateRange } = useDateRange();

  const data = useMemo(() => getTikTokMetrics(dateRange), [dateRange]);
  const audience = useMemo(() => getTikTokAudience(), []);

  const metrics = [
    {
      title: "New Viewers",
      value: formatNumber(data.summary.totalViewersNew),
      change: data.summary.totalViewersNewChange,
      changeLabel: "vs prev period",
      icon: Eye,
    },
  ];

  const countryData = audience.audienceCountries.map((c) => ({
    name: c.country,
    percentage: c.percentage,
  }));

  const genderData = audience.audienceGender.map((g) => ({
    name: g.gender,
    percentage: g.percentage,
  }));

  const activeHoursData = audience.audienceActivity.map((h) => ({
    hour: h.hour,
    activeFollowers: h.activeFollowers,
  }));

  return (
    <div className="space-y-4">
      <MetricCardGrid metrics={metrics} />

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <BarChartCard
          title="Audience by Country"
          description="Percentage of audience per country"
          data={countryData}
          chartConfig={countryConfig}
          dataKeys={["percentage"]}
          xAxisKey="name"
          horizontal
          showLegend={false}
        />
        <BarChartCard
          title="Gender Distribution"
          description="Audience breakdown by gender"
          data={genderData}
          chartConfig={genderConfig}
          dataKeys={["percentage"]}
          xAxisKey="name"
          showLegend={false}
        />
      </div>

      <BarChartCard
        title="Active Hours"
        description="Follower activity throughout the day (24-hour average)"
        data={activeHoursData}
        chartConfig={activeHoursConfig}
        dataKeys={["activeFollowers"]}
        xAxisKey="hour"
        xAxisFormatter={hourFormatter}
        showLegend={false}
      />
    </div>
  );
}
