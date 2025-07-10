import { metricIconMap, wasteStatusColorMap } from "@/lib/constants";
import type { MetricType, WasteStatus } from "@/lib/types";

interface WasteStatusBadgeProps {
  status: WasteStatus;
  metric: MetricType;
}

export default function WasteStatusBadge({
  status,
  metric,
}: WasteStatusBadgeProps) {
  const Icon = metricIconMap[metric][status];
  const color = wasteStatusColorMap[status];

  return (
    <div className="flex items-center gap-2">
      <div
        className={`${color} flex flex-row gap-1.5 items-center text-sm rounded-full py-1 px-2`}
      >
        <Icon className="w-4 h-4" />
        <span className="capitalize">{status}</span>
      </div>
    </div>
  );
}
