import z from "zod/v4";
import { baseSchema } from "./base-schema";
import { insertExcludedFields } from "@/lib/utils";

export const activitySchema = z.object({
  orgId: z.string().min(1, { message: "Organization ID is required." }),
  actorId: z.string().min(1, { message: "Actor ID is required." }),
  entity: z.string().min(1, { message: "Entity type is required." }),
  action: z.string().min(1, { message: "Action type is required." }),
  description: z.string().min(1, { message: "Description is required." }),
  isArchive: z.boolean().default(false),
  changes: z
    .object({
      id: z.string().min(1, { message: "ID is required." }),
      before: z.record(z.string(), z.any()),
      after: z.record(z.string(), z.any()),
    })
    .nullable()
    .or(z.literal(null)),
  ...baseSchema.shape,
});

export const createActivitySchema = activitySchema.omit({
  ...insertExcludedFields,
});

export const updateActivitySchema = createActivitySchema.partial();

export type Activity = z.infer<typeof activitySchema>;
export type CreateActivity = z.infer<typeof createActivitySchema>;
export type UpdateActivity = z.infer<typeof updateActivitySchema>;
