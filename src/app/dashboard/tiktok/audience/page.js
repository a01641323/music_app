"use client";

import { useMemo } from "react";
import { Users, UserPlus, UserMinus, TrendingUp } from "lucide-react";
import { useDateRange } from "@/context/date-range-context";
import { getTikTokMetrics, getTikTokAudience } from "@/services/tiktok";
import { MetricCardGrid } from "@/components/metrics/metric-card-grid";
import { BarChartCard } from "@/components/charts/bar-chart-card";
import { AreaChartCard } from "@/components/charts/area-chart-card";
import { formatNumber } from "@/lib/format";

const countryConfig = {
  percentage: { label: "Audience %", color: "#25f4ee" },
};

const genderAgeConfig = {
  female: { label: "Female", color: "#fe2c55" },
  male: { label: "Male", color: "#25f4ee" },
};

const followerChangeConfig = {
  followers_gained: { label: "Gained", color: "#25f4ee" },
  followers_lost: { label: "Lost", color: "#fe2c55" },
};

const dateFormatter = (value) =>
  new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" });

export default function TikTokAudiencePage() {
  const { dateRange } = useDateRange();

  const data = useMemo(() => getTikTokMetrics(dateRange), [dateRange]);
  const audience = useMemo(() => getTikTokAudience(), []);

  const metrics = [
    {
      title: "Total Followers",
      value: formatNumber(data.summary.currentFollowers),
      change: data.summary.currentFollowersChange,
      changeLabel: "vs prev period",
      icon: Users,
    },
    {
      title: "Followers Gained",
      value: formatNumber(data.summary.followersGained),
      change: data.summary.followersGainedChange,
      changeLabel: "vs prev period",
      icon: UserPlus,
    },
    {
      title: "Followers Lost",
      value: formatNumber(data.summary.followersLost),
      change: data.summary.followersLostChange,
      changeLabel: "vs prev period",
      icon: UserMinus,
    },
    {
      title: "Net Growth",
      value: formatNumber(data.summary.followersGained - data.summary.followersLost),
      change: data.summary.followersGainedChange - (data.summary.followersLostChange || 0),
      changeLabel: "vs prev period",
      icon: TrendingUp,
    },
  ];

  const countryData = audience.audienceCountries.map((c) => ({
    name: c.country,
    percentage: c.percentage,
  }));

  const genderAgeData = audience.audienceGendersAge.map((g) => ({
    ageRange: g.group,
    female: g.female,
    male: g.male,
  }));

  const followerChangeData = data.daily.map((d) => ({
    date: d.date,
    followers_gained: d.followers_gained,
    followers_lost: d.followers_lost,
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
          title="Age & Gender Distribution"
          description="Audience breakdown by age group and gender"
          data={genderAgeData}
          chartConfig={genderAgeConfig}
          dataKeys={["female", "male"]}
          xAxisKey="ageRange"
          stacked
          showLegend
        />
      </div>

      <AreaChartCard
        title="Follower Growth Timeline"
        description="Daily followers gained vs lost"
        data={followerChangeData}
        chartConfig={followerChangeConfig}
        dataKeys={["followers_gained", "followers_lost"]}
        xAxisKey="date"
        xAxisFormatter={dateFormatter}
        showLegend
      />
    </div>
  );
}
