import { userColumns } from "@/components/table/columns-table";
import DataTable from "@/components/table/data-table";
import userApi from "@/api/user-api";
import {
  QueryClient,
  queryOptions,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

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
  const { data } = useSuspenseQuery(userQueryOpts);

  return (
    <div className="w-full">
      <DataTable
        data={data}
        columns={userColumns}
        searchPattern={"id"}
        apiRoute="users"
        tableName="users"
        resourceType="user-management"
      />
    </div>
  );
}
