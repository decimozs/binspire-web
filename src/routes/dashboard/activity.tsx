import activityApi from "@/api/activity-api";
import { activityColumns } from "@/components/table/columns-table";
import DataTable from "@/components/table/data-table";
import {
  QueryClient,
  queryOptions,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

const queryClient = new QueryClient();

const activityQueryOpts = queryOptions({
  queryKey: ["activities"],
  queryFn: () => activityApi.getActivities(),
});

export const Route = createFileRoute("/dashboard/activity")({
  component: ActivityRouteComponent,
  loader: async () => queryClient.ensureQueryData(activityQueryOpts),
});

function ActivityRouteComponent() {
  const { data } = useSuspenseQuery(activityQueryOpts);

  return (
    <div className="w-full">
      <DataTable
        data={data}
        columns={activityColumns}
        searchPattern={"id"}
        apiRoute="activities"
        tableName="activities"
        resourceType="activity"
      />
    </div>
  );
}
