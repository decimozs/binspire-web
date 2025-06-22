import type { LoginFormFields } from "@/components/form/login-form";
import type { RequestAccessFormFields } from "@/components/form/request-access-form";
import { successSonner } from "@/components/ui/sonner";
import apiClient, { axiosError } from "@/lib/axios";
import { useSessionStore } from "@/store/use-session-store";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

export function useLogin() {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async (data: LoginFormFields) => {
      return await apiClient.post("/auth/login", data);
    },
    onError: (error) => axiosError(error),
    onSuccess: ({ data }) => {
      successSonner(data.message);
      return navigate({
        to: "/dashboard",
      });
    },
  });
}

export function useLogout() {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async () => {
      return await apiClient.get("/auth/logout");
    },
    onError: (error) => axiosError(error),
    onSuccess: ({ data }) => {
      useSessionStore.getState().clearSession();
      successSonner(data.message);
      return navigate({
        to: "/",
      });
    },
  });
}

export function useRequestAccess() {
  return useMutation({
    mutationFn: async (data: RequestAccessFormFields) => {
      return await apiClient.post("/requests-access", data);
    },
    onError: (error) => axiosError(error),
    onSuccess: ({ data }) => {
      successSonner(data.message);
    },
  });
}
