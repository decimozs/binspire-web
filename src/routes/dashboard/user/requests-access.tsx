import { requestAccessColumns } from "@/components/table/columns-table";
import DataTable from "@/components/table/data-table";
import requestAccessApi from "@/api/request-access-api";
import {
  QueryClient,
  queryOptions,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import Loading from "@/components/core/loading";

const queryClient = new QueryClient();

const requestAccessQueryOpts = queryOptions({
  queryKey: ["requests-access"],
  queryFn: () => requestAccessApi.getRequestsAccess(),
});

export const Route = createFileRoute("/dashboard/user/requests-access")({
  component: UserRequestsAccessRouteComponent,
  loader: async () => queryClient.ensureQueryData(requestAccessQueryOpts),
});

function UserRequestsAccessRouteComponent() {
  const { data, isLoading } = useSuspenseQuery(requestAccessQueryOpts);

  if (!data || isLoading) {
    return <Loading message="Loading requests access..." type="screen" />;
  }

  return (
    <div className="w-full">
      <DataTable
        data={data ?? []}
        columns={requestAccessColumns}
        searchPattern={"id"}
        apiRoute="requests-access"
        tableName="request-access"
        resourceType="request"
      />
    </div>
  );
}
