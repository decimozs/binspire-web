import { requestAccessColumns } from "@/components/table/columns-table";
import DataTable from "@/components/table/data-table";
import requestAccessApi from "@/api/request-access-api";
import {
  QueryClient,
  queryOptions,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import NoResultsFound from "@/components/core/no-results-found";

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
  const { data, isFetching, refetch } = useSuspenseQuery(
    requestAccessQueryOpts,
  );

  if (data && data.length === 0) {
    return (
      <NoResultsFound
        title="No Access Requests"
        description="No requested access at the moment. When someone submits a request, it will appear here for review."
        isFetching={isFetching}
        onRefresh={refetch}
      />
    );
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
