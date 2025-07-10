import { z } from "zod/v4";
import { baseSchema } from "./base-schema";
import { verificationTypeValues } from "@/lib/constants";
import { insertExcludedFields } from "@/lib/utils";

export const verificationSchema = z.object({
  email: z.email("Must be a valid email address.").min(1, "Email is required."),
  value: z.string(),
  identifier: z.enum(verificationTypeValues, {
    error: () => ({ message: "Invalid verification value." }),
  }),
  ...baseSchema.shape,
});

export const createVerificationSchema = verificationSchema.omit({
  ...insertExcludedFields,
});

export const updateVerificationSchema = createVerificationSchema.partial();

export type Verification = z.infer<typeof verificationSchema>;
export type CreateVerification = z.infer<typeof createVerificationSchema>;
export type UpdateVerification = z.infer<typeof updateVerificationSchema>;
