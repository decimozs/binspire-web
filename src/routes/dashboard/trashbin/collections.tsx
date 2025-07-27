import { createFileRoute } from "@tanstack/react-router";
import collectionApi from "@/api/collection-api";
import { collectionColumns } from "@/components/table/columns-table";
import DataTable from "@/components/table/data-table";
import {
  QueryClient,
  queryOptions,
  useSuspenseQuery,
} from "@tanstack/react-query";
import NoResultsFound from "@/components/core/no-results-found";

const queryClient = new QueryClient();

const collectionsQueryOpts = queryOptions({
  queryKey: ["collections"],
  queryFn: () => collectionApi.getCollections(),
});

export const Route = createFileRoute("/dashboard/trashbin/collections")({
  component: CollectionsRouteComponent,
  loader: async () => queryClient.ensureQueryData(collectionsQueryOpts),
});

function CollectionsRouteComponent() {
  const { data, isFetching, refetch } = useSuspenseQuery(collectionsQueryOpts);

  if (data && data.length === 0) {
    return (
      <NoResultsFound
        title="No Collections"
        description="No waste collection records are available yet. Once a collection is completed, the details will show up here."
        isFetching={isFetching}
        onRefresh={refetch}
      />
    );
  }

  return (
    <div className="w-full">
      <DataTable
        data={data ?? []}
        columns={collectionColumns}
        searchPattern={"id"}
        apiRoute="collections"
        tableName="collections"
        resourceType="collection"
      />
    </div>
  );
}
