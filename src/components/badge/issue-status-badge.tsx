import { issueIconMap, issueStatusColorMap } from "@/lib/constants";
import type { Issue } from "@/lib/types";

interface StatusBadgeProps {
  issue: Issue;
}

export default function IssueStatusBadge({ issue }: StatusBadgeProps) {
  const Icon = issueIconMap[issue];
  const color = issueStatusColorMap[issue];

  return (
    <div className="flex items-center gap-2">
      <div
        className={`${color} flex flex-row gap-1.5 items-center text-sm rounded-full py-1 px-2`}
      >
        <Icon className="w-4 h-4" />
        <span className="capitalize">{issue}</span>
      </div>
    </div>
  );
}
