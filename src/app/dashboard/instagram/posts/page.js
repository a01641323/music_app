"use client";

import { useMemo } from "react";
import { Image, Heart, Eye, Bookmark } from "lucide-react";
import { useDateRange } from "@/context/date-range-context";
import { getPostsAnalytics } from "@/services/instagram";
import { MetricCardGrid } from "@/components/metrics/metric-card-grid";
import { AreaChartCard } from "@/components/charts/area-chart-card";
import { PieChartCard } from "@/components/charts/pie-chart-card";
import { HeatmapChart } from "@/components/charts/heatmap-chart";
import { BarChartCard } from "@/components/charts/bar-chart-card";
import { contentTypeChartConfig } from "@/lib/chart-config";
import { formatNumber, formatPercentage } from "@/lib/format";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const engagementRateConfig = {
  engagementRate: { label: "Engagement Rate", color: "#833AB4" },
};

const postFrequencyConfig = {
  count: { label: "Posts", color: "#E1306C" },
};

const dateFormatter = (value) => {
  const d = new Date(value);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

export default function PostsPage() {
  const { dateRange } = useDateRange();

  const postsAnalytics = useMemo(
    () => getPostsAnalytics(dateRange),
    [dateRange]
  );

  const metrics = [
    {
      title: "Total Posts",
      value: formatNumber(postsAnalytics.summary.totalPosts),
      icon: Image,
    },
    {
      title: "Avg Engagement Rate",
      value: formatPercentage(postsAnalytics.summary.avgEngagementRate),
      icon: Heart,
    },
    {
      title: "Total Reach",
      value: formatNumber(postsAnalytics.summary.totalReach),
      icon: Eye,
    },
    {
      title: "Total Saves",
      value: formatNumber(postsAnalytics.summary.totalSaves),
      icon: Bookmark,
    },
  ];

  const engagementRateData = useMemo(() => {
    const sorted = [...postsAnalytics.posts].sort(
      (a, b) => new Date(a.publishedAt) - new Date(b.publishedAt)
    );
    return sorted.map((post) => ({
      date: post.publishedAt.split("T")[0],
      engagementRate: post.engagementRate,
    }));
  }, [postsAnalytics.posts]);

  const contentBreakdownData = useMemo(() => {
    return postsAnalytics.contentBreakdown.map((item) => ({
      name: item.type,
      value: item.count,
    }));
  }, [postsAnalytics.contentBreakdown]);

  const heatmapData = useMemo(() => {
    // 7 rows (Mon=0 to Sun=6) x 24 cols (hours)
    const counts = Array.from({ length: 7 }, () => Array(24).fill(0));
    const totals = Array.from({ length: 7 }, () => Array(24).fill(0));

    for (const post of postsAnalytics.posts) {
      const d = new Date(post.publishedAt);
      // getDay() returns 0=Sun, convert to 0=Mon
      const jsDay = d.getDay();
      const dayIndex = jsDay === 0 ? 6 : jsDay - 1;
      const hour = d.getHours();
      counts[dayIndex][hour] += 1;
      totals[dayIndex][hour] += post.engagementRate;
    }

    return counts.map((row, dayIndex) =>
      row.map((count, hour) =>
        count > 0
          ? Math.round((totals[dayIndex][hour] / count) * 100) / 100
          : 0
      )
    );
  }, [postsAnalytics.posts]);

  const postFrequencyData = useMemo(() => {
    const weekMap = {};
    for (const post of postsAnalytics.posts) {
      const d = new Date(post.publishedAt);
      // Get the Monday of the week
      const day = d.getDay();
      const diff = d.getDate() - day + (day === 0 ? -6 : 1);
      const monday = new Date(d);
      monday.setDate(diff);
      const weekKey = monday.toISOString().split("T")[0];
      weekMap[weekKey] = (weekMap[weekKey] || 0) + 1;
    }
    return Object.entries(weekMap)
      .map(([week, count]) => ({ week, count }))
      .sort((a, b) => a.week.localeCompare(b.week));
  }, [postsAnalytics.posts]);

  const topPosts = useMemo(() => {
    return [...postsAnalytics.posts]
      .sort((a, b) => b.engagementRate - a.engagementRate)
      .slice(0, 20);
  }, [postsAnalytics.posts]);

  const weekFormatter = (value) => {
    const d = new Date(value);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div className="space-y-4">
      <MetricCardGrid metrics={metrics} />

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <AreaChartCard
          title="Engagement Rate Over Time"
          description="Engagement rate per post over time"
          data={engagementRateData}
          chartConfig={engagementRateConfig}
          dataKeys={["engagementRate"]}
          xAxisKey="date"
          xAxisFormatter={dateFormatter}
        />
        <PieChartCard
          title="Content Type Breakdown"
          description="Distribution of post types"
          data={contentBreakdownData}
          chartConfig={contentTypeChartConfig}
          dataKey="value"
          nameKey="name"
        />
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <HeatmapChart
          title="Best Posting Times"
          description="Average engagement rate by day and hour"
          data={heatmapData}
          valueLabel="Avg Engagement Rate"
        />
        <BarChartCard
          title="Post Frequency"
          description="Number of posts per week"
          data={postFrequencyData}
          chartConfig={postFrequencyConfig}
          dataKeys={["count"]}
          xAxisKey="week"
          showLegend={false}
          xAxisFormatter={weekFormatter}
        />
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Top Posts by Engagement</CardTitle>
          <CardDescription>
            Top 20 posts sorted by engagement rate
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Likes</TableHead>
                  <TableHead className="text-right">Comments</TableHead>
                  <TableHead className="text-right">Saves</TableHead>
                  <TableHead className="text-right">Shares</TableHead>
                  <TableHead className="text-right">Reach</TableHead>
                  <TableHead className="text-right">Engagement Rate</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topPosts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {post.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(post.publishedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatNumber(post.likes)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatNumber(post.comments)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatNumber(post.saves)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatNumber(post.shares)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatNumber(post.reach)}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatPercentage(post.engagementRate)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
