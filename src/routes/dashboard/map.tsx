import { useSessionStore } from "@/store/use-session-store";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/map")({
  component: MapRouteComponent,
});

function MapRouteComponent() {
  const { session } = useSessionStore();

  return (
    <main className="h-screen">
      <h1>this is this the map from dashboard layout</h1>
      <h1>Session: {JSON.stringify(session)}</h1>
    </main>
  );
}
