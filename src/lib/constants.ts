import {
  AlertTriangle,
  Archive,
  ArchiveRestore,
  ArrowDownCircle,
  BatteryFull,
  BatteryLow,
  BatteryMedium,
  CalendarSync,
  ChartNoAxesGantt,
  CheckCircle2,
  Circle,
  CircleCheck,
  CircleX,
  ClipboardList,
  Clock,
  Gauge,
  GitPullRequest,
  Layers2,
  Loader2,
  RotateCcw,
  Settings2,
  Shield,
  Ticket,
  Trash,
  Trash2,
  Truck,
  UserRound,
  Weight,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import type {
  ActionIcon,
  ActionType,
  EntityType,
  Issue,
  MapLayer,
  MetricType,
  Permission,
  PermissionIcon,
  Priority,
  ResourceType,
  Role,
  RoleIcon,
  Status,
  StatusIcon,
  TaskStatus,
  WasteStatus,
} from "./types";
import type { Map3DLayer } from "./layers";

export const roleValues = ["admin", "collector"] as const;
export const permissionValues = ["viewer", "editor", "superuser"] as const;
export const ORG_ID = "NVL99uuTSX_xmkTJipWm4";

export const statusValues = [
  "pending",
  "approved",
  "rejected",
  "archived",
] as const;

export const verificationTypeValues = [
  "email-verification",
  "forgot-password",
  "request-access",
  "access-approved",
  "access-rejected",
  "create-account",
] as const;

export const actionIconMap: ActionIcon = {
  delete: Trash,
  archive: Archive,
  unarchive: ArchiveRestore,
  approve: CircleCheck,
  reject: CircleX,
  restore: RotateCcw,
  update: Settings2,
};

export const actionToStatusMap: Record<ActionType, Status> = {
  archive: "archived",
  unarchive: "pending",
  delete: "rejected",
  approve: "approved",
  reject: "rejected",
  restore: "pending",
  update: "pending",
};

export const statusIconMap: StatusIcon = {
  approved: CircleCheck,
  pending: Clock,
  rejected: CircleX,
  archived: Archive,
};

export const statusColorMap: Record<Status, string> = {
  pending: "bg-yellow-400/20 text-yellow-500",
  approved: "bg-green-400/20 text-green-500",
  rejected: "bg-red-400/20 text-red-500",
  archived: "bg-gray-400/20 text-gray-500",
};

export const roleIconMap: RoleIcon = {
  admin: Shield,
  collector: Truck,
};

export const roleColorMap: Record<Role, string> = {
  admin: "bg-blue-400/20 text-blue-500",
  collector: "bg-orange-400/20 text-orange-500",
};

export const permissionIconMap: PermissionIcon = {
  viewer: Layers2,
  editor: Settings2,
  superuser: UserRound,
};

export const permissionColorMap: Record<Permission, string> = {
  viewer: "bg-purple-400/20 text-purple-500",
  editor: "bg-teal-400/20 text-teal-500",
  superuser: "bg-pink-400/20 text-pink-500",
};

export const issueIconMap: Record<Issue, LucideIcon> = {
  open: GitPullRequest,
  "in-progress": Loader2,
  resolved: CheckCircle2,
  closed: XCircle,
};

export const taskStatusIconMap: Record<TaskStatus, LucideIcon> = {
  pending: Clock,
  "in-progress": Loader2,
  done: CheckCircle2,
};

export const taskStatusColorMap: Record<TaskStatus, string> = {
  pending: "bg-yellow-400/20 text-yellow-500",
  "in-progress": "bg-blue-400/20 text-blue-500",
  done: "bg-green-400/20 text-green-500",
};

export const issueStatusColorMap: Record<Issue, string> = {
  open: "bg-blue-400/20 text-blue-500",
  closed: "bg-green-400/20 text-green-500",
  "in-progress": "bg-yellow-400/20 text-yellow-500",
  resolved: "bg-gray-400/20 text-gray-500",
};

export const priorityIconMap: Record<Priority, LucideIcon> = {
  low: ArrowDownCircle,
  medium: Circle,
  high: AlertTriangle,
};

export const priorityColorMap: Record<Priority, string> = {
  low: "bg-green-400/20 text-green-500",
  medium: "bg-yellow-400/20 text-yellow-500",
  high: "bg-red-400/20 text-red-500",
};

export const wasteLevelStatusColorMap: Record<WasteStatus, string> = {
  low: "bg-green-100 text-green-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-orange-100 text-orange-800",
  critical: "bg-red-100 text-red-800",
};

export const wasteLevelStatusIconMap: Record<WasteStatus, LucideIcon> = {
  low: BatteryFull,
  medium: BatteryMedium,
  high: BatteryLow,
  critical: AlertTriangle,
};

export const operationalStatusIconMap: Record<"true" | "false", LucideIcon> = {
  true: CheckCircle2,
  false: XCircle,
};

export const operationalStatusColorMap: Record<"true" | "false", string> = {
  true: "bg-green-400/20 text-green-500",
  false: "bg-red-400/20 text-red-500",
};

export const wasteStatusColorMap: Record<WasteStatus, string> = {
  low: "bg-green-400/20 text-green-500",
  medium: "bg-yellow-400/20 text-yellow-500",
  high: "bg-orange-400/20 text-orange-500",
  critical: "bg-red-400/20 text-red-500",
};

export const trashbinStatusIconMap = {
  true: AlertTriangle,
  false: CheckCircle2,
};

export const trashbinStatusColorMap = {
  true: "bg-red-400/20 text-red-500",
  false: "bg-green-400/20 text-green-500",
};

export const metricIconMap: Record<
  MetricType,
  Record<WasteStatus, LucideIcon>
> = {
  battery: {
    low: BatteryLow,
    medium: BatteryMedium,
    high: BatteryFull,
    critical: AlertTriangle,
  },
  weight: {
    low: Gauge,
    medium: Gauge,
    high: Weight,
    critical: AlertTriangle,
  },
  waste: {
    low: Trash2,
    medium: Trash2,
    high: Trash2,
    critical: AlertTriangle,
  },
};

export const adminSidebarData = {
  navMain: [
    {
      title: "Overview",
      url: "/dashboard",
      icon: ChartNoAxesGantt,
      isActive: true,
      items: [
        {
          title: "Map",
          url: "/dashboard/map",
        },
        {
          title: "Analytics",
          url: "/dashboard/analytics",
        },
        {
          title: "Board",
          url: "/dashboard/board",
        },
        {
          title: "Issues",
          url: "/dashboard/issues",
        },
        {
          title: "Activity",
          url: "/dashboard/activity",
        },
        {
          title: "History",
          url: "/dashboard/history",
        },
      ],
    },
    {
      title: "User",
      url: "/dashboard/user",
      icon: UserRound,
      items: [
        {
          title: "Management",
          url: "/dashboard/user/management",
        },
        {
          title: "Requests Access",
          url: "/dashboard/user/requests-access",
        },
      ],
    },
    {
      title: "Trashbin",
      url: "/dashboard/trashbin",
      icon: Trash,
      items: [
        {
          title: "Management",
          url: "/dashboard/trashbin/management",
        },
        {
          title: "Collections",
          url: "/dashboard/trashbin/collections",
        },
      ],
    },
  ],
};

export const collectorSidebarData = {
  navMain: [
    {
      title: "Overview",
      url: "/dashboard",
      icon: ChartNoAxesGantt,
      isActive: true,
      items: [
        {
          title: "Map",
          url: "/dashboard/map",
        },
        {
          title: "Analytics",
          url: "/dashboard/analytics",
        },
        {
          title: "Board",
          url: "/dashboard/board",
        },
      ],
    },
    {
      title: "Trashbin",
      url: "/dashboard/trashbin",
      icon: Trash,
      items: [
        {
          title: "Management",
          url: "/dashboard/trashbin/management",
        },
        {
          title: "Collections",
          url: "/dashboard/trashbin/collections",
        },
      ],
    },
  ],
};

export const getActionContent = (
  actionType: ActionType,
  data: { id: string; name?: string }[],
  resourceType: ResourceType = "request",
) => {
  const isBatch = Array.isArray(data);
  const count = isBatch ? data.length : 1;
  const name = isBatch ? "" : `"${(data as { name: string }).name}"`;

  const resourceLabel = (plural = false) => {
    const map: Record<ResourceType, string> = {
      request: plural ? "requests" : "request",
      "user-management": plural ? "users" : "user",
      collection: plural ? "collections" : "collection",
      "trashbin-management": plural ? "trashbins" : "trashbin",
      issue: plural ? "issues" : "issue",
      history: plural ? "history records" : "history record",
      activity: plural ? "activities" : "activity",
    };
    return map[resourceType];
  };

  const actionContentMap: Record<
    ActionType,
    { title: string; description: string; warning: string }
  > = {
    delete: {
      title: isBatch
        ? `Delete ${count} ${resourceLabel(true)}`
        : `Delete ${resourceLabel()}`,
      description: isBatch
        ? `Are you sure you want to delete these ${count} ${resourceLabel(true)}?`
        : `Are you sure you want to delete ${resourceLabel()} ${name}?`,
      warning: isBatch
        ? `This action is permanent. ${count} ${resourceLabel(true)} will be removed from the system.`
        : `This action is permanent. The ${resourceLabel()} ${name} will be removed from the system.`,
    },
    archive: {
      title: isBatch
        ? `Archive ${count} ${resourceLabel(true)}`
        : `Archive ${resourceLabel()}`,
      description: isBatch
        ? `Are you sure you want to archive these ${count} ${resourceLabel(true)}?`
        : `Are you sure you want to archive ${resourceLabel()} ${name}?`,
      warning: isBatch
        ? `These ${resourceLabel(true)} will be moved to archive and won't be visible in the main list.`
        : `The ${resourceLabel()} ${name} will be moved to archive and won't be visible in the main list.`,
    },
    unarchive: {
      title: isBatch
        ? `Unarchive ${count} ${resourceLabel(true)}`
        : `Unarchive ${resourceLabel()}`,
      description: isBatch
        ? `Are you sure you want to restore these ${count} archived ${resourceLabel(true)}?`
        : `Are you sure you want to restore ${resourceLabel()} ${name}?`,
      warning: isBatch
        ? `These ${resourceLabel(true)} will be restored and visible in the main list again.`
        : `The ${resourceLabel()} ${name} will be restored and visible in the main list again.`,
    },
    approve: {
      title: isBatch
        ? `Approve ${count} ${resourceLabel(true)}`
        : `Approve ${resourceLabel()}`,
      description: isBatch
        ? `Are you sure you want to approve these ${count} ${resourceLabel(true)}?`
        : `Are you sure you want to approve ${resourceLabel()} ${name}?`,
      warning: isBatch
        ? `${count} ${resourceLabel(true)} will be approved.`
        : `The ${resourceLabel()} ${name} will be approved.`,
    },
    reject: {
      title: isBatch
        ? `Reject ${count} ${resourceLabel(true)}`
        : `Reject ${resourceLabel()}`,
      description: isBatch
        ? `Are you sure you want to reject these ${count} ${resourceLabel(true)}?`
        : `Are you sure you want to reject ${resourceLabel()} ${name}?`,
      warning: isBatch
        ? `${count} ${resourceLabel(true)} will be rejected.`
        : `The ${resourceLabel()} ${name} will be rejected.`,
    },
    restore: {
      title: isBatch
        ? `Restore ${count} ${resourceLabel(true)}`
        : `Restore ${resourceLabel()}`,
      description: isBatch
        ? `Are you sure you want to restore these ${count} ${resourceLabel(true)}?`
        : `Are you sure you want to restore ${resourceLabel()} ${name}?`,
      warning: isBatch
        ? `These ${resourceLabel(true)} will be restored to their previous state.`
        : `The ${resourceLabel()} ${name} will be restored to its previous state.`,
    },
    update: {
      title: isBatch
        ? `Update ${count} ${resourceLabel(true)}`
        : `Update ${resourceLabel()}`,
      description: isBatch
        ? `Are you sure you want to update these ${count} ${resourceLabel(true)}?`
        : `Are you sure you want to update ${resourceLabel()} ${name}?`,
      warning: isBatch
        ? `These ${resourceLabel(true)} will be updated with the new details.`
        : `The ${resourceLabel()} ${name} will be updated with the new details.`,
    },
  };
  return actionContentMap[actionType];
};

export const entityIconMap: Record<EntityType, LucideIcon> = {
  "request-access": ClipboardList,
  user: UserRound,
  collection: CalendarSync,
  trashbin: Trash,
  history: Clock,
  issue: Ticket,
};

export const INITIAL_VIEW_STATE = {
  longitude: 121.07618705298137,
  latitude: 14.577577090977371,
  zoom: 18.5,
  pitch: 70,
  bearing: 10,
};

export const mapLayerItems: Array<MapLayer> = [
  {
    layer: "0196585a-8568-78da-9d4f-9e0a23f2efd9",
    layerImage: "/images/map-layers-2.png",
    name: "Streets",
  },
  {
    layer: "0197d4fd-eaa1-7158-974c-223908408a63",
    layerImage: "/images/map-layers-1.png",
    name: "Binspire",
  },
  {
    layer: "openstreetmap",
    layerImage: "/images/map-layers-3.png",
    name: "OpenStreetMap",
  },
  {
    layer: "satellite",
    layerImage: "/images/map-layers-4.png",
    name: "Sattelite",
  },
];

export const mockTrashbinData: Array<Map3DLayer> = [
  {
    id: "0QXamgnoA-xvQh3zot3gC",
    name: "Trash Bin 3",
    location: "Near Aurora Blvd & Betty Go-Belmonte St.",
    coordinates: [121.07458067915695, 14.578656811854344],
  },
  {
    id: "0RYVp3AAepn6WOg_bqNdp",
    name: "Trash Bin 10",
    location: "Along Gilmore Avenue, near Broadway Centrum",
    coordinates: [121.07673515228237, 14.578375640697189],
  },
  {
    id: "2ouBtQLuRRE3binl-5C99",
    name: "Trash Bin 8",
    location: "Corner of Dona Juana Rodriguez St. and Betty Go-Belmonte",
    coordinates: [121.07518614779536, 14.577095410235756],
  },
  {
    id: "4Lg9x-19JaSx2ctHqJnDo",
    name: "Trash Bin 9",
    location: "Along N. Domingo St. near Trinity College QC",
    coordinates: [121.07622208365427, 14.576657940971273],
  },
  {
    id: "50g8Kkm7ODOe4dUh7UAef",
    name: "Trash Bin 1",
    location: "Aurora Blvd, near LRT-2 Betty Go-Belmonte Station",
    coordinates: [121.07463193405027, 14.578342384001559],
  },
  {
    id: "5Ha_K-w-5nvQ2wtKa-Ci7",
    name: "Trash Bin 4",
    location: "Along E. Rodriguez Sr. Ave near St. Luke’s Medical Center",
    coordinates: [121.07757877798196, 14.579800722724215],
  },
  {
    id: "6mcoufZ4zYToT7IS4pLL0",
    name: "Trash Bin 2",
    location: "Inside residential area near Dona M. Hemady St.",
    coordinates: [121.07578212263957, 14.577886702006609],
  },
  {
    id: "8FknK7zZiRL3k0w7lfwVO",
    name: "Trash Bin 6",
    location: "Along Gilmore Ave near Gilmore IT Center",
    coordinates: [121.07629044892656, 14.579461020204079],
  },
  {
    id: "8sTa3fgMC9DIgOiEppXnq",
    name: "Trash Bin 5",
    location: "Intersection of N. Domingo and Dona M. Hemady St.",
    coordinates: [121.07765407870465, 14.579748249763696],
  },
  {
    id: "9RO3_RUrjfU52rvERSOVs",
    name: "Trash Bin 7",
    location: "Corner of Aurora Blvd and Gilmore Ave",
    coordinates: [121.07655351515689, 14.577254332143326],
  },
];

export const mockTruckData: Array<Map3DLayer> = [
  {
    id: "truck-3",
    name: "Truck 1",
    location: "Near Aurora Blvd & Betty Go-Belmonte St.",
    coordinates: [121.07536817158604, 14.577933213408315],
  },
];
