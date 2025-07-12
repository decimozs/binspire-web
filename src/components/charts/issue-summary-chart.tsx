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
import type { Issue } from "@/schemas/issue-schema";
import type { Session } from "@/routes/dashboard/route";
import useIssue from "@/queries/use-issue";
import { useSessionStore } from "@/store/use-session-store";
import { useState } from "react";
import { format, isThisMonth, isThisWeek, isThisYear, isToday } from "date-fns";
import { FilterTimeframe, type TrendResult } from "./collection-summary-chart";

interface IssueChartProps {
  data: Issue[];
  session: Session | null;
}

function calculateAverageResolutionHours(data: Issue[], userId?: string) {
  const resolved = data.filter((i) => {
    const isResolved = i.status === "resolved";
    const isAssigned = userId ? i.assignedTo === userId : true;
    return isResolved && isAssigned;
  });

  if (resolved.length === 0) return 0;

  const totalMs = resolved.reduce((acc, issue) => {
    const created = new Date(issue.createdAt).getTime();
    const resolvedAt = new Date(issue.updatedAt).getTime();
    return acc + (resolvedAt - created);
  }, 0);

  const avgMs = totalMs / resolved.length;
  const avgHours = avgMs / (1000 * 60 * 60);

  return parseFloat(avgHours.toFixed(1));
}

function getIssueTrendMessage(
  data: Issue[],
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
    (issue) => issue.assignedTo === userId && issue.status === "resolved",
  );

  const monthlyCounts = filtered.reduce<Record<string, number>>(
    (acc, issue) => {
      const key = format(new Date(issue.createdAt), "yyyy-MM");
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    },
    {},
  );

  const currentCount = monthlyCounts[currentMonth] || 0;
  const prevCount = monthlyCounts[previousMonth] || 0;

  if (currentCount > prevCount) {
    return {
      message: "Issue resolution increased this month",
      icon: TrendingUp,
    };
  } else if (currentCount < prevCount) {
    return {
      message: "Resolved fewer issues than last month",
      icon: TrendingDown,
    };
  } else if (currentCount === 0 && prevCount === 0) {
    return {
      message: "No issues resolved recently",
      icon: MinusCircle,
    };
  } else {
    return {
      message: "Issue resolution remained steady",
      icon: Activity,
    };
  }
}

function filterByTimeframe(
  data: Issue[],
  timeframe: string,
  userId: string | undefined,
): Issue[] {
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

function TotalIssuesResolved({ data, session }: IssueChartProps) {
  const [timeframe, setTimeframe] = useState("overall");

  const filtered = filterByTimeframe(data, timeframe, session?.userId);

  const resolvedTasks = filtered.filter((t) => t.status === "resolved");

  const chartData = [
    {
      browser: "safari",
      visitors: resolvedTasks.length,
      fill: "var(--color-safari)",
    },
  ];

  const chartConfig = {
    visitors: {
      label: "Issues Resolved",
    },
    safari: {
      label: "Safari",
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig;

  const trendMessage = getIssueTrendMessage(data, session?.userId);
  const Icon = trendMessage.icon;

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <div>
          <CardTitle>Your Issue Resolution</CardTitle>
          <CardDescription>
            Track how many issues you've successfully resolved
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
            <RadialBar dataKey="visitors" background cornerRadius={10} />
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
                          {chartData[0].visitors.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Issues Resolved
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
            ? "All-time issue resolution data"
            : `Filtered by ${timeframe}`}
        </div>
      </CardFooter>
      <div className="flex items-center justify-center">
        <FilterTimeframe value={timeframe} onChange={setTimeframe} />
      </div>{" "}
    </Card>
  );
}

function AverageResolutionRate({ data, session }: IssueChartProps) {
  const [timeframe, setTimeframe] = useState("overall");
  const filtered = filterByTimeframe(data, timeframe, session?.userId);
  const avgHours = calculateAverageResolutionHours(filtered);

  const chartData = [
    {
      browser: "safari",
      visitors: avgHours,
      fill: "var(--color-safari)",
    },
  ];

  const chartConfig = {
    visitors: {
      label: "Average Resolution Time",
    },
    safari: {
      label: "Safari",
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig;

  const trendMessage = getIssueTrendMessage(data, session?.userId);
  const Icon = trendMessage.icon;

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <div>
          <CardTitle>Your Response Efficiency</CardTitle>
          <CardDescription>
            Your average time to resolve issues (in hours)
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
            <RadialBar dataKey="visitors" background cornerRadius={10} />
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
                          {chartData[0].visitors.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          hrs avg
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
            ? "All-time average resolution"
            : `Filtered by ${timeframe}`}
        </div>
      </CardFooter>
      <div className="flex items-center justify-center">
        <FilterTimeframe value={timeframe} onChange={setTimeframe} />
      </div>
    </Card>
  );
}

export default function IssueSummaryChart() {
  const { getIssues } = useIssue();
  const { session } = useSessionStore();
  const { data } = getIssues;

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
      <TotalIssuesResolved data={data} session={session} />
      <AverageResolutionRate data={data} session={session} />
    </div>
  );
}
