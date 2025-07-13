import useIssue from "@/queries/use-issue";
import { useSessionStore } from "@/store/use-session-store";
import Loading from "../core/loading";
import {
  AverageResolutionRateRadialChart,
  TotalIssuesResolvedRadialChart,
} from "./radial-charts";

export default function IssueSummaryChart() {
  const { getIssues } = useIssue();
  const { session } = useSessionStore();
  const { data, isLoading } = getIssues;
  const isAdmin = session?.role === "admin";

  if (!data || isLoading) {
    return <Loading type="screen" />;
  }

  if (!isAdmin) {
    return (
      <div className="grid grid-cols-1 gap-4 mb-[10vh]">
        <TotalIssuesResolvedRadialChart data={data} session={session} />
        <AverageResolutionRateRadialChart data={data} session={session} />
      </div>
    );
  }
}
