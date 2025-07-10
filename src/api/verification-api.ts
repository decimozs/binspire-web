import apiClient from "@/lib/axios";
import type { BaseResponse } from "@/lib/types";
import { type Verification } from "@/schemas/verification-schema";

export type VerificationResponse = BaseResponse<Verification>;

const apiRoute = "/protected/verifications";

async function getVerificationByToken(token: string) {
  const response = await apiClient.get<VerificationResponse>(
    `${apiRoute}/${token}`,
  );
  return response.data.payload;
}

const verificationApi = {
  getVerificationByToken,
};

export default verificationApi;
