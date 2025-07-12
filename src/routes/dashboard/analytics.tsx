import AnalyticsDashboard from "@/components/core/analytics-dashboard";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/analytics")({
  component: AnalyticsComponentRoute,
});

function AnalyticsComponentRoute() {
  return <AnalyticsDashboard />;
}
