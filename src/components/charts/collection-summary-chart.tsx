import useCollection from "@/queries/use-collection";
import { useSessionStore } from "@/store/use-session-store";
import Loading from "../core/loading";
import {
  AverageWasteCollectedRadialChart,
  TotalCollectionRadialChart,
  TotalWasteWeightCollectionRadialChart,
} from "./radial-charts";
import { TotalCollectionLineChart } from "./line-charts";
import CollectionUpdates from "../updates/collection-updates";

export default function CollectionSummaryChart() {
  const { getCollections } = useCollection();
  const { session } = useSessionStore();
  const { data, isLoading } = getCollections;
  const isAdmin = session?.role === "admin";

  if (!data || isLoading) {
    return <Loading type="screen" />;
  }

  if (!isAdmin) {
    return (
      <div className="grid grid-cols-1 gap-4 mb-[10vh]">
        <TotalCollectionRadialChart data={data} session={session} />
        <TotalWasteWeightCollectionRadialChart data={data} session={session} />
        <AverageWasteCollectedRadialChart data={data} session={session} />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[1fr_600px] gap-4 h-full max-h-dvh">
      <div className="grid grid-rows-[auto_1fr] gap-4">
        <TotalCollectionLineChart data={data} />
        <div className="flex flex-row gap-4 w-full justify-between h-full min-h-0">
          <div className="w-full h-full overflow-auto">
            <TotalCollectionRadialChart data={data} session={session} />
          </div>
          <div className="w-full h-full overflow-auto">
            <TotalWasteWeightCollectionRadialChart
              data={data}
              session={session}
            />
          </div>
          <div className="w-full h-full overflow-auto">
            <AverageWasteCollectedRadialChart data={data} session={session} />
          </div>
        </div>
      </div>
      <CollectionUpdates />
    </div>
  );
}
