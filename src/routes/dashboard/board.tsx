import BoardDashboard from "@/components/board-dashboard";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/board")({
  component: BoardRouteComponent,
});

function BoardRouteComponent() {
  return <BoardDashboard />;
}
