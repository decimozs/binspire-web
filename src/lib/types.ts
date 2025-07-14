import type { LucideIcon } from "lucide-react";
import type { permissionValues, roleValues, statusValues } from "./constants";
import type { Session } from "@/routes/dashboard/route";
import type {
  FeatureCollection,
  Feature,
  Geometry,
  LineString,
  BBox,
} from "geojson";

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

export interface Direction {
  profile?: string;
  start: string;
  end: string;
}

export interface GeoJsonResponse {
  type: string;
  bbox: number[];
  features: GeoJsonFeature[];
  metadata: GeoJsonMetadata;
}

export interface GeoJsonFeature {
  bbox: number[];
  type: string;
  properties: GeoJsonProperties;
  geometry: GeoJsonGeometry;
}

export interface GeoJsonProperties {
  segments: GeoJsonSegment[];
  way_points: number[]; // Keeping this snake_case if matching API spec
  summary: GeoJsonSummary;
}

export interface GeoJsonSegment {
  distance: number;
  duration: number;
  steps: GeoJsonStep[];
}

export interface GeoJsonStep {
  distance: number;
  duration: number;
  type: number;
  instruction: string;
  name: string;
  way_points: number[];
}

export interface GeoJsonSummary {
  distance: number;
  duration: number;
}

export interface GeoJsonGeometry {
  coordinates: number[][];
  type: string;
}

export interface GeoJsonMetadata {
  attribution: string;
  service: string;
  timestamp: number;
  query: GeoJsonQuery;
  engine: GeoJsonEngine;
}

export interface GeoJsonQuery {
  coordinates: number[][];
  profile: string;
  profileName: string;
  format: string;
}

export interface GeoJsonEngine {
  version: string;
  buildDate: string;
  graphDate: string;
  osmDate: string;
  graphVersion?: string;
}

export interface GeoJsonErrorResponse {
  error: GeoJsonError;
  info: GeoJsonErrorInfo;
}

export interface GeoJsonError {
  code: number;
  message: string;
}

export interface GeoJsonErrorInfo {
  engine: GeoJsonEngine;
  timestamp: number;
}

export interface ORSDirectionsResponse
  extends FeatureCollection<Geometry, GeoJsonProperties> {
  type: "FeatureCollection";
  features: ORSFeature[];
  bbox: BBox;
  metadata: ORSMetadata;
}

export interface ORSFeature extends Feature<LineString, GeoJsonProperties> {
  type: "Feature";
  geometry: LineString;
  properties: {
    segments: ORSSegment[];
    summary: {
      distance: number;
      duration: number;
    };
    way_points: number[];
  };
  bbox: BBox;
}

export interface ORSSegment {
  distance: number;
  duration: number;
  steps: ORSStep[];
}

export interface ORSStep {
  distance: number;
  duration: number;
  type: number;
  instruction: string;
  name: string;
  way_points: number[];
}

export interface ORSMetadata {
  attribution: string;
  service: string;
  timestamp: number;
  query: {
    coordinates: number[][];
    profile: string;
    format: string;
  };
  engine: {
    version: string;
    build_date: string;
    graph_date: string;
  };
}
