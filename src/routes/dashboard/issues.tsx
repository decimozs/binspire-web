import { createFileRoute } from "@tanstack/react-router";
import { issueColumns } from "@/components/table/columns-table";
import DataTable from "@/components/table/data-table";
import {
  QueryClient,
  queryOptions,
  useSuspenseQuery,
} from "@tanstack/react-query";
import issueApi from "@/api/issue-api";

const queryClient = new QueryClient();

const issuesQueryOpts = queryOptions({
  queryKey: ["issues"],
  queryFn: () => issueApi.getIssues(),
});

export const Route = createFileRoute("/dashboard/issues")({
  component: IssuesRouteComponent,
  loader: async () => queryClient.ensureQueryData(issuesQueryOpts),
});

function IssuesRouteComponent() {
  const { data } = useSuspenseQuery(issuesQueryOpts);

  return (
    <div className="w-full">
      <DataTable
        data={data}
        columns={issueColumns}
        searchPattern={"id"}
        apiRoute="issues"
        tableName="issues"
        resourceType="issue"
      />
    </div>
  );
}
