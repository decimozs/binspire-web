import ResetPasswordForm from "@/components/form/reset-password-form";
import apiClient from "@/lib/axios";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { z } from "zod/v4";

const resetPasswordSearchSchema = z.object({
  id: z.string().min(1),
});

export const Route = createFileRoute("/auth/reset-password")({
  validateSearch: resetPasswordSearchSchema,
  beforeLoad: async ({ search }) => {
    const id = search.id;

    if (!id || !isNaN(Number(id))) {
      throw redirect({ to: "/" });
    }

    try {
      await apiClient.get(`/verifications/${id}`);
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
