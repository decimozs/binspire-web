import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardRouteComponent,
});

function DashboardRouteComponent() {
  return <div>Hello "/dashboard/"!</div>;
}
