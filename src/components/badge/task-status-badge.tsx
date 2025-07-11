import { taskStatusColorMap, taskStatusIconMap } from "@/lib/constants";
import type { TaskStatus } from "@/lib/types";

interface StatusBadgeProps {
  status: TaskStatus;
}

export default function TaskStatusBadge({ status }: StatusBadgeProps) {
  const Icon = taskStatusIconMap[status];
  const color = taskStatusColorMap[status];

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
