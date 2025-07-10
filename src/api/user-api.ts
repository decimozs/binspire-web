import apiClient from "@/lib/axios";
import type { BaseResponse } from "@/lib/types";
import { type UpdateUser, type User } from "@/schemas/user-schema";

export type UserListResponse = BaseResponse<User[]>;
export type UserResponse = BaseResponse<User>;

const apiRoute = "/protected/users";

async function getUsers() {
  const response = await apiClient.get<UserListResponse>(apiRoute);
  return response.data.payload;
}

async function getUserById(id: string) {
  const response = await apiClient.get<UserResponse>(`${apiRoute}/${id}`);
  return response.data.payload;
}

async function updateUser(id: string, data: UpdateUser) {
  const response = await apiClient.patch<UserResponse>(
    `${apiRoute}/${id}`,
    data,
  );
  return response.data.payload;
}

async function deleteUser(id: string) {
  const response = await apiClient.delete<UserResponse>(`${apiRoute}/${id}`);
  return response.data.payload;
}

const userApi = {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};

export default userApi;
