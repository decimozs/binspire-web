import { z } from "zod/v4";
import { baseSchema } from "./base-schema";
import { insertExcludedFields } from "@/lib/utils";

export const trashinSchema = z.object({
  orgId: z.string().min(1, "Organization ID is required"),
  name: z.string().min(1, "Name is required"),
  location: z.string().min(1, "Location is required"),
  latitude: z.string().refine((val) => !isNaN(parseFloat(val)), {
    message: "Latitude must be a valid number",
  }),
  longitude: z.string().refine((val) => !isNaN(parseFloat(val)), {
    message: "Longitude must be a valid number",
  }),
  isOperational: z.boolean().default(false),
  isArchive: z.boolean().default(false),
  isCollected: z.boolean().default(false),
  ...baseSchema.shape,
});

export const createTrashbinSchema = trashinSchema.omit({
  ...insertExcludedFields,
});

export const updateTrashbinSchema = createTrashbinSchema.partial();

export type Trashbin = z.infer<typeof trashinSchema>;
export type CreateTrashbin = z.infer<typeof createTrashbinSchema>;
export type UpdateTrashbin = z.infer<typeof updateTrashbinSchema>;
