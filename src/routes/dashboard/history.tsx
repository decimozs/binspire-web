import historyApi from "@/api/history-api";
import NoResultsFound from "@/components/core/no-results-found";
import { historyColumns } from "@/components/table/columns-table";
import DataTable from "@/components/table/data-table";
import {
  QueryClient,
  queryOptions,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

const queryClient = new QueryClient();

const historyQueryOpts = queryOptions({
  queryKey: ["histories"],
  queryFn: () => historyApi.getHistories(),
});

export const Route = createFileRoute("/dashboard/history")({
  component: HistoryRouteComponent,
  loader: async () => queryClient.ensureQueryData(historyQueryOpts),
});

function HistoryRouteComponent() {
  const { data, isFetching, refetch } = useSuspenseQuery(historyQueryOpts);

  if (data && data.length === 0) {
    return (
      <NoResultsFound
        title="No History Found"
        description="There are currently no activity logs available. Actions performed within the system will be recorded and shown here."
        isFetching={isFetching}
        onRefresh={refetch}
      />
    );
  }

  return (
    <div className="w-full">
      <DataTable
        data={data ?? []}
        columns={historyColumns}
        searchPattern={"id"}
        apiRoute="histories"
        tableName="histories"
        resourceType="history"
      />
    </div>
  );
}
