import { TabsContent } from "@/components/ui/tabs";
import { CheckCircle2, GitPullRequest, Loader2, XCircle } from "lucide-react";
import { useState } from "react";
import type { Issue as IssueStatus } from "@/lib/types";
import type { Issue } from "@/schemas/issue-schema";
import { generateIdNumber } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { parseAsBoolean, useQueryState } from "nuqs";

interface IssueTabProps {
  data?: Issue[];
  isLoading: boolean;
}

export default function IssueTab({ data, isLoading }: IssueTabProps) {
  const [, setIssueId] = useQueryState("issue_id");
  const [, setViewIssue] = useQueryState("view_issue", parseAsBoolean);
  const [selectedStatus, setSelectedStatus] =
    useState<IssueStatus[number]>("open");

  if (isLoading) {
    return (
      <TabsContent value="tab-1">
        <p className="text-muted-foreground p-4 text-center text-xs">
          Loading issues...
        </p>
      </TabsContent>
    );
  }

  if (!data) {
    return (
      <TabsContent value="tab-1">
        <p className="text-muted-foreground p-4 text-center text-xs">
          No issues found.
        </p>
      </TabsContent>
    );
  }

  const filteredIssues = data
    .filter(
      (issue) =>
        issue.status.toLowerCase() === selectedStatus.toLowerCase() &&
        issue.category === "trashbin",
    )
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );

  return (
    <TabsContent value="tab-3" className="pb-20">
      <div className="flex flex-col gap-2">
        {filteredIssues.map((issue) => (
          <div
            className="p-4 border-[1px] border-input border-dashed rounded-md flex flex-row items-center justify-between"
            key={issue.id}
            onClick={() => {
              setViewIssue(true);
              setIssueId(issue.id);
            }}
          >
            <div>
              <p className="text-xs text-muted-foreground mb-1">
                {`ISSUE-${generateIdNumber(issue.id)}`}
              </p>
              <p>{issue.title}</p>
              <p className="text-xs text-muted-foreground">
                {issue.status === "resolved" && "Resolved "}
                {issue.status === "in-progress" && "Started "}
                {issue.status === "closed" && "Closed "}
                {formatDistanceToNow(new Date(issue.updatedAt), {
                  addSuffix: true,
                })}
              </p>
            </div>
          </div>
        ))}
        {filteredIssues.length === 0 && (
          <p className="text-muted-foreground p-4 text-center text-xs">
            No issues found for this status.
          </p>
        )}
      </div>

      <div
        className={`${data.length === 0 ? "hidden" : "fixed"} bottom-0 left-0 p-4 w-full flex flex-row items-center justify-evenly
        bg-background/40 backdrop-blur-xl backdrop-filter text-muted-foreground text-sm`}
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
