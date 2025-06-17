import LoginForm from "@/components/form/login-form";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <main className="h-screen flex items-center justify-center">
      <LoginForm />
    </main>
  );
}
