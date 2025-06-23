import { Button } from "@/components/ui/button";
import { useLogout } from "@/hooks/use-auth";
import apiClient from "@/lib/axios";
import { useSessionStore } from "@/store/use-session-store";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard")({
  component: DasboardLayoutRouteComponent,
  beforeLoad: async () => {
    try {
      const session = await apiClient.get("/auth/session");
      console.log(session.data);
      useSessionStore.getState().setSession(session.data?.data);
    } catch (error) {
      console.log(error);
      throw redirect({ to: "/" });
    }
  },
});

function DasboardLayoutRouteComponent() {
  const logout = useLogout();
  const { session } = useSessionStore();

  const handleLogout = async () => {
    await logout.mutateAsync();
  };

  return (
    <main className="h-screen">
      <h1>this is this the dashboard</h1>
      <h1>Session: {JSON.stringify(session)}</h1>
      <Button onClick={handleLogout}>Logout</Button>
      <Outlet />
    </main>
  );
}
