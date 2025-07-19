import { z } from "zod/v4";
import { baseSchema } from "./base-schema";
import { insertExcludedFields } from "@/lib/utils";

export const notificationSchema = z.object({
  userId: z.string().min(1, { message: "User ID is required." }),
  fcmToken: z.string().min(1, { message: "FCM token is required." }),
  ...baseSchema.shape,
});

export const createNotificationSchema = notificationSchema.omit({
  ...insertExcludedFields,
});

export const updateNotificationSchema = createNotificationSchema.partial();

export type Notification = z.infer<typeof notificationSchema>;
export type CreateNotification = z.infer<typeof createNotificationSchema>;
export type UpdateNotification = z.infer<typeof updateNotificationSchema>;
