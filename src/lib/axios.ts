import { errorSonner, warningSonner } from "@/components/ui/sonner";
import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

apiClient.interceptors.request.use(function (config) {
  const orgId = localStorage.getItem("orgId");

  if (orgId) {
    config.headers["X-Org-Id"] = orgId;
  }

  return config;
});

export function axiosError(error: unknown) {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message;

    if (status === 401) {
      errorSonner(message);
    }

    if (status === 404 || status === 409) {
      warningSonner(message);
    }

    if (status === 500) {
      errorSonner(message);
    }
  }
}

export default apiClient;
