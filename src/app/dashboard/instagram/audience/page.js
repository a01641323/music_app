"use client";

import { useMemo } from "react";
import { Heart } from "lucide-react";
import { useDateRange } from "@/context/date-range-context";
import { getAccountMetrics, getAudienceData } from "@/services/instagram";
import { MetricCardGrid } from "@/components/metrics/metric-card-grid";
import { BarChartCard } from "@/components/charts/bar-chart-card";
import { formatNumber } from "@/lib/format";

const ageGenderConfig = {
  male: { label: "Male", color: "#405DE6" },
  female: { label: "Female", color: "#E1306C" },
};

const countryConfig = {
  percentage: { label: "Audience %", color: "#833AB4" },
};

const cityConfig = {
  percentage: { label: "Audience %", color: "#E1306C" },
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
      title: "Accounts Engaged",
      value: formatNumber(accountData.summary.totalAccountsEngaged),
      change: accountData.summary.totalAccountsEngagedChange,
      changeLabel: "vs prev period",
      icon: Heart,
    },
  ];

  const ageGenderData = audienceData.audienceAgeGender.map((d) => ({
    ageRange: d.ageRange,
    male: d.male,
    female: d.female,
  }));

  const countryData = audienceData.topCountries.slice(0, 10).map((c) => ({
    name: c.country,
    percentage: c.percentage,
  }));

  const cityData = audienceData.topCities.slice(0, 10).map((c) => ({
    name: c.city,
    percentage: c.percentage,
  }));

  return (
    <div className="space-y-4">
      <MetricCardGrid metrics={metrics} />

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <BarChartCard
          title="Age & Gender Distribution"
          description="Follower demographics by age range"
          data={ageGenderData}
          chartConfig={ageGenderConfig}
          dataKeys={["male", "female"]}
          xAxisKey="ageRange"
          stacked
          showLegend
        />
        <BarChartCard
          title="Top Countries"
          description="Audience percentage by country"
          data={countryData}
          chartConfig={countryConfig}
          dataKeys={["percentage"]}
          xAxisKey="name"
          horizontal
          showLegend={false}
        />
      </div>

      <BarChartCard
        title="Top Cities"
        description="Audience percentage by city"
        data={cityData}
        chartConfig={cityConfig}
        dataKeys={["percentage"]}
        xAxisKey="name"
        horizontal
        showLegend={false}
      />
    </div>
  );
}
