import { createFileRoute } from "@tanstack/react-router";
import collectionApi from "@/api/collection-api";
import { collectionColumns } from "@/components/table/columns-table";
import DataTable from "@/components/table/data-table";
import {
  QueryClient,
  queryOptions,
  useSuspenseQuery,
} from "@tanstack/react-query";

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
  const { data } = useSuspenseQuery(collectionsQueryOpts);
  return (
    <div className="w-full">
      <DataTable
        data={data}
        columns={collectionColumns}
        searchPattern={"id"}
        apiRoute="collections"
        tableName="collections"
        resourceType="collection"
      />
    </div>
  );
}
