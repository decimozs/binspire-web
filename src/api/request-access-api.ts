import apiClient from "@/lib/axios";
import type { BaseResponse } from "@/lib/types";
import {
  type CreateRequestAccess,
  type RequestAccess,
  type UpdateRequestAccess,
} from "@/schemas/request-access-schema";

export type RequestAccessListResponse = BaseResponse<RequestAccess[]>;
export type RequestAccessResponse = BaseResponse<RequestAccess>;

const apiRoute = "/protected/requests-access";

async function getRequestsAccess() {
  const response = await apiClient.get<RequestAccessListResponse>(apiRoute);
  return response.data.payload;
}

async function getRequestAccessById(id: string) {
  const response = await apiClient.get<RequestAccessResponse>(
    `${apiRoute}/${id}`,
  );
  return response.data.payload;
}

async function getRequestAccessByEmail(email: string) {
  const response = await apiClient.get<RequestAccessResponse>(
    `/requests-access/email/${email}`,
  );
  return response.data.payload;
}

async function createRequestAccess(data: CreateRequestAccess) {
  const response = await apiClient.post<RequestAccessResponse>(
    "/requests-access",
    data,
  );
  return response.data.payload;
}

async function updateRequestAccess(id: string, data: UpdateRequestAccess) {
  const response = await apiClient.patch<RequestAccessResponse>(
    `${apiRoute}/${id}`,
    data,
  );
  return response.data.payload;
}

async function deleteRequestAccess(id: string) {
  const response = await apiClient.delete<RequestAccessResponse>(
    `${apiRoute}/${id}`,
  );
  return response.data.payload;
}

const requestAccessApi = {
  getRequestsAccess,
  getRequestAccessById,
  getRequestAccessByEmail,
  createRequestAccess,
  updateRequestAccess,
  deleteRequestAccess,
};

export default requestAccessApi;
