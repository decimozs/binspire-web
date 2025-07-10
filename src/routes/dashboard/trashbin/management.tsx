import { createFileRoute } from "@tanstack/react-router";
import trashbinApi from "@/api/trashbin-api";
import { trashbinColumns } from "@/components/table/columns-table";
import DataTable from "@/components/table/data-table";
import {
  QueryClient,
  queryOptions,
  useSuspenseQuery,
} from "@tanstack/react-query";

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
  const { data, isLoading } = useSuspenseQuery(trashbinsQueryOpts);

  if (!data || isLoading) {
    return (
      <div>
        <p>Loading trashbins...</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <DataTable
        data={data}
        columns={trashbinColumns}
        searchPattern={"id"}
        apiRoute="trashbins"
        tableName="trashbins"
        resourceType="trashbin-management"
      />
    </div>
  );
}
