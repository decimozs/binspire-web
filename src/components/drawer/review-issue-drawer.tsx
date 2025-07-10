import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "../ui/button";
import { CircleAlert } from "lucide-react";
import { generateIdNumber } from "@/lib/utils";
import type { Issue } from "@/schemas/issue-schema";
import { Separator } from "../ui/separator";
import { format, formatDistanceToNow } from "date-fns";
import { IdToggle } from "../core/id-toggle";
import PriorityScoreBadge from "../badge/priority-score-badge";
import IssueStatusBadge from "../badge/issue-status-badge";
import CommittedBy from "../core/committed-by";
import MarkAsDoneIssueModal from "../modal/mark-as-done-issue-modal";

interface ReviewIssueDrawerProps {
  data: Issue;
}

export default function ReviewIssueDrawer({ data }: ReviewIssueDrawerProps) {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <div className="p-4 border-[1px] border-input border-dashed rounded-md flex flex-row items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground mb-1">
              {`ISSUE-${generateIdNumber(data.id)}`}
            </p>
            <p>{data.title}</p>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(data.createdAt), {
                addSuffix: true,
              })}
            </p>
          </div>
        </div>
      </DrawerTrigger>
      <DrawerContent className="min-h-[80vh]">
        <DrawerHeader className="flex flex-row items-center gap-4">
          <div
            className="flex size-11 shrink-0 items-center justify-center rounded-full border"
            aria-hidden="true"
          >
            <CircleAlert className="opacity-80" size={23} />
          </div>
          <div className="flex flex-col text-left">
            <DrawerTitle>Issue</DrawerTitle>
            <DrawerDescription>
              View the current details of this issue.
            </DrawerDescription>
          </div>
        </DrawerHeader>
        <div className="flex flex-col gap-4 px-4 overflow-y-auto h-full">
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-muted-foreground text-sm font-medium">
                Issue ID
              </p>
              <IdToggle id={`ISSUE-${generateIdNumber(data.id)}`} />
            </div>
            <div className="flex flex-row gap-2">
              <IssueStatusBadge issue={data.status} />
              <PriorityScoreBadge priority={data.priority} />
            </div>
          </div>
          <Separator />
          <div className="flex flex-col gap-1">
            <p className="text-sm text-muted-foreground">Title</p>
            <p>{data.title}</p>
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
              <div>
                <p className="capitalize">
                  {format(new Date(data.createdAt), "eee, MMM d, yyyy")}
                </p>
                <p className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(data.createdAt), {
                    addSuffix: true,
                  })}
                </p>
              </div>
              <div></div>
            </div>
          </div>
        </div>
        <DrawerFooter>
          <MarkAsDoneIssueModal data={data} />
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
