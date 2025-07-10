import historyApi from "@/api/history-api";
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
  const { data, isLoading } = useSuspenseQuery(historyQueryOpts);

  if (!data || isLoading) {
    return (
      <div>
        <p>Loading histories...</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <DataTable
        data={data}
        columns={historyColumns}
        searchPattern={"id"}
        apiRoute="histories"
        tableName="histories"
        resourceType="history"
      />
    </div>
  );
}
