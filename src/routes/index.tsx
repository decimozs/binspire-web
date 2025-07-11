import LoginForm from "@/components/form/login-form";
import { useSessionStore } from "@/store/use-session-store";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { sessionSchema, type SessionResponse } from "./dashboard/route";
import apiClient from "@/lib/axios";

export const Route = createFileRoute("/")({
  component: Index,
  beforeLoad: async () => {
    try {
      const response = await apiClient.get<SessionResponse>("/auth/session");
      const parsed = sessionSchema.safeParse(response.data.payload);

      if (parsed.success) {
        useSessionStore.getState().setSession(parsed.data);
        return redirect({ to: "/dashboard/map" });
      }
    } catch {
      // No active session, show login form
    }
  },
});

function Index() {
  return (
    <main className="h-screen flex items-center justify-center">
      <LoginForm />
    </main>
  );
}
