"use client";

import { useMemo } from "react";
import { Users, UserPlus, UserMinus, TrendingUp } from "lucide-react";
import { useDateRange } from "@/context/date-range-context";
import { getSpotifyMetrics, getSpotifyAudience } from "@/services/spotify";
import { MetricCardGrid } from "@/components/metrics/metric-card-grid";
import { BarChartCard } from "@/components/charts/bar-chart-card";
import { AreaChartCard } from "@/components/charts/area-chart-card";
import { formatNumber } from "@/lib/format";

const countryConfig = {
  percentage: { label: "Listeners %", color: "#1db954" },
};

const cityConfig = {
  listeners: { label: "Listeners", color: "#1ed760" },
};

const genderAgeConfig = {
  female: { label: "Female", color: "#1db954" },
  male: { label: "Male", color: "#1ed760" },
};

const followerChangeConfig = {
  followers_gained: { label: "Gained", color: "#1db954" },
  followers_lost: { label: "Lost", color: "#ff6b35" },
};

const dateFormatter = (value) =>
  new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" });

export default function SpotifyAudiencePage() {
  const { dateRange } = useDateRange();

  const data = useMemo(() => getSpotifyMetrics(dateRange), [dateRange]);
  const audience = useMemo(() => getSpotifyAudience(), []);

  const metrics = [
    {
      title: "Followers",
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

  const countryData = audience.listenerCountries.map((c) => ({
    name: c.country,
    percentage: c.percentage,
  }));

  const cityData = audience.listenerCities.slice(0, 8).map((c) => ({
    name: c.city,
    listeners: c.listeners,
  }));

  const genderAgeData = audience.audienceAgeGender.map((g) => ({
    ageRange: g.ageRange,
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
          title="Listeners by Country"
          description="Percentage of listeners per country"
          data={countryData}
          chartConfig={countryConfig}
          dataKeys={["percentage"]}
          xAxisKey="name"
          horizontal
          showLegend={false}
        />
        <BarChartCard
          title="Age & Gender Distribution"
          description="Listener breakdown by age group and gender"
          data={genderAgeData}
          chartConfig={genderAgeConfig}
          dataKeys={["female", "male"]}
          xAxisKey="ageRange"
          stacked
          showLegend
        />
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <BarChartCard
          title="Top Cities"
          description="Listeners by city"
          data={cityData}
          chartConfig={cityConfig}
          dataKeys={["listeners"]}
          xAxisKey="name"
          horizontal
          showLegend={false}
        />
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
    </div>
  );
}
