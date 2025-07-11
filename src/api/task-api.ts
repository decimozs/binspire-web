import type { BaseResponse } from "@/lib/types";
import apiClient from "@/lib/axios";
import type { CreateTask, UpdateTask, Task } from "@/schemas/task-schema";

export type TaskListResponse = BaseResponse<Task[]>;
export type TaskResponse = BaseResponse<Task>;

const apiRoute = "/protected/tasks";

async function getTasks() {
  const response = await apiClient.get<TaskListResponse>(apiRoute);
  return response.data.payload;
}

async function getTaskById(id: string) {
  const response = await apiClient.get<TaskResponse>(`${apiRoute}/${id}`);
  return response.data.payload;
}

async function getTaskByUserId(userId: string) {
  const response = await apiClient.get<TaskListResponse>(
    `${apiRoute}/user-id/${userId}`,
  );
  return response.data.payload;
}

async function createTask(data: CreateTask) {
  const response = await apiClient.post<TaskResponse>(apiRoute, data);
  return response.data.payload;
}

async function updateTask(id: string, data: UpdateTask) {
  const response = await apiClient.patch<TaskResponse>(
    `${apiRoute}/${id}`,
    data,
  );
  return response.data.payload;
}

async function deleteTask(id: string) {
  const response = await apiClient.delete<TaskResponse>(`${apiRoute}/${id}`);
  return response.data.payload;
}

const taskApi = {
  getTasks,
  getTaskById,
  getTaskByUserId,
  createTask,
  updateTask,
  deleteTask,
};

export default taskApi;
