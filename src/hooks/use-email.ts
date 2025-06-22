import type { EmailVerificationFormFields } from "@/components/form/email-verification-form";
import { successSonner } from "@/components/ui/sonner";
import apiClient, { axiosError } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";

export function useEmail() {
  return useMutation({
    mutationFn: async (data: EmailVerificationFormFields) => {
      return await apiClient.post("/emails", data);
    },
    onError: (error) => axiosError(error),
    onSuccess: ({ data }) => {
      successSonner(data.message);
    },
  });
}
