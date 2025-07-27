import { z } from "zod/v4";
import { baseSchema } from "./base-schema";

export const orgSchema = z.object({
  name: z.string().min(1, "Name is required."),
  slug: z.string().min(1, "Slug is required."),
  ...baseSchema.shape,
});

export type Org = z.infer<typeof orgSchema>;
