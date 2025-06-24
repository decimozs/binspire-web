import ResetPasswordForm from "@/components/form/reset-password-form";
import apiClient from "@/lib/axios";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { z } from "zod/v4";

const resetPasswordSearchSchema = z.object({
  token: z.string().min(1),
});

export const Route = createFileRoute("/auth/reset-password")({
  validateSearch: resetPasswordSearchSchema,
  beforeLoad: async ({ search }): Promise<{ email: string }> => {
    const token = search.token;

    if (!token || !isNaN(Number(token))) {
      throw redirect({ to: "/" });
    }

    try {
      const response = await apiClient.get(`/verifications/${token}`);
      const email = response.data?.payload?.email;

      if (!email) throw redirect({ to: "/" });

      return { email };
    } catch {
      throw redirect({ to: "/" });
    }
  },
  component: ResetPasswordRouteComponent,
});

function ResetPasswordRouteComponent() {
  return (
    <main className="h-screen flex items-center justify-center">
      <ResetPasswordForm />
    </main>
  );
}
