import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { generateIdNumber } from "@/lib/utils";
import { format, formatDistanceToNow } from "date-fns";
import { parseAsBoolean, useQueryState } from "nuqs";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import PriorityScoreBadge from "../badge/priority-score-badge";
import { IdToggle } from "../core/id-toggle";
import { ClipboardList } from "lucide-react";
import TaskStatusBadge from "../badge/task-status-badge";
import type { Priority, TaskStatus } from "@/lib/types";
import TaskActionModal from "../modal/task-action-modal";
import { useEffect, useState } from "react";
import useTask from "@/queries/use-task";

export default function ReviewTaskDrawer() {
  const [taskId, setTaskId] = useQueryState("task_id");
  const [viewTask, setViewTask] = useQueryState("view_task", parseAsBoolean);
  const { getTaskById } = useTask();
  const { data, isLoading } = getTaskById(taskId || "");
  const [open, setOpen] = useState(!!viewTask);

  useEffect(() => {
    setOpen(!!viewTask);
  }, [viewTask]);

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      setTimeout(() => {
        setTaskId(null);
        setViewTask(null);
      }, 300);
    }
  };

  if (!data || isLoading) {
    return (
      <Drawer open={open} onOpenChange={handleOpenChange}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Loading Task Info...</DrawerTitle>
            <DrawerDescription>
              Please wait while we load the data.
            </DrawerDescription>
          </DrawerHeader>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Drawer open={open} onOpenChange={handleOpenChange}>
      <DrawerContent className="min-h-[80vh]">
        <DrawerHeader className="flex flex-row items-center gap-4">
          <div
            className="flex size-11 shrink-0 items-center justify-center rounded-full border"
            aria-hidden="true"
          >
            <ClipboardList className="opacity-80" size={23} />
          </div>
          <div className="flex flex-col text-left">
            <DrawerTitle>Task</DrawerTitle>
            <DrawerDescription>
              View the current details of this task.
            </DrawerDescription>
          </div>
        </DrawerHeader>
        <div className="flex flex-col gap-4 px-4 overflow-y-auto h-full">
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-muted-foreground text-sm font-medium">
                Issue ID
              </p>
              <IdToggle id={`TASK-${generateIdNumber(data.id)}`} />
            </div>
            <div className="flex flex-row gap-2">
              <TaskStatusBadge status={data.status as TaskStatus} />
              <PriorityScoreBadge priority={data.priority as Priority} />
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
          <div className="flex flex-row justify-evenly">
            <div className="flex flex-col gap-3 border-input border-dashed p-4 rounded-md border-[1px]">
              <p className="text-sm text-muted-foreground text-center">
                Scheduled at
              </p>
              <div>
                <p className="capitalize text-center">
                  {format(new Date(data.scheduledAt), "eee, MMM d, yyyy")}
                </p>
                <p className="text-sm text-muted-foreground text-center">
                  {formatDistanceToNow(new Date(data.scheduledAt), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </div>

            <div className="flex flex-col item gap-3 border-input border-dashed p-4 rounded-md border-[1px]">
              <p className="text-sm text-muted-foreground text-center">
                Due at
              </p>
              <div>
                <p className="capitalize text-center">
                  {format(new Date(data.dueAt), "eee, MMM d, yyyy")}
                </p>
                <p className="text-sm text-muted-foreground text-center">
                  {formatDistanceToNow(new Date(data.dueAt), {
                    addSuffix: true,
                  })}
                </p>{" "}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <p className="text-sm text-muted-foreground">Posted on</p>
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
          </div>
        </div>
        <DrawerFooter>
          <TaskActionModal data={data} />
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
