import { useSessionStore } from "@/store/use-session-store";
import type { ReactNode } from "react";

interface PermissionGuardProps {
  children: ReactNode;
  allowed?: string[];
  excludeIf?: boolean;
}

export default function PermissionGuard({
  allowed = ["superuser", "editor"],
  excludeIf = false,
  children,
}: PermissionGuardProps) {
  const { session } = useSessionStore();

  const isCollector = session?.role === "collector";

  const hasPermission =
    session?.permission &&
    isCollector &&
    allowed.includes(session.permission) &&
    !excludeIf;

  if (!hasPermission) return null;

  return <>{children}</>;
}
