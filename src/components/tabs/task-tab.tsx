import { TabsContent } from "@/components/ui/tabs";
import { Clock, Loader2, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import type { Task } from "@/schemas/task-schema";
import { generateIdNumber } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { parseAsBoolean, useQueryState } from "nuqs";

type TaskStatus = "pending" | "in-progress" | "done";

interface TaskTabProps {
  data?: Task[];
  isLoading: boolean;
}

export default function TaskTab({ data, isLoading }: TaskTabProps) {
  const [selectedStatus, setSelectedStatus] = useState<TaskStatus>("pending");
  const [, setTaskId] = useQueryState("task_id");
  const [, setViewTask] = useQueryState("view_task", parseAsBoolean);

  if (isLoading) {
    return (
      <TabsContent value="tab-1">
        <p className="text-muted-foreground p-4 text-center text-xs">
          Loading tasks...
        </p>
      </TabsContent>
    );
  }

  if (!data) {
    return (
      <TabsContent value="tab-1">
        <p className="text-muted-foreground p-4 text-center text-xs">
          No tasks found.
        </p>
      </TabsContent>
    );
  }

  const filteredTasks = data
    .filter((task) => task.status.toLowerCase() === selectedStatus)
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );

  return (
    <TabsContent value="tab-1" className="pb-20">
      <div className="flex flex-col gap-2">
        {filteredTasks.map((task) => (
          <div
            className="p-4 border-[1px] border-input border-dashed rounded-md flex flex-row items-center justify-between"
            key={task.id}
            onClick={() => {
              setViewTask(true);
              setTaskId(task.id);
            }}
          >
            <div>
              <p className="text-xs text-muted-foreground mb-1">
                {`TASK-${generateIdNumber(task.id)}`}
              </p>
              <p>{task.title}</p>
              <p className="text-xs text-muted-foreground">
                {task.status === "done" && "Completed "}
                {task.status === "in-progress" && "Started "}
                {formatDistanceToNow(new Date(task.updatedAt), {
                  addSuffix: true,
                })}
              </p>
            </div>
          </div>
        ))}
        {filteredTasks.length === 0 && (
          <p className="text-muted-foreground p-4 text-center text-xs">
            No tasks found for this status.
          </p>
        )}
      </div>

      <div
        className={`${
          data.length === 0 ? "hidden" : "fixed"
        } bottom-0 left-0 p-4 w-full flex flex-row items-center justify-evenly
        bg-background/40 backdrop-blur-xl backdrop-filter text-muted-foreground text-sm`}
      >
        <button
          className="flex flex-col items-center gap-1"
          onClick={() => setSelectedStatus("pending")}
        >
          <Clock
            className={selectedStatus === "pending" ? "text-primary" : ""}
          />
          <p className={selectedStatus === "pending" ? "text-primary" : ""}>
            Pending
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
            In Progress
          </p>
        </button>
        <button
          className="flex flex-col items-center gap-1"
          onClick={() => setSelectedStatus("done")}
        >
          <CheckCircle2
            className={selectedStatus === "done" ? "text-primary" : ""}
          />
          <p className={selectedStatus === "done" ? "text-primary" : ""}>
            Done
          </p>
        </button>
      </div>
    </TabsContent>
  );
}
