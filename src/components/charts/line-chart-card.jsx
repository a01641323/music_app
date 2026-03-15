"use client";

import { Line, LineChart, CartesianGrid, XAxis, YAxis, ReferenceLine } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";

export function LineChartCard({
  title,
  description,
  data,
  chartConfig,
  dataKeys,
  xAxisKey = "date",
  height = "min-h-[300px]",
  referenceLine,
  xAxisFormatter,
  showLegend = false,
}) {
  return (
    <Card className="glass glass-glow">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className={height}>
          <LineChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
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
            <ChartTooltip
              content={<ChartTooltipContent indicator="line" />}
            />
            {referenceLine && (
              <ReferenceLine
                y={referenceLine.value}
                stroke={referenceLine.color || "hsl(var(--muted-foreground))"}
                strokeDasharray="3 3"
                label={referenceLine.label}
              />
            )}
            {showLegend && (
              <ChartLegend content={<ChartLegendContent />} />
            )}
            {dataKeys.map((key) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={`var(--color-${key})`}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            ))}
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
