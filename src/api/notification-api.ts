import apiClient from "@/lib/axios";
import type { BaseResponse } from "@/lib/types";
import {
  type CreateNotification,
  type Notification,
} from "@/schemas/notification-schema";

export type NotificationResponse = BaseResponse<Notification[]>;

async function getNotificationByFCMToken(fcmToken: string) {
  const response = await apiClient.get<NotificationResponse>(
    `/notifications/fcm_token/${fcmToken}`,
  );
  return response.data.payload;
}

async function createNotificationToken(data: CreateNotification) {
  const response = await apiClient.post<BaseResponse<Notification>>(
    "/notifications",
    data,
  );
  return response.data.payload;
}

const notificationApi = {
  createNotificationToken,
  getNotificationByFCMToken,
};

export default notificationApi;
