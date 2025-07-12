import { useSessionStore } from "@/store/use-session-store";
import CollectionSummaryChart from "../charts/collection-summary-chart";
import IssueSummaryChart from "../charts/issue-summary-chart";
import TaskSummaryChart from "../charts/task-summary-chart";
import ViewSummaryChart from "../charts/view-summary-chart";
import { useQueryState } from "nuqs";

function AdminAnalytics() {
  return (
    <div className="w-full grid grid-cols-1 gap-4">
      <h1>admin analytics</h1>
    </div>
  );
}

function CollectorAnalytics() {
  const [chart] = useQueryState("chart", {
    defaultValue: "collection",
  });
  return (
    <div className="w-full grid grid-cols-1 gap-4">
      {chart === "collection" && <CollectionSummaryChart />}
      {chart === "task" && <TaskSummaryChart />}
      {chart === "issue" && <IssueSummaryChart />}
      <ViewSummaryChart />
    </div>
  );
}

export default function AnalyticsDashboard() {
  const { session } = useSessionStore();
  const role = session?.role;

  if (role === "admin") {
    return <AdminAnalytics />;
  }

  if (role === "collector") {
    return <CollectorAnalytics />;
  }
}
