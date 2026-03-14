"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";

export function BarChartCard({
  title,
  description,
  data,
  chartConfig,
  dataKeys,
  xAxisKey = "name",
  height = "min-h-[300px]",
  stacked = false,
  horizontal = false,
  showLegend = true,
  xAxisFormatter,
  barRadius = [4, 4, 0, 0],
}) {
  const ChartComponent = horizontal ? (
    <BarChart
      data={data}
      layout="vertical"
      margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
    >
      <CartesianGrid horizontal={false} strokeDasharray="3 3" />
      <YAxis
        dataKey={xAxisKey}
        type="category"
        tickLine={false}
        axisLine={false}
        tickMargin={8}
        width={80}
      />
      <XAxis type="number" tickLine={false} axisLine={false} />
      <ChartTooltip content={<ChartTooltipContent />} />
      {showLegend && (
        <ChartLegend content={<ChartLegendContent />} />
      )}
      {dataKeys.map((key) => (
        <Bar
          key={key}
          dataKey={key}
          stackId={stacked ? "a" : undefined}
          fill={`var(--color-${key})`}
          radius={barRadius}
        />
      ))}
    </BarChart>
  ) : (
    <BarChart
      data={data}
      margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
    >
      <CartesianGrid vertical={false} strokeDasharray="3 3" />
      <XAxis
        dataKey={xAxisKey}
        tickLine={false}
        axisLine={false}
        tickMargin={8}
        tickFormatter={xAxisFormatter}
      />
      <YAxis tickLine={false} axisLine={false} tickMargin={8} />
      <ChartTooltip content={<ChartTooltipContent />} />
      {showLegend && (
        <ChartLegend content={<ChartLegendContent />} />
      )}
      {dataKeys.map((key) => (
        <Bar
          key={key}
          dataKey={key}
          stackId={stacked ? "a" : undefined}
          fill={`var(--color-${key})`}
          radius={barRadius}
        />
      ))}
    </BarChart>
  );

  return (
    <Card className="glass glass-glow">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className={height}>
          {ChartComponent}
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
