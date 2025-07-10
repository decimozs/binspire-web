import apiClient from "@/lib/axios";
import type { BaseResponse } from "@/lib/types";
import {
  type Collection,
  type UpdateCollection,
  type CreateCollection,
} from "@/schemas/collection-schema";

export type CollectionListResponse = BaseResponse<Collection[]>;
export type CollectionResponse = BaseResponse<Collection>;

const apiRoute = "/protected/collections";

async function getCollections() {
  const response = await apiClient.get<CollectionListResponse>(apiRoute);

  return response.data.payload;
}

async function getCollectionById(id: string) {
  const response = await apiClient.get<CollectionResponse>(`${apiRoute}/${id}`);

  return response.data.payload;
}

async function createCollection(data: CreateCollection) {
  const response = await apiClient.post<CollectionResponse>(apiRoute, data);

  return response.data.payload;
}

async function updateCollection(id: string, data: UpdateCollection) {
  const response = await apiClient.patch<CollectionResponse>(
    `${apiRoute}/${id}`,
    data,
  );

  return response.data.payload;
}

async function deleteCollection(id: string) {
  const response = await apiClient.delete<CollectionResponse>(
    `${apiRoute}/${id}`,
  );

  return response.data.payload;
}

const collectionApi = {
  getCollections,
  getCollectionById,
  createCollection,
  updateCollection,
  deleteCollection,
};

export default collectionApi;
