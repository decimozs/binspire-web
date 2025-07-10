import z from "zod/v4";

export const baseSchema = z.object({
  id: z.string({ message: "ID is required." }),
  createdAt: z.coerce.date({ message: "Created date is required." }),
  updatedAt: z.coerce.date({ message: "Updated date is required." }),
});
