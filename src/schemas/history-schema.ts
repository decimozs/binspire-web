import z from "zod/v4";
import { baseSchema } from "./base-schema";
import { insertExcludedFields } from "@/lib/utils";

export const historySchema = z.object({
  orgId: z.string().min(1, { message: "Organization ID is required." }),
  actorId: z.string().min(1, { message: "Actor ID is required." }),
  entity: z.string().min(1, { message: "Entity type is required." }),
  action: z.string().min(1, { message: "Action type is required." }),
  description: z.string().min(1, { message: "Description is required." }),
  isArchive: z.boolean().default(false),
  ...baseSchema.shape,
});

export const createHistorySchema = historySchema.omit({
  ...insertExcludedFields,
});

export const updateHistorySchema = createHistorySchema.partial();

export type History = z.infer<typeof historySchema>;
export type CreateHistory = z.infer<typeof createHistorySchema>;
export type UpdateHistory = z.infer<typeof updateHistorySchema>;
