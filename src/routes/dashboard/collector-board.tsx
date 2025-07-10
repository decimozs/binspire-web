import CollectorBoardTabs from "@/components/tabs/collector-board-tabs";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/collector-board")({
  component: CollectorBoardRouteComponent,
});

function CollectorBoardRouteComponent() {
  return <CollectorBoardTabs />;
}
