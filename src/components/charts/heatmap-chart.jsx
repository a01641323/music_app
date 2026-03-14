"use client";

import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const hourLabels = Array.from({ length: 24 }, (_, i) =>
  i === 0 ? "12a" : i < 12 ? `${i}a` : i === 12 ? "12p" : `${i - 12}p`
);

function interpolateColor(value, min, max) {
  const ratio = max === min ? 0 : (value - min) / (max - min);
  // From dark purple to bright yellow (Instagram palette)
  const r = Math.round(131 + (252 - 131) * ratio);
  const g = Math.round(58 + (175 - 58) * ratio);
  const b = Math.round(180 + (69 - 180) * ratio);
  return `rgb(${r}, ${g}, ${b})`;
}

export function HeatmapChart({ title, description, data, valueLabel = "Activity" }) {
  const { min, max } = useMemo(() => {
    let min = Infinity;
    let max = -Infinity;
    for (const row of data) {
      for (const val of row) {
        if (val < min) min = val;
        if (val > max) max = val;
      }
    }
    return { min, max };
  }, [data]);

  return (
    <Card className="glass glass-glow">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="min-w-[600px]">
            {/* Hour labels */}
            <div className="flex ml-10 mb-1">
              {hourLabels.map((h, i) =>
                i % 3 === 0 ? (
                  <span
                    key={i}
                    className="text-[10px] text-muted-foreground"
                    style={{ width: `${100 / 24}%`, textAlign: "center" }}
                  >
                    {h}
                  </span>
                ) : (
                  <span
                    key={i}
                    style={{ width: `${100 / 24}%` }}
                  />
                )
              )}
            </div>
            {/* Grid */}
            {data.map((row, dayIndex) => (
              <div key={dayIndex} className="flex items-center mb-0.5">
                <span className="text-[11px] text-muted-foreground w-10 text-right pr-2 shrink-0">
                  {dayLabels[dayIndex]}
                </span>
                <div className="flex flex-1 gap-0.5">
                  {row.map((value, hourIndex) => (
                    <Tooltip key={hourIndex}>
                      <TooltipTrigger
                        render={
                          <div
                            className="flex-1 aspect-square rounded-sm cursor-pointer transition-transform hover:scale-110"
                            style={{
                              backgroundColor: interpolateColor(value, min, max),
                              opacity: 0.4 + 0.6 * ((value - min) / (max - min || 1)),
                            }}
                          />
                        }
                      />
                      <TooltipContent>
                        <p className="text-xs">
                          {dayLabels[dayIndex]} {hourLabels[hourIndex]}: {valueLabel} {value}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              </div>
            ))}
            {/* Legend */}
            <div className="flex items-center justify-end gap-2 mt-3 mr-1">
              <span className="text-[10px] text-muted-foreground">Low</span>
              <div className="flex gap-0.5">
                {[0, 25, 50, 75, 100].map((v) => (
                  <div
                    key={v}
                    className="w-3 h-3 rounded-sm"
                    style={{
                      backgroundColor: interpolateColor(v, 0, 100),
                      opacity: 0.4 + 0.6 * (v / 100),
                    }}
                  />
                ))}
              </div>
              <span className="text-[10px] text-muted-foreground">High</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
