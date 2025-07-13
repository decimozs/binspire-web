import { useQueryState } from "nuqs";
import { CircleAlert, ClipboardList, Truck } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSessionStore } from "@/store/use-session-store";
import { Button } from "../ui/button";

export default function ViewSummaryChart() {
  const isMobile = useIsMobile();
  const { session } = useSessionStore();
  const isCollector = session?.role === "collector";
  const [chart, setChart] = useQueryState("chart", {
    defaultValue: "collection",
    history: "push",
  });

  if (isCollector) {
    return (
      <div
        className="fixed bottom-0 left-0 p-4 w-full flex flex-row items-center justify-evenly
        bg-background/40 backdrop-blur-xl backdrop-filter text-muted-foreground text-sm z-40"
      >
        <button
          onClick={() => setChart("collection")}
          className={`flex flex-col items-center gap-1 ${chart === "collection" ? "text-primary" : ""}`}
        >
          <Truck />
          <p>Collection</p>
        </button>

        <button
          onClick={() => setChart("task")}
          className={`flex flex-col items-center gap-1 ${chart === "task" ? "text-primary" : ""}`}
        >
          <ClipboardList />
          <p>Task</p>
        </button>

        <button
          onClick={() => setChart("issue")}
          className={`flex flex-col items-center gap-1 ${chart === "issue" ? "text-primary" : ""}`}
        >
          <CircleAlert />
          <p>Issue</p>
        </button>
      </div>
    );
  }

  if (!isMobile && !isCollector) {
    return (
      <div className="flex flex-row items-center gap-2">
        <Button
          variant="outline"
          className="h-9"
          onClick={() => setChart("collection")}
        >
          <Truck /> Collection
        </Button>
        <Button
          variant="outline"
          className="h-9"
          onClick={() => setChart("issue")}
        >
          <CircleAlert /> Issue
        </Button>
      </div>
    );
  }
}
