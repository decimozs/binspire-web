import {
  AlertTriangle,
  Archive,
  ArrowDownCircle,
  BatteryFull,
  BatteryLow,
  BatteryMedium,
  CheckCircle2,
  CircleCheck,
  CircleX,
  Clock,
  Gauge,
  GitPullRequest,
  Layers2,
  Loader2,
  Settings2,
  Shield,
  Trash2,
  Truck,
  UserRound,
  Weight,
  XCircle,
} from "lucide-react";
import type { FilterOptions, NavFilterOptions } from "./filter-table-button";

export const requestAccessStatusFilter: FilterOptions[] = [
  { label: "Approved", filterValue: "approved", icon: CircleCheck },
  { label: "Pending", filterValue: "pending", icon: Clock },
  { label: "Rejected", filterValue: "rejected", icon: CircleX },
  { label: "Archive", filterValue: "archived", icon: Archive },
];

export const roleFilter: FilterOptions[] = [
  { label: "Admin", filterValue: "admin", icon: Shield },
  { label: "Collector", filterValue: "collector", icon: Truck },
];

export const permissionFilter: FilterOptions[] = [
  { label: "Viewer", filterValue: "viewer", icon: Layers2 },
  { label: "Editor", filterValue: "editor", icon: Settings2 },
  { label: "Superuser", filterValue: "superuser", icon: UserRound },
];

export const issueStatusFilter: FilterOptions[] = [
  { label: "Open", filterValue: "open", icon: GitPullRequest },
  { label: "In Progress", filterValue: "in-progress", icon: Loader2 },
  { label: "Closed", filterValue: "closed", icon: XCircle },
  { label: "Resolved", filterValue: "resolved", icon: CheckCircle2 },
];

export const priorityStatusFilter: FilterOptions[] = [
  { label: "Low", filterValue: "low", icon: ArrowDownCircle },
  { label: "Medium", filterValue: "medium", icon: Loader2 },
  { label: "High", filterValue: "high", icon: AlertTriangle },
];

export const wasteLevelStatusFilter: FilterOptions[] = [
  { label: "Low", filterValue: "low", icon: Trash2 },
  { label: "Medium", filterValue: "medium", icon: Trash2 },
  { label: "High", filterValue: "high", icon: Trash2 },
  { label: "Critical", filterValue: "critical", icon: AlertTriangle },
];

export const weightLevelStatusFilter: FilterOptions[] = [
  Gauge,
  Gauge,
  Weight,
  AlertTriangle,
].map((icon, index) => ({
  label: ["Low", "Medium", "High", "Critical"][index],
  filterValue: ["low", "medium", "high", "critical"][index],
  icon,
}));

export const batteryLevelStatusFilter: FilterOptions[] = [
  BatteryLow,
  BatteryMedium,
  BatteryFull,
  AlertTriangle,
].map((icon, index) => ({
  label: ["Low", "Medium", "High", "Critical"][index],
  filterValue: ["low", "medium", "high", "critical"][index],
  icon,
}));

export const navStatusFilter: NavFilterOptions[] = [
  {
    navFilterValue: "next.js",
    label: "Next.js",
  },
  {
    navFilterValue: "sveltekit",
    label: "SvelteKit",
  },
  {
    navFilterValue: "nuxt.js",
    label: "Nuxt.js",
  },
  {
    navFilterValue: "remix",
    label: "Remix",
  },
  {
    navFilterValue: "astro",
    label: "Astro",
  },
  {
    navFilterValue: "angular",
    label: "Angular",
  },
  {
    navFilterValue: "vue",
    label: "Vue.js",
  },
  {
    navFilterValue: "react",
    label: "React",
  },
  {
    navFilterValue: "ember",
    label: "Ember.js",
  },
  {
    navFilterValue: "gatsby",
    label: "Gatsby",
  },
  {
    navFilterValue: "eleventy",
    label: "Eleventy",
  },
  {
    navFilterValue: "solid",
    label: "SolidJS",
  },
  {
    navFilterValue: "preact",
    label: "Preact",
  },
  {
    navFilterValue: "qwik",
    label: "Qwik",
  },
  {
    navFilterValue: "alpine",
    label: "Alpine.js",
  },
  {
    navFilterValue: "lit",
    label: "Lit",
  },
];
