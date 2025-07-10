import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { AnyZodObject } from "zod";
import type { WasteStatus } from "./types";

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
