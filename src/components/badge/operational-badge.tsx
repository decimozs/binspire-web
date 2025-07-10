import {
  operationalStatusColorMap,
  operationalStatusIconMap,
} from "@/lib/constants";

interface OperationalStatusBadgeProps {
  isOperational: boolean;
}

export default function OperationalStatusBadge({
  isOperational,
}: OperationalStatusBadgeProps) {
  const key = String(isOperational) as "true" | "false";
  const Icon = operationalStatusIconMap[key];
  const color = operationalStatusColorMap[key];
  const label = isOperational ? "Operational" : "Offline";

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
