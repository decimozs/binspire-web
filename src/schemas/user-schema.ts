import { z } from "zod/v4";
import { baseSchema } from "./base-schema";
import { permissionValues, roleValues } from "@/lib/constants";
import { insertExcludedFields } from "@/lib/utils";

export const userSchema = z.object({
  email: z
    .string()
    .email("Must be a valid email address.")
    .min(1, "Email is required."),
  name: z.string().min(1, "Name is required."),
  role: z.enum(roleValues, {
    error: () => ({ message: "Invalid role value." }),
  }),
  permission: z.enum(permissionValues, {
    error: () => ({ message: "Invalid permission value." }),
  }),
  isOnline: z.boolean().default(false),
  isArchive: z.boolean().default(false),
  ...baseSchema.shape,
});

export const createUserSchema = userSchema.omit({
  ...insertExcludedFields,
});

export const updateUserSchema = createUserSchema.partial();

export type User = z.infer<typeof userSchema>;
export type CreateUser = z.infer<typeof createUserSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;
