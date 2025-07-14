import apiClient from "@/lib/axios";
import type { Direction, ORSDirectionsResponse } from "@/lib/types";

const apiRoute = "/protected/directions";

async function getDirections(data: Direction) {
  const response = await apiClient.post<ORSDirectionsResponse>(apiRoute, data);
  return response.data;
}

const directionApi = {
  getDirections,
};

export default directionApi;
