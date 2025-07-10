import apiClient from "@/lib/axios";
import type { BaseResponse } from "@/lib/types";
import {
  type CreateTrashbin,
  type Trashbin,
  type UpdateTrashbin,
} from "@/schemas/trashbin-schema";

export type TrashbinListResponse = BaseResponse<Trashbin[]>;
export type TrashbinResponse = BaseResponse<Trashbin>;

const apiRoute = "/protected/trashbins";

async function getTrashbins() {
  const response = await apiClient.get<TrashbinListResponse>(apiRoute);
  return response.data.payload;
}

async function getTrashbinById(id: string) {
  const response = await apiClient.get<TrashbinResponse>(`${apiRoute}/${id}`);
  return response.data.payload;
}

async function createTrashbin(data: CreateTrashbin) {
  const response = await apiClient.post<TrashbinResponse>(apiRoute, data);
  return response.data.payload;
}

async function updateTrashbin(id: string, data: UpdateTrashbin) {
  const response = await apiClient.patch<TrashbinResponse>(
    `${apiRoute}/${id}`,
    data,
  );
  return response.data.payload;
}

async function deleteTrashbin(id: string) {
  const response = await apiClient.delete<TrashbinResponse>(
    `${apiRoute}/${id}`,
  );
  return response.data.payload;
}

const trashbinApi = {
  getTrashbins,
  getTrashbinById,
  createTrashbin,
  updateTrashbin,
  deleteTrashbin,
};

export default trashbinApi;
