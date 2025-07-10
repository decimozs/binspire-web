import apiClient from "@/lib/axios";
import type { BaseResponse } from "@/lib/types";
import {
  type CreateIssue,
  type Issue,
  type UpdateIssue,
} from "@/schemas/issue-schema";

export type IssueListResponse = BaseResponse<Issue[]>;
export type IssueResponse = BaseResponse<Issue>;

const apiRoute = "/protected/issues";

async function getIssues() {
  const response = await apiClient.get<IssueListResponse>(apiRoute);
  return response.data.payload;
}

async function getIssueById(id: string) {
  const response = await apiClient.get<IssueResponse>(`${apiRoute}/${id}`);
  return response.data.payload;
}

async function createIssue(data: CreateIssue) {
  const response = await apiClient.post<IssueResponse>(apiRoute, data);
  return response.data.payload;
}

async function updateIssue(id: string, data: UpdateIssue) {
  const response = await apiClient.patch<IssueResponse>(
    `${apiRoute}/${id}`,
    data,
  );
  return response.data.payload;
}

async function deleteIssue(id: string) {
  const response = await apiClient.delete<IssueResponse>(`${apiRoute}/${id}`);
  return response.data.payload;
}

const issueApi = {
  getIssues,
  getIssueById,
  createIssue,
  updateIssue,
  deleteIssue,
};

export default issueApi;
