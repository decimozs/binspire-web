import EmailVerificationForm from "@/components/form/email-verification-form";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/email-verification")({
  component: EmailVerificationRouteComponent,
});

function EmailVerificationRouteComponent() {
  return (
    <main className="h-screen flex items-center justify-center">
      <EmailVerificationForm />
    </main>
  );
}
