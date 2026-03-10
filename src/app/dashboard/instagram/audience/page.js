"use client";

import { useMemo } from "react";
import { Users, UserPlus, TrendingUp } from "lucide-react";
import { useDateRange } from "@/context/date-range-context";
import { getAccountMetrics, getAudienceData } from "@/services/instagram";
import { MetricCardGrid } from "@/components/metrics/metric-card-grid";
import { BarChartCard } from "@/components/charts/bar-chart-card";
import { AreaChartCard } from "@/components/charts/area-chart-card";
import { HeatmapChart } from "@/components/charts/heatmap-chart";
import { formatNumber } from "@/lib/format";

const ageGenderConfig = {
  male: { label: "Male", color: "#405DE6" },
  female: { label: "Female", color: "#E1306C" },
  other: { label: "Other", color: "#FCAF45" },
};

const countryConfig = {
  followers: { label: "Followers", color: "#833AB4" },
};

const cityConfig = {
  followers: { label: "Followers", color: "#E1306C" },
};

const followerChangeConfig = {
  followersGained: { label: "Gained", color: "#833AB4" },
  followersLost: { label: "Lost", color: "#E1306C" },
};

export default function AudiencePage() {
  const { dateRange } = useDateRange();

  const accountData = useMemo(
    () => getAccountMetrics(dateRange),
    [dateRange]
  );

  const audienceData = useMemo(() => getAudienceData(), []);

  const metrics = [
    {
      title: "Total Followers",
      value: formatNumber(accountData.summary.currentFollowers),
      change: accountData.summary.followersGainedChange,
      changeLabel: "vs prev period",
      icon: Users,
    },
    {
      title: "New Followers",
      value: formatNumber(accountData.summary.followersGained),
      change: accountData.summary.followersGainedChange,
      changeLabel: "vs prev period",
      icon: UserPlus,
    },
    {
      title: "Net Growth",
      value: formatNumber(
        accountData.summary.followersGained - accountData.summary.followersLost
      ),
      change:
        accountData.summary.followersGainedChange -
        (accountData.summary.followersLostChange || 0),
      changeLabel: "vs prev period",
      icon: TrendingUp,
    },
  ];

  const ageGenderData = audienceData.audienceAgeGender.map((d) => ({
    ageRange: d.ageRange,
    male: d.male,
    female: d.female,
    other: d.other,
  }));

  const countryData = audienceData.topCountries.slice(0, 10).map((c) => ({
    name: c.country,
    followers: c.followers,
  }));

  const cityData = audienceData.topCities.slice(0, 10).map((c) => ({
    name: c.city,
    followers: c.followers,
  }));

  const dateFormatter = (value) =>
    new Date(value).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

  return (
    <div className="space-y-4">
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-3">
        {metrics.map((metric, i) => (
          <div key={i}>
            <MetricCardGrid metrics={[metric]} />
          </div>
        ))}
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <BarChartCard
          title="Age & Gender Distribution"
          description="Follower demographics by age range"
          data={ageGenderData}
          chartConfig={ageGenderConfig}
          dataKeys={["male", "female", "other"]}
          xAxisKey="ageRange"
          stacked
          showLegend
        />
        <BarChartCard
          title="Top Countries"
          description="Followers by country"
          data={countryData}
          chartConfig={countryConfig}
          dataKeys={["followers"]}
          xAxisKey="name"
          horizontal
          showLegend={false}
        />
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <BarChartCard
          title="Top Cities"
          description="Followers by city"
          data={cityData}
          chartConfig={cityConfig}
          dataKeys={["followers"]}
          xAxisKey="name"
          horizontal
          showLegend={false}
        />
        <HeatmapChart
          title="Active Hours"
          description="When your followers are most active"
          data={audienceData.activeHours}
          valueLabel="Activity"
        />
      </div>

      <AreaChartCard
        title="Follower Growth Timeline"
        description="Daily followers gained vs lost"
        data={accountData.daily.map((d) => ({
          date: d.date,
          followersGained: d.followersGained,
          followersLost: d.followersLost,
        }))}
        chartConfig={followerChangeConfig}
        dataKeys={["followersGained", "followersLost"]}
        xAxisKey="date"
        xAxisFormatter={dateFormatter}
      />
    </div>
  );
}
