import DashboardMap from "@/components/core/dashboard-map";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/map")({
  component: MapRouteComponent,
});

function MapRouteComponent() {
  return <DashboardMap />;
}
