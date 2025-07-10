import { roleColorMap, roleIconMap } from "@/lib/constants";
import type { Role } from "@/lib/types";

interface RoleBadgeProps {
  role: Role;
}

export default function RoleBadge({ role }: RoleBadgeProps) {
  const Icon = roleIconMap[role];
  const color = roleColorMap[role];

  return (
    <div className="flex items-center gap-2">
      <div
        className={`${color} flex flex-row gap-1.5 items-center text-sm rounded-full py-1 px-2`}
      >
        <Icon className="w-4 h-4" />
        <span className="capitalize">{role}</span>
      </div>
    </div>
  );
}
