import apiClient from "@/lib/axios";
import type { BaseResponse } from "@/lib/types";
import type { Org } from "@/schemas/org-schema";

export type OrgResponse = BaseResponse<Org>;

const apiRoute = "/protected/orgs";

async function getOrgById(id: string) {
  const response = await apiClient.get<OrgResponse>(`${apiRoute}/${id}`);
  return response.data.payload;
}

const orgApi = {
  getOrgById,
};

export default orgApi;
