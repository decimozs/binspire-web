import { statusColorMap, statusIconMap } from "@/lib/constants";
import type { Status } from "@/lib/types";

interface StatusBadgeProps {
  status: Status;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const Icon = statusIconMap[status];
  const color = statusColorMap[status];

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
