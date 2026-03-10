"use client";

import { useMemo } from "react";
import { Film, Play, Clock, Heart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDateRange } from "@/context/date-range-context";
import { getReelsAnalytics } from "@/services/instagram";
import { MetricCardGrid } from "@/components/metrics/metric-card-grid";
import { AreaChartCard } from "@/components/charts/area-chart-card";
import { BarChartCard } from "@/components/charts/bar-chart-card";
import {
  formatNumber,
  formatCompact,
  formatPercentage,
  formatDuration,
} from "@/lib/format";

const viewsChartConfig = {
  plays: { label: "Views", color: "#833AB4" },
};

const engagementBreakdownConfig = {
  likes: { label: "Likes", color: "#E1306C" },
  saves: { label: "Saves", color: "#FCAF45" },
  shares: { label: "Shares", color: "#F77737" },
};

const dateFormatter = (value) =>
  new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

export default function ReelsPage() {
  const { dateRange } = useDateRange();

  const { reels, summary } = useMemo(
    () => getReelsAnalytics(dateRange),
    [dateRange]
  );

  const metrics = [
    {
      title: "Total Reels",
      value: formatNumber(summary.totalReels),
      icon: Film,
    },
    {
      title: "Total Views",
      value: formatCompact(summary.totalPlays),
      icon: Play,
    },
    {
      title: "Avg Watch Time",
      value: formatDuration(summary.avgWatchTime),
      icon: Clock,
    },
    {
      title: "Avg Engagement Rate",
      value: formatPercentage(summary.avgEngagementRate),
      icon: Heart,
    },
  ];

  // Views Over Time: sort reels by publishedAt, each reel as a data point
  const viewsOverTimeData = useMemo(() => {
    const sorted = [...reels].sort(
      (a, b) => new Date(a.publishedAt) - new Date(b.publishedAt)
    );
    return sorted.map((reel) => ({
      date: reel.publishedAt.split("T")[0],
      plays: reel.plays,
    }));
  }, [reels]);

  // Engagement Breakdown: top 10 reels by date (most recent first)
  const engagementData = useMemo(() => {
    const sorted = [...reels].sort(
      (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)
    );
    return sorted.slice(0, 10).map((reel) => ({
      date: reel.publishedAt.split("T")[0],
      likes: reel.likes,
      saves: reel.saves,
      shares: reel.shares,
    }));
  }, [reels]);

  // Top 9 reels sorted by plays descending
  const topReels = useMemo(() => {
    return [...reels].sort((a, b) => b.plays - a.plays).slice(0, 9);
  }, [reels]);

  return (
    <div className="space-y-4">
      <MetricCardGrid metrics={metrics} />

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <AreaChartCard
          title="Reel Views Over Time"
          description="Total plays per reel by publish date"
          data={viewsOverTimeData}
          chartConfig={viewsChartConfig}
          dataKeys={["plays"]}
          xAxisKey="date"
          xAxisFormatter={dateFormatter}
          gradient
        />
        <BarChartCard
          title="Engagement Breakdown"
          description="Likes, saves, and shares per reel (latest 10)"
          data={engagementData}
          chartConfig={engagementBreakdownConfig}
          dataKeys={["likes", "saves", "shares"]}
          xAxisKey="date"
          stacked
          showLegend
          xAxisFormatter={dateFormatter}
        />
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-3">Top Reels</h2>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {topReels.map((reel) => (
            <Card key={reel.id}>
              <div className="bg-gradient-to-br from-purple-900 to-pink-900 h-40 rounded-t-lg" />
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium leading-snug">
                  {reel.caption.length > 60
                    ? reel.caption.slice(0, 60) + "..."
                    : reel.caption}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-2 text-center text-sm">
                  <div>
                    <p className="text-muted-foreground">Plays</p>
                    <p className="font-semibold">{formatCompact(reel.plays)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Likes</p>
                    <p className="font-semibold">{formatCompact(reel.likes)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Comments</p>
                    <p className="font-semibold">
                      {formatCompact(reel.comments)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
