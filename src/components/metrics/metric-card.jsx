"use client";

import { useMemo } from "react";
import CountUp from "react-countup";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TrendIndicator } from "./trend-indicator";

function parseValue(value) {
  if (typeof value !== "string") return { num: 0, suffix: "", decimals: 0 };
  const cleaned = value.replace(/,/g, "");
  const match = cleaned.match(/^([\d.]+)(.*)$/);
  if (!match) return { num: 0, suffix: value, decimals: 0 };
  const num = parseFloat(match[1]);
  const suffix = match[2] || "";
  const parts = match[1].split(".");
  const decimals = parts[1] ? parts[1].length : 0;
  return { num, suffix, decimals };
}

export function MetricCard({ title, value, change, changeLabel, icon: Icon }) {
  const { num, suffix, decimals } = useMemo(() => parseValue(value), [value]);

  return (
    <div className="glass glass-hover rounded-xl transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {Icon && <Icon className="h-4 w-4 text-[#00ffbe]" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-[#00ffbe]">
          {num > 0 ? (
            <CountUp
              key={value}
              end={num}
              duration={1.4}
              decimals={decimals}
              separator=","
              suffix={suffix}
            />
          ) : (
            value
          )}
        </div>
        {change !== undefined && (
          <TrendIndicator value={change} label={changeLabel} />
        )}
      </CardContent>
    </div>
  );
}
