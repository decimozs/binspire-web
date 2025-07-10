import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Ticket } from "lucide-react";
import { Separator } from "../ui/separator";
import { format } from "date-fns";
import { IdToggle } from "../core/id-toggle";
import { generateIdNumber } from "@/lib/utils";
import PriorityScoreBadge from "../badge/priority-score-badge";
import useIssue from "@/queries/use-issue";
import { UpdateModal } from "./update-modal";
import { DeleteModal } from "./delete-modal";
import { useEffect, useId, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { issueIconMap, issueStatusColorMap } from "@/lib/constants";
import type { Issue as IssueStatus } from "@/lib/types";
import PermissionGuard from "../core/permission-guard";
import CommittedBy from "../core/committed-by";
import { parseAsBoolean, useQueryState } from "nuqs";

const issueStatuses: IssueStatus[] = [
  "open",
  "in-progress",
  "resolved",
  "closed",
];

interface SelectIssueStatusProps {
  value: IssueStatus;
  onChange: (value: IssueStatus) => void;
}

export function SelectIssueStatus({ value, onChange }: SelectIssueStatusProps) {
  const id = useId();

  return (
    <div className="*:not-first:mt-2">
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger
          id={id}
          className="h-auto text-left [&>span]:flex [&>span]:items-center [&>span]:gap-2 border-none"
        >
          <SelectValue placeholder="Select issue status" />
        </SelectTrigger>
        <SelectContent align="end">
          {issueStatuses.map((status) => {
            const Icon = issueIconMap[status];
            const color = issueStatusColorMap[status];
            return (
              <SelectItem key={status} value={status}>
                <div
                  className={`flex items-center gap-2 ${color} rounded-full px-2 py-1 text-sm`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="capitalize">{status}</span>
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
}

export default function ReviewIssueModal() {
  const { updateIssue, deleteIssue, getIssueById } = useIssue();
  const [issueId, setIssueId] = useQueryState("issue_id");
  const [viewIssue, setViewIssue] = useQueryState("view_issue", parseAsBoolean);
  const { data, isLoading } = getIssueById(issueId || "");
  const [open, setOpen] = useState(!!viewIssue);

  const isDeleting = deleteIssue.isPending;
  const isUpdating = updateIssue.isPending;

  useEffect(() => {
    setOpen(!!viewIssue);
  }, [viewIssue]);

  const [status, setStatus] = useState<IssueStatus>("open");

  useEffect(() => {
    if (data?.status) {
      setStatus(data.status);
    }
  }, [data?.status]);

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      setTimeout(() => {
        setIssueId(null);
        setViewIssue(null);
      }, 300);
    }
  };

  const handleUpdate = async (id: string) => {
    if (!data) return;

    await updateIssue.mutateAsync({
      id,
      data: { status },
    });
  };

  const handleDelete = async (id: string) => {
    if (!data) return;

    await deleteIssue.mutateAsync(id);

    handleOpenChange(false);
  };

  const handleArchive = async (id: string) => {
    if (!data) return;

    await updateIssue.mutateAsync({
      id,
      data: { isArchive: !data.isArchive },
    });
  };

  if (!data || isLoading) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Loading Issue Info...</DialogTitle>
            <DialogDescription>
              Please wait while we load the data.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  const { id, ...items } = data;
  const tIssueId = generateIdNumber(id);
  const tData = {
    id,
    name: `ISSUE-${tIssueId}`,
    ...items,
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="min-w-xl">
        <DialogHeader>
          <div
            className="flex size-11 shrink-0 items-center justify-center rounded-full border"
            aria-hidden="true"
          >
            <Ticket className="opacity-80" size={23} />
          </div>
          <DialogTitle>Review Issue</DialogTitle>
          <DialogDescription>
            Review the issue details below and update the status or take
            necessary action.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-row justify-between items-center">
          <div>
            <p className="text-muted-foreground text-sm font-medium">
              Issue ID
            </p>
            <IdToggle id={`ISSUE-${tIssueId}`} />
          </div>
          <div className="mt-5">
            <SelectIssueStatus
              value={status}
              onChange={(value) => setStatus(value as IssueStatus)}
            />
          </div>
        </div>
        <Separator />
        <div className="space-y-4">
          <div className="">
            <p className="text-sm text-muted-foreground">Title</p>
            <p>{data.title}</p>
          </div>
          <div className="">
            <p className="text-sm text-muted-foreground">Category</p>
            <p className="capitalize">{data.category}</p>
          </div>
          <div className="">
            <p className="text-sm text-muted-foreground mb-2">Priority Score</p>
            <PriorityScoreBadge priority={data.priority} />
          </div>
          <div className="">
            <p className="text-sm text-muted-foreground">Description</p>
            <p className="p-4 text-sm bg-muted-foreground/5 rounded-md mt-2">
              {data.description}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-3">
              <p className="text-sm text-muted-foreground">Issued By</p>
              <div className="cursor-pointer border border-dashed rounded-md py-2 px-4 w-fit">
                <CommittedBy userId={data.reporterId} enableRole={true} />
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <p className="text-sm text-muted-foreground">Issued At</p>
              <div className="capitalize">
                {format(new Date(data.createdAt), "eee, MMM d, yyyy")}
              </div>
            </div>
          </div>
        </div>
        <PermissionGuard>
          <DialogFooter>
            <div className="flex flex-row gap-2 items-center w-full">
              <div className="flex flex-row gap-2 items-center">
                <UpdateModal
                  data={tData}
                  buttonType="icon"
                  action={data.isArchive ? "restore" : "archive"}
                  onUpdate={() => handleArchive(data.id)}
                  isPending={isUpdating}
                  resourceType="issue"
                />
                <DeleteModal
                  data={tData}
                  buttonType="icon"
                  onDelete={handleDelete}
                  isPending={isDeleting}
                  resourceType="issue"
                />
              </div>
              <Separator
                orientation="vertical"
                className="data-[orientation=vertical]:h-6"
              />
              <UpdateModal
                data={tData}
                buttonType="modal"
                action="update"
                label="Update Issue"
                onUpdate={() => handleUpdate(data.id)}
                isPending={isUpdating}
                disabled={status === data.status}
                resourceType="issue"
              />
            </div>
          </DialogFooter>
        </PermissionGuard>
      </DialogContent>
    </Dialog>
  );
}
