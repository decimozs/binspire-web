import { trashbinStatusColorMap, trashbinStatusIconMap } from "@/lib/constants";

interface TrashbinStatusBadgeProps {
  isFull: boolean;
}

export default function TrashbinStatusBadge({
  isFull,
}: TrashbinStatusBadgeProps) {
  const key = String(isFull) as "true" | "false";
  const Icon = trashbinStatusIconMap[key];
  const color = trashbinStatusColorMap[key];
  const label = isFull ? "Full" : "Not Full";

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
