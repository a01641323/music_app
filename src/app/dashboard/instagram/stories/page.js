"use client";

import { useMemo } from "react";
import { Circle, Eye, CheckCircle, MessageCircle } from "lucide-react";
import { useDateRange } from "@/context/date-range-context";
import { getStoriesAnalytics } from "@/services/instagram";
import { MetricCardGrid } from "@/components/metrics/metric-card-grid";
import { AreaChartCard } from "@/components/charts/area-chart-card";
import { LineChartCard } from "@/components/charts/line-chart-card";
import { BarChartCard } from "@/components/charts/bar-chart-card";
import { storyChartConfig } from "@/lib/chart-config";
import {
  formatNumber,
  formatCompact,
  formatPercentage,
} from "@/lib/format";

const impressionsReachConfig = {
  impressions: { label: "Impressions", color: "#833AB4" },
  reach: { label: "Reach", color: "#FCAF45" },
};

const completionRateConfig = {
  completionRate: { label: "Completion Rate", color: "#E1306C" },
};

const interactionsConfig = {
  tapsForward: storyChartConfig.tapsForward,
  tapsBack: storyChartConfig.tapsBack,
  exits: storyChartConfig.exits,
};

const repliesConfig = {
  replies: { label: "Replies", color: "#833AB4" },
};

const dateFormatter = (value) =>
  new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

export default function StoriesPage() {
  const { dateRange } = useDateRange();

  const { stories, summary } = useMemo(
    () => getStoriesAnalytics(dateRange),
    [dateRange]
  );

  const metrics = [
    {
      title: "Total Stories",
      value: formatNumber(summary.totalStories),
      icon: Circle,
    },
    {
      title: "Avg Impressions",
      value: formatCompact(
        summary.totalStories > 0
          ? Math.round(summary.totalImpressions / summary.totalStories)
          : 0
      ),
      icon: Eye,
    },
    {
      title: "Avg Completion Rate",
      value: formatPercentage(summary.avgCompletionRate),
      icon: CheckCircle,
    },
    {
      title: "Total Replies",
      value: formatNumber(summary.totalReplies),
      icon: MessageCircle,
    },
  ];

  // Impressions & Reach: raw stories sorted by date ascending
  const impressionsReachData = useMemo(() => {
    const sorted = [...stories].sort(
      (a, b) => new Date(a.publishedAt) - new Date(b.publishedAt)
    );
    return sorted.map((s) => ({
      date: s.publishedAt.split("T")[0],
      impressions: s.impressions,
      reach: s.reach,
    }));
  }, [stories]);

  // Completion Rate Trend: stories sorted by date ascending
  const completionRateData = useMemo(() => {
    const sorted = [...stories].sort(
      (a, b) => new Date(a.publishedAt) - new Date(b.publishedAt)
    );
    return sorted.map((s) => ({
      date: s.publishedAt.split("T")[0],
      completionRate: s.completionRate,
    }));
  }, [stories]);

  // Average completion rate for reference line
  const avgCompletionRate = summary.avgCompletionRate;

  // Story Interactions: group by month, sum tapsForward, tapsBack, exits
  const interactionsData = useMemo(() => {
    const groups = {};
    for (const story of stories) {
      const month = story.publishedAt.slice(0, 7); // YYYY-MM
      if (!groups[month]) {
        groups[month] = { tapsForward: 0, tapsBack: 0, exits: 0 };
      }
      groups[month].tapsForward += story.tapsForward;
      groups[month].tapsBack += story.tapsBack;
      groups[month].exits += story.exits;
    }

    return Object.entries(groups)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, values]) => {
        const date = new Date(month + "-01");
        const label = date.toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        });
        return {
          month: label,
          tapsForward: values.tapsForward,
          tapsBack: values.tapsBack,
          exits: values.exits,
        };
      });
  }, [stories]);

  // Story Replies: group by month, sum replies
  const repliesData = useMemo(() => {
    const groups = {};
    for (const story of stories) {
      const month = story.publishedAt.slice(0, 7); // YYYY-MM
      if (!groups[month]) {
        groups[month] = 0;
      }
      groups[month] += story.replies;
    }

    return Object.entries(groups)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, replies]) => {
        const date = new Date(month + "-01");
        const label = date.toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        });
        return {
          month: label,
          replies,
        };
      });
  }, [stories]);

  return (
    <div className="space-y-4">
      <MetricCardGrid metrics={metrics} />

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <AreaChartCard
          title="Story Impressions & Reach"
          description="Impressions and reach per story over time"
          data={impressionsReachData}
          chartConfig={impressionsReachConfig}
          dataKeys={["impressions", "reach"]}
          xAxisKey="date"
          xAxisFormatter={dateFormatter}
          gradient
        />
        <LineChartCard
          title="Completion Rate Trend"
          description="Story completion rate over time"
          data={completionRateData}
          chartConfig={completionRateConfig}
          dataKeys={["completionRate"]}
          xAxisKey="date"
          xAxisFormatter={dateFormatter}
          referenceLine={{
            value: avgCompletionRate,
            color: "#FCAF45",
            label: `Avg: ${avgCompletionRate}%`,
          }}
        />
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <BarChartCard
          title="Story Interactions"
          description="Taps forward, taps back, and exits by month"
          data={interactionsData}
          chartConfig={interactionsConfig}
          dataKeys={["tapsForward", "tapsBack", "exits"]}
          xAxisKey="month"
          stacked
          showLegend
        />
        <BarChartCard
          title="Story Replies"
          description="Total replies received per month"
          data={repliesData}
          chartConfig={repliesConfig}
          dataKeys={["replies"]}
          xAxisKey="month"
          showLegend={false}
        />
      </div>
    </div>
  );
}
