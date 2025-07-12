import { useSessionStore } from "@/store/use-session-store";
import type { ReactNode } from "react";

interface PermissionGuardProps {
  children: ReactNode;
  allowedPermissions?: string[];
  allowedRole?: string;
  excludeIf?: boolean;
}

export default function PermissionGuard({
  allowedPermissions = ["superuser", "editor"],
  allowedRole = "admin",
  excludeIf = false,
  children,
}: PermissionGuardProps) {
  const { session } = useSessionStore();

  const hasPermission =
    session?.permission &&
    session?.role &&
    allowedPermissions.includes(session.permission) &&
    session.role === allowedRole &&
    !excludeIf;

  if (!hasPermission) return null;

  return <>{children}</>;
}
