import type { LucideIcon } from "lucide-react";
import type { permissionValues, roleValues, statusValues } from "./constants";
import type { Session } from "@/routes/dashboard/route";

export type BaseResponse<T> = {
  status: boolean;
  message: string;
  payload?: T;
};

export type ActionType =
  | "unarchive"
  | "archive"
  | "delete"
  | "approve"
  | "reject"
  | "update"
  | "restore";

export interface BaseModalProps<T> {
  data: T;
  title: string;
  description: string;
  warning: string;
  action: ActionType;
}

export type TaskStatus = "pending" | "in-progress" | "done";

export type Issue = "open" | "closed" | "in-progress" | "resolved";

export type ActionIcon = Record<ActionType, LucideIcon>;

export type Status = (typeof statusValues)[number];

export type StatusIcon = Record<Status, LucideIcon>;

export type Role = (typeof roleValues)[number];

export type RoleIcon = Record<Role, LucideIcon>;

export type Permission = (typeof permissionValues)[number];

export type PermissionIcon = Record<Permission, LucideIcon>;

export type Priority = "low" | "medium" | "high";

export type WasteStatus = "low" | "medium" | "high" | "critical";

export type MetricType = "battery" | "weight" | "waste";

export type ResourceType =
  | "request"
  | "user-management"
  | "collection"
  | "trashbin-management"
  | "history"
  | "activity"
  | "issue";

export type EntityType =
  | "request-access"
  | "user"
  | "collection"
  | "trashbin"
  | "history"
  | "issue";

export interface MapLayer {
  layer: string;
  layerImage: string;
  name: string;
}

export interface TrendResult {
  message: string;
  icon: LucideIcon;
}

export type Timeframe = "daily" | "weekly" | "monthly" | "yearly" | "overall";

export interface FilterTimeframeProps {
  value: string;
  onChange: (value: Timeframe) => void;
}

export interface ChartProps<T> {
  data: T[];
  session?: Session | null;
}
