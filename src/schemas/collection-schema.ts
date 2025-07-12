import { z } from "zod/v4";
import { baseSchema } from "./base-schema";
import { insertExcludedFields } from "@/lib/utils";

export const collectionSchema = z.object({
  trashbinId: z.string().min(1, "Trashbin ID is required"),
  collectedBy: z.string().min(1, "Collected by is required"),
  weightLevel: z.string().refine((val) => !isNaN(parseFloat(val)), {
    message: "Weight must be a valid number",
  }),
  wasteLevel: z
    .number()
    .min(0, "Waste level cannot be negative")
    .max(100, "Waste level must be between 0 and 100"),
  batteryLevel: z
    .number()
    .min(0, "Battery level cannot be negative")
    .max(100, "Battery level must be between 0 and 100"),
  isFull: z.boolean().default(false),
  isArchive: z.boolean().default(false),
  ...baseSchema.shape,
});

export const createCollectionSchema = collectionSchema.omit({
  ...insertExcludedFields,
});

export const updateCollectionSchema = createCollectionSchema.partial();

export type Collection = z.infer<typeof collectionSchema>;
export type CreateCollection = z.infer<typeof createCollectionSchema>;
export type UpdateCollection = z.infer<typeof updateCollectionSchema>;
