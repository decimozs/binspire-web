import ResetPasswordForm from "@/components/form/reset-password-form";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/reset-password")({
  component: ResetPasswordRouteComponent,
});

function ResetPasswordRouteComponent() {
  return (
    <main className="h-screen flex items-center justify-center">
      <ResetPasswordForm />
    </main>
  );
}
