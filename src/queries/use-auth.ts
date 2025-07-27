import type { Login } from "@/components/form/login-form";
import type { ResetPassword } from "@/components/form/reset-password-form";
import { useWebSocket } from "@/components/provider/websocket-provider";
import { successSonner } from "@/components/ui/sonner";
import apiClient, { axiosError } from "@/lib/axios";
import type { BaseResponse } from "@/lib/types";
import type { Session } from "@/routes/dashboard/route";
import type { CreateAccountSchema as CreateAccount } from "@/schemas/account-schema";
import { useSessionStore } from "@/store/use-session-store";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

export function useLogin() {
  const navigate = useNavigate();
  const { sendMessage } = useWebSocket();
  const { setSession } = useSessionStore();

  return useMutation({
    mutationFn: async (data: Login) => {
      return await apiClient.post<BaseResponse<Session>>("/auth/login", data);
    },
    onError: (error) => axiosError(error),
    onSuccess: ({ data }) => {
      successSonner(data.message);

      const session = data.payload;
      const orgId = session?.orgId;

      if (orgId) {
        localStorage.setItem("orgId", orgId);
      }

      if (session) {
        setSession(session);
      }

      sendMessage(
        JSON.stringify({
          type: "login",
          payload: {
            userId: data.payload?.userId,
            role: data.payload?.role,
          },
        }),
      );

      return navigate({
        to: "/dashboard/map",
      });
    },
  });
}

export function useCreateAccount() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (data: CreateAccount) => {
      return await apiClient.post("/auth/sign-up", data);
    },
    onError: (error) => axiosError(error),
    onSuccess: ({ data }) => {
      successSonner(data.message);
      return navigate({
        to: "/dashboard/map",
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

export function useResetPassword() {
  return useMutation({
    mutationFn: async (data: ResetPassword) => {
      return await apiClient.post("/auth/reset-password", data);
    },
    onError: (error) => axiosError(error),
    onSuccess: ({ data }) => {
      localStorage.removeItem("orgId");
      successSonner(data.message);
    },
  });
}

export function useAuth() {
  const login = useLogin();
  const logout = useLogout();
  const resetPassword = useResetPassword();
  const createAccount = useCreateAccount();

  return {
    login,
    logout,
    resetPassword,
    createAccount,
  };
}
