import apiClient from "@/lib/axios";
import type {
  Direction,
  ORSDirectionsResponse,
  BaseResponse,
} from "@/lib/types";

const apiRoute = "/protected/directions";

type BaseORSDirectionsResponse = BaseResponse<ORSDirectionsResponse>;

async function getDirections(data: Direction) {
  const response = await apiClient.post<BaseORSDirectionsResponse>(
    apiRoute,
    data,
  );
  return response.data.payload;
}

const directionApi = {
  getDirections,
};

export default directionApi;
