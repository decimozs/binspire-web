import {
  operationalStatusColorMap,
  operationalStatusIconMap,
} from "@/lib/constants";

interface CollectedStatusBadgeProps {
  isCollected: boolean;
}

export default function CollectedStatusBadge({
  isCollected,
}: CollectedStatusBadgeProps) {
  const key = String(isCollected) as "true" | "false";
  const Icon = operationalStatusIconMap[key];
  const color = operationalStatusColorMap[key];
  const label = isCollected ? "Collected" : "Not collected";

  return (
    <div className="flex items-center gap-2">
      <div
        className={`${color} flex flex-row gap-1.5 items-center text-sm rounded-full py-1 px-2`}
      >
        <Icon className="w-4 h-4" />
        <span>{label}</span>
      </div>
    </div>
  );
}
