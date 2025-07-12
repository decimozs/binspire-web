"use client";

import { useQueryState } from "nuqs";
import { CircleAlert, ClipboardList, Truck } from "lucide-react";

export default function ViewSummaryChart() {
  const [chart, setChart] = useQueryState("chart", {
    defaultValue: "collection",
    history: "push",
  });

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
