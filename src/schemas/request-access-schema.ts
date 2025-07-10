import { permissionValues, roleValues, statusValues } from "@/lib/constants";
import { insertExcludedFields } from "@/lib/utils";
import { z } from "zod/v4";
import { baseSchema } from "./base-schema";

export const requestAccessSchema = z.object({
  orgId: z.string({ message: "Organization ID is required." }),
  name: z.string().min(1, { message: "Name is required." }),
  email: z.email("Must be a valid email address.").min(1, "Email is required."),
  reason: z.string({ message: "Reason is required." }),
  permission: z.enum(permissionValues, {
    error: () => ({ message: "Invalid permission value." }),
  }),
  role: z.enum(roleValues, {
    error: () => ({ message: "Invalid role value." }),
  }),
  status: z.enum(statusValues, {
    error: () => ({ message: "Invalid status value." }),
  }),
  ...baseSchema.shape,
});

export const createRequestAcessSchema = requestAccessSchema.omit({
  ...insertExcludedFields,
});

export const updateRequestAccessSchema = createRequestAcessSchema.partial();

export type RequestAccess = z.infer<typeof requestAccessSchema>;
export type CreateRequestAccess = z.infer<typeof createRequestAcessSchema>;
export type UpdateRequestAccess = z.infer<typeof updateRequestAccessSchema>;
