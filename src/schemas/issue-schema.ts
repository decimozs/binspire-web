import { z } from "zod/v4";
import { baseSchema } from "./base-schema";
import { insertExcludedFields } from "@/lib/utils";

export const issueSchema = z
  .object({
    orgId: z.string().min(1, { message: "Organization ID is required." }),
    reporterId: z.string().min(1, "Reporter ID is required"),
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    status: z.enum(["open", "in-progress", "resolved", "closed"]),
    category: z.string().min(1, "Category is required"),
    assignedTo: z.string().optional(),
    referenceId: z.string().nullable().optional(),
    priority: z.enum(["low", "medium", "high"]),
    isArchive: z.boolean(),
    ...baseSchema.shape,
  })
  .strict();

export const createIssueSchema = issueSchema.omit({
  ...insertExcludedFields,
});

export const updateIssueSchema = createIssueSchema.partial();

export type Issue = z.infer<typeof issueSchema>;
export type CreateIssue = z.infer<typeof createIssueSchema>;
export type UpdateIssue = z.infer<typeof updateIssueSchema>;
