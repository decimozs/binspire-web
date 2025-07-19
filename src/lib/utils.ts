import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { AnyZodObject } from "zod";
import type { TrendResult, WasteStatus } from "./types";
import type { Collection } from "@/schemas/collection-schema";
import { Activity, MinusCircle, TrendingDown, TrendingUp } from "lucide-react";
import { format, isThisMonth, isThisWeek, isThisYear, isToday } from "date-fns";
import type { Issue } from "@/schemas/issue-schema";
import type { Task } from "@/schemas/task-schema";
import bearing from "@turf/bearing";
import { point } from "@turf/helpers";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export const insertExcludedFields = {
  id: true,
  createdAt: true,
  updatedAt: true,
} as const satisfies Partial<Record<keyof AnyZodObject["shape"], true>>;

export function getWasteStatus(level: number): WasteStatus {
  if (level < 25) return "low";
  if (level < 50) return "medium";
  if (level < 75) return "high";
  return "critical";
}

export function generateIdNumber(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i);
    hash |= 0;
  }

  const number = Math.abs(hash % 10000);
  return number.toString().padStart(4, "0");
}

export function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function getFirstLetter(name?: string): string {
  if (!name) return "";
  return name.trim()[0]?.toUpperCase() || "";
}

export function avatarFallback(name?: string) {
  return getFirstLetter(name);
}

export function formatLabel(label?: string) {
  return label ? label.replace("-", " ") : "";
}

export function getChangedFields<T extends object>(
  before: T,
  after: Partial<T>,
): Record<string, { before: unknown; after: unknown }> {
  const changes: Record<string, { before: unknown; after: unknown }> = {};

  for (const key in after) {
    if (
      key !== "updatedAt" &&
      Object.prototype.hasOwnProperty.call(after, key) &&
      before[key as keyof T] !== after[key as keyof T]
    ) {
      changes[key] = {
        before: before[key as keyof T],
        after: after[key as keyof T],
      };
    }
  }

  return changes;
}

export function getCollectionTrendMessage(
  data: Collection[],
  userId: string | undefined,
): TrendResult {
  if (!userId) {
    return {
      message: "User not identified",
      icon: MinusCircle,
    };
  }

  const currentMonth = format(new Date(), "yyyy-MM");
  const previousMonth = format(
    new Date(new Date().setMonth(new Date().getMonth() - 1)),
    "yyyy-MM",
  );

  const filtered = data.filter((c) => c.collectedBy === userId);

  const monthlyCounts = filtered.reduce<Record<string, number>>((acc, item) => {
    const key = format(new Date(item.createdAt), "yyyy-MM");
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const currentCount = monthlyCounts[currentMonth] || 0;
  const prevCount = monthlyCounts[previousMonth] || 0;

  if (currentCount > prevCount) {
    return {
      message: "Steady increase in collections observed",
      icon: TrendingUp,
    };
  } else if (currentCount < prevCount) {
    return {
      message: "Collection activity has slightly decreased",
      icon: TrendingDown,
    };
  } else if (currentCount === 0 && prevCount === 0) {
    return {
      message: "No collection activity recorded",
      icon: MinusCircle,
    };
  } else {
    return {
      message: "Your collection performance has remained stable",
      icon: Activity,
    };
  }
}

export function calculateAverageResolutionHours(
  data: Issue[],
  userId?: string,
) {
  const resolved = data.filter((i) => {
    const isResolved = i.status === "resolved";
    const isAssigned = userId ? i.assignedTo === userId : true;
    return isResolved && isAssigned;
  });

  if (resolved.length === 0) return 0;

  const totalMs = resolved.reduce((acc, issue) => {
    const created = new Date(issue.createdAt).getTime();
    const resolvedAt = new Date(issue.updatedAt).getTime();
    return acc + (resolvedAt - created);
  }, 0);

  const avgMs = totalMs / resolved.length;
  const avgHours = avgMs / (1000 * 60 * 60);

  return parseFloat(avgHours.toFixed(1));
}

export function getIssueTrendMessage(
  data: Issue[],
  userId: string | undefined,
): TrendResult {
  if (!userId) {
    return {
      message: "User not identified",
      icon: MinusCircle,
    };
  }

  const currentMonth = format(new Date(), "yyyy-MM");
  const previousMonth = format(
    new Date(new Date().setMonth(new Date().getMonth() - 1)),
    "yyyy-MM",
  );

  const filtered = data.filter(
    (issue) => issue.assignedTo === userId && issue.status === "resolved",
  );

  const monthlyCounts = filtered.reduce<Record<string, number>>(
    (acc, issue) => {
      const key = format(new Date(issue.createdAt), "yyyy-MM");
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    },
    {},
  );

  const currentCount = monthlyCounts[currentMonth] || 0;
  const prevCount = monthlyCounts[previousMonth] || 0;

  if (currentCount > prevCount) {
    return {
      message: "Issue resolution increased this month",
      icon: TrendingUp,
    };
  } else if (currentCount < prevCount) {
    return {
      message: "Resolved fewer issues than last month",
      icon: TrendingDown,
    };
  } else if (currentCount === 0 && prevCount === 0) {
    return {
      message: "No issues resolved recently",
      icon: MinusCircle,
    };
  } else {
    return {
      message: "Issue resolution remained steady",
      icon: Activity,
    };
  }
}

export function getTaskTrendMessage(
  data: Task[],
  userId: string | undefined,
): TrendResult {
  if (!userId) {
    return {
      message: "User not identified",
      icon: MinusCircle,
    };
  }

  const currentMonth = format(new Date(), "yyyy-MM");
  const previousMonth = format(
    new Date(new Date().setMonth(new Date().getMonth() - 1)),
    "yyyy-MM",
  );

  const filtered = data.filter(
    (task) => task.assignedTo === userId && task.status === "done",
  );

  const monthlyCounts = filtered.reduce<Record<string, number>>((acc, task) => {
    const key = format(new Date(task.createdAt), "yyyy-MM");
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const currentCount = monthlyCounts[currentMonth] || 0;
  const prevCount = monthlyCounts[previousMonth] || 0;

  if (currentCount > prevCount) {
    return {
      message: "Task completion improved this month",
      icon: TrendingUp,
    };
  } else if (currentCount < prevCount) {
    return {
      message: "Fewer tasks completed than last month",
      icon: TrendingDown,
    };
  } else if (currentCount === 0 && prevCount === 0) {
    return {
      message: "No tasks completed in recent months",
      icon: MinusCircle,
    };
  } else {
    return {
      message: "Task performance remained consistent",
      icon: Activity,
    };
  }
}

interface TimeframeFilterable {
  createdAt: string | Date;
}

export function filterByTimeframe<T extends TimeframeFilterable>(
  data: T[],
  timeframe: string,
  options?: {
    userId?: string;
    userIdProperty?: keyof T;
  },
): T[] {
  return data.filter((item) => {
    if (options?.userId !== undefined && options.userIdProperty) {
      if (item[options.userIdProperty] !== options.userId) return false;
    }

    const date = new Date(item.createdAt);

    switch (timeframe) {
      case "daily":
        return isToday(date);
      case "weekly":
        return isThisWeek(date, { weekStartsOn: 1 });
      case "monthly":
        return isThisMonth(date);
      case "yearly":
        return isThisYear(date);
      case "overall":
      default:
        return true;
    }
  });
}

export function calculateBearing(
  from: { lat: number; lng: number },
  to: { lat: number; lng: number },
): number {
  const fromPoint = point([from.lng, from.lat]);
  const toPoint = point([to.lng, to.lat]);
  return bearing(fromPoint, toPoint);
}

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
