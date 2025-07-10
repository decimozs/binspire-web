import { permissionColorMap, permissionIconMap } from "@/lib/constants";
import type { Permission } from "@/lib/types";

interface PermissionBadgeProps {
  permission: Permission;
}

export default function PermissionBadge({ permission }: PermissionBadgeProps) {
  const Icon = permissionIconMap[permission];
  const color = permissionColorMap[permission];

  return (
    <div className="flex items-center gap-2">
      <div
        className={`${color} flex flex-row gap-1.5 items-center text-sm rounded-full py-1 px-2`}
      >
        <Icon className="w-4 h-4" />
        <span className="capitalize">{permission}</span>
      </div>
    </div>
  );
}
