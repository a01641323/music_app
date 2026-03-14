import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function TrendIndicator({ value, label }) {
  if (value == null) return null;
  const isPositive = value >= 0;

  return (
    <div className="flex items-center gap-1 text-xs">
      {isPositive ? (
        <TrendingUp className="h-3 w-3 text-emerald-500" />
      ) : (
        <TrendingDown className="h-3 w-3 text-red-500" />
      )}
      <span className={cn(isPositive ? "text-emerald-500" : "text-red-500")}>
        {isPositive ? "+" : ""}
        {value.toFixed(1)}%
      </span>
      {label && <span className="text-muted-foreground">{label}</span>}
    </div>
  );
}
