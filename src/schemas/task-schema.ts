import z from "zod/v4";
import { baseSchema } from "./base-schema";
import { insertExcludedFields } from "@/lib/utils";

export const taskSchema = z.object({
  orgId: z.string().min(1, "Organization ID is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  status: z.string().min(1, "Status is required"),
  assignedTo: z.string().optional(),
  priority: z.string().min(1, "Priority is required"),
  referenceId: z.string().min(1, "Reference ID is required"),
  scheduledAt: z.date(),
  dueAt: z.date(),
  ...baseSchema.shape,
});

export const createTaskSchema = taskSchema.omit({
  ...insertExcludedFields,
});

export const updateTaskSchema = createTaskSchema.partial();

export type Task = z.infer<typeof taskSchema>;
export type CreateTask = z.infer<typeof createTaskSchema>;
export type UpdateTask = z.infer<typeof updateTaskSchema>;
