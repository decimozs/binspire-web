import { userColumns } from "@/components/table/columns-table";
import DataTable from "@/components/table/data-table";
import userApi from "@/api/user-api";
import {
  QueryClient,
  queryOptions,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import NoResultsFound from "@/components/core/no-results-found";

const queryClient = new QueryClient();

const userQueryOpts = queryOptions({
  queryKey: ["users"],
  queryFn: () => userApi.getUsers(),
});

export const Route = createFileRoute("/dashboard/user/management")({
  component: UserManagementRouteComponent,
  loader: async () => queryClient.ensureQueryData(userQueryOpts),
});

function UserManagementRouteComponent() {
  const { data, isFetching, refetch } = useSuspenseQuery(userQueryOpts);

  if (data && data.length === 0) {
    return (
      <NoResultsFound
        title="No Users Found"
        description="There are no registered users in the system yet. Once users sign up or are added, they will be listed here."
        isFetching={isFetching}
        onRefresh={refetch}
      />
    );
  }

  return (
    <div className="w-full">
      <DataTable
        data={data ?? []}
        columns={userColumns}
        searchPattern={"id"}
        apiRoute="users"
        tableName="users"
        resourceType="user-management"
      />
    </div>
  );
}
