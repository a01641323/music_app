import { MetricCard } from "./metric-card";

export function MetricCardGrid({ metrics }) {
  return (
    <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, i) => (
        <MetricCard key={i} {...metric} />
      ))}
    </div>
  );
}
