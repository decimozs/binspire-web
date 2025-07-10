import apiClient from "@/lib/axios";
import type { BaseResponse } from "@/lib/types";
import {
  type CreateHistory,
  type History,
  type UpdateHistory,
} from "@/schemas/history-schema";

export type HistoryListResponse = BaseResponse<History[]>;
export type HistoryResponse = BaseResponse<History>;

const apiRoute = "/protected/history";

async function getHistories() {
  const response = await apiClient.get<HistoryListResponse>(apiRoute);
  return response.data.payload;
}

async function getHistoryById(id: string) {
  const response = await apiClient.get<HistoryResponse>(`${apiRoute}/${id}`);
  return response.data.payload;
}

async function getHistoryByUserId(userId: string) {
  const response = await apiClient.get<HistoryListResponse>(
    `${apiRoute}/user/${userId}`,
  );
  return response.data.payload;
}

async function createHistory(data: CreateHistory) {
  const response = await apiClient.post<HistoryResponse>(apiRoute, data);
  return response.data.payload;
}

async function updateHistory(id: string, data: UpdateHistory) {
  const response = await apiClient.patch<HistoryResponse>(
    `${apiRoute}/${id}`,
    data,
  );
  return response.data.payload;
}

async function deleteHistory(id: string) {
  const response = await apiClient.delete<HistoryResponse>(`${apiRoute}/${id}`);
  return response.data.payload;
}

const historyApi = {
  getHistories,
  getHistoryById,
  getHistoryByUserId,
  createHistory,
  updateHistory,
  deleteHistory,
};

export default historyApi;
