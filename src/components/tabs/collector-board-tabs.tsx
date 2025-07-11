import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useIssue from "@/queries/use-issue";
import { CircleAlert, ListCheck, Trash } from "lucide-react";
import IssueTab from "./issue-tab";
import useTrashbin from "@/queries/use-trashbin";
import TrashbinTab from "./trashbin-tab";
import useTask from "@/queries/use-task";
import TaskTab from "./task-tab";
import { useSessionStore } from "@/store/use-session-store";

export default function CollectorBoardTabs() {
  const { session } = useSessionStore();
  const { getIssues } = useIssue();
  const { getTrashbins } = useTrashbin();
  const { getTasks } = useTask();

  const isTaskLoading = getTasks.isLoading;
  const isTrashbinLoading = getTrashbins.isLoading;
  const isIssueLoading = getIssues.isLoading;

  const tasksCount =
    getTasks.data?.filter((task) => task.status === "pending").length || 0;
  const trashbinsCount =
    getTrashbins.data?.filter(
      (trashbin) => !trashbin.isCollected && trashbin.isOperational,
    ).length || 0;
  const issuesCount =
    getIssues.data?.filter(
      (issue) => issue.category === "trashbin" && issue.status === "open",
    ).length || 0;

  const assignedTasks =
    getTasks.data?.filter((task) => task.assignedTo === session?.userId) || [];

  return (
    <Tabs defaultValue="tab-1" className="w-full">
      <TabsList className="bg-transparent flex flex-row w-full justify-evenly overflow-y-auto">
        <TabsTrigger
          value="tab-1"
          className="p-4 data-[state=active]:bg-muted data-[state=active]:shadow-none"
        >
          <ListCheck />
          Tasks
          {tasksCount > 0 && (
            <div className="bg-muted rounded-full min-w-[20px] h-[20px] flex items-center justify-center">
              <p className="text-xs">{tasksCount}</p>
            </div>
          )}
        </TabsTrigger>
        <TabsTrigger
          value="tab-2"
          className="p-4 data-[state=active]:bg-muted data-[state=active]:shadow-none"
        >
          <Trash />
          Trashbins
          {trashbinsCount > 0 && (
            <div className="bg-muted rounded-full min-w-[20px] h-[20px] flex items-center justify-center">
              <p className="text-xs">{trashbinsCount}</p>
            </div>
          )}
        </TabsTrigger>
        <TabsTrigger
          value="tab-3"
          className="p-4 flex flex-row items gap-1 data-[state=active]:bg-muted data-[state=active]:shadow-none"
        >
          <CircleAlert />
          Issues
          {issuesCount > 0 && (
            <div className="bg-muted rounded-full min-w-[20px] h-[20px] flex items-center justify-center">
              <p className="text-xs">{issuesCount}</p>
            </div>
          )}
        </TabsTrigger>
      </TabsList>
      <TaskTab data={assignedTasks} isLoading={isTaskLoading} />
      <TrashbinTab data={getTrashbins.data} isLoading={isTrashbinLoading} />
      <IssueTab data={getIssues.data} isLoading={isIssueLoading} />
    </Tabs>
  );
}
