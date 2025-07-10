import apiClient from "@/lib/axios";
import type { BaseResponse, Status } from "@/lib/types";

export interface BatchDataParams {
  ids: string[];
  apiRoute: string;
}

export interface UpdateBatchParams extends BatchDataParams {
  data: {
    status: Status;
  };
}

async function update({ ids, data, apiRoute }: UpdateBatchParams) {
  const url = `/protected/${apiRoute}/batch`;

  const body = {
    ids,
    data,
  };

  const response = await apiClient.patch<BaseResponse<unknown>>(url, body);
  return response;
}

async function remove({ ids, apiRoute }: BatchDataParams) {
  const url = `/protected/${apiRoute}/batch`;

  const response = await apiClient.delete<BaseResponse<unknown>>(url, {
    data: { ids },
  });

  return response;
}

const batchingApi = {
  update,
  remove,
};

export default batchingApi;
