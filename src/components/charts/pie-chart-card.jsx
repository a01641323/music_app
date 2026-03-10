"use client";

import { Pie, PieChart, Cell } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";

export function PieChartCard({
  title,
  description,
  data,
  chartConfig,
  dataKey = "value",
  nameKey = "name",
  height = "min-h-[300px]",
  innerRadius = 60,
  outerRadius = 100,
}) {
  const colors = Object.values(chartConfig).map((c) => c.color);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className={height}>
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent nameKey={nameKey} />} />
            <Pie
              data={data}
              dataKey={dataKey}
              nameKey={nameKey}
              cx="50%"
              cy="50%"
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              paddingAngle={2}
              strokeWidth={0}
            >
              {data.map((entry, index) => (
                <Cell
                  key={entry[nameKey]}
                  fill={colors[index % colors.length]}
                />
              ))}
            </Pie>
            <ChartLegend content={<ChartLegendContent nameKey={nameKey} />} />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
