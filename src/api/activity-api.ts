import apiClient from "@/lib/axios";
import type { BaseResponse } from "@/lib/types";
import {
  type CreateActivity,
  type Activity,
  type UpdateActivity,
} from "@/schemas/activity-schema";

export type ActivityListResponse = BaseResponse<Activity[]>;
export type ActivityResponse = BaseResponse<Activity>;

const apiRoute = "/protected/activity";

async function getActivities() {
  const response = await apiClient.get<ActivityListResponse>(apiRoute);
  return response.data.payload;
}

async function getActivityById(id: string) {
  const response = await apiClient.get<ActivityResponse>(`${apiRoute}/${id}`);
  return response.data.payload;
}

async function getActivityByUserId(userId: string) {
  const response = await apiClient.get<ActivityListResponse>(
    `${apiRoute}/user/${userId}`,
  );
  return response.data.payload;
}

async function createActivity(data: CreateActivity) {
  const response = await apiClient.post<ActivityResponse>(apiRoute, data);
  return response.data.payload;
}

async function updateActivity(id: string, data: UpdateActivity) {
  const response = await apiClient.patch<ActivityResponse>(
    `${apiRoute}/${id}`,
    data,
  );
  return response.data.payload;
}

async function deleteActivity(id: string) {
  const response = await apiClient.delete<ActivityResponse>(
    `${apiRoute}/${id}`,
  );
  return response.data.payload;
}

const activityApi = {
  getActivities,
  getActivityById,
  getActivityByUserId,
  createActivity,
  updateActivity,
  deleteActivity,
};

export default activityApi;
