import { permissionValues, roleValues } from "@/lib/constants";
import z from "zod/v4";

export const createAccountSchema = z.object({
  userData: z.object({
    name: z.string(),
    orgId: z.string(),
    email: z.email(),
    permission: z.enum(permissionValues),
    role: z.enum(roleValues),
  }),
  accountData: z.object({
    password: z.string().min(6),
  }),
});

export type CreateAccountSchema = z.infer<typeof createAccountSchema>;
