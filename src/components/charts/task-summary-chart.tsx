import useTask from "@/queries/use-task";
import { useSessionStore } from "@/store/use-session-store";
import Loading from "../core/loading";
import {
  AverageTaskCompletionRadialChart,
  TaskOverdueRadialChart,
  TotalTaskCompletedRadialChart,
} from "./radial-charts";

export default function TaskSummaryChart() {
  const { getTasks } = useTask();
  const { session } = useSessionStore();
  const { data, isLoading } = getTasks;

  if (!data || isLoading) {
    return <Loading type="screen" />;
  }

  return (
    <div className="grid grid-cols-1 gap-4 mb-[10vh]">
      <TotalTaskCompletedRadialChart data={data} session={session} />
      <AverageTaskCompletionRadialChart data={data} session={session} />
      <TaskOverdueRadialChart data={data} session={session} />
      <TaskOverdueRadialChart data={data} session={session} />
    </div>
  );
}
