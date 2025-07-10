import { priorityColorMap, priorityIconMap } from "@/lib/constants";
import type { Priority } from "@/lib/types";

interface PriorityBadgeProps {
  priority: Priority;
}

export default function PriorityScoreBadge({ priority }: PriorityBadgeProps) {
  const Icon = priorityIconMap[priority];
  const color = priorityColorMap[priority];

  return (
    <div className="flex items-center gap-2">
      <div
        className={`${color} flex flex-row gap-1.5 items-center text-sm rounded-full py-1 px-2`}
      >
        <Icon className="w-4 h-4" />
        <span className="capitalize">{priority}</span>
      </div>
    </div>
  );
}
