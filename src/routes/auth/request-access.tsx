import RequestAccessForm from "@/components/form/request-access-form";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/request-access")({
  component: RequestAccessRouteComponent,
});

function RequestAccessRouteComponent() {
  return (
    <main className="h-screen flex items-center justify-center">
      <RequestAccessForm />
    </main>
  );
}
