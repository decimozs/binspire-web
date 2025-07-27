import { createFileRoute } from "@tanstack/react-router";
import trashbinApi from "@/api/trashbin-api";
import { trashbinColumns } from "@/components/table/columns-table";
import DataTable from "@/components/table/data-table";
import {
  QueryClient,
  queryOptions,
  useSuspenseQuery,
} from "@tanstack/react-query";
import NoResultsFound from "@/components/core/no-results-found";

const queryClient = new QueryClient();

const trashbinsQueryOpts = queryOptions({
  queryKey: ["trashbins"],
  queryFn: () => trashbinApi.getTrashbins(),
});

export const Route = createFileRoute("/dashboard/trashbin/management")({
  component: TrashbinManagagementRouteComponent,
  loader: async () => queryClient.ensureQueryData(trashbinsQueryOpts),
});

function TrashbinManagagementRouteComponent() {
  const { data, isFetching, refetch } = useSuspenseQuery(trashbinsQueryOpts);

  if (data && data.length === 0) {
    return (
      <NoResultsFound
        title="No Trashbins"
        description="No trashbin data is currently available. Connected devices will appear here once they are online and sending updates."
        isFetching={isFetching}
        onRefresh={refetch}
      />
    );
  }

  return (
    <div className="w-full">
      <DataTable
        data={data ?? []}
        columns={trashbinColumns}
        searchPattern={"id"}
        apiRoute="trashbins"
        tableName="trashbins"
        resourceType="trashbin-management"
      />
    </div>
  );
}
