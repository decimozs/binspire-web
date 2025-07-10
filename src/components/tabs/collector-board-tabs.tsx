import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useIssue from "@/queries/use-issue";
import {
  CheckCircle2,
  CircleAlert,
  GitPullRequest,
  ListCheck,
  Loader2,
  PackageOpen,
  XCircle,
} from "lucide-react";
import ReviewIssueDrawer from "../drawer/review-issue-drawer";
import { useState } from "react";
import type { Issue } from "@/lib/types";

function IssueTab() {
  const { getIssues } = useIssue();
  const { data, isLoading } = getIssues;
  const [selectedStatus, setSelectedStatus] = useState<Issue[number]>("open");

  if (!data || isLoading) {
    return (
      <TabsContent value="tab-3">
        <p className="text-muted-foreground p-4 text-center text-xs">
          Loading issues...
        </p>
      </TabsContent>
    );
  }

  const filteredIssues = data.filter(
    (issue) =>
      issue.status.toLowerCase() === selectedStatus.toLowerCase() &&
      issue.category === "trashbin",
  );

  return (
    <TabsContent value="tab-3" className="pb-20">
      <div className="flex flex-col gap-2">
        {filteredIssues.map((issue) => (
          <ReviewIssueDrawer data={issue} key={issue.id} />
        ))}
        {filteredIssues.length === 0 && (
          <p className="text-muted-foreground p-4 text-center text-xs">
            No issues found for this status.
          </p>
        )}
      </div>

      <div
        className="fixed bottom-0 left-0 p-4 w-full flex flex-row items-center justify-evenly
          bg-background/40 backdrop-blur-xl backdrop-filter text-muted-foreground z-50 text-sm"
      >
        <button
          className="flex flex-col items-center gap-1"
          onClick={() => setSelectedStatus("open")}
        >
          <GitPullRequest
            className={selectedStatus === "open" ? "text-primary" : ""}
          />
          <p className={selectedStatus === "open" ? "text-primary" : ""}>
            Open
          </p>
        </button>
        <button
          className="flex flex-col items-center gap-1"
          onClick={() => setSelectedStatus("in-progress")}
        >
          <Loader2
            className={selectedStatus === "in-progress" ? "text-primary" : ""}
          />
          <p className={selectedStatus === "in-progress" ? "text-primary" : ""}>
            In progress
          </p>
        </button>
        <button
          className="flex flex-col items-center gap-1"
          onClick={() => setSelectedStatus("resolved")}
        >
          <CheckCircle2
            className={selectedStatus === "resolved" ? "text-primary" : ""}
          />
          <p className={selectedStatus === "resolved" ? "text-primary" : ""}>
            Resolved
          </p>
        </button>
        <button
          className="flex flex-col items-center gap-1"
          onClick={() => setSelectedStatus("closed")}
        >
          <XCircle
            className={selectedStatus === "closed" ? "text-primary" : ""}
          />
          <p className={selectedStatus === "closed" ? "text-primary" : ""}>
            Closed
          </p>
        </button>
      </div>
    </TabsContent>
  );
}
export default function CollectorBoardTabs() {
  return (
    <Tabs defaultValue="tab-1" className="w-full">
      <TabsList className="bg-transparent flex flex-row w-full justify-evenly overflow-y-auto">
        <TabsTrigger
          value="tab-1"
          className="p-4 data-[state=active]:bg-muted data-[state=active]:shadow-none"
        >
          <ListCheck />
          Tasks
          <div className="bg-muted rounded-full px-1.5 py-0.5">
            <p className="text-xs">10</p>
          </div>
        </TabsTrigger>
        <TabsTrigger
          value="tab-2"
          className="p-4 data-[state=active]:bg-muted data-[state=active]:shadow-none"
        >
          <PackageOpen />
          Collections
          <div className="bg-muted rounded-full px-1.5 py-0.5">
            <p className="text-xs">10</p>
          </div>
        </TabsTrigger>
        <TabsTrigger
          value="tab-3"
          className="p-4 data-[state=active]:bg-muted data-[state=active]:shadow-none"
        >
          <CircleAlert />
          Issues
          <div className="bg-muted rounded-full px-1.5 py-0.5">
            <p className="text-xs">10</p>
          </div>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="tab-1">
        <p className="text-muted-foreground p-4 text-center text-xs">
          Content for Tab 1
        </p>
      </TabsContent>
      <TabsContent value="tab-2">
        <p className="text-muted-foreground p-4 text-center text-xs">
          Content for Tab 2
        </p>
      </TabsContent>
      <IssueTab />
    </Tabs>
  );
}
