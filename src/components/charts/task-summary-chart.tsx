import { Activity, MinusCircle, TrendingDown, TrendingUp } from "lucide-react";
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { type ChartConfig, ChartContainer } from "@/components/ui/chart";
import useTask from "@/queries/use-task";
import { useSessionStore } from "@/store/use-session-store";
import type { Session } from "@/routes/dashboard/route";
import type { Task } from "@/schemas/task-schema";
import { useState } from "react";
import {
  format,
  isBefore,
  isThisMonth,
  isThisWeek,
  isThisYear,
  isToday,
} from "date-fns";
import {
  FilterTimeframe,
  type Timeframe,
  type TrendResult,
} from "./collection-summary-chart";

function getTaskTrendMessage(
  data: Task[],
  userId: string | undefined,
): TrendResult {
  if (!userId) {
    return {
      message: "User not identified",
      icon: MinusCircle,
    };
  }

  const currentMonth = format(new Date(), "yyyy-MM");
  const previousMonth = format(
    new Date(new Date().setMonth(new Date().getMonth() - 1)),
    "yyyy-MM",
  );

  const filtered = data.filter(
    (task) => task.assignedTo === userId && task.status === "done",
  );

  const monthlyCounts = filtered.reduce<Record<string, number>>((acc, task) => {
    const key = format(new Date(task.createdAt), "yyyy-MM");
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const currentCount = monthlyCounts[currentMonth] || 0;
  const prevCount = monthlyCounts[previousMonth] || 0;

  if (currentCount > prevCount) {
    return {
      message: "Task completion improved this month",
      icon: TrendingUp,
    };
  } else if (currentCount < prevCount) {
    return {
      message: "Fewer tasks completed than last month",
      icon: TrendingDown,
    };
  } else if (currentCount === 0 && prevCount === 0) {
    return {
      message: "No tasks completed in recent months",
      icon: MinusCircle,
    };
  } else {
    return {
      message: "Task performance remained consistent",
      icon: Activity,
    };
  }
}

function filterByTimeframe(
  data: Task[],
  timeframe: string,
  userId: string | undefined,
): Task[] {
  return data.filter((item) => {
    if (item.assignedTo !== userId) return false;
    const date = new Date(item.createdAt);

    switch (timeframe) {
      case "daily":
        return isToday(date);
      case "weekly":
        return isThisWeek(date, { weekStartsOn: 1 });
      case "monthly":
        return isThisMonth(date);
      case "yearly":
        return isThisYear(date);
      case "overall":
      default:
        return true;
    }
  });
}

interface TotalTaskCompletedChartProps {
  data: Task[];
  session: Session | null;
}

function TotalTaskCompletedChart({
  data,
  session,
}: TotalTaskCompletedChartProps) {
  const [timeframe, setTimeframe] = useState("overall");

  const filtered = filterByTimeframe(data, timeframe, session?.userId);
  const completedTasks = filtered.filter((t) => t.status === "done");

  const chartData = [
    {
      browser: "safari",
      completed: completedTasks.length,
      fill: "var(--color-safari)",
    },
  ];

  const chartConfig = {
    visitors: {
      label: "Tasks Completed",
    },
    safari: {
      label: "Safari",
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig;

  const trendMessage = getTaskTrendMessage(data, session?.userId);
  const Icon = trendMessage.icon;

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center">
        <div>
          <CardTitle>Your Completed Tasks</CardTitle>
          <CardDescription>
            Track your progress on completed tasks and activities.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadialBarChart
            data={chartData}
            startAngle={90}
            endAngle={450}
            innerRadius={80}
            outerRadius={110}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-muted last:fill-background"
              polarRadius={[86, 74]}
            />
            <RadialBar dataKey="completed" background cornerRadius={10} />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-4xl font-bold"
                        >
                          {chartData[0].completed.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Completed
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          {trendMessage.message} <Icon className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          {timeframe === "overall"
            ? "Showing all-time completed tasks"
            : `Filtered by ${timeframe}`}
        </div>
      </CardFooter>
      <div className="flex items-center justify-center">
        <FilterTimeframe value={timeframe} onChange={setTimeframe} />
      </div>
    </Card>
  );
}

function TaskDueTodayChart({ data, session }: TotalTaskCompletedChartProps) {
  const [timeframe, setTimeframe] = useState("overall");

  const filtered = filterByTimeframe(data, timeframe, session?.userId);
  const dueTodayTasks = filtered.filter(
    (t) => isToday(new Date(t.dueAt)) && t.status !== "done",
  );

  const chartData = [
    {
      browser: "safari",
      completed: dueTodayTasks.length,
      fill: "var(--color-safari)",
    },
  ];

  const chartConfig = {
    visitors: {
      label: "Tasks Completed",
    },
    safari: {
      label: "Safari",
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig;

  const trendMessage = getTaskTrendMessage(data, session?.userId);
  const Icon = trendMessage.icon;

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center">
        <div>
          <CardTitle>Today's Tasks</CardTitle>
          <CardDescription>
            Your pending tasks that need attention today.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadialBarChart
            data={chartData}
            startAngle={90}
            endAngle={450}
            innerRadius={80}
            outerRadius={110}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-muted last:fill-background"
              polarRadius={[86, 74]}
            />
            <RadialBar dataKey="completed" background cornerRadius={10} />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-4xl font-bold"
                        >
                          {chartData[0].completed.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Due Tasks
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          {trendMessage.message} <Icon className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          {timeframe === "overall"
            ? "Showing all-time completed tasks"
            : `Filtered by ${timeframe}`}
        </div>
      </CardFooter>
      <div className="flex items-center justify-center">
        <FilterTimeframe value={timeframe} onChange={setTimeframe} />
      </div>
    </Card>
  );
}

function TaskOverdueChart({ data, session }: TotalTaskCompletedChartProps) {
  const [timeframe, setTimeframe] = useState("overall");

  const filtered = filterByTimeframe(data, timeframe, session?.userId);

  const overdueTasks = filtered.filter((t) => {
    if (!t.dueAt || t.status === "done") return false;
    const dueDate = new Date(t.dueAt);
    return isBefore(dueDate, new Date()) && !isToday(dueDate);
  });

  const chartData = [
    {
      browser: "safari",
      completed: overdueTasks.length,
      fill: "var(--color-safari)",
    },
  ];

  const chartConfig = {
    visitors: {
      label: "Overdue Tasks",
    },
    safari: {
      label: "Safari",
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig;

  const trendMessage = getTaskTrendMessage(data, session?.userId);
  const Icon = trendMessage.icon;

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center">
        <div>
          <CardTitle>Your Overdue Tasks</CardTitle>
          <CardDescription>
            Tasks that need your immediate attention.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadialBarChart
            data={chartData}
            startAngle={90}
            endAngle={450}
            innerRadius={80}
            outerRadius={110}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              className="first:fill-muted last:fill-background"
              stroke="none"
              polarRadius={[86, 74]}
            />
            <RadialBar dataKey="completed" background cornerRadius={10} />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-4xl font-bold"
                        >
                          {chartData[0].completed.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Overdue
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          {trendMessage.message} <Icon className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          {timeframe === "overall"
            ? "Showing all-time overdue tasks"
            : `Filtered by ${timeframe}`}
        </div>
      </CardFooter>
      <div className="flex items-center justify-center">
        <FilterTimeframe value={timeframe} onChange={setTimeframe} />
      </div>
    </Card>
  );
}

function AverageTaskCompletionChart({
  data,
  session,
}: TotalTaskCompletedChartProps) {
  const [timeframe, setTimeframe] = useState<Timeframe>("overall");

  const filtered = filterByTimeframe(data, timeframe, session?.userId);
  const completedTasks = filtered.filter((t) => t.status === "done");

  const taskPerDayMap = new Map<string, number>();

  for (const task of completedTasks) {
    const dateKey = format(new Date(task.createdAt), "yyyy-MM-dd");
    taskPerDayMap.set(dateKey, (taskPerDayMap.get(dateKey) || 0) + 1);
  }

  const totalDays = taskPerDayMap.size || 1;
  const totalCompleted = completedTasks.length;
  const averageCompleted = Math.round(totalCompleted / totalDays);

  const chartData = [
    {
      browser: "safari",
      completed: averageCompleted,
      fill: "var(--color-safari)",
    },
  ];

  const chartConfig = {
    visitors: {
      label: "Average Tasks",
    },
    safari: {
      label: "Safari",
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig;

  const trendMessage = getTaskTrendMessage(data, session?.userId);
  const Icon = trendMessage.icon;

  const labelMap: Record<Timeframe, string> = {
    daily: "Per Day",
    weekly: "Per Week",
    monthly: "Per Month",
    yearly: "Per Year",
    overall: "Overall Avg",
  };

  const readableLabel = labelMap[timeframe];

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center">
        <div>
          <CardTitle>Your Task Completion Rate</CardTitle>
          <CardDescription>
            Your average task completion {readableLabel.toLowerCase()}.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadialBarChart
            data={chartData}
            startAngle={90}
            endAngle={450}
            innerRadius={80}
            outerRadius={110}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              className="first:fill-muted last:fill-background"
              stroke="none"
              polarRadius={[86, 74]}
            />
            <RadialBar dataKey="completed" background cornerRadius={10} />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-4xl font-bold"
                        >
                          {chartData[0].completed.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          {readableLabel}
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          {trendMessage.message} <Icon className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          {timeframe === "overall"
            ? "Average per day across all completed tasks"
            : `Filtered by ${timeframe}`}
        </div>
      </CardFooter>
      <div className="flex items-center justify-center">
        <FilterTimeframe value={timeframe} onChange={setTimeframe} />
      </div>
    </Card>
  );
}

export default function TaskSummaryChart() {
  const { getTasks } = useTask();
  const { session } = useSessionStore();
  const { data } = getTasks;

  if (!data) {
    return (
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle>Issue Summary</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <div className="text-center text-muted-foreground">
            No data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 mb-[10vh]">
      <TotalTaskCompletedChart data={data} session={session} />
      <AverageTaskCompletionChart data={data} session={session} />
      <TaskDueTodayChart data={data} session={session} />
      <TaskOverdueChart data={data} session={session} />
    </div>
  );
}
