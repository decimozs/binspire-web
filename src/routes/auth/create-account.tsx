import CreateAccountForm from "@/components/form/create-account-form";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/create-account")({
  component: CreateAccountRouteComponent,
});

function CreateAccountRouteComponent() {
  return (
    <main className="h-screen flex items-center justify-center">
      <CreateAccountForm />
    </main>
  );
}
