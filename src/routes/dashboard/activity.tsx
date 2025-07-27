import activityApi from "@/api/activity-api";
import NoResultsFound from "@/components/core/no-results-found";
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
  const { data, isFetching, refetch } = useSuspenseQuery(activityQueryOpts);

  if (data && data.length === 0) {
    return (
      <NoResultsFound
        title="No Activities Yet"
        description="Looks like nothing has happened yet. As new activities take place, they'll show up here."
        isFetching={isFetching}
        onRefresh={refetch}
      />
    );
  }

  return (
    <div className="w-full">
      <DataTable
        data={data ?? []}
        columns={activityColumns}
        searchPattern={"id"}
        apiRoute="activities"
        tableName="activities"
        resourceType="activity"
      />
    </div>
  );
}
